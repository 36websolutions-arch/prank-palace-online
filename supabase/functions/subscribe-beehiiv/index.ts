import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const BEEHIIV_API_KEY = Deno.env.get("BEEHIIV_API_KEY");
const BEEHIIV_PUBLICATION_ID = Deno.env.get("BEEHIIV_PUBLICATION_ID");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!BEEHIIV_API_KEY || !BEEHIIV_PUBLICATION_ID) {
      // Not configured yet — silently skip
      return new Response(
        JSON.stringify({ success: true, skipped: true, reason: "Beehiiv not configured" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { email } = await req.json();
    if (!email) {
      throw new Error("Email is required");
    }

    const response = await fetch(
      `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUBLICATION_ID}/subscriptions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BEEHIIV_API_KEY}`,
        },
        body: JSON.stringify({
          email,
          reactivate_existing: true,
          send_welcome_email: true,
          utm_source: "website",
          utm_medium: "signup",
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Beehiiv API error:", errText);
      throw new Error(`Beehiiv API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Subscribed ${email} to Beehiiv`);

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Beehiiv subscription error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
