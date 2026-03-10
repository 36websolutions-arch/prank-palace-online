import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const SITE_URL = "https://corporatepranks.com";

const STATIC_ROUTES = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/chronicles", priority: "0.9", changefreq: "weekly" },
  { path: "/forum-economicus", priority: "0.9", changefreq: "daily" },
  { path: "/armory", priority: "0.8", changefreq: "monthly" },
  { path: "/you-smell-like-shit", priority: "0.8", changefreq: "monthly" },
  { path: "/your-breath-stinks", priority: "0.8", changefreq: "monthly" },
  { path: "/the-dickhead", priority: "0.8", changefreq: "monthly" },
  { path: "/digital-products", priority: "0.7", changefreq: "monthly" },
  { path: "/physical-products", priority: "0.7", changefreq: "monthly" },
  { path: "/subscription-products", priority: "0.7", changefreq: "monthly" },
  { path: "/chronicle/the-performance-review", priority: "0.6", changefreq: "yearly" },
  { path: "/chronicle/the-all-hands-meeting", priority: "0.6", changefreq: "yearly" },
  { path: "/chronicle/the-return-to-office", priority: "0.6", changefreq: "yearly" },
  { path: "/chronicle/the-department-of-imperial-efficiency", priority: "0.6", changefreq: "yearly" },
  { path: "/chronicle/the-war-of-the-oracles", priority: "0.6", changefreq: "yearly" },
  { path: "/chronicle/the-scrolls-of-the-island", priority: "0.6", changefreq: "yearly" },
  { path: "/chronicle/the-festivitas-of-oil", priority: "0.6", changefreq: "yearly" },
  { path: "/chronicle/the-festival-of-the-superb-owl", priority: "0.6", changefreq: "yearly" },
  { path: "/support", priority: "0.4", changefreq: "yearly" },
  { path: "/terms", priority: "0.3", changefreq: "yearly" },
  { path: "/privacy", priority: "0.3", changefreq: "yearly" },
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const today = new Date().toISOString().split("T")[0];

    let blogUrls = "";
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data: blogs } = await supabase
        .from("blogs")
        .select("id, published_at, updated_at")
        .eq("is_published", true)
        .order("published_at", { ascending: false });

      if (blogs) {
        blogUrls = blogs
          .map(
            (blog) => `
  <url>
    <loc>${SITE_URL}/blog/${blog.id}</loc>
    <lastmod>${(blog.updated_at || blog.published_at || today).split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
          )
          .join("");
      }
    }

    const staticUrls = STATIC_ROUTES.map(
      (route) => `
  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
    ).join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${blogUrls}
</urlset>`;

    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=600");
    return res.status(200).send(xml);
  } catch (error) {
    console.error("Sitemap generation error:", error);
    res.setHeader("Content-Type", "application/xml");
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <priority>1.0</priority>
  </url>
</urlset>`;
    return res.status(200).send(fallbackXml);
  }
}
