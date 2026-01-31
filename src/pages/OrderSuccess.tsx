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
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-6 animate-bounce-in">
            <CheckCircle className="h-12 w-12 text-amber-600" />
          </div>

          <h1 className="font-display text-5xl text-stone-900 dark:text-stone-100 mb-4">
            {isDigital ? "Payment Complete!" : "Order Confirmed!"}
          </h1>

          <p className="text-xl text-stone-600 dark:text-stone-400 mb-2">
            {isDigital ? "Your digital product is ready!" : "Your order is being processed."}
          </p>

          <p className="text-stone-500 dark:text-stone-500 mb-8">
            {isDigital
              ? "Access your digital content below. It's also saved to your order history."
              : "We've received your order and will start preparing it right away. You'll receive an email confirmation shortly."}
          </p>

          {/* Digital Product Content */}
          {isDigital && product && product.digital_content && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-amber-600" />
                <h3 className="font-semibold text-lg text-stone-900 dark:text-stone-100">Your Digital Content</h3>
              </div>
              <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">{product.name}</p>
              <a
                href={product.digital_content}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="gap-2 w-full bg-amber-600 hover:bg-amber-700 text-white">
                  <ExternalLink className="h-4 w-4" />
                  Access Your Content
                </Button>
              </a>
            </div>
          )}

          {isDigital && loading && (
            <div className="bg-stone-100 dark:bg-stone-800 rounded-xl p-6 mb-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
              <p className="text-sm text-stone-600 dark:text-stone-400 mt-2">Loading your content...</p>
            </div>
          )}

          {/* Physical Order Steps */}
          {!isDigital && (
            <div className="bg-stone-100 dark:bg-stone-800 rounded-xl p-6 mb-8">
              <p className="text-sm text-stone-600 dark:text-stone-400 mb-2">What happens next?</p>
              <ul className="text-left space-y-2 text-sm">
                <li className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                  <span className="text-amber-600">✓</span>
                  Order confirmation email sent
                </li>
                <li className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                  <span className="text-amber-600">✓</span>
                  Our team prepares your order
                </li>
                <li className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                  <span className="text-amber-600">✓</span>
                  Shipping notification when dispatched
                </li>
                <li className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                  <span className="text-amber-600">✓</span>
                  Delivery to your address
                </li>
              </ul>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button className="gap-2 w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white">
                <Home className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <Link to={isDigital ? "/digital-products" : "/physical-products"}>
              <Button variant="outline" className="gap-2 w-full sm:w-auto border-stone-300 dark:border-stone-700 hover:border-amber-600 hover:text-amber-600">
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
