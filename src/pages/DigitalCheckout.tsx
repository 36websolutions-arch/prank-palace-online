import { useEffect, useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JokerLoader } from "@/components/JokerLoader";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Zap, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { trackPurchase } from "@/lib/analytics";

declare global {
  interface Window {
    paypal?: any;
  }
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
  type: string;
  description: string | null;
  digital_content: string | null;
}

interface Profile {
  nickname: string;
  email: string;
}

export default function DigitalCheckout() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [paypalClientId, setPaypalClientId] = useState<string | null>(null);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Fetch product and profile
  useEffect(() => {
    if (user && id) {
      Promise.all([fetchProduct(), fetchProfile()]).then(() => setLoading(false));
    }
  }, [user, id]);

  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .eq("type", "digital")
      .maybeSingle();

    if (error) {
      console.error("Error fetching product:", error);
      toast({
        title: "Error",
        description: "Failed to load product",
        variant: "destructive",
      });
    }
    setProduct(data);
  };

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("nickname, email")
      .eq("id", user?.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
    }
    setProfile(data);
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
        toast({
          title: "Error",
          description: "Failed to initialize payment system",
          variant: "destructive",
        });
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
      toast({
        title: "Error",
        description: "Failed to load payment system",
        variant: "destructive",
      });
    };
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [paypalClientId]);

  // Render PayPal buttons
  useEffect(() => {
    if (!paypalLoaded || !window.paypal || !product || !profile) return;

    const container = document.getElementById("paypal-button-container");
    if (!container) return;

    container.innerHTML = "";

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
              amount: product.price.toFixed(2),
            },
          });

          if (error) throw error;
          return data.orderId;
        } catch (error) {
          console.error("Error creating order:", error);
          toast({
            title: "Error",
            description: "Failed to create payment order",
            variant: "destructive",
          });
          setProcessing(false);
          throw error;
        }
      },
      onApprove: async (data: { orderID: string }) => {
        try {
          // Capture payment
          const { data: captureData, error: captureError } = await supabase.functions.invoke("paypal", {
            body: {
              action: "capture",
              orderId: data.orderID,
            },
          });

          if (captureError) throw captureError;

          // Save digital order
          const { error: orderError } = await supabase.from("digital_orders").insert({
            user_id: user!.id,
            product_id: product.id,
            product_name: product.name,
            nickname: profile.nickname,
            email: profile.email,
            amount_paid: product.price,
            payment_method: "paypal",
            payment_provider: "paypal",
            paypal_order_id: data.orderID,
            status: "completed",
            delivered_at: new Date().toISOString(),
          });

          if (orderError) throw orderError;

          // Track purchase in GA4
          trackPurchase(
            data.orderID,
            product.price,
            [{ item_name: product.name, price: product.price }]
          );

          toast({
            title: "Payment Successful! 🎉",
            description: "Your digital product is ready!",
          });

          // Navigate to success page with digital content
          navigate(`/order-success?type=digital&productId=${product.id}`);
        } catch (error) {
          console.error("Error processing payment:", error);
          toast({
            title: "Error",
            description: "Failed to complete payment",
            variant: "destructive",
          });
        } finally {
          setProcessing(false);
        }
      },
      onCancel: () => {
        setProcessing(false);
        toast({
          title: "Payment Cancelled",
          description: "You cancelled the payment",
        });
      },
      onError: (err: Error) => {
        console.error("PayPal error:", err);
        setProcessing(false);
        toast({
          title: "Payment Error",
          description: "There was an error processing your payment",
          variant: "destructive",
        });
      },
    }).render("#paypal-button-container");
  }, [paypalLoaded, product, profile, user, navigate]);

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
          <p className="text-muted-foreground mb-8">This digital product doesn't exist.</p>
          <Link to="/digital-products">
            <Button variant="joker">Browse Digital Products</Button>
          </Link>
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
          to={`/product/${product.id}`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Product
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-4xl mb-8 text-center">Complete Your Purchase</h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Summary */}
            <div className="bg-card border rounded-xl p-6">
              <h2 className="font-semibold text-xl mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-joker-green" />
                Digital Product
              </h2>
              
              <div className="flex gap-4 mb-6">
                <div className="w-24 h-24 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">💻</div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  {product.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">${product.price.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-joker-green/10 rounded-lg text-sm">
                <p className="flex items-center gap-2 text-joker-green font-medium">
                  <Zap className="h-4 w-4" />
                  Instant delivery after payment
                </p>
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-card border rounded-xl p-6">
              <h2 className="font-semibold text-xl mb-4 flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Secure Payment
              </h2>

              {profile && (
                <div className="mb-6 space-y-2 text-sm">
                  <p><span className="text-muted-foreground">Account:</span> {profile.nickname}</p>
                  <p><span className="text-muted-foreground">Email:</span> {profile.email}</p>
                </div>
              )}

              <div className="min-h-[150px] relative">
                {!paypalLoaded && (
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
                <div id="paypal-button-container" className={!paypalLoaded ? "hidden" : ""}></div>
              </div>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Your payment is secured by PayPal. You'll receive instant access after payment.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
