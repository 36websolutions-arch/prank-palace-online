import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChronicleLoader } from "@/components/ChronicleLoader";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Star } from "lucide-react";

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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 mb-4">
            <Crown className="h-8 w-8 text-amber-600" />
          </div>
          <h1 className="font-display text-5xl text-stone-900 dark:text-stone-100 mb-4">Imperial Tribute</h1>
          <p className="text-stone-600 dark:text-stone-400 text-lg font-serif italic">"Regular offerings to the Senate. Ongoing value for loyal citizens."</p>
          <div className="flex items-center justify-center gap-2 mt-4 text-amber-600">
            <Star className="h-4 w-4" />
            <span className="text-sm font-medium">Recurring subscriptions for the dedicated</span>
            <Star className="h-4 w-4" />
          </div>
        </div>

        {loading ? (
          <ChronicleLoader />
        ) : products.length === 0 ? (
          <EmptyState icon="👑" title="The Imperial Treasury is Empty..." description="New tribute offerings are being prepared. Check back soon, citizen." />
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
                    <div className="w-full h-full flex items-center justify-center text-6xl">👑</div>
                  )}
                  <Badge className="absolute top-3 right-3 gap-1 bg-gradient-to-r from-amber-600 to-yellow-600 text-white">
                    <Crown className="h-3 w-3" />
                    Imperial
                  </Badge>
                  {/* Wax Seal */}
                  <div className="absolute bottom-3 left-3 w-10 h-10 bg-red-700 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-red-800">
                    S.A.
                  </div>
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
                    <Button className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white">
                      Pay Tribute
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
