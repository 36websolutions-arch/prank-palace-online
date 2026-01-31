import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChronicleLoader } from "@/components/ChronicleLoader";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";

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
  type: string;
  description: string | null;
  subscription_options: unknown;
}

export default function SubscriptionProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("type", "subscription");
    setProducts(data || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-4">
            <RefreshCw className="h-8 w-8 text-amber-600" />
          </div>
          <h1 className="font-display text-5xl text-stone-900 dark:text-stone-100 mb-4">Subscription Products</h1>
          <p className="text-stone-600 dark:text-stone-400 text-lg">Regular deliveries for ongoing value.</p>
        </div>

        {loading ? (
          <ChronicleLoader />
        ) : products.length === 0 ? (
          <EmptyState icon="🔄" title="No subscription products yet..." description="Check back soon for recurring offerings!" />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden hover:shadow-lg hover:border-amber-500/50 transition-all duration-300 group"
              >
                {/* Product Image */}
                <div className="aspect-video bg-stone-100 dark:bg-stone-800 relative overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">🔄</div>
                  )}
                  <Badge className="absolute top-3 right-3 gap-1 bg-amber-600 text-white">
                    <RefreshCw className="h-3 w-3" />
                    Ongoing
                  </Badge>
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <h3 className="font-display text-xl text-stone-900 dark:text-stone-100 mb-2 group-hover:text-amber-600 transition-colors">{product.name}</h3>
                  {product.description && (
                    <p className="text-stone-600 dark:text-stone-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                  )}

                  {/* Subscription Options Preview */}
                  {product.subscription_options && Array.isArray(product.subscription_options) && product.subscription_options.length > 0 && (
                    <div className="mb-4 space-y-2">
                      <p className="text-xs text-stone-500 dark:text-stone-400 font-medium uppercase tracking-wide">Available Plans:</p>
                      <div className="flex flex-wrap gap-2">
                        {(product.subscription_options as SubscriptionOption[]).map((opt, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300">
                            {opt.name} - ${opt.price}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Link to={`/subscription-checkout/${product.id}`}>
                    <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                      Subscribe Now
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
