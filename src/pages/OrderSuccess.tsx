import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CheckCircle, Home, ShoppingBag, Zap, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  digital_content: string | null;
}

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const productId = searchParams.get("productId");
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  const isDigital = type === "digital";

  useEffect(() => {
    if (isDigital && productId) {
      setLoading(true);
      supabase
        .from("products")
        .select("id, name, digital_content")
        .eq("id", productId)
        .single()
        .then(({ data }) => {
          setProduct(data);
          setLoading(false);
        });
    }
  }, [isDigital, productId]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-joker-green/20 mb-6 animate-bounce-in">
            <CheckCircle className="h-12 w-12 text-joker-green" />
          </div>
          
          <h1 className="font-display text-5xl mb-4">
            {isDigital ? "Payment Complete! 🎉" : "Order Confirmed! 🎉"}
          </h1>
          
          <p className="text-xl text-muted-foreground mb-2">
            {isDigital ? "Your digital product is ready!" : "Your prank is loading… 😈"}
          </p>
          
          <p className="text-muted-foreground mb-8">
            {isDigital 
              ? "Access your digital content below. It's also saved to your order history."
              : "We've received your order and will start preparing your mischief supplies right away! You'll receive an email confirmation shortly."}
          </p>

          {/* Digital Product Content */}
          {isDigital && product && product.digital_content && (
            <div className="bg-joker-green/10 border border-joker-green/30 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-joker-green" />
                <h3 className="font-semibold text-lg">Your Digital Content</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{product.name}</p>
              <a 
                href={product.digital_content} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="joker" className="gap-2 w-full">
                  <ExternalLink className="h-4 w-4" />
                  Access Your Content
                </Button>
              </a>
            </div>
          )}

          {isDigital && loading && (
            <div className="bg-secondary rounded-xl p-6 mb-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground mt-2">Loading your content...</p>
            </div>
          )}

          {/* Physical Order Steps */}
          {!isDigital && (
            <div className="bg-secondary rounded-xl p-6 mb-8">
              <p className="text-sm text-muted-foreground mb-2">What happens next?</p>
              <ul className="text-left space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-joker-green">✓</span>
                  Order confirmation email sent
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-joker-green">✓</span>
                  Our team prepares your pranks
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-joker-green">✓</span>
                  Shipping notification when dispatched
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-joker-green">✓</span>
                  Maximum mischief upon delivery!
                </li>
              </ul>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button variant="joker" className="gap-2 w-full sm:w-auto">
                <Home className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <Link to={isDigital ? "/digital-products" : "/physical-products"}>
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <ShoppingBag className="h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
