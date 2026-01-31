import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { ChronicleLoader } from "@/components/ChronicleLoader";
import { EmptyState } from "@/components/EmptyState";
import { Zap } from "lucide-react";

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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-4">
            <Zap className="h-8 w-8 text-amber-600" />
          </div>
          <h1 className="font-display text-5xl text-stone-900 dark:text-stone-100 mb-4">Digital Products</h1>
          <p className="text-stone-600 dark:text-stone-400 text-lg">Instant delivery. Maximum value.</p>
        </div>

        {loading ? (
          <ChronicleLoader />
        ) : products.length === 0 ? (
          <EmptyState icon="💻" title="No digital products yet..." description="Check back soon for new offerings!" />
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
