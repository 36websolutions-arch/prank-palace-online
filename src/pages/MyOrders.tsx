import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePageMeta } from "@/hooks/usePageMeta";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChronicleLoader } from "@/components/ChronicleLoader";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Clock, CheckCircle, ShoppingBag } from "lucide-react";

interface Order {
  id: string;
  items: { name: string; qty: number; price: number }[];
  amount_paid: number;
  status: string;
  created_at: string;
  payment_provider: string;
}

export default function MyOrders() {
  usePageMeta({ title: "My Orders", description: "View your order history", noindex: true });

  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("physical_orders")
        .select("id, items, amount_paid, status, created_at, payment_provider")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
      } else {
        setOrders(data || []);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <ChronicleLoader />
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <EmptyState
            icon="🔒"
            title="Sign in to view your orders"
            description="Create an account or sign in to track your order history."
            action={<Link to="/auth"><Button className="bg-amber-600 hover:bg-amber-700 text-white">Sign In</Button></Link>}
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <ShoppingBag className="h-8 w-8 text-amber-600" />
            <h1 className="font-display text-3xl text-stone-900 dark:text-stone-100">My Orders</h1>
          </div>

          {orders.length === 0 ? (
            <EmptyState
              icon="📦"
              title="No orders yet"
              description="Your order history will appear here after your first purchase."
              action={<Link to="/"><Button className="bg-amber-600 hover:bg-amber-700 text-white">Browse Products</Button></Link>}
            />
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const date = new Date(order.created_at);
                const items = Array.isArray(order.items) ? order.items : [];
                const productName = items[0]?.name || "Order";

                return (
                  <div
                    key={order.id}
                    className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Package className="h-4 w-4 text-amber-600 flex-shrink-0" />
                          <span className="font-bold text-stone-900 dark:text-stone-100 truncate">
                            {productName}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-stone-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                          {items[0]?.qty > 1 && <span>Qty: {items[0].qty}</span>}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-bold text-stone-900 dark:text-stone-100">
                          ${order.amount_paid.toFixed(2)}
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            order.status === "Delivered"
                              ? "border-green-500 text-green-600 mt-1"
                              : "border-amber-500 text-amber-600 mt-1"
                          }
                        >
                          {order.status === "Delivered" ? (
                            <><CheckCircle className="h-3 w-3 mr-1" /> Delivered</>
                          ) : (
                            <><Clock className="h-3 w-3 mr-1" /> {order.status}</>
                          )}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
