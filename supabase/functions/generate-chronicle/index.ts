import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Topic rotation list for chronicles
const TOPICS = [
  {
    title: "The Team Building Exercise",
    description: "Trust falls, escape rooms, and mandatory bonding",
    topic: "team building exercises",
  },
  {
    title: "The Open Office",
    description: "No walls, no privacy, no escape",
    topic: "the open office plan",
  },
  {
    title: "The Unlimited PTO Policy",
    description: "All the time off you want, if you never take it",
    topic: "unlimited PTO policies",
  },
  {
    title: "The Return to Office",
    description: "The commute is back, but why?",
    topic: "return to office mandates",
  },
  {
    title: "The Annual Review",
    description: "When arbitrary numbers determine your worth",
    topic: "annual performance reviews",
  },
  {
    title: "The Pizza Party",
    description: "Celebration during crisis",
    topic: "pizza parties as compensation",
  },
  {
    title: "The Reorg",
    description: "Same problems, new org chart",
    topic: "corporate reorganizations",
  },
  {
    title: "The Exit Interview",
    description: "The final performance before freedom",
    topic: "exit interviews",
  },
  {
    title: "The Mandatory Training",
    description: "Click next to continue existing",
    topic: "mandatory compliance training",
  },
  {
    title: "The Town Hall Q&A",
    description: "Questions pre-approved for your protection",
    topic: "town hall Q&A sessions",
  },
];

const SYSTEM_PROMPT = `You are a satirical writer for The Corporate Chronicle. You write darkly humorous stories that parallel the Roman Empire with modern corporate culture.

Your writing style:
- Sharp but empathetic satire (not mean-spirited)
- Dialogue-heavy narrative
- Characters have Roman names but speak in corporate doublespeak
- Always include a "THE PARALLEL" section that connects to modern office life
- End with "The Corporate Chronicle / Satire Since Rome"

Character mappings:
- Gladiators = Employees
- Senate/Senators = Executives/Leadership
- Arena = Office/Workplace
- Emperor = CEO
- Centurions = Middle Management
- Forum = All-Hands Meeting
- Scrolls = Emails/Slack
- Denarii = Salary
- Lions = Layoffs/PIPs

Structure your story as:
1. Opening scene in Roman setting
2. Conflict/incident revealing corporate absurdity
3. Dialogue with corporate speak in Roman terms
4. Section break (---)
5. Escalation
6. "THE PARALLEL" header followed by modern workplace version
7. Reflection on participation and choice
8. End with "The Corporate Chronicle / Satire Since Rome"

Length: 1500-2000 words`;

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify cron secret to prevent unauthorized calls
    const cronSecret = Deno.env.get("CRON_SECRET");
    const authHeader = req.headers.get("Authorization");

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.error("Unauthorized request - invalid or missing cron secret");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const xaiKey = Deno.env.get("XAI_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!xaiKey) {
      throw new Error("XAI_API_KEY not configured");
    }
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase credentials not configured");
    }

    // Initialize Supabase client with service role
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get count of existing chronicles to rotate topics
    const { count } = await supabase
      .from("blogs")
      .select("*", { count: "exact", head: true });

    const topicIndex = (count || 0) % TOPICS.length;
    const selectedTopic = TOPICS[topicIndex];

    console.log(`Generating chronicle #${(count || 0) + 1}: ${selectedTopic.title}`);

    // Call Grok API (xAI - OpenAI-compatible format)
    const grokResponse = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${xaiKey}`,
      },
      body: JSON.stringify({
        model: "grok-beta",
        max_tokens: 4096,
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: `Write a Corporate Chronicle about "${selectedTopic.topic}".

Title: "${selectedTopic.title}"
Subtitle: "A Chronicle from the Corporate Empire"

The story should satirize ${selectedTopic.description.toLowerCase()} by showing how it would look in ancient Rome.

Remember to:
- Create a vivid protagonist with a Roman name
- Include plenty of dialogue
- Have a clear "THE PARALLEL" section
- End with the Chronicle sign-off

Write the complete story now.`,
          },
        ],
      }),
    });

    if (!grokResponse.ok) {
      const errorData = await grokResponse.text();
      console.error("Grok API error:", errorData);
      throw new Error(`Grok API error: ${grokResponse.status}`);
    }

    const grokData = await grokResponse.json();
    const generatedContent = grokData.choices[0].message.content;

    console.log("Chronicle generated, saving to database...");

    // Get admin user for author_id (first admin user)
    const { data: adminUser } = await supabase
      .from("profiles")
      .select("id")
      .eq("is_admin", true)
      .limit(1)
      .single();

    // Insert as draft into blogs table
    const { data: blog, error: insertError } = await supabase
      .from("blogs")
      .insert({
        title: selectedTopic.title,
        content: generatedContent,
        is_published: false, // Save as draft for human review
        author_id: adminUser?.id || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Database insert error:", insertError);
      throw new Error(`Database error: ${insertError.message}`);
    }

    console.log("Chronicle saved as draft:", blog.id);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Chronicle generated and saved as draft",
        blog_id: blog.id,
        title: selectedTopic.title,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error generating chronicle:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
