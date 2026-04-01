import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Users, UserCheck, UserX, RefreshCw, Search, Download } from "lucide-react";

interface Subscriber {
  id: string;
  email: string;
  nickname: string | null;
  subscribed_at: string;
  unsubscribed_at: string | null;
  is_active: boolean;
}

export function SubscribersTab() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "unsubscribed">("all");

  const fetchSubscribers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("subscribed_at", { ascending: false });

    if (!error && data) {
      setSubscribers(data as Subscriber[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const filtered = subscribers.filter((s) => {
    const matchesSearch = !search || s.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && s.is_active) ||
      (filter === "unsubscribed" && !s.is_active);
    return matchesSearch && matchesFilter;
  });

  const activeCount = subscribers.filter((s) => s.is_active).length;
  const unsubCount = subscribers.filter((s) => !s.is_active).length;

  const exportCSV = () => {
    const headers = "Email,Subscribed At,Active,Unsubscribed At\n";
    const rows = filtered
      .map((s) => `${s.email},${s.subscribed_at},${s.is_active},${s.unsubscribed_at || ""}`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
          <CardContent className="pt-6 text-center">
            <Users className="h-6 w-6 text-amber-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">{subscribers.length}</p>
            <p className="text-xs text-stone-500">Total</p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
          <CardContent className="pt-6 text-center">
            <UserCheck className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">{activeCount}</p>
            <p className="text-xs text-stone-500">Active</p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
          <CardContent className="pt-6 text-center">
            <UserX className="h-6 w-6 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">{unsubCount}</p>
            <p className="text-xs text-stone-500">Unsubscribed</p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-stone-900 dark:text-stone-100">
            <Mail className="h-5 w-5 text-amber-600" />
            Prank Letter Subscribers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <Input
                placeholder="Search by email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 border-stone-300 dark:border-stone-700"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
                className={filter === "all" ? "bg-amber-600 text-white" : ""}
              >
                All
              </Button>
              <Button
                variant={filter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("active")}
                className={filter === "active" ? "bg-green-600 text-white" : ""}
              >
                Active
              </Button>
              <Button
                variant={filter === "unsubscribed" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("unsubscribed")}
                className={filter === "unsubscribed" ? "bg-red-500 text-white" : ""}
              >
                Unsub'd
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={fetchSubscribers} className="border-stone-300 dark:border-stone-700">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={exportCSV} className="border-stone-300 dark:border-stone-700">
                <Download className="h-4 w-4 mr-1" />
                CSV
              </Button>
            </div>
          </div>

          {loading ? (
            <p className="text-center text-stone-500 py-8">Loading subscribers...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-stone-500 py-8">No subscribers found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200 dark:border-stone-700">
                    <th className="text-left py-2 px-3 text-stone-500 font-medium">Email</th>
                    <th className="text-left py-2 px-3 text-stone-500 font-medium">Subscribed</th>
                    <th className="text-left py-2 px-3 text-stone-500 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((sub) => (
                    <tr key={sub.id} className="border-b border-stone-100 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/50">
                      <td className="py-2 px-3 text-stone-900 dark:text-stone-100">{sub.email}</td>
                      <td className="py-2 px-3 text-stone-500">
                        {new Date(sub.subscribed_at).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-3">
                        {sub.is_active ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                            <UserCheck className="h-3 w-3" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full">
                            <UserX className="h-3 w-3" /> Unsub'd
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
