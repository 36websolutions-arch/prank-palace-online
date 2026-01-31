import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChronicleLoader } from "@/components/ChronicleLoader";
import { EmptyState } from "@/components/EmptyState";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, Clock } from "lucide-react";

interface DigitalOrder {
  id: string;
  nickname: string;
  email: string;
  product_name: string;
  amount_paid: number;
  status: string;
  created_at: string;
}

export function DigitalOrdersTab() {
  const [orders, setOrders] = useState<DigitalOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "Pending" | "Delivered">("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("digital_orders")
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
      .from("digital_orders")
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
        <h2 className="font-display text-2xl text-stone-900 dark:text-stone-100">Digital Orders</h2>
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
        <EmptyState icon="📧" title="No digital orders yet..." description="No pranks sold yet… suspicious 😏" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-semibold">Order ID</th>
                <th className="pb-3 font-semibold">Nickname</th>
                <th className="pb-3 font-semibold">Email</th>
                <th className="pb-3 font-semibold">Product</th>
                <th className="pb-3 font-semibold">Paid</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b last:border-0">
                  <td className="py-4 text-sm font-mono">{order.id.slice(0, 8)}...</td>
                  <td className="py-4">{order.nickname}</td>
                  <td className="py-4 text-sm">{order.email}</td>
                  <td className="py-4">{order.product_name}</td>
                  <td className="py-4 font-bold text-primary">${Number(order.amount_paid).toFixed(2)}</td>
                  <td className="py-4">
                    <Badge variant={order.status === "Delivered" ? "default" : "secondary"} className="gap-1">
                      {order.status === "Delivered" ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {order.status}
                    </Badge>
                  </td>
                  <td className="py-4 text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4">
                    {order.status === "Pending" && (
                      <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white" onClick={() => markAsDelivered(order.id)}>
                        Mark Delivered
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
