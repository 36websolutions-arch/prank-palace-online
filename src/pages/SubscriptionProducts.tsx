import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JokerLoader } from "@/components/JokerLoader";
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <span className="text-5xl mb-4 inline-block">🔄</span>
          <h1 className="font-display text-5xl mb-4">Subscription Products</h1>
          <p className="text-muted-foreground text-lg">Regular deliveries of chaos! 😈</p>
        </div>

        {loading ? (
          <JokerLoader />
        ) : products.length === 0 ? (
          <EmptyState icon="🔄" title="No subscription products yet..." description="Check back soon for recurring mischief!" />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-shadow group"
              >
                {/* Product Image */}
                <div className="aspect-video bg-secondary relative overflow-hidden">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">🔄</div>
                  )}
                  <Badge className="absolute top-3 right-3 gap-1">
                    <RefreshCw className="h-3 w-3" />
                    Subscription
                  </Badge>
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <h3 className="font-display text-xl mb-2">{product.name}</h3>
                  {product.description && (
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{product.description}</p>
                  )}

                  {/* Subscription Options Preview */}
                  {product.subscription_options && Array.isArray(product.subscription_options) && product.subscription_options.length > 0 && (
                    <div className="mb-4 space-y-2">
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Available Plans:</p>
                      <div className="flex flex-wrap gap-2">
                        {(product.subscription_options as SubscriptionOption[]).map((opt, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {opt.name} - ${opt.price}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Link to={`/subscription-checkout/${product.id}`}>
                    <Button variant="joker" className="w-full">
                      Subscribe Now 🔄
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