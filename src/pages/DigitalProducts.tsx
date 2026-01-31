import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { ChronicleLoader } from "@/components/ChronicleLoader";
import { EmptyState } from "@/components/EmptyState";
import { Scroll, Star } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
  type: string;
  description: string | null;
}

export default function DigitalProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").eq("type", "digital");
    setProducts(data || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-stone-100 dark:from-amber-900/30 dark:to-stone-800/30 mb-4">
            <Scroll className="h-8 w-8 text-amber-600" />
          </div>
          <h1 className="font-display text-5xl text-stone-900 dark:text-stone-100 mb-4">Senate Archives</h1>
          <p className="text-stone-600 dark:text-stone-400 text-lg font-serif italic">"Digital scrolls of wisdom. Instant delivery to your quarters."</p>
          <div className="flex items-center justify-center gap-2 mt-4 text-amber-600">
            <Star className="h-4 w-4" />
            <span className="text-sm font-medium">Knowledge the Senate couldn't suppress</span>
            <Star className="h-4 w-4" />
          </div>
        </div>

        {loading ? (
          <ChronicleLoader />
        ) : products.length === 0 ? (
          <EmptyState icon="📜" title="The Archives Are Empty..." description="New scrolls are being transcribed. Check back soon, citizen." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} type="digital" />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
