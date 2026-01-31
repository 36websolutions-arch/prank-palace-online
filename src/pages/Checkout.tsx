import { useState, useEffect, useRef } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
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
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { trackPurchase } from "@/lib/analytics";

declare global {
  interface Window {
    paypal?: any;
  }
}

export default function Checkout() {
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

  // Validate form
  useEffect(() => {
    setFormValid(form.phone.trim() !== "" && form.address.trim() !== "" && form.deliveryDate !== "");
  }, [form]);

  // Fetch PayPal client ID
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

  // Load PayPal SDK
  useEffect(() => {
    if (!paypalClientId || paypalLoaded) return;

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=USD`;
    script.async = true;
    script.onload = () => {
      setPaypalLoaded(true);
    };
    script.onerror = () => {
      toast({ title: "Error", description: "Failed to load PayPal SDK", variant: "destructive" });
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup on unmount
      const existingScript = document.querySelector(`script[src*="paypal.com/sdk/js"]`);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [paypalClientId, paypalLoaded]);

  // Render PayPal buttons
  useEffect(() => {
    if (!paypalLoaded || !window.paypal || !paypalContainerRef.current || !formValid) return;

    // Clear existing buttons
    paypalContainerRef.current.innerHTML = "";

    window.paypal.Buttons({
      style: {
        layout: "vertical",
        color: "gold",
        shape: "rect",
        label: "paypal",
      },
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
          // Capture the payment
          const { data: captureData, error: captureError } = await supabase.functions.invoke("paypal", {
            body: { action: "capture", orderId: data.orderID },
          });
          if (captureError) throw captureError;

          if (captureData.status !== "COMPLETED") {
            throw new Error("Payment was not completed");
          }

          // Create the order in database
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

          // Track purchase in GA4
          trackPurchase(
            data.orderID,
            totalPrice,
            items.map(item => ({
              item_name: item.product.name,
              price: item.product.price
            }))
          );

          // Clear the cart
          await clearCart();

          toast({
            title: "Payment Successful!",
            description: "Your order has been placed.",
          });

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
          {/* Checkout Form */}
          <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-6">
            <h2 className="font-display text-2xl text-stone-900 dark:text-stone-100 mb-6 flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-amber-600" />
              Delivery Details
            </h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nickname" className="text-stone-700 dark:text-stone-300">Nickname</Label>
                <Input
                  id="nickname"
                  value={nickname || "Citizen"}
                  disabled
                  className="bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-stone-700 dark:text-stone-300">Email</Label>
                <Input
                  id="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-stone-700 dark:text-stone-300">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                  className="border-stone-300 dark:border-stone-700 focus:border-amber-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-stone-700 dark:text-stone-300">Full Address *</Label>
                <Textarea
                  id="address"
                  placeholder="123 Main Street, City, State 12345"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  rows={3}
                  required
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
                  required
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

          {/* Order Summary */}
          <div>
            <div className="bg-stone-100 dark:bg-stone-800 rounded-xl p-6 sticky top-24">
              <h2 className="font-display text-2xl text-stone-900 dark:text-stone-100 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white dark:bg-stone-900 rounded-lg flex items-center justify-center text-2xl overflow-hidden">
                      {item.product.image ? (
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        "📦"
                      )}
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
