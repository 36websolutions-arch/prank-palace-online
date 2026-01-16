import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Zap, RefreshCw } from "lucide-react";
import { trackAddToCart } from "@/lib/analytics";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string | null;
  type: "digital" | "physical" | "subscription";
  description?: string | null;
}

export function ProductCard({ id, name, price, image, type, description }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    trackAddToCart(name, price);
    addToCart(id);
  };

  const handleBuyClick = () => {
    trackAddToCart(name, price);
  };

  const productLink = type === "subscription" ? `/subscription-checkout/${id}` : `/product/${id}`;

  return (
    <Link to={productLink}>
      <div className="product-card bg-card rounded-xl overflow-hidden shadow-card border border-border group">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-secondary">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              {type === "digital" ? "💻" : type === "subscription" ? "🔄" : "📦"}
            </div>
          )}
          
          {/* Type Badge */}
          <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
            type === "digital" 
              ? "bg-joker-green text-primary-foreground" 
              : type === "subscription"
              ? "bg-primary text-primary-foreground"
              : "bg-joker-gold text-foreground"
          }`}>
            {type === "digital" ? "⚡ Digital" : type === "subscription" ? "🔄 Ongoing Shenanigans" : "📦 Physical"}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-display text-xl mb-2 group-hover:text-primary transition-colors">
            {name}
          </h3>
          
          {description && (
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
              {description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">
              ${price.toFixed(2)}
            </span>

            {type === "digital" ? (
              <Button variant="joker" size="sm" className="gap-2" onClick={handleBuyClick}>
                <Zap className="h-4 w-4" />
                Buy Now
              </Button>
            ) : type === "subscription" ? (
              <Button variant="joker" size="sm" className="gap-2" onClick={handleBuyClick}>
                <RefreshCw className="h-4 w-4" />
                Activate
              </Button>
            ) : (
              <Button 
                variant="gold" 
                size="sm" 
                className="gap-2"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
