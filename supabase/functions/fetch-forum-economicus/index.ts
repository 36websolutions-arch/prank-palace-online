import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
const FINNHUB_API_KEY = Deno.env.get("FINNHUB_API_KEY");
const ALPHA_VANTAGE_API_KEY = Deno.env.get("ALPHA_VANTAGE_API_KEY");
const GNEWS_API_KEY = Deno.env.get("GNEWS_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limit cooldowns in minutes
const COOLDOWNS: Record<string, number> = {
  finnhub: 15,
  alpha_vantage: 120,
  gnews: 60,
};

const ROMAN_TRANSFORM_PROMPT = `You are 'Forum Economicus', the financial desk of The Corporate Chronicle — a satirical publication covering modern events as Roman Empire dispatches.

VOCABULARY:
- "Stocks/Crypto" → "Denarii"
- "Cloud Computing" → "The Aether"
- "AI/Machine Learning" → "The Oracle" or "Machina Intelligentia"
- "The Fed/Central Banks" → "Imperial Treasury"
- "Social Media" → "The Forum"
- "Wall Street" → "The Merchant Quarter"
- "CEO" → "Imperator" or "Consul"
- "IPO" → "Public Offering to the Citizens"
- "Earnings Report" → "The Tribute"
- "Market Crash" → "The Great Devaluation"
- "Startup" → "Fledgling Enterprise"
- "Layoffs" → "The Purge"

RECURRING CHARACTERS (use when the person is mentioned):
- Merchant Elonius (Elon Musk) - erratic, claims divinity
- Senator Bezosicus (Jeff Bezos) - controls all trade routes
- Consul Zuckerbergus (Zuckerberg) - awkward, obsessed with the Metaversus
- Oracle Jensen (Jensen Huang) - keeper of the sacred computing stones
- Chancellor Cook (Tim Cook) - master of the golden fruit empire
- Satya the Wise (Satya Nadella) - patient strategist of the Azure Aether

CATEGORIES (pick the best fit):
- denarii_report: Stock market, crypto, financial numbers
- oracle_dispatches: AI, tech innovation, product launches
- senate_decrees: Government policy, regulation, legal
- merchant_affairs: Business deals, M&A, corporate strategy
- forum_gossip: Viral stories, social media, culture

TASK: Transform these news articles into Roman Chronicle style. For each article return:
{
  "roman_title": "Roman-sounding headline (max 80 chars)",
  "roman_summary": "2-3 sentence satirical summary in Roman voice (max 200 words)",
  "roman_category": "one of the 5 categories above",
  "sentiment": "favorable | ominous | neutral",
  "roman_characters": ["array of character names used, if any"]
}

Return a JSON array of transformed articles. Return ONLY valid JSON, no markdown.`;

// ─── API Fetchers ─────────────────────────────────────────────────────────────

interface RawArticle {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  apiSource: string;
}

async function fetchFinnhub(): Promise<RawArticle[]> {
  if (!FINNHUB_API_KEY) return [];
  try {
    const res = await fetch(`https://finnhub.io/api/v1/news?category=general&token=${FINNHUB_API_KEY}`);
    if (!res.ok) throw new Error(`Finnhub ${res.status}`);
    const data = await res.json();
    return (data || []).slice(0, 10).map((item: any) => ({
      title: item.headline,
      url: item.url,
      source: item.source,
      publishedAt: new Date(item.datetime * 1000).toISOString(),
      apiSource: "finnhub",
    }));
  } catch (err) {
    console.error("Finnhub fetch error:", err);
    return [];
  }
}

async function fetchAlphaVantage(): Promise<RawArticle[]> {
  if (!ALPHA_VANTAGE_API_KEY) return [];
  try {
    const res = await fetch(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&apikey=${ALPHA_VANTAGE_API_KEY}&limit=10`);
    if (!res.ok) throw new Error(`Alpha Vantage ${res.status}`);
    const data = await res.json();
    return (data.feed || []).slice(0, 10).map((item: any) => ({
      title: item.title,
      url: item.url,
      source: item.source,
      publishedAt: item.time_published
        ? new Date(item.time_published.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/, "$1-$2-$3T$4:$5:$6")).toISOString()
        : new Date().toISOString(),
      apiSource: "alpha_vantage",
    }));
  } catch (err) {
    console.error("Alpha Vantage fetch error:", err);
    return [];
  }
}

async function fetchGNews(): Promise<RawArticle[]> {
  if (!GNEWS_API_KEY) return [];
  try {
    const res = await fetch(`https://gnews.io/api/v4/top-headlines?category=business&lang=en&max=10&apikey=${GNEWS_API_KEY}`);
    if (!res.ok) throw new Error(`GNews ${res.status}`);
    const data = await res.json();
    return (data.articles || []).slice(0, 10).map((item: any) => ({
      title: item.title,
      url: item.url,
      source: item.source?.name || "Unknown",
      publishedAt: item.publishedAt || new Date().toISOString(),
      apiSource: "gnews",
    }));
  } catch (err) {
    console.error("GNews fetch error:", err);
    return [];
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function checkCooldown(apiSource: string): Promise<boolean> {
  const cooldownMinutes = COOLDOWNS[apiSource] || 60;
  const { data } = await supabase
    .from("forum_economicus_fetch_log")
    .select("fetched_at")
    .eq("api_source", apiSource)
    .order("fetched_at", { ascending: false })
    .limit(1);

  if (!data || data.length === 0) return true;

  const lastFetch = new Date(data[0].fetched_at);
  const now = new Date();
  const diffMinutes = (now.getTime() - lastFetch.getTime()) / (1000 * 60);
  return diffMinutes >= cooldownMinutes;
}

async function transformWithClaude(articles: RawArticle[]): Promise<any[]> {
  if (!ANTHROPIC_API_KEY || articles.length === 0) return [];

  const articleList = articles.map((a, i) => `${i + 1}. "${a.title}" (Source: ${a.source})`).join("\n");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      system: ROMAN_TRANSFORM_PROMPT,
      messages: [{ role: "user", content: `Transform these ${articles.length} articles:\n\n${articleList}` }],
    }),
  });

  if (!response.ok) {
    console.error("Claude API error:", await response.text());
    return [];
  }

  const data = await response.json();
  const text = data.content[0]?.text || "";
  const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    console.error("Failed to parse Claude response:", cleaned.substring(0, 200));
    return [];
  }
}

