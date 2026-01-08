import { useEffect, useState } from "react";
import { useParams, Navigate, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JokerLoader } from "@/components/JokerLoader";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { RefreshCw, Lock, ArrowLeft, User, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    paypal?: any;
  }
}

interface SubscriptionOption {
  name: string;
  description: string;
  price: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
  description: string | null;
  subscription_options: unknown;
}

export default function SubscriptionCheckout() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [paypalClientId, setPaypalClientId] = useState<string | null>(null);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Form state
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientTitle, setRecipientTitle] = useState("");
  const [recipientCompany, setRecipientCompany] = useState("");
  const [recipientAddressLine1, setRecipientAddressLine1] = useState("");
  const [recipientAddressLine2, setRecipientAddressLine2] = useState("");
  const [recipientCity, setRecipientCity] = useState("");
  const [recipientState, setRecipientState] = useState("");
  const [recipientZipcode, setRecipientZipcode] = useState("");
  const [recipientCountry, setRecipientCountry] = useState("United States");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>();
  const [selectedSubscription, setSelectedSubscription] = useState<string>("");
  const [formValid, setFormValid] = useState(false);

  // Validate form
  useEffect(() => {
    const isValid = 
      buyerName.trim() !== "" &&
      buyerEmail.trim() !== "" &&
      recipientName.trim() !== "" &&
      recipientAddressLine1.trim() !== "" &&
      recipientCity.trim() !== "" &&
      recipientState.trim() !== "" &&
      recipientZipcode.trim() !== "" &&
      recipientCountry.trim() !== "" &&
      recipientEmail.trim() !== "" &&
      recipientPhone.trim() !== "" &&
      deliveryDate !== undefined &&
      selectedSubscription !== "";
    setFormValid(isValid);
  }, [buyerName, buyerEmail, recipientName, recipientAddressLine1, recipientCity, recipientState, recipientZipcode, recipientCountry, recipientEmail, recipientPhone, deliveryDate, selectedSubscription]);

  // Fetch product
  useEffect(() => {
    if (user && id) {
      fetchProduct();
    }
  }, [user, id]);

  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .eq("type", "subscription")
      .maybeSingle();

    if (error) {
      console.error("Error fetching product:", error);
      toast({ title: "Error", description: "Failed to load product", variant: "destructive" });
    }
    setProduct(data);
    setLoading(false);
  };

  // Fetch PayPal client ID
  useEffect(() => {
    const fetchPayPalClientId = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("paypal", {
          body: { action: "get-client-id" },
        });

        if (error) throw error;
        setPaypalClientId(data.clientId);
      } catch (error) {
        console.error("Error fetching PayPal client ID:", error);
        toast({ title: "Error", description: "Failed to initialize payment system", variant: "destructive" });
      }
    };

    if (user && product) {
      fetchPayPalClientId();
    }
  }, [user, product]);

  // Load PayPal SDK
  useEffect(() => {
    if (!paypalClientId || paypalLoaded) return;

    const existingScript = document.querySelector('script[src*="paypal.com/sdk"]');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=USD`;
    script.async = true;
    script.onload = () => setPaypalLoaded(true);
    script.onerror = () => {
      toast({ title: "Error", description: "Failed to load payment system", variant: "destructive" });
    };
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [paypalClientId]);

  // Get selected subscription details
  const getSelectedSubscriptionDetails = (): SubscriptionOption | null => {
    if (!product?.subscription_options || !selectedSubscription) return null;
    return (product.subscription_options as SubscriptionOption[]).find(s => s.name === selectedSubscription) || null;
  };

  // Render PayPal buttons
  useEffect(() => {
    if (!paypalLoaded || !window.paypal || !product || !formValid) return;

    const container = document.getElementById("paypal-button-container");
    if (!container) return;

    container.innerHTML = "";

    const subscriptionDetails = getSelectedSubscriptionDetails();
    if (!subscriptionDetails) return;

    window.paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'paypal',
      },
      createOrder: async () => {
        setProcessing(true);
        try {
          const { data, error } = await supabase.functions.invoke("paypal", {
            body: {
              action: "create",
              amount: subscriptionDetails.price.toFixed(2),
            },
          });

          if (error) throw error;
          return data.orderId;
        } catch (error) {
          console.error("Error creating order:", error);
          toast({ title: "Error", description: "Failed to create payment order", variant: "destructive" });
          setProcessing(false);
          throw error;
        }
      },
      onApprove: async (data: { orderID: string }) => {
        try {
          // Capture payment
          const { error: captureError } = await supabase.functions.invoke("paypal", {
            body: {
              action: "capture",
              orderId: data.orderID,
            },
          });

          if (captureError) throw captureError;

          // Save subscription order
          const { error: orderError } = await supabase.from("subscription_orders").insert({
            user_id: user!.id,
            product_id: product.id,
            product_name: product.name,
            subscription_name: subscriptionDetails.name,
            subscription_price: subscriptionDetails.price,
            buyer_name: buyerName,
            buyer_email: buyerEmail,
            recipient_name: recipientName,
            recipient_title: recipientTitle || null,
            recipient_company: recipientCompany || null,
            recipient_address: `${recipientAddressLine1}${recipientAddressLine2 ? ', ' + recipientAddressLine2 : ''}, ${recipientCity}, ${recipientState} ${recipientZipcode}, ${recipientCountry}`,
            recipient_address_line1: recipientAddressLine1,
            recipient_address_line2: recipientAddressLine2 || null,
            recipient_city: recipientCity,
            recipient_state: recipientState,
            recipient_zipcode: recipientZipcode,
            recipient_country: recipientCountry,
            recipient_email: recipientEmail,
            recipient_phone: recipientPhone,
            delivery_date: deliveryDate?.toISOString().split('T')[0],
            amount_paid: subscriptionDetails.price,
            payment_method: "paypal",
            payment_provider: "paypal",
            paypal_order_id: data.orderID,
            status: "Pending",
          });

          if (orderError) throw orderError;

          toast({ title: "Payment Successful! 🎉", description: "Your subscription order is confirmed!" });
          navigate(`/order-success?type=subscription`);
        } catch (error) {
          console.error("Error processing payment:", error);
          toast({ title: "Error", description: "Failed to complete payment", variant: "destructive" });
        } finally {
          setProcessing(false);
        }
      },
      onCancel: () => {
        setProcessing(false);
        toast({ title: "Payment Cancelled", description: "You cancelled the payment" });
      },
      onError: (err: Error) => {
        console.error("PayPal error:", err);
        setProcessing(false);
        toast({ title: "Payment Error", description: "There was an error processing your payment", variant: "destructive" });
      },
    }).render("#paypal-button-container");
  }, [paypalLoaded, product, formValid, selectedSubscription, buyerName, buyerEmail, recipientName, recipientTitle, recipientCompany, recipientAddressLine1, recipientAddressLine2, recipientCity, recipientState, recipientZipcode, recipientCountry, recipientEmail, recipientPhone, deliveryDate, user, navigate]);

  if (!authLoading && !user) return <Navigate to="/auth" replace />;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <JokerLoader />
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12 text-center">
          <span className="text-6xl mb-4 inline-block">🎭</span>
          <h1 className="font-display text-4xl mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">This subscription product doesn't exist.</p>
          <Link to="/subscription-products">
            <Button variant="joker">Browse Subscription Products</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const subscriptionOptions = product.subscription_options as SubscriptionOption[] | null;
  const selectedSubDetails = getSelectedSubscriptionDetails();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Link
          to={`/subscription-products`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Subscriptions
        </Link>

        <div className="max-w-5xl mx-auto">
          <h1 className="font-display text-4xl mb-8 text-center">Complete Your Subscription</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Your Information */}
              <div className="bg-card border rounded-xl p-6">
                <h2 className="font-semibold text-xl mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Your Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="buyer-name">Your Name</Label>
                    <Input
                      id="buyer-name"
                      placeholder="John Doe"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="buyer-email">Your Email</Label>
                    <Input
                      id="buyer-email"
                      type="email"
                      placeholder="john@example.com"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Recipient Information */}
              <div className="bg-card border rounded-xl p-6">
                <h2 className="font-semibold text-xl mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Recipient Information
                </h2>
                <p className="text-sm font-bold text-primary mb-4">
                  🎭 The delivery will be anonymous
                </p>
                <div className="space-y-4">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="recipient-name">Full Name <span className="text-destructive">*</span></Label>
                    <Input
                      id="recipient-name"
                      placeholder="Jane Smith"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      required
                    />
                  </div>

                  {/* Title & Company */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipient-title">Title</Label>
                      <Input
                        id="recipient-title"
                        placeholder="Mr./Ms./Dr."
                        value={recipientTitle}
                        onChange={(e) => setRecipientTitle(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipient-company">Company</Label>
                      <Input
                        id="recipient-company"
                        placeholder="Company Name"
                        value={recipientCompany}
                        onChange={(e) => setRecipientCompany(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Address Lines */}
                  <div className="space-y-2">
                    <Label htmlFor="recipient-address1">Address 1 <span className="text-destructive">*</span></Label>
                    <Input
                      id="recipient-address1"
                      placeholder="123 Main Street"
                      value={recipientAddressLine1}
                      onChange={(e) => setRecipientAddressLine1(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipient-address2">Address 2</Label>
                    <Input
                      id="recipient-address2"
                      placeholder="Apt, Suite, Unit, etc."
                      value={recipientAddressLine2}
                      onChange={(e) => setRecipientAddressLine2(e.target.value)}
                    />
                  </div>

                  {/* City & Country */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipient-city">City <span className="text-destructive">*</span></Label>
                      <Input
                        id="recipient-city"
                        placeholder="New York"
                        value={recipientCity}
                        onChange={(e) => setRecipientCity(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipient-country">Country <span className="text-destructive">*</span></Label>
                      <Input
                        id="recipient-country"
                        placeholder="United States"
                        value={recipientCountry}
                        onChange={(e) => setRecipientCountry(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* State & Zipcode */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipient-state">State <span className="text-destructive">*</span></Label>
                      <Input
                        id="recipient-state"
                        placeholder="NY"
                        value={recipientState}
                        onChange={(e) => setRecipientState(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipient-zipcode">Zipcode <span className="text-destructive">*</span></Label>
                      <Input
                        id="recipient-zipcode"
                        placeholder="10001"
                        value={recipientZipcode}
                        onChange={(e) => setRecipientZipcode(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipient-email">Email <span className="text-destructive">*</span></Label>
                      <Input
                        id="recipient-email"
                        type="email"
                        placeholder="jane@example.com"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipient-phone">Phone <span className="text-destructive">*</span></Label>
                      <Input
                        id="recipient-phone"
                        type="tel"
                        placeholder="+1 234 567 8900"
                        value={recipientPhone}
                        onChange={(e) => setRecipientPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Delivery Date */}
                  <div className="space-y-2">
                    <Label>Delivery Date <span className="text-destructive">*</span></Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !deliveryDate && "text-muted-foreground"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {deliveryDate ? format(deliveryDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={deliveryDate}
                          onSelect={setDeliveryDate}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              {/* Subscription Selection - Cards Layout */}
              <div className="bg-card border rounded-xl p-6">
                <h2 className="font-semibold text-xl mb-4 flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Select Subscription Plan
                </h2>
                {subscriptionOptions && subscriptionOptions.length > 0 ? (
                  <div className="grid sm:grid-cols-3 gap-4">
                    {subscriptionOptions.map((option, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedSubscription(option.name)}
                        className={cn(
                          "relative border-2 rounded-xl p-5 cursor-pointer transition-all hover:shadow-lg",
                          selectedSubscription === option.name
                            ? "border-primary bg-primary/10 shadow-lg ring-2 ring-primary/20"
                            : "border-border hover:border-primary/50 bg-card"
                        )}
                      >
                        {/* Selected indicator */}
                        {selectedSubscription === option.name && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-primary-foreground text-xs">✓</span>
                          </div>
                        )}
                        
                        {/* Price badge */}
                        <div className="text-center mb-3">
                          <span className="text-3xl font-bold text-primary">${option.price.toFixed(2)}</span>
                        </div>
                        
                        {/* Plan name */}
                        <h3 className="text-lg font-semibold text-center mb-2">{option.name}</h3>
                        
                        {/* Description */}
                        {option.description && (
                          <p className="text-sm text-muted-foreground text-center line-clamp-3">
                            {option.description}
                          </p>
                        )}
                        
                        {/* Selection indicator */}
                        <div className={cn(
                          "mt-4 py-2 rounded-lg text-center text-sm font-medium transition-colors",
                          selectedSubscription === option.name
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground"
                        )}>
                          {selectedSubscription === option.name ? "Selected" : "Select Plan"}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No subscription options available</p>
                )}
              </div>
            </div>

            {/* Order Summary & Payment */}
            <div className="space-y-6">
              {/* Product Summary */}
              <div className="bg-card border rounded-xl p-6">
                <h2 className="font-semibold text-xl mb-4">Order Summary</h2>

                <div className="flex gap-4 mb-4">
                  <div className="w-20 h-20 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">🔄</div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    {selectedSubDetails && (
                      <p className="text-sm text-primary">{selectedSubDetails.name}</p>
                    )}
                  </div>
                </div>

                {selectedSubDetails && (
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">${selectedSubDetails.price.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Section */}
              <div className="bg-card border rounded-xl p-6">
                <h2 className="font-semibold text-xl mb-4 flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Secure Payment
                </h2>

                {!formValid && (
                  <div className="p-4 bg-secondary rounded-lg text-sm text-muted-foreground mb-4">
                    Please fill in all required fields and select a subscription plan to proceed with payment.
                  </div>
                )}

                <div className="min-h-[150px] relative">
                  {!paypalLoaded && formValid && (
                    <div className="flex items-center justify-center h-[150px]">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  )}
                  {processing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center h-[150px] gap-2 bg-card z-10">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <p className="text-sm text-muted-foreground">Processing payment...</p>
                    </div>
                  )}
                  <div id="paypal-button-container" className={!paypalLoaded || !formValid ? "hidden" : ""}></div>
                </div>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Your payment is secured by PayPal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}