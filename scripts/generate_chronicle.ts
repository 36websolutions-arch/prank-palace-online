import Parser from 'rss-parser';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
// Also try loading from .env.local if available
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const RSS_URL = 'https://techcrunch.com/feed/';

// Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!SUPABASE_URL) {
    console.error("❌ Missing Supabase URL. Please set VITE_SUPABASE_URL.");
    process.exit(1);
}

if (!ANTHROPIC_API_KEY) {
    console.error("❌ Missing Anthropic API Key. Please set ANTHROPIC_API_KEY in your .env file.");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY || "");
const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
const parser = new Parser();

async function fetchTrendingTopic() {
    try {
        const feed = await parser.parseURL(RSS_URL);
        if (!feed.items || feed.items.length === 0) throw new Error("No items in feed");

        const topItems = feed.items.slice(0, 5);
        const randomItem = topItems[Math.floor(Math.random() * topItems.length)];

        console.log(`🗞️ Selected Topic: ${randomItem.title}`);
        return randomItem;
    } catch (error) {
        console.error("Error fetching RSS feed:", error);
        return null;
    }
}

async function getRecentContext() {
    if (!SUPABASE_KEY) return ""; // Cannot fetch without key if RLS blocks it, but let's try anon

    const { data: blogs, error } = await supabase
        .from('blogs')
        .select('title, content')
        .order('published_at', { ascending: false })
        .limit(3);

    if (error) {
        console.error("Error fetching recent chronicles:", error);
        return "";
    }

    return blogs.map(b => `Title: ${b.title}\nExcerpt: ${b.content.substring(0, 200)}...`).join("\n---\n");
}

async function generateChronicle(topic: string, context: string) {
    console.log("🤖 Generating chronicle with Claude...");

    const systemPrompt = `
  You are 'The Corporate Chronicle', a satirical publication that covers modern events—corporate, political, and cultural—as if they were dispatches from the Roman Empire.

  TONE & STYLE:
  - Sharp, understated, slightly nihilistic. Dry wit, not slapstick.
  - Avoid obvious jokes. The humor comes from the deadpan absurdity of treating mundane modern horrors with historical gravitas.
  - Meetings are military campaigns. Performance reviews are public executions. Layoffs are purges. CEOs are Emperors. Politicians are Senators scheming for power.
  - World leaders and tech billionaires should be given Roman-esque names (e.g., Elonius Muskus, Consul Zuckerbergus, Emperor Trumpicus, Senator Bidus the Elder).
  - End each chronicle with a quiet but devastating realization—something that lingers.

  VOCABULARY:
  - "The Cloud" → "The Aether"
  - "AI" → "The Oracle" or "Machina Intelligentia"
  - "Stocks/Crypto" → "Denarii"
  - "Social Media" → "The Forum"
  - "HR" → "The Praetorian Guard"
  - "Quarterly Earnings" → "The Tribute"

  RECURRING CHARACTERS (use when relevant):
  - Merchant Elonius (Elon Musk) - erratic, claims divinity
  - Consul Zuckerbergus (Zuckerberg) - awkward, obsessed with the Metaversus
  - Marcus - the everyman worker, exhausted, hoping for a pension that will never come
  - Senator Bezosicus - controls all trade routes

  TASK:
  Write a ~300 word satirical chronicle based on the provided news topic.
  Output MUST be valid JSON:
  {
    "title": "Roman-sounding title",
    "content": "The full story text...",
    "image_prompt": "A description for an image generator to create a header image in classical Roman art style depicting the scene"
  }
  Return ONLY the JSON object, no preamble.
  `;

    const userPrompt = `
  Trending Topic: "${topic}"
  
  Recent Chronicles (for continuity context):
  ${context}
  
  Write a new chronicle about this topic.
  `;

    const message = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [
            { role: "user", content: userPrompt }
        ]
    });

    // Claude text block handling
    const contentCheck = message.content[0];
    if (contentCheck.type !== 'text') throw new Error("Unexpected response type from Claude");

    let contentString = contentCheck.text;

    // Cleanup potential markdown formatting if Claude adds it
    contentString = contentString.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
        return JSON.parse(contentString);
    } catch (e) {
        console.error("Failed to parse JSON from Claude:", contentString);
        throw e;
    }
}

async function main() {
    // 1. Get Topic
    console.log("Searching for tablets of news...");
    const newsItem = await fetchTrendingTopic();
    if (!newsItem) return;

    // 2. Get Context
    const context = await getRecentContext();

    // 3. Generate
    try {
        const chronicle = await generateChronicle(newsItem.title || "Unknown News", context);
        console.log("✅ Chronicle Generated:", chronicle.title);

        // 4. Save to DB - Use a proper UUID
        const id = crypto.randomUUID();

        const newRecord = {
            id: id,
            title: chronicle.title,
            content: chronicle.content,
            published_at: new Date().toISOString(),
            image: null,
            is_published: true,
        };

        if (!SUPABASE_KEY) {
            console.log("⚠️  SUPABASE_SERVICE_ROLE_KEY missing. Skipping DB save.");
            console.log("--- GENERATED CONTENT ---");
            console.log(JSON.stringify(newRecord, null, 2));
            return;
        }

        const { error } = await supabase
            .from('blogs')
            .upsert(newRecord);

        if (error) {
            console.error("❌ Error saving to Supabase:", error);
        } else {
            console.log(`🎉 Successfully saved chronicle: ${id}`);
        }

    } catch (error) {
        console.error("❌ Generation failed:", error);
    }
}

main();
