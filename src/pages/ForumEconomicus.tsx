import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Search,
  ExternalLink,
  Clock,
  Filter,
} from "lucide-react";

interface ForumArticle {
  id: string;
  original_title: string;
  original_url: string;
  original_source: string;
  original_published_at: string;
  api_source: string;
  roman_title: string;
  roman_summary: string;
  roman_category: string;
  roman_characters: string[];
  sentiment: string;
  ticker_symbols: string[];
  created_at: string;
}

const CATEGORIES = [
  { id: "all", label: "All Dispatches" },
  { id: "denarii_report", label: "Denarii Report" },
  { id: "oracle_dispatches", label: "Oracle Dispatches" },
  { id: "senate_decrees", label: "Senate Decrees" },
  { id: "merchant_affairs", label: "Merchant Affairs" },
  { id: "forum_gossip", label: "Forum Gossip" },
];

const API_SOURCES = [
  { id: "all", label: "All Sources" },
  { id: "finnhub", label: "Finnhub" },
  { id: "alpha_vantage", label: "Alpha Vantage" },
  { id: "gnews", label: "GNews" },
];

const SENTIMENT_STYLES: Record<string, { label: string; class: string }> = {
  favorable: { label: "Favorable Omens", class: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  ominous: { label: "Ominous Portents", class: "bg-red-500/20 text-red-400 border-red-500/30" },
  neutral: { label: "The Winds Are Still", class: "bg-stone-500/20 text-stone-400 border-stone-500/30" },
};

const CATEGORY_STYLES: Record<string, string> = {
  denarii_report: "bg-amber-500/20 text-amber-400",
  oracle_dispatches: "bg-purple-500/20 text-purple-400",
  senate_decrees: "bg-blue-500/20 text-blue-400",
  merchant_affairs: "bg-emerald-500/20 text-emerald-400",
  forum_gossip: "bg-pink-500/20 text-pink-400",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function ForumEconomicus() {
  const [articles, setArticles] = useState<ForumArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSource, setSelectedSource] = useState("all");

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from("forum_economicus_articles")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) console.error("Fetch error:", error);
    setArticles((data as ForumArticle[]) || []);
    setLoading(false);
  };

  const filtered = articles.filter((a) => {
    if (selectedCategory !== "all" && a.roman_category !== selectedCategory) return false;
    if (selectedSource !== "all" && a.api_source !== selectedSource) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        a.roman_title.toLowerCase().includes(q) ||
        a.roman_summary.toLowerCase().includes(q) ||
        a.original_title.toLowerCase().includes(q) ||
        a.roman_characters.some((c) => c.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-stone-200 dark:border-stone-800 py-16">
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />

          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 mb-6">
                <TrendingUp className="h-10 w-10 text-amber-600" />
              </div>

              <h1 className="font-display text-5xl md:text-6xl text-stone-900 dark:text-stone-100 mb-4">
                Forum Economicus
              </h1>

              <p className="text-xl text-stone-600 dark:text-stone-400 mb-8 font-serif italic">
                "Where the Denarii flow and the Oracles speak."
              </p>

              {/* Search */}
              <div className="max-w-md mx-auto relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                <Input
                  type="text"
                  placeholder="Search the financial scrolls..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-700"
                />
              </div>

              <p className="text-stone-500 text-sm mt-4">
                {filtered.length} dispatch{filtered.length !== 1 ? "es" : ""} in the forum
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="border-b border-stone-200 dark:border-stone-800 py-4 bg-white/50 dark:bg-stone-900/50">
          <div className="container mx-auto px-4">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 mb-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat.id
                      ? "bg-amber-600 text-white"
                      : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* API source filters */}
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-stone-400" />
              {API_SOURCES.map((src) => (
                <button
                  key={src.id}
                  onClick={() => setSelectedSource(src.id)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                    selectedSource === src.id
                      ? "bg-stone-700 text-white dark:bg-stone-300 dark:text-stone-900"
                      : "bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-500 hover:bg-stone-200 dark:hover:bg-stone-700"
                  }`}
                >
                  {src.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Article Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 p-6 animate-pulse">
                    <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-1/3 mb-3" />
                    <div className="h-6 bg-stone-200 dark:bg-stone-700 rounded w-full mb-3" />
                    <div className="h-16 bg-stone-200 dark:bg-stone-700 rounded w-full mb-4" />
                    <div className="h-3 bg-stone-200 dark:bg-stone-700 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <TrendingUp className="h-16 w-16 text-stone-300 dark:text-stone-700 mx-auto mb-4" />
                <h3 className="font-display text-2xl text-stone-700 dark:text-stone-300 mb-2">
                  {searchQuery || selectedCategory !== "all" || selectedSource !== "all"
                    ? "No dispatches match your search"
                    : "The Forum Is Quiet"}
                </h3>
                <p className="text-stone-500">
                  {searchQuery
                    ? "Try different search terms or clear your filters."
                    : "The market scribes are gathering intelligence. Check back soon."}
                </p>
                {(searchQuery || selectedCategory !== "all" || selectedSource !== "all") && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                      setSelectedSource("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function ArticleCard({ article }: { article: ForumArticle }) {
  const sentiment = SENTIMENT_STYLES[article.sentiment] || SENTIMENT_STYLES.neutral;
  const categoryStyle = CATEGORY_STYLES[article.roman_category] || "bg-stone-500/20 text-stone-400";
  const categoryLabel = CATEGORIES.find((c) => c.id === article.roman_category)?.label || article.roman_category;

  return (
    <div className="bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 p-6 hover:border-amber-500/50 dark:hover:border-amber-500/30 transition-all duration-300 flex flex-col">
      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryStyle}`}>
          {categoryLabel}
        </span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${sentiment.class}`}>
          {sentiment.label}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-display text-lg text-stone-900 dark:text-stone-100 mb-2 leading-snug">
        {article.roman_title}
      </h3>

      {/* Summary */}
      <p className="text-stone-600 dark:text-stone-400 text-sm font-serif italic leading-relaxed mb-4 flex-1">
        {article.roman_summary}
      </p>

      {/* Characters */}
      {article.roman_characters && article.roman_characters.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {article.roman_characters.map((char) => (
            <span
              key={char}
              className="px-2 py-0.5 rounded-full text-xs bg-amber-500/15 text-amber-600 dark:text-amber-400 font-medium"
            >
              {char}
            </span>
          ))}
        </div>
      )}

      {/* Tickers */}
      {article.ticker_symbols && article.ticker_symbols.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {article.ticker_symbols.map((ticker) => (
            <span
              key={ticker}
              className="px-2 py-0.5 rounded text-xs bg-stone-100 dark:bg-stone-800 text-stone-500 font-mono"
            >
              ${ticker}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800 text-xs text-stone-500">
        <div className="flex items-center gap-3">
          <span>{article.original_source}</span>
          <span className="text-stone-300 dark:text-stone-700">•</span>
          <span className="capitalize">{article.api_source.replace("_", " ")}</span>
          <span className="text-stone-300 dark:text-stone-700">•</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {timeAgo(article.created_at)}
          </span>
        </div>
        <a
          href={article.original_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-amber-600 hover:text-amber-500 transition-colors"
        >
          <ExternalLink className="h-3 w-3" />
          Original
        </a>
      </div>
    </div>
  );
}
