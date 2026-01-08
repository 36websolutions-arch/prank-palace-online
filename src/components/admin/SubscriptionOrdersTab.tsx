import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JokerLoader } from "@/components/JokerLoader";
import { EmptyState } from "@/components/EmptyState";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, Clock, User, MapPin, Phone, Calendar } from "lucide-react";

interface SubscriptionOrder {
  id: string;
  buyer_name: string;
  buyer_email: string;
  recipient_name: string;
  recipient_title: string | null;
  recipient_company: string | null;
  recipient_address: string;
  recipient_address_line1: string | null;
  recipient_address_line2: string | null;
  recipient_city: string | null;
  recipient_state: string | null;
  recipient_zipcode: string | null;
  recipient_country: string | null;
  recipient_email: string | null;
  recipient_phone: string;
  delivery_date: string;
  product_name: string;
  subscription_name: string;
  subscription_price: number;
  amount_paid: number;
  status: string;
  created_at: string;
}

export function SubscriptionOrdersTab() {
  const [orders, setOrders] = useState<SubscriptionOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "Pending" | "Delivered">("all");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("subscription_orders")
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
      .from("subscription_orders")
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

  if (loading) return <JokerLoader />;

  return (
    <div className="bg-card rounded-xl border p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="font-display text-2xl">Subscription Orders 🔄</h2>
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
        <EmptyState icon="🔄" title="No subscription orders yet..." description="Subscription orders will appear here" />
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="border rounded-lg overflow-hidden">
              {/* Order Header */}
              <div 
                className="p-4 bg-secondary/30 cursor-pointer hover:bg-secondary/50 transition-colors"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-mono text-sm text-muted-foreground">#{order.id.slice(0, 8)}</p>
                      <p className="font-semibold">{order.product_name}</p>
                      <p className="text-sm text-primary">{order.subscription_name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-primary">${Number(order.amount_paid).toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={order.status === "Delivered" ? "default" : "secondary"} className="gap-1">
                      {order.status === "Delivered" ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {order.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedOrder === order.id && (
                <div className="p-4 border-t space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Buyer Info */}
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <User className="h-4 w-4" /> Buyer Information
                      </h4>
                      <p className="text-sm"><span className="text-muted-foreground">Name:</span> {order.buyer_name}</p>
                      <p className="text-sm"><span className="text-muted-foreground">Email:</span> {order.buyer_email}</p>
                    </div>

                    {/* Recipient Info */}
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <MapPin className="h-4 w-4" /> Recipient Information
                      </h4>
                      <p className="text-sm"><span className="text-muted-foreground">Name:</span> {order.recipient_name}</p>
                      {order.recipient_title && (
                        <p className="text-sm"><span className="text-muted-foreground">Title:</span> {order.recipient_title}</p>
                      )}
                      {order.recipient_company && (
                        <p className="text-sm"><span className="text-muted-foreground">Company:</span> {order.recipient_company}</p>
                      )}
                      <div className="pt-2">
                        <p className="text-sm font-medium text-muted-foreground">Address:</p>
                        <p className="text-sm">{order.recipient_address_line1 || order.recipient_address}</p>
                        {order.recipient_address_line2 && (
                          <p className="text-sm">{order.recipient_address_line2}</p>
                        )}
                        {order.recipient_city && (
                          <p className="text-sm">
                            {order.recipient_city}, {order.recipient_state} {order.recipient_zipcode}
                          </p>
                        )}
                        {order.recipient_country && (
                          <p className="text-sm">{order.recipient_country}</p>
                        )}
                      </div>
                      {order.recipient_email && (
                        <p className="text-sm"><span className="text-muted-foreground">Email:</span> {order.recipient_email}</p>
                      )}
                      <p className="text-sm flex items-center gap-1">
                        <Phone className="h-3 w-3 text-muted-foreground" /> {order.recipient_phone}
                      </p>
                      <p className="text-sm flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" /> Delivery: {new Date(order.delivery_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {order.status === "Pending" && (
                    <div className="pt-4 border-t">
                      <Button variant="joker" onClick={() => markAsDelivered(order.id)}>
                        Mark as Delivered
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}