import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { TrendingUp, RefreshCw, Eye, EyeOff, Users, Clock } from "lucide-react";

interface ForumArticle {
  id: string;
  roman_title: string;
  roman_category: string;
  api_source: string;
  sentiment: string;
  is_published: boolean;
  created_at: string;
}

interface FetchLog {
  id: string;
  api_source: string;
  fetched_at: string;
  articles_fetched: number;
  articles_new: number;
  error: string | null;
}

export function ManageForumTab() {
  const [articles, setArticles] = useState<ForumArticle[]>([]);
  const [fetchLogs, setFetchLogs] = useState<FetchLog[]>([]);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [articlesRes, logsRes, subsRes] = await Promise.all([
      supabase
        .from("forum_economicus_articles")
        .select("id, roman_title, roman_category, api_source, sentiment, is_published, created_at")
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("forum_economicus_fetch_log")
        .select("*")
        .order("fetched_at", { ascending: false })
        .limit(10),
      supabase
        .from("newsletter_subscribers")
        .select("id", { count: "exact" })
        .eq("is_active", true),
    ]);

    setArticles((articlesRes.data as ForumArticle[]) || []);
    setFetchLogs((logsRes.data as FetchLog[]) || []);
    setSubscriberCount(subsRes.count || 0);
    setLoading(false);
  };

  const handleFetchNow = async () => {
    setFetching(true);
    try {
      const { data, error } = await supabase.functions.invoke("fetch-forum-economicus", {
        body: {},
      });
      if (error) throw error;
      alert(`Fetch complete: ${data.articles_new || 0} new articles`);
      loadData();
    } catch (err: any) {
      alert(`Fetch failed: ${err.message}`);
    } finally {
      setFetching(false);
    }
  };

  const togglePublish = async (id: string, currentlyPublished: boolean) => {
    const { error } = await supabase
      .from("forum_economicus_articles")
      .update({ is_published: !currentlyPublished })
      .eq("id", id);

    if (!error) {
      setArticles((prev) =>
        prev.map((a) => (a.id === id ? { ...a, is_published: !currentlyPublished } : a))
      );
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-stone-200 dark:bg-stone-700 rounded w-48 animate-pulse" />
        <div className="h-64 bg-stone-200 dark:bg-stone-700 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-stone-500 text-sm mb-1">
            <TrendingUp className="h-4 w-4" />
            Total Articles
          </div>
          <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">{articles.length}</p>
        </div>
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-stone-500 text-sm mb-1">
            <Users className="h-4 w-4" />
            Newsletter Subscribers
          </div>
          <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">{subscriberCount}</p>
        </div>
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-4">
          <Button
            onClick={handleFetchNow}
            disabled={fetching}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${fetching ? "animate-spin" : ""}`} />
            {fetching ? "Fetching..." : "Fetch New Articles"}
          </Button>
        </div>
      </div>

      {/* Articles List */}
      <div>
        <h3 className="font-display text-lg text-stone-900 dark:text-stone-100 mb-4">Recent Articles</h3>
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 dark:bg-stone-800">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-stone-600 dark:text-stone-400">Title</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-600 dark:text-stone-400">Category</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-600 dark:text-stone-400">Source</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-600 dark:text-stone-400">Sentiment</th>
                  <th className="text-center px-4 py-3 font-medium text-stone-600 dark:text-stone-400">Published</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
                    <td className="px-4 py-3 text-stone-900 dark:text-stone-100 max-w-xs truncate">
                      {article.roman_title}
                    </td>
                    <td className="px-4 py-3 text-stone-500 capitalize">
                      {article.roman_category.replace("_", " ")}
                    </td>
                    <td className="px-4 py-3 text-stone-500 capitalize">
                      {article.api_source.replace("_", " ")}
                    </td>
                    <td className="px-4 py-3 capitalize">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        article.sentiment === "favorable" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                        article.sentiment === "ominous" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                        "bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-400"
                      }`}>
                        {article.sentiment}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePublish(article.id, article.is_published)}
                        className={article.is_published ? "text-emerald-600" : "text-stone-400"}
                      >
                        {article.is_published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Fetch Log */}
      <div>
        <h3 className="font-display text-lg text-stone-900 dark:text-stone-100 mb-4">Fetch Log</h3>
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 dark:bg-stone-800">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-stone-600 dark:text-stone-400">Time</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-600 dark:text-stone-400">API Source</th>
                  <th className="text-right px-4 py-3 font-medium text-stone-600 dark:text-stone-400">Fetched</th>
                  <th className="text-right px-4 py-3 font-medium text-stone-600 dark:text-stone-400">New</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-600 dark:text-stone-400">Error</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {fetchLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-4 py-3 text-stone-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(log.fetched_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-stone-600 dark:text-stone-400 capitalize">
                      {log.api_source.replace("_", " ")}
                    </td>
                    <td className="px-4 py-3 text-right text-stone-600 dark:text-stone-400">{log.articles_fetched}</td>
                    <td className="px-4 py-3 text-right font-medium text-amber-600">{log.articles_new}</td>
                    <td className="px-4 py-3 text-red-500 text-xs truncate max-w-xs">{log.error || "—"}</td>
                  </tr>
                ))}
                {fetchLogs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-stone-500">No fetch logs yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
