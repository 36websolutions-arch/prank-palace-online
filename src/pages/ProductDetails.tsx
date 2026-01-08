import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JokerLoader } from "@/components/JokerLoader";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";
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
    if (!user) {
      navigate("/auth");
      return;
    }
    if (product) {
      await addToCart(product.id);
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    navigate(`/digital-checkout/${product?.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <JokerLoader />
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12 text-center">
          <span className="text-6xl mb-4 inline-block">🎭</span>
          <h1 className="font-display text-4xl mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">This prank seems to have disappeared...</p>
          <Link to="/">
            <Button variant="joker">Back to Home</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          to={product.type === "digital" ? "/digital-products" : "/physical-products"}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {product.type === "digital" ? "Digital" : "Physical"} Pranks
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-square bg-secondary rounded-2xl overflow-hidden flex items-center justify-center">
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
                  ? "bg-joker-green text-primary-foreground" 
                  : "bg-joker-gold text-foreground"
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
            <h1 className="font-display text-4xl lg:text-5xl mb-4">{product.name}</h1>
            
            <p className="text-4xl font-bold text-primary mb-6">
              ${Number(product.price).toFixed(2)}
            </p>

            {product.description && (
              <div className="mb-8">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4 mt-auto">
              {product.type === "digital" ? (
                <Button 
                  variant="joker" 
                  size="xl" 
                  className="w-full gap-2"
                  onClick={handleBuyNow}
                >
                  <Zap className="h-5 w-5" />
                  Buy Now - Instant Delivery
                </Button>
              ) : (
                <>
                  <Button 
                    variant="joker" 
                    size="xl" 
                    className="w-full gap-2"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </Button>
                  <Link to="/cart" className="block">
                    <Button 
                      variant="outline" 
                      size="xl" 
                      className="w-full"
                    >
                      View Cart
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Trust Badges */}
            <div className="mt-8 pt-8 border-t">
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <span className="text-2xl mb-1 block">🔒</span>
                  <p className="text-muted-foreground">Secure Checkout</p>
                </div>
                <div>
                  <span className="text-2xl mb-1 block">⚡</span>
                  <p className="text-muted-foreground">
                    {product.type === "digital" ? "Instant Delivery" : "Fast Shipping"}
                  </p>
                </div>
                <div>
                  <span className="text-2xl mb-1 block">😈</span>
                  <p className="text-muted-foreground">Maximum Chaos</p>
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
