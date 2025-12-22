import { Navigate, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { EmptyState } from "@/components/EmptyState";
import { Trash2, Plus, Minus } from "lucide-react";

export default function Cart() {
  const { user, loading } = useAuth();
  const { items, totalPrice, removeFromCart, updateQuantity } = useCart();

  if (!loading && !user) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="font-display text-5xl text-center mb-12">Your Cart 🛒</h1>

        {items.length === 0 ? (
          <EmptyState 
            icon="🛒" 
            title="Your cart is empty!" 
            description="No pranks in here yet... that's suspicious 🤔"
            action={<Link to="/physical-products"><Button variant="joker">Browse Pranks</Button></Link>}
          />
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4 mb-8">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 bg-card p-4 rounded-xl border">
                  <div className="w-20 h-20 bg-secondary rounded-lg flex items-center justify-center text-3xl">
                    {item.product.image ? <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover rounded-lg" /> : "📦"}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.product.name}</h3>
                    <p className="text-primary font-bold">${item.product.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="h-4 w-4" /></Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="h-4 w-4" /></Button>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              ))}
            </div>
            
            <div className="bg-secondary p-6 rounded-xl">
              <div className="flex justify-between items-center text-xl font-bold mb-4">
                <span>Total:</span>
                <span className="text-primary">${totalPrice.toFixed(2)}</span>
              </div>
              <Link to="/checkout">
                <Button variant="joker" size="xl" className="w-full">Proceed to Mischief Checkout 😈</Button>
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
