import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { JokerLoader } from "@/components/JokerLoader";
import { EmptyState } from "@/components/EmptyState";
import { useAuth } from "@/contexts/AuthContext";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
  type: string;
  description: string | null;
}

export default function PhysicalProducts() {
  const { user, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").eq("type", "physical");
    setProducts(data || []);
    setLoading(false);
  };

  if (!authLoading && !user) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <span className="text-5xl mb-4 inline-block">📦</span>
          <h1 className="font-display text-5xl mb-4">Physical Pranks</h1>
          <p className="text-muted-foreground text-lg">Real props for real mischief! 🪲</p>
        </div>

        {loading ? (
          <JokerLoader />
        ) : products.length === 0 ? (
          <EmptyState icon="📦" title="No physical pranks yet..." description="The warehouse is empty… for now 😏" />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} type="physical" />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