// ─── Main Handler ─────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Check which APIs are ready (not in cooldown)
    const [finnhubReady, alphaReady, gnewsReady] = await Promise.all([
      checkCooldown("finnhub"),
      checkCooldown("alpha_vantage"),
      checkCooldown("gnews"),
    ]);

    console.log(`API cooldowns — Finnhub: ${finnhubReady ? "ready" : "cooling"}, Alpha Vantage: ${alphaReady ? "ready" : "cooling"}, GNews: ${gnewsReady ? "ready" : "cooling"}`);

    // Fetch from all ready APIs in parallel
    const fetchers: Promise<RawArticle[]>[] = [];
    if (finnhubReady) fetchers.push(fetchFinnhub());
    if (alphaReady) fetchers.push(fetchAlphaVantage());
    if (gnewsReady) fetchers.push(fetchGNews());

    if (fetchers.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: "All APIs in cooldown. No fetch needed.", articles_new: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results = await Promise.allSettled(fetchers);
    const allArticles: RawArticle[] = [];
    for (const r of results) {
      if (r.status === "fulfilled") allArticles.push(...r.value);
    }

    console.log(`Fetched ${allArticles.length} raw articles`);

    // Deduplicate against existing DB entries
    const hashes = await Promise.all(allArticles.map(a => sha256(a.url)));
    const { data: existing } = await supabase
      .from("forum_economicus_articles")
      .select("url_hash")
      .in("url_hash", hashes);

    const existingHashes = new Set((existing || []).map(e => e.url_hash));
    const newArticles: (RawArticle & { hash: string })[] = [];
    for (let i = 0; i < allArticles.length; i++) {
      if (!existingHashes.has(hashes[i])) {
        newArticles.push({ ...allArticles[i], hash: hashes[i] });
      }
    }

    console.log(`${newArticles.length} new articles after dedup`);

    if (newArticles.length === 0) {
      // Log the fetch even if no new articles
      const sources = [...new Set(allArticles.map(a => a.apiSource))];
      for (const src of sources) {
        await supabase.from("forum_economicus_fetch_log").insert({
          api_source: src,
          articles_fetched: allArticles.filter(a => a.apiSource === src).length,
          articles_new: 0,
        });
      }

      return new Response(
        JSON.stringify({ success: true, message: "No new articles found", articles_new: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Batch transform with Claude (groups of 5)
    let totalInserted = 0;
    for (let i = 0; i < newArticles.length; i += 5) {
      const batch = newArticles.slice(i, i + 5);
      const transformed = await transformWithClaude(batch);

      for (let j = 0; j < Math.min(batch.length, transformed.length); j++) {
        const article = batch[j];
        const roman = transformed[j];

        const { error } = await supabase.from("forum_economicus_articles").insert({
          original_title: article.title,
          original_url: article.url,
          original_source: article.source,
          original_published_at: article.publishedAt,
          api_source: article.apiSource,
          url_hash: article.hash,
          roman_title: roman.roman_title || article.title,
          roman_summary: roman.roman_summary || "",
          roman_category: roman.roman_category || "forum_gossip",
          roman_characters: roman.roman_characters || [],
          sentiment: roman.sentiment || "neutral",
        });

        if (!error) totalInserted++;
        else console.error("Insert error:", error);
      }
    }

    // Log results per source
    const sources = [...new Set(newArticles.map(a => a.apiSource))];
    for (const src of sources) {
      await supabase.from("forum_economicus_fetch_log").insert({
        api_source: src,
        articles_fetched: allArticles.filter(a => a.apiSource === src).length,
        articles_new: newArticles.filter(a => a.apiSource === src).length,
      });
    }

    console.log(`Inserted ${totalInserted} transformed articles`);

    return new Response(
      JSON.stringify({ success: true, articles_new: totalInserted }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in fetch-forum-economicus:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
