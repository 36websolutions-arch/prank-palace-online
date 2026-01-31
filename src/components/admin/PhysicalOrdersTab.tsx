import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChronicleLoader } from "@/components/ChronicleLoader";
import { EmptyState } from "@/components/EmptyState";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, Clock, MapPin, Phone, Calendar } from "lucide-react";

interface PhysicalOrder {
  id: string;
  nickname: string;
  email: string;
  phone: string;
  address: string;
  delivery_date: string;
  items: any;
  amount_paid: number;
  status: string;
  created_at: string;
}

export function PhysicalOrdersTab() {
  const [orders, setOrders] = useState<PhysicalOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "Pending" | "Delivered">("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("physical_orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  const markAsDelivered = async (orderId: string) => {
    const { error } = await supabase
      .from("physical_orders")
      .update({ status: "Delivered", delivered_at: new Date().toISOString() })
      .eq("id", orderId);

    if (error) {
      toast({ title: "Error", description: "Failed to update order", variant: "destructive" });
    } else {
      toast({ title: "Success! 🎉", description: "Order marked as delivered" });
      fetchOrders();
    }
  };

  const filteredOrders = filter === "all" ? orders : orders.filter(o => o.status === filter);

  if (loading) return <ChronicleLoader />;

  return (
    <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="font-display text-2xl text-stone-900 dark:text-stone-100">Physical Orders</h2>
        <div className="flex gap-2">
          {(["all", "Pending", "Delivered"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All" : f}
            </Button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <EmptyState icon="📦" title="No physical orders yet..." description="The warehouse is quiet… too quiet 😏" />
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-secondary rounded-xl p-4 border">
              <div className="flex flex-col lg:flex-row justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-sm bg-background px-2 py-1 rounded">{order.id.slice(0, 8)}...</span>
                    <Badge variant={order.status === "Delivered" ? "default" : "secondary"} className="gap-1">
                      {order.status === "Delivered" ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {order.status}
                    </Badge>
                    <span className="text-2xl font-bold text-primary">${Number(order.amount_paid).toFixed(2)}</span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2 text-sm">
                    <div><span className="text-muted-foreground">Nickname:</span> {order.nickname}</div>
                    <div><span className="text-muted-foreground">Email:</span> {order.email}</div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-muted-foreground" /> {order.phone}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" /> 
                      Delivery: {new Date(order.delivery_date).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-start gap-1 text-sm">
                    <MapPin className="h-3 w-3 text-muted-foreground mt-1" />
                    <span>{order.address}</span>
                  </div>

                  <div className="text-sm">
                    <span className="text-muted-foreground">Items: </span>
                    {Array.isArray(order.items) 
                      ? order.items.map((item: any) => `${item.name} x${item.qty}`).join(", ")
                      : "N/A"
                    }
                  </div>
                </div>

                <div className="flex items-center">
                  {order.status === "Pending" && (
                    <Button className="bg-amber-600 hover:bg-amber-700 text-white" onClick={() => markAsDelivered(order.id)}>
                      Mark Delivered
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
