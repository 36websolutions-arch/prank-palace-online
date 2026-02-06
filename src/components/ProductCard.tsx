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

  const productLink =
    name.toLowerCase().includes("you smell like shit") ? "/you-smell-like-shit" :
    type === "subscription" ? `/subscription-checkout/${id}` :
    `/product/${id}`;

  return (
    <Link to={productLink}>
      <div className="bg-white dark:bg-stone-900 rounded-xl overflow-hidden shadow-md border border-stone-200 dark:border-stone-800 group hover:shadow-lg hover:border-amber-500/50 transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-stone-100 dark:bg-stone-800">
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
              ? "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400"
              : type === "subscription"
              ? "bg-amber-600 text-white"
              : "bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300"
          }`}>
            {type === "digital" ? "Digital" : type === "subscription" ? "Ongoing" : "Physical"}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-display text-xl mb-2 text-stone-900 dark:text-stone-100 group-hover:text-amber-600 transition-colors">
            {name}
          </h3>

          {description && (
            <p className="text-stone-500 dark:text-stone-400 text-sm mb-3 line-clamp-2">
              {description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-amber-600">
              ${price.toFixed(2)}
            </span>

            {type === "digital" ? (
              <Button className="gap-2 bg-amber-600 hover:bg-amber-700 text-white" size="sm" onClick={handleBuyClick}>
                <Zap className="h-4 w-4" />
                Buy Now
              </Button>
            ) : type === "subscription" ? (
              <Button className="gap-2 bg-amber-600 hover:bg-amber-700 text-white" size="sm" onClick={handleBuyClick}>
                <RefreshCw className="h-4 w-4" />
                Activate
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-stone-300 dark:border-stone-700 hover:border-amber-600 hover:text-amber-600"
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
