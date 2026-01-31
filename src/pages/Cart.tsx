import { Navigate, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { EmptyState } from "@/components/EmptyState";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

export default function Cart() {
  const { user, loading } = useAuth();
  const { items, totalPrice, removeFromCart, updateQuantity } = useCart();

  if (!loading && !user) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag className="h-8 w-8 text-amber-600" />
          <h1 className="font-display text-4xl text-stone-900 dark:text-stone-100">Your Cart</h1>
        </div>

        {items.length === 0 ? (
          <EmptyState
            icon="🛒"
            title="Your cart is empty!"
            description="No items in here yet..."
            action={<Link to="/physical-products"><Button className="bg-amber-600 hover:bg-amber-700 text-white">Browse Products</Button></Link>}
          />
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4 mb-8">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
                  <div className="w-20 h-20 bg-stone-100 dark:bg-stone-800 rounded-lg flex items-center justify-center text-3xl overflow-hidden">
                    {item.product.image ? <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover rounded-lg" /> : "📦"}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-stone-900 dark:text-stone-100">{item.product.name}</h3>
                    <p className="text-amber-600 font-bold">${item.product.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="border-stone-300 dark:border-stone-700" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="h-4 w-4" /></Button>
                    <span className="w-8 text-center font-medium text-stone-900 dark:text-stone-100">{item.quantity}</span>
                    <Button variant="outline" size="icon" className="border-stone-300 dark:border-stone-700" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="h-4 w-4" /></Button>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-800">
              <div className="flex justify-between items-center text-xl font-bold mb-4">
                <span className="text-stone-900 dark:text-stone-100">Total:</span>
                <span className="text-amber-600">${totalPrice.toFixed(2)}</span>
              </div>
              <Link to="/checkout">
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white" size="lg">Proceed to Checkout</Button>
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
