import { useEffect, useState } from "react";
import { useParams, Navigate, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChronicleLoader } from "@/components/ChronicleLoader";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { RefreshCw, Lock, ArrowLeft, User, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { trackPurchase } from "@/lib/analytics";

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
      selectedSubscription !== "";
    setFormValid(isValid);
  }, [buyerName, buyerEmail, recipientName, recipientAddressLine1, recipientCity, recipientState, recipientZipcode, recipientCountry, recipientEmail, selectedSubscription]);

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
            recipient_phone: recipientPhone || null,
            delivery_date: new Date().toISOString().split('T')[0],
            amount_paid: subscriptionDetails.price,
            payment_method: "paypal",
            payment_provider: "paypal",
            paypal_order_id: data.orderID,
            status: "Pending",
          });

          if (orderError) throw orderError;

          // Track purchase in GA4
          trackPurchase(
            data.orderID,
            subscriptionDetails.price,
            [{ item_name: `${product.name} - ${subscriptionDetails.name}`, price: subscriptionDetails.price }]
          );

          toast({ title: "Payment Successful!", description: "Your subscription order is confirmed!" });
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
  }, [paypalLoaded, product, formValid, selectedSubscription, buyerName, buyerEmail, recipientName, recipientTitle, recipientCompany, recipientAddressLine1, recipientAddressLine2, recipientCity, recipientState, recipientZipcode, recipientCountry, recipientEmail, recipientPhone, user, navigate]);



  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <ChronicleLoader />
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-6">
            <RefreshCw className="h-12 w-12 text-amber-600" />
          </div>
          <h1 className="font-display text-4xl text-stone-900 dark:text-stone-100 mb-4">Product Not Found</h1>
          <p className="text-stone-600 dark:text-stone-400 mb-8">This subscription product doesn't exist.</p>
          <Link to="/subscription-products">
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">Browse Subscription Products</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const subscriptionOptions = product.subscription_options as SubscriptionOption[] | null;
  const selectedSubDetails = getSelectedSubscriptionDetails();

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Link
          to={`/subscription-products`}
          className="inline-flex items-center gap-2 text-stone-600 dark:text-stone-400 hover:text-amber-600 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Subscriptions
        </Link>

        <div className="max-w-5xl mx-auto">
          <h1 className="font-display text-4xl text-stone-900 dark:text-stone-100 mb-8 text-center">Complete Your Subscription</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Your Information */}
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6">
                <h2 className="font-semibold text-xl text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-amber-600" />
                  Your Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="buyer-name" className="text-stone-700 dark:text-stone-300">Your Name</Label>
                    <Input
                      id="buyer-name"
                      placeholder="John Doe"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      required
                      className="border-stone-300 dark:border-stone-700 focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="buyer-email" className="text-stone-700 dark:text-stone-300">Your Email</Label>
                    <Input
                      id="buyer-email"
                      type="email"
                      placeholder="john@example.com"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      required
                      className="border-stone-300 dark:border-stone-700 focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Recipient Information */}
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6">
                <h2 className="font-semibold text-xl text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-amber-600" />
                  Recipient Information
                </h2>
                <p className="text-sm font-bold text-amber-600 mb-4">
                  The delivery will be anonymous
                </p>
                <div className="space-y-4">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="recipient-name" className="text-stone-700 dark:text-stone-300">Full Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="recipient-name"
                      placeholder="Jane Smith"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      required
                      className="border-stone-300 dark:border-stone-700 focus:border-amber-500"
                    />
                  </div>

                  {/* Title & Company */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipient-title" className="text-stone-700 dark:text-stone-300">Title</Label>
                      <Input
                        id="recipient-title"
                        placeholder="Mr./Ms./Dr."
                        value={recipientTitle}
                        onChange={(e) => setRecipientTitle(e.target.value)}
                        className="border-stone-300 dark:border-stone-700 focus:border-amber-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipient-company" className="text-stone-700 dark:text-stone-300">Company</Label>
                      <Input
                        id="recipient-company"
                        placeholder="Company Name"
                        value={recipientCompany}
                        onChange={(e) => setRecipientCompany(e.target.value)}
                        className="border-stone-300 dark:border-stone-700 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Address Lines */}
                  <div className="space-y-2">
                    <Label htmlFor="recipient-address1" className="text-stone-700 dark:text-stone-300">Address 1 <span className="text-red-500">*</span></Label>
                    <Input
                      id="recipient-address1"
                      placeholder="123 Main Street"
                      value={recipientAddressLine1}
                      onChange={(e) => setRecipientAddressLine1(e.target.value)}
                      required
                      className="border-stone-300 dark:border-stone-700 focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipient-address2" className="text-stone-700 dark:text-stone-300">Address 2</Label>
                    <Input
                      id="recipient-address2"
                      placeholder="Apt, Suite, Unit, etc."
                      value={recipientAddressLine2}
                      onChange={(e) => setRecipientAddressLine2(e.target.value)}
                      className="border-stone-300 dark:border-stone-700 focus:border-amber-500"
                    />
                  </div>

                  {/* City & Country */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipient-city" className="text-stone-700 dark:text-stone-300">City <span className="text-red-500">*</span></Label>
                      <Input
                        id="recipient-city"
                        placeholder="New York"
                        value={recipientCity}
                        onChange={(e) => setRecipientCity(e.target.value)}
                        required
                        className="border-stone-300 dark:border-stone-700 focus:border-amber-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipient-country" className="text-stone-700 dark:text-stone-300">Country <span className="text-red-500">*</span></Label>
                      <Input
                        id="recipient-country"
                        placeholder="United States"
                        value={recipientCountry}
                        onChange={(e) => setRecipientCountry(e.target.value)}
                        required
                        className="border-stone-300 dark:border-stone-700 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* State & Zipcode */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipient-state" className="text-stone-700 dark:text-stone-300">State <span className="text-red-500">*</span></Label>
                      <Input
                        id="recipient-state"
                        placeholder="NY"
                        value={recipientState}
                        onChange={(e) => setRecipientState(e.target.value)}
                        required
                        className="border-stone-300 dark:border-stone-700 focus:border-amber-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipient-zipcode" className="text-stone-700 dark:text-stone-300">Zipcode <span className="text-red-500">*</span></Label>
                      <Input
                        id="recipient-zipcode"
                        placeholder="10001"
                        value={recipientZipcode}
                        onChange={(e) => setRecipientZipcode(e.target.value)}
                        required
                        className="border-stone-300 dark:border-stone-700 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipient-email" className="text-stone-700 dark:text-stone-300">Email <span className="text-red-500">*</span></Label>
                      <Input
                        id="recipient-email"
                        type="email"
                        placeholder="jane@example.com"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        required
                        className="border-stone-300 dark:border-stone-700 focus:border-amber-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipient-phone" className="text-stone-700 dark:text-stone-300">Phone <span className="text-stone-500">(optional)</span></Label>
                      <Input
                        id="recipient-phone"
                        type="tel"
                        placeholder="+1 234 567 8900"
                        value={recipientPhone}
                        onChange={(e) => setRecipientPhone(e.target.value)}
                        className="border-stone-300 dark:border-stone-700 focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Subscription Selection - Cards Layout */}
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6">
                <h2 className="font-semibold text-xl text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-amber-600" />
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
                            ? "border-amber-600 bg-amber-50 dark:bg-amber-900/20 shadow-lg ring-2 ring-amber-600/20"
                            : "border-stone-200 dark:border-stone-700 hover:border-amber-500/50 bg-white dark:bg-stone-900"
                        )}
                      >
                        {/* Selected indicator */}
                        {selectedSubscription === option.name && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}

                        {/* Price badge */}
                        <div className="text-center mb-3">
                          <span className="text-3xl font-bold text-amber-600">${option.price.toFixed(2)}</span>
                        </div>

                        {/* Plan name */}
                        <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 text-center mb-2">{option.name}</h3>

                        {/* Description */}
                        {option.description && (
                          <p className="text-sm text-stone-600 dark:text-stone-400 text-center line-clamp-3">
                            {option.description}
                          </p>
                        )}

                        {/* Selection indicator */}
                        <div className={cn(
                          "mt-4 py-2 rounded-lg text-center text-sm font-medium transition-colors",
                          selectedSubscription === option.name
                            ? "bg-amber-600 text-white"
                            : "bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400"
                        )}>
                          {selectedSubscription === option.name ? "Selected" : "Select Plan"}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-stone-600 dark:text-stone-400">No subscription options available</p>
                )}
              </div>
            </div>

            {/* Order Summary & Payment */}
            <div className="space-y-6">
              {/* Product Summary */}
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6">
                <h2 className="font-semibold text-xl text-stone-900 dark:text-stone-100 mb-4">Order Summary</h2>

                <div className="flex gap-4 mb-4">
                  <div className="w-20 h-20 bg-stone-100 dark:bg-stone-800 rounded-lg overflow-hidden flex-shrink-0">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">🔄</div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900 dark:text-stone-100">{product.name}</h3>
                    {selectedSubDetails && (
                      <p className="text-sm text-amber-600">{selectedSubDetails.name}</p>
                    )}
                  </div>
                </div>

                {selectedSubDetails && (
                  <div className="border-t border-stone-200 dark:border-stone-800 pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-stone-900 dark:text-stone-100">Total</span>
                      <span className="text-amber-600">${selectedSubDetails.price.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Section */}
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6">
                <h2 className="font-semibold text-xl text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-amber-600" />
                  Secure Payment
                </h2>

                {!formValid && (
                  <div className="p-4 bg-stone-100 dark:bg-stone-800 rounded-lg text-sm text-stone-600 dark:text-stone-400 mb-4">
                    Please fill in all required fields and select a subscription plan to proceed with payment.
                  </div>
                )}

                <div className="min-h-[150px] relative">
                  {!paypalLoaded && formValid && (
                    <div className="flex items-center justify-center h-[150px]">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                    </div>
                  )}
                  {processing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center h-[150px] gap-2 bg-white dark:bg-stone-900 z-10">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                      <p className="text-sm text-stone-600 dark:text-stone-400">Processing payment...</p>
                    </div>
                  )}
                  <div id="paypal-button-container" className={!paypalLoaded || !formValid ? "hidden" : ""}></div>
                </div>

                <p className="text-xs text-stone-500 dark:text-stone-400 text-center mt-4">
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
