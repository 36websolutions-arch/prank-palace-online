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
import { JokerSpinner } from "@/components/JokerLoader";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
            nickname: nickname || "Prankster",
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

          // Clear the cart
          await clearCart();

          toast({
            title: "Payment Successful! 🎉",
            description: "Your prank order has been placed!",
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
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <EmptyState
            icon="🛒"
            title="Your cart is empty!"
            description="Add some pranks before checking out 😏"
            action={<Link to="/physical-products"><Button variant="joker">Browse Pranks</Button></Link>}
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Link 
          to="/cart"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Link>

        <h1 className="font-display text-4xl mb-8">Proceed to Mischief Checkout 😈</h1>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <div className="bg-card rounded-xl border p-6">
            <h2 className="font-display text-2xl mb-6 flex items-center gap-2">
              <ShoppingBag className="h-6 w-6" />
              Delivery Details
            </h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nickname">Nickname</Label>
                <Input
                  id="nickname"
                  value={nickname || "Prankster"}
                  disabled
                  className="bg-secondary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-secondary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Full Address *</Label>
                <Textarea
                  id="address"
                  placeholder="123 Prank Street, Mischief City, MC 12345"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryDate">Preferred Delivery Date *</Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={form.deliveryDate}
                  onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })}
                  required
                />
              </div>

              <div className="pt-4 border-t">
                {!formValid && (
                  <p className="text-sm text-muted-foreground mb-4 text-center">
                    Please fill in all delivery details to proceed with payment
                  </p>
                )}
                
                {submitting ? (
                  <div className="flex items-center justify-center py-4">
                    <JokerSpinner />
                    <span className="ml-2">Processing payment...</span>
                  </div>
                ) : paypalLoaded && formValid ? (
                  <div ref={paypalContainerRef} className="min-h-[150px]" />
                ) : !paypalLoaded ? (
                  <div className="flex items-center justify-center py-4">
                    <JokerSpinner />
                    <span className="ml-2">Loading PayPal...</span>
                  </div>
                ) : null}
                
                <p className="text-xs text-muted-foreground text-center mt-3">
                  🔒 Your payment is secured by PayPal Sandbox
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-secondary rounded-xl p-6 sticky top-24">
              <h2 className="font-display text-2xl mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-background rounded-lg flex items-center justify-center text-2xl overflow-hidden">
                      {item.product.image ? (
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        "📦"
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-joker-green">Free</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">${totalPrice.toFixed(2)}</span>
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
