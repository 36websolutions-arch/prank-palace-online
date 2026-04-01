import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function buildWelcomeEmail(email: string): string {
  const unsubUrl = `https://corporatepranks.com/unsubscribe?email=${encodeURIComponent(email)}`;
  return `
<div style="max-width:600px;margin:0 auto;font-family:Georgia,serif;color:#1c1917;background:#fafaf9;padding:40px 24px">
  <div style="text-align:center;margin-bottom:32px">
    <h1 style="font-size:28px;margin:0 0 4px;color:#1c1917">Welcome to the Senate, Citizen.</h1>
    <p style="color:#78716c;font-size:14px;margin:0">You've officially joined the resistance.</p>
  </div>
  <div style="background:#1c1917;color:#fafaf9;border-radius:12px;padding:32px;text-align:center;margin-bottom:24px">
    <p style="color:#d97706;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px">Your Exclusive Code</p>
    <p style="font-family:monospace;font-size:36px;font-weight:bold;color:#f59e0b;letter-spacing:4px;margin:0 0 8px">PRANKSTER50</p>
    <p style="color:#a8a29e;font-size:14px;margin:0">50% off your next 5 orders &middot; excludes shipping</p>
  </div>
  <div style="text-align:center;margin-bottom:32px">
    <a href="https://corporatepranks.com/you-smell-like-shit" style="display:inline-block;background:#d97706;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:bold;font-size:16px">Shop Now — Use Your Code</a>
  </div>
  <div style="border-top:1px solid #e7e5e4;padding-top:24px;margin-bottom:24px">
    <h2 style="font-size:18px;margin:0 0 12px;color:#1c1917">What You're Getting Into</h2>
    <p style="color:#57534e;font-size:15px;line-height:1.6;margin:0">Corporate Pranks is satire since Rome. We make prank gifts that actually smell good, write dispatches from the Corporate Empire, and remind everyone that history doesn't repeat itself — but corporate America sure does.</p>
    <p style="color:#57534e;font-size:15px;line-height:1.6;margin:16px 0 0">As a Prank Letter subscriber, you'll get exclusive drops, early access to new products, and content that would make Juvenal proud.</p>
  </div>
  <div style="text-align:center;padding:16px 0;border-top:1px solid #e7e5e4">
    <p style="color:#a8a29e;font-size:12px;margin:0">&copy; 2026 CorporatePranks &middot; Satire Since Rome</p>
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
    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ success: true, skipped: true, reason: "Resend not configured" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { email } = await req.json();
    if (!email) {
      throw new Error("Email is required");
    }

    // Send welcome email via Resend
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Sam from Corporate Pranks <sam@corporatepranks.com>",
        to: [email],
        subject: "Welcome to the Senate, Citizen — here's 50% off",
        html: buildWelcomeEmail(email),
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
    console.error("Welcome email error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
