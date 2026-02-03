import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are 'The Corporate Chronicle', a satirical publication that covers modern events—corporate, political, and cultural—as if they were dispatches from the Roman Empire.

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
Write a ~400 word satirical chronicle based on the provided topic.
Output MUST be valid JSON:
{
  "title": "Roman-sounding title",
  "content": "The full story text...",
  "image_prompt": "A detailed description for an AI image generator to create a header image in classical Roman art style (oil painting, marble sculpture, or mosaic style) depicting the scene described in the chronicle. Be specific about composition, lighting, and Roman aesthetic elements."
}
Return ONLY the JSON object, no preamble or markdown.`;

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY not configured in Supabase secrets");
    }

    const { topic, additionalContext } = await req.json();

    if (!topic) {
      throw new Error("Topic is required");
    }

    const userPrompt = `
Topic: "${topic}"
${additionalContext ? `\nAdditional Context/Angle: ${additionalContext}` : ""}

Write a new chronicle about this topic. Make it sharp and memorable.
`;

    console.log(`Generating chronicle for topic: ${topic}`);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic API error:", errorText);
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const textContent = data.content[0]?.text;

    if (!textContent) {
      throw new Error("No content in Claude response");
    }

    // Parse the JSON from Claude's response
    const cleanedContent = textContent.replace(/```json/g, "").replace(/```/g, "").trim();

    let chronicle;
    try {
      chronicle = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("Failed to parse Claude response:", cleanedContent);
      throw new Error("Failed to parse AI response as JSON");
    }

    console.log(`Chronicle generated: ${chronicle.title}`);

    return new Response(
      JSON.stringify({
        success: true,
        chronicle,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error generating chronicle:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
