import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChronicleLoader } from "@/components/ChronicleLoader";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Zap, ArrowLeft, Package } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
  type: string;
  description: string | null;
  digital_content: string | null;
}

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching product:", error);
    }
    setProduct(data);
    setLoading(false);
  };

  const handleAddToCart = async () => {
    if (product?.name.toLowerCase().includes("you smell like shit")) {
      navigate("/you-smell-like-shit");
      return;
    }
    if (product) {
      await addToCart(product.id);
    }
  };

  const handleBuyNow = () => {
    navigate(`/digital-checkout/${product?.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <ChronicleLoader />
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-6">
            <Package className="h-12 w-12 text-amber-600" />
          </div>
          <h1 className="font-display text-4xl text-stone-900 dark:text-stone-100 mb-4">Product Not Found</h1>
          <p className="text-stone-600 dark:text-stone-400 mb-8">This product doesn't seem to exist.</p>
          <Link to="/">
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">Back to Home</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          to={product.type === "digital" ? "/digital-products" : "/physical-products"}
          className="inline-flex items-center gap-2 text-stone-600 dark:text-stone-400 hover:text-amber-600 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {product.type === "digital" ? "Digital" : "Physical"} Products
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-square bg-stone-100 dark:bg-stone-800 rounded-2xl overflow-hidden flex items-center justify-center">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-9xl">
                  {product.type === "digital" ? "💻" : "📦"}
                </span>
              )}
            </div>

            {/* Type Badge */}
            <Badge
              className={`absolute top-4 right-4 text-sm px-4 py-2 ${
                product.type === "digital"
                  ? "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400"
                  : "bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300"
              }`}
            >
              {product.type === "digital" ? (
                <><Zap className="h-4 w-4 mr-1" /> Digital Product</>
              ) : (
                <><Package className="h-4 w-4 mr-1" /> Physical Product</>
              )}
            </Badge>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="font-display text-4xl lg:text-5xl text-stone-900 dark:text-stone-100 mb-4">{product.name}</h1>

            <p className="text-4xl font-bold text-amber-600 mb-6">
              ${Number(product.price).toFixed(2)}
            </p>

            {product.description && (
              <div className="mb-8">
                <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-2">Description</h3>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4 mt-auto">
              {product.type === "digital" ? (
                <Button
                  size="lg"
                  className="w-full gap-2 bg-amber-600 hover:bg-amber-700 text-white"
                  onClick={handleBuyNow}
                >
                  <Zap className="h-5 w-5" />
                  Buy Now - Instant Delivery
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    className="w-full gap-2 bg-amber-600 hover:bg-amber-700 text-white"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </Button>
                  <Link to="/cart" className="block">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full border-stone-300 dark:border-stone-700 hover:border-amber-600 hover:text-amber-600"
                    >
                      View Cart
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Trust Badges */}
            <div className="mt-8 pt-8 border-t border-stone-200 dark:border-stone-800">
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <span className="text-2xl mb-1 block">🔒</span>
                  <p className="text-stone-600 dark:text-stone-400">Secure Checkout</p>
                </div>
                <div>
                  <span className="text-2xl mb-1 block">⚡</span>
                  <p className="text-stone-600 dark:text-stone-400">
                    {product.type === "digital" ? "Instant Delivery" : "Fast Shipping"}
                  </p>
                </div>
                <div>
                  <span className="text-2xl mb-1 block">✨</span>
                  <p className="text-stone-600 dark:text-stone-400">Quality Guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
