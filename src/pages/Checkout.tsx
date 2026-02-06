import { useState, useEffect, useRef } from "react";
import { Navigate, Link, useNavigate, useSearchParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { EmptyState } from "@/components/EmptyState";
import { ChronicleSpinner } from "@/components/ChronicleLoader";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, ShoppingBag, Gift, Lock, CreditCard, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { trackPurchase } from "@/lib/analytics";

declare global {
  interface Window {
    paypal?: any;
  }
}

// ─── Stripe Setup ───────────────────────────────────────────────────────────────

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Dark/amber theme for Stripe Elements
const stripeAppearance = {
  theme: "night" as const,
  variables: {
    colorPrimary: "#d97706",
    colorBackground: "#1c1917",
    colorText: "#fafaf9",
    colorDanger: "#ef4444",
    colorTextSecondary: "#a8a29e",
    colorTextPlaceholder: "#78716c",
    fontFamily: "system-ui, -apple-system, sans-serif",
    borderRadius: "12px",
    spacingUnit: "4px",
    fontSizeBase: "15px",
  },
  rules: {
    ".Input": {
      border: "1px solid #44403c",
      boxShadow: "none",
      backgroundColor: "#1c1917",
      padding: "12px",
    },
    ".Input:focus": {
      border: "1px solid #d97706",
      boxShadow: "0 0 0 1px #d97706",
    },
    ".Label": {
      color: "#d6d3d1",
      fontWeight: "600",
      fontSize: "13px",
      textTransform: "uppercase" as const,
      letterSpacing: "0.05em",
    },
    ".Tab": {
      border: "1px solid #44403c",
      backgroundColor: "#1c1917",
    },
    ".Tab:hover": {
      border: "1px solid #78716c",
    },
    ".Tab--selected": {
      border: "1px solid #d97706",
      backgroundColor: "rgba(217, 119, 6, 0.1)",
    },
  },
};

// ─── Types ──────────────────────────────────────────────────────────────────────

interface YslsOrder {
  productName: string;
  scentVariant: string;
  scentId: string;
  cardId: number;
  cardName: string;
  cardFront: string;
  cardInside: string;
  bundleQty: number;
  unitPrice: number;
  totalPrice: number;
  comparePrice: number;
  image: string;
}

// ─── Stripe Payment Form (inner component, must be inside <Elements>) ───────────

function StripePaymentForm({
  funnelOrder,
  shippingAddress,
  recipientName,
  shipAnonymous,
  phone,
  deliveryDate,
  formValid,
  paymentIntentId,
}: {
  funnelOrder: YslsOrder;
  shippingAddress: string;
  recipientName: string;
  shipAnonymous: boolean;
  phone: string;
  deliveryDate: string;
  formValid: boolean;
  paymentIntentId: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { user, nickname } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [paymentReady, setPaymentReady] = useState(false);

  const shippingCost = funnelOrder.bundleQty >= 2 ? 0 : 4.99;
  const finalTotal = funnelOrder.totalPrice + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !user || !formValid) return;

    setSubmitting(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
        confirmParams: {
          receipt_email: user.email || undefined,
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message || "Something went wrong with your payment.",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        // Create order in database
        const orderItems = [{
          name: funnelOrder.productName,
          qty: funnelOrder.bundleQty,
          price: funnelOrder.totalPrice,
          scent_variant: funnelOrder.scentVariant,
          card_name: funnelOrder.cardName,
          card_front: funnelOrder.cardFront,
          card_inside: funnelOrder.cardInside,
          recipient_name: recipientName,
          ship_anonymous: shipAnonymous,
        }];

        const { error: dbError } = await supabase.from("physical_orders").insert({
          user_id: user.id,
          nickname: nickname || "Citizen",
          email: user.email || "",
          phone,
          address: shippingAddress,
          delivery_date: deliveryDate,
          items: orderItems,
          amount_paid: finalTotal,
          payment_method: "Stripe",
          payment_provider: "Stripe",
          paypal_order_id: paymentIntent.id,
          status: "Paid",
        });

        if (dbError) {
          console.error("Order DB error:", dbError);
          // Payment succeeded but DB failed — webhook will catch it
        }

        trackPurchase(
          paymentIntent.id,
          finalTotal,
          [{ item_name: funnelOrder.productName, price: funnelOrder.totalPrice }]
        );

        // Clean up localStorage
        localStorage.removeItem("yslsOrder");

        toast({
          title: "Payment Successful!",
          description: "Your order has been placed.",
        });

        navigate("/order-success");
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      toast({
        title: "Error",
        description: err.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-stone-900 border border-stone-700 rounded-xl p-5">
        <PaymentElement
          onReady={() => setPaymentReady(true)}
          options={{
            layout: "tabs",
          }}
        />
      </div>

      {submitting ? (
        <div className="flex items-center justify-center py-4">
          <ChronicleSpinner />
          <span className="ml-2 text-stone-600 dark:text-stone-400">Processing payment...</span>
        </div>
      ) : (
        <Button
          type="submit"
          disabled={!stripe || !elements || !formValid || !paymentReady}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-6 text-lg font-bold gap-2 disabled:opacity-50 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all"
        >
          <CreditCard className="h-5 w-5" />
          PAY ${finalTotal.toFixed(2)}
        </Button>
      )}

      <div className="flex items-center justify-center gap-2 text-xs text-stone-500 dark:text-stone-400">
        <Lock className="h-3.5 w-3.5" />
        Secured by Stripe. Your card details never touch our servers.
      </div>
    </form>
  );
}

// ─── Funnel Checkout (Stripe Elements) ──────────────────────────────────────────

function FunnelCheckout() {
  const { user, nickname, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [shipToFriend, setShipToFriend] = useState(true);
  const [form, setForm] = useState({
    phone: "",
    address: "",
    deliveryDate: "",
  });
  const [recipientForm, setRecipientForm] = useState({
    recipientName: "",
    recipientAddress: "",
  });
  const [formValid, setFormValid] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string>("");
  const [loadingPayment, setLoadingPayment] = useState(false);

  // Load funnel order from localStorage
  const funnelOrder: YslsOrder | null = (() => {
    try {
      const raw = localStorage.getItem("yslsOrder");
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  })();

  // Validate form
  useEffect(() => {
    const baseValid = form.phone.trim() !== "" && form.deliveryDate !== "";
    const addressValid = shipToFriend
      ? recipientForm.recipientName.trim() !== "" && recipientForm.recipientAddress.trim() !== ""
      : form.address.trim() !== "";
    setFormValid(baseValid && addressValid);
  }, [form, shipToFriend, recipientForm]);

  // Create PaymentIntent when we have a valid order + user
  useEffect(() => {
    if (!funnelOrder || !user || clientSecret) return;

    const createPaymentIntent = async () => {
      setLoadingPayment(true);
      try {
        const shippingAddress = shipToFriend ? recipientForm.recipientAddress : form.address;
        const recipientName = shipToFriend ? recipientForm.recipientName : nickname || "Customer";

        const { data, error } = await supabase.functions.invoke("stripe-checkout", {
          body: {
            productName: funnelOrder.productName,
            scentVariant: funnelOrder.scentVariant,
            bundleQty: funnelOrder.bundleQty,
            totalPrice: funnelOrder.totalPrice,
            cardName: funnelOrder.cardName,
            cardFront: funnelOrder.cardFront,
            cardInside: funnelOrder.cardInside,
            shippingAddress,
            recipientName,
            shipAnonymous: shipToFriend,
            phone: form.phone,
            deliveryDate: form.deliveryDate,
            userId: user.id,
            email: user.email,
            nickname: nickname || "Citizen",
          },
        });

        if (error) throw error;
        if (data?.clientSecret) {
          setClientSecret(data.clientSecret);
          setPaymentIntentId(data.paymentIntentId);
        }
      } catch (err) {
        console.error("Failed to create payment intent:", err);
        toast({
          title: "Error",
          description: "Failed to initialize payment. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoadingPayment(false);
      }
    };

    createPaymentIntent();
  }, [user, funnelOrder?.totalPrice]);

  if (!authLoading && !user) return <Navigate to="/auth" replace />;

  if (!funnelOrder) {
    return (
      <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <EmptyState
            icon="🧴"
            title="No order found"
            description="Go back and pick your pack first."
            action={<Link to="/you-smell-like-shit"><Button className="bg-amber-600 hover:bg-amber-700 text-white">Go Back</Button></Link>}
          />
        </main>
        <Footer />
      </div>
    );
  }

  const shippingCost = funnelOrder.bundleQty >= 2 ? 0 : 4.99;
  const finalTotal = funnelOrder.totalPrice + shippingCost;
  const shippingAddress = shipToFriend ? recipientForm.recipientAddress : form.address;
  const recipientName = shipToFriend ? recipientForm.recipientName : nickname || "Customer";

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Link
          to="/you-smell-like-shit"
          className="inline-flex items-center gap-2 text-stone-600 dark:text-stone-400 hover:text-amber-600 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Product
        </Link>

        <h1 className="font-display text-4xl text-stone-900 dark:text-stone-100 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Shipping + Payment */}
          <div className="space-y-6">
            {/* Shipping Form */}
            <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-6">
              <h2 className="font-display text-2xl text-stone-900 dark:text-stone-100 mb-6 flex items-center gap-2">
                <ShoppingBag className="h-6 w-6 text-amber-600" />
                Shipping Details
              </h2>

              <div className="space-y-6">
                {/* Ship to Friend Toggle */}
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => setShipToFriend(!shipToFriend)}
                    className="flex items-center gap-3 w-full text-left"
                  >
                    <div className={`w-10 h-6 rounded-full transition-colors flex items-center px-0.5 ${
                      shipToFriend ? "bg-amber-600" : "bg-stone-300 dark:bg-stone-600"
                    }`}>
                      <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        shipToFriend ? "translate-x-4" : "translate-x-0"
                      }`} />
                    </div>
                    <div className="flex items-center gap-2">
                      <Gift className="h-5 w-5 text-amber-600" />
                      <span className="font-medium text-stone-900 dark:text-stone-100">
                        Ship directly to recipient (anonymous)
                      </span>
                    </div>
                  </button>

                  {shipToFriend && (
                    <div className="space-y-4 pl-2 border-l-2 border-amber-600/30 ml-5">
                      <div className="space-y-2">
                        <Label htmlFor="recipientName" className="text-stone-700 dark:text-stone-300">Recipient's Name *</Label>
                        <Input
                          id="recipientName"
                          placeholder="Their full name"
                          value={recipientForm.recipientName}
                          onChange={(e) => setRecipientForm({ ...recipientForm, recipientName: e.target.value })}
                          className="border-stone-300 dark:border-stone-700 focus:border-amber-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="recipientAddress" className="text-stone-700 dark:text-stone-300">Recipient's Address *</Label>
                        <Textarea
                          id="recipientAddress"
                          placeholder="123 Main Street, City, State 12345"
                          value={recipientForm.recipientAddress}
                          onChange={(e) => setRecipientForm({ ...recipientForm, recipientAddress: e.target.value })}
                          rows={3}
                          className="border-stone-300 dark:border-stone-700 focus:border-amber-500"
                        />
                      </div>
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        No return address will be shown. The package ships anonymously.
                      </p>
                    </div>
                  )}
                </div>

                {!shipToFriend && (
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-stone-700 dark:text-stone-300">Your Address *</Label>
                    <Textarea
                      id="address"
                      placeholder="123 Main Street, City, State 12345"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      rows={3}
                      className="border-stone-300 dark:border-stone-700 focus:border-amber-500"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-stone-700 dark:text-stone-300">Your Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="border-stone-300 dark:border-stone-700 focus:border-amber-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryDate" className="text-stone-700 dark:text-stone-300">Preferred Delivery Date *</Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={form.deliveryDate}
                    onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })}
                    className="border-stone-300 dark:border-stone-700 focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-6">
              <h2 className="font-display text-2xl text-stone-900 dark:text-stone-100 mb-6 flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-amber-600" />
                Payment
              </h2>

              {!formValid && (
                <p className="text-sm text-stone-500 dark:text-stone-400 mb-4 text-center py-8">
                  Fill in shipping details above to unlock payment
                </p>
              )}

              {formValid && loadingPayment && (
                <div className="flex items-center justify-center py-8">
                  <ChronicleSpinner />
                  <span className="ml-2 text-stone-600 dark:text-stone-400">Setting up secure payment...</span>
                </div>
              )}

              {formValid && clientSecret && (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: stripeAppearance,
                  }}
                >
                  <StripePaymentForm
                    funnelOrder={funnelOrder}
                    shippingAddress={shippingAddress}
                    recipientName={recipientName}
                    shipAnonymous={shipToFriend}
                    phone={form.phone}
                    deliveryDate={form.deliveryDate}
                    formValid={formValid}
                    paymentIntentId={paymentIntentId}
                  />
                </Elements>
              )}
            </div>
          </div>

          {/* Right: Order Summary */}
          <div>
            <div className="bg-stone-100 dark:bg-stone-800 rounded-xl p-6 sticky top-24">
              <h2 className="font-display text-2xl text-stone-900 dark:text-stone-100 mb-6">Order Summary</h2>

              {/* Product */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white dark:bg-stone-900 rounded-lg flex items-center justify-center text-2xl overflow-hidden">
                  {funnelOrder.image ? (
                    <img src={funnelOrder.image} alt={funnelOrder.productName} className="w-full h-full object-cover" />
                  ) : (
                    "🧴"
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-stone-900 dark:text-stone-100">{funnelOrder.productName}</p>
                  <p className="text-sm text-stone-500 dark:text-stone-400">
                    {funnelOrder.bundleQty} {funnelOrder.bundleQty === 1 ? "pack" : "packs"} &middot; {funnelOrder.scentVariant}
                  </p>
                </div>
                <p className="font-bold text-stone-900 dark:text-stone-100">${funnelOrder.totalPrice.toFixed(2)}</p>
              </div>

              {/* Gift Details */}
              <div className="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-medium text-sm">
                  <Gift className="h-4 w-4" />
                  Gift Details
                </div>
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  <span className="font-medium text-stone-700 dark:text-stone-300">Scent:</span> {funnelOrder.scentVariant}
                </p>
                <div className="text-sm text-stone-600 dark:text-stone-400">
                  <span className="font-medium text-stone-700 dark:text-stone-300">Card:</span> {funnelOrder.cardName}
                  <div className="mt-1 text-xs italic bg-white dark:bg-stone-800 rounded p-2 border border-stone-200 dark:border-stone-700">
                    <div>Front: &ldquo;{funnelOrder.cardFront}&rdquo;</div>
                    <div className="mt-1">Inside: &ldquo;{funnelOrder.cardInside}&rdquo;</div>
                  </div>
                </div>
                {shipToFriend && recipientForm.recipientName && (
                  <p className="text-sm text-stone-600 dark:text-stone-400">
                    <span className="font-medium text-stone-700 dark:text-stone-300">Ship to:</span> {recipientForm.recipientName} (anonymous)
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="border-t border-stone-200 dark:border-stone-700 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600 dark:text-stone-400">Subtotal</span>
                  <span className="text-stone-900 dark:text-stone-100">${funnelOrder.totalPrice.toFixed(2)}</span>
                </div>
                {funnelOrder.comparePrice > funnelOrder.totalPrice && (
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600 dark:text-stone-400">You Save</span>
                    <span className="text-green-600 font-medium">
                      -${(funnelOrder.comparePrice - funnelOrder.totalPrice).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600 dark:text-stone-400">Shipping</span>
                  <span className="text-amber-600">{funnelOrder.bundleQty >= 2 ? "Free" : "$4.99"}</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-2 border-t border-stone-200 dark:border-stone-700">
                  <span className="text-stone-900 dark:text-stone-100">Total</span>
                  <span className="text-amber-600">${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ─── Cart Checkout (PayPal — existing flow) ─────────────────────────────────────

function CartCheckout() {
  const { user, nickname, loading: authLoading } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [paypalClientId, setPaypalClientId] = useState<string | null>(null);
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({
    phone: "",
    address: "",
    deliveryDate: "",
  });
  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    setFormValid(form.phone.trim() !== "" && form.address.trim() !== "" && form.deliveryDate !== "");
  }, [form]);

  useEffect(() => {
    const fetchClientId = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("paypal", {
          body: { action: "get-client-id" },
        });
        if (error) throw error;
        setPaypalClientId(data.clientId);
      } catch (error) {
        console.error("Failed to get PayPal client ID:", error);
        toast({ title: "Error", description: "Failed to load PayPal", variant: "destructive" });
      }
    };
    fetchClientId();
  }, []);

  useEffect(() => {
    if (!paypalClientId || paypalLoaded) return;

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=USD`;
    script.async = true;
    script.onload = () => setPaypalLoaded(true);
    script.onerror = () => {
      toast({ title: "Error", description: "Failed to load PayPal SDK", variant: "destructive" });
    };
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector(`script[src*="paypal.com/sdk/js"]`);
      if (existingScript) existingScript.remove();
    };
  }, [paypalClientId, paypalLoaded]);

  useEffect(() => {
    if (!paypalLoaded || !window.paypal || !paypalContainerRef.current || !formValid) return;

    paypalContainerRef.current.innerHTML = "";

    window.paypal.Buttons({
      style: { layout: "vertical", color: "gold", shape: "rect", label: "paypal" },
      createOrder: async () => {
        try {
          const { data, error } = await supabase.functions.invoke("paypal", {
            body: { action: "create", amount: totalPrice.toFixed(2) },
          });
          if (error) throw error;
          return data.orderId;
        } catch (error) {
          console.error("Error creating order:", error);
          toast({ title: "Error", description: "Failed to create PayPal order", variant: "destructive" });
          throw error;
        }
      },
      onApprove: async (data: { orderID: string }) => {
        setSubmitting(true);
        try {
          const { data: captureData, error: captureError } = await supabase.functions.invoke("paypal", {
            body: { action: "capture", orderId: data.orderID },
          });
          if (captureError) throw captureError;

          if (captureData.status !== "COMPLETED") {
            throw new Error("Payment was not completed");
          }

          const orderItems = items.map(item => ({
            productId: item.product_id,
            name: item.product.name,
            qty: item.quantity,
            price: item.product.price,
          }));

          const { error: dbError } = await supabase.from("physical_orders").insert({
            user_id: user!.id,
            nickname: nickname || "Citizen",
            email: user!.email || "",
            phone: form.phone,
            address: form.address,
            delivery_date: form.deliveryDate,
            items: orderItems,
            amount_paid: totalPrice,
            payment_method: "PayPal",
            payment_provider: "PayPal",
            paypal_order_id: data.orderID,
            status: "Paid",
          });

          if (dbError) throw dbError;

          trackPurchase(
            data.orderID,
            totalPrice,
            items.map(item => ({ item_name: item.product.name, price: item.product.price }))
          );

          await clearCart();

          toast({ title: "Payment Successful!", description: "Your order has been placed." });
          navigate("/order-success");
        } catch (error: any) {
          console.error("Error processing payment:", error);
          toast({
            title: "Payment Error",
            description: error.message || "Failed to process payment",
            variant: "destructive"
          });
        } finally {
          setSubmitting(false);
        }
      },
      onError: (err: any) => {
        console.error("PayPal error:", err);
        toast({ title: "PayPal Error", description: "Something went wrong with PayPal", variant: "destructive" });
      },
      onCancel: () => {
        toast({ title: "Cancelled", description: "Payment was cancelled" });
      },
    }).render(paypalContainerRef.current);
  }, [paypalLoaded, formValid, totalPrice, items, user, nickname, form, navigate, clearCart]);

  if (!authLoading && !user) return <Navigate to="/auth" replace />;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <EmptyState
            icon="🛒"
            title="Your cart is empty!"
            description="Add some products before checking out."
            action={<Link to="/physical-products"><Button className="bg-amber-600 hover:bg-amber-700 text-white">Browse Products</Button></Link>}
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-stone-600 dark:text-stone-400 hover:text-amber-600 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Link>

        <h1 className="font-display text-4xl text-stone-900 dark:text-stone-100 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-6">
            <h2 className="font-display text-2xl text-stone-900 dark:text-stone-100 mb-6 flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-amber-600" />
              Delivery Details
            </h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nickname" className="text-stone-700 dark:text-stone-300">Nickname</Label>
                <Input id="nickname" value={nickname || "Citizen"} disabled className="bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-stone-700 dark:text-stone-300">Email</Label>
                <Input id="email" value={user?.email || ""} disabled className="bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-stone-700 dark:text-stone-300">Phone Number *</Label>
                <Input
                  id="phone" type="tel" placeholder="+1 (555) 123-4567"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="border-stone-300 dark:border-stone-700 focus:border-amber-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-stone-700 dark:text-stone-300">Full Address *</Label>
                <Textarea
                  id="address" placeholder="123 Main Street, City, State 12345"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  rows={3} className="border-stone-300 dark:border-stone-700 focus:border-amber-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryDate" className="text-stone-700 dark:text-stone-300">Preferred Delivery Date *</Label>
                <Input
                  id="deliveryDate" type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={form.deliveryDate}
                  onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })}
                  className="border-stone-300 dark:border-stone-700 focus:border-amber-500"
                />
              </div>

              <div className="pt-4 border-t border-stone-200 dark:border-stone-800">
                {!formValid && (
                  <p className="text-sm text-stone-500 dark:text-stone-400 mb-4 text-center">
                    Please fill in all delivery details to proceed with payment
                  </p>
                )}

                {submitting ? (
                  <div className="flex items-center justify-center py-4">
                    <ChronicleSpinner />
                    <span className="ml-2 text-stone-600 dark:text-stone-400">Processing payment...</span>
                  </div>
                ) : paypalLoaded && formValid ? (
                  <div ref={paypalContainerRef} className="min-h-[150px]" />
                ) : !paypalLoaded ? (
                  <div className="flex items-center justify-center py-4">
                    <ChronicleSpinner />
                    <span className="ml-2 text-stone-600 dark:text-stone-400">Loading PayPal...</span>
                  </div>
                ) : null}

                <p className="text-xs text-stone-500 dark:text-stone-400 text-center mt-3">
                  Your payment is secured by PayPal
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-stone-100 dark:bg-stone-800 rounded-xl p-6 sticky top-24">
              <h2 className="font-display text-2xl text-stone-900 dark:text-stone-100 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white dark:bg-stone-900 rounded-lg flex items-center justify-center text-2xl overflow-hidden">
                      {item.product.image ? (
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : "📦"}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-stone-900 dark:text-stone-100">{item.product.name}</p>
                      <p className="text-sm text-stone-500 dark:text-stone-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-stone-900 dark:text-stone-100">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-stone-200 dark:border-stone-700 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600 dark:text-stone-400">Subtotal</span>
                  <span className="text-stone-900 dark:text-stone-100">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600 dark:text-stone-400">Shipping</span>
                  <span className="text-amber-600">Free</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-2 border-t border-stone-200 dark:border-stone-700">
                  <span className="text-stone-900 dark:text-stone-100">Total</span>
                  <span className="text-amber-600">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ─── Router ─────────────────────────────────────────────────────────────────────

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const isFunnel = searchParams.get("from") === "ysls";

  if (isFunnel) {
    return <FunnelCheckout />;
  }

  return <CartCheckout />;
}
