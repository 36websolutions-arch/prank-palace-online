import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const UNSUB_SECRET = Deno.env.get("UNSUB_SECRET") || "cp-unsub-2026-default-key";
const PROMO_CODE = Deno.env.get("PROMO_CODE") || "PRANKSTER50";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/** Generate HMAC token for unsubscribe link */
async function generateToken(email: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(UNSUB_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(email.toLowerCase()));
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/[+/=]/g, (c) =>
    c === "+" ? "-" : c === "/" ? "_" : ""
  );
}

/** Verify HMAC token matches email */
async function verifyToken(token: string, email: string): Promise<boolean> {
  const expected = await generateToken(email);
  return token === expected;
}

function buildWelcomeEmail(email: string, unsubToken: string): string {
  const unsubUrl = `https://corporatepranks.com/unsubscribe?token=${unsubToken}`;
  return `
<div style="max-width:600px;margin:0 auto;font-family:Georgia,serif;color:#1c1917;background:#fafaf9;padding:40px 24px">
  <div style="text-align:center;margin-bottom:32px">
    <h1 style="font-size:28px;margin:0 0 4px;color:#1c1917">Welcome to the Senate, Citizen.</h1>
    <p style="color:#78716c;font-size:14px;margin:0">You've officially joined the resistance.</p>
  </div>
  <div style="background:#1c1917;color:#fafaf9;border-radius:12px;padding:32px;text-align:center;margin-bottom:24px">
    <p style="color:#d97706;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px">Your Exclusive Code</p>
    <p style="font-family:monospace;font-size:36px;font-weight:bold;color:#f59e0b;letter-spacing:4px;margin:0 0 8px">${PROMO_CODE}</p>
    <p style="color:#a8a29e;font-size:14px;margin:0">50% off your next 5 orders &middot; excludes shipping</p>
  </div>
  <div style="text-align:center;margin-bottom:32px">
    <a href="https://corporatepranks.com/you-smell-like-shit" style="display:inline-block;background:#d97706;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:bold;font-size:16px">Shop Now</a>
  </div>
  <div style="border-top:1px solid #e7e5e4;padding-top:24px;margin-bottom:24px">
    <h2 style="font-size:18px;margin:0 0 12px;color:#1c1917">What You're Getting Into</h2>
    <p style="color:#57534e;font-size:15px;line-height:1.6;margin:0">Corporate Pranks is satire since Rome. We make prank gifts that actually smell good, write dispatches from the Corporate Empire, and remind everyone that history doesn't repeat itself, but corporate America sure does.</p>
    <p style="color:#57534e;font-size:15px;line-height:1.6;margin:16px 0 0">As a Prank Letter subscriber, you'll get exclusive drops, early access to new products, and content that would make Juvenal proud.</p>
  </div>
  <div style="text-align:center;padding:16px 0;border-top:1px solid #e7e5e4">
    <p style="color:#a8a29e;font-size:12px;margin:0">&copy; 2026 CorporatePranks. Satire Since Rome</p>
    <p style="color:#a8a29e;font-size:12px;margin:4px 0 0"><a href="https://corporatepranks.com" style="color:#d97706;text-decoration:none">corporatepranks.com</a></p>
    <p style="color:#a8a29e;font-size:11px;margin:8px 0 0"><a href="${unsubUrl}" style="color:#a8a29e;text-decoration:underline">Unsubscribe</a></p>
  </div>
</div>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    // Unsubscribe action — verify token and deactivate
    if (body.action === "unsubscribe") {
      const { token } = body;
      if (!token) throw new Error("Token is required");

      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

      // Find all active subscribers and check token against each
      const { data: subs } = await supabase
        .from("newsletter_subscribers")
        .select("id, email")
        .eq("is_active", true);

      let matchedEmail = "";
      for (const sub of subs || []) {
        if (await verifyToken(token, sub.email)) {
          matchedEmail = sub.email;
          break;
        }
      }

      if (!matchedEmail) {
        throw new Error("Invalid or expired unsubscribe link");
      }

      const { error } = await supabase
        .from("newsletter_subscribers")
        .update({ is_active: false, unsubscribed_at: new Date().toISOString() })
        .eq("email", matchedEmail);

      if (error) throw error;

      console.log(`Unsubscribed: ${matchedEmail}`);
      return new Response(
        JSON.stringify({ success: true, email: matchedEmail }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Subscribe action — send welcome email
    const { email } = body;
    if (!email) throw new Error("Email is required");

    // Verify email actually exists in our subscriber table (prevents open relay abuse)
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: subscriber } = await supabase
      .from("newsletter_subscribers")
      .select("id")
      .eq("email", email.toLowerCase().trim())
      .eq("is_active", true)
      .limit(1)
      .single();

    if (!subscriber) {
      throw new Error("Email not found in subscriber list");
    }

    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ success: true, skipped: true, reason: "Resend not configured" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const unsubToken = await generateToken(email);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Sam from Corporate Pranks <sam@corporatepranks.com>",
        to: [email],
        subject: "Welcome to the Senate, Citizen -- here's 50% off",
        html: buildWelcomeEmail(email, unsubToken),
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Resend API error:", errText);
      throw new Error(`Resend API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Welcome email sent to ${email} via Resend (id: ${data.id})`);

    return new Response(
      JSON.stringify({ success: true, emailId: data.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Email function error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
