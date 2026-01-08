import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { JokerLoader } from "@/components/JokerLoader";
import { EmptyState } from "@/components/EmptyState";

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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <span className="text-5xl mb-4 inline-block">⚡</span>
          <h1 className="font-display text-5xl mb-4">Digital Pranks</h1>
          <p className="text-muted-foreground text-lg">Instant delivery. Maximum chaos. 😈</p>
        </div>

        {loading ? (
          <JokerLoader />
        ) : products.length === 0 ? (
          <EmptyState icon="💻" title="No digital pranks yet..." description="No pranks sold yet… suspicious 😏" />
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
