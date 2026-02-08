import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ─── Email Templates ──────────────────────────────────────────────────────────

interface TemplateData {
  title: string;
  url: string;
  snippet?: string;
}

function getTemplate(data: TemplateData) {
  const templates = [hearYe, whispers, senateDispatch, scribeWarning];
  const pick = templates[Math.floor(Math.random() * templates.length)];
  return pick(data);
}

const BRAND_HEADER = `
<div style="background: linear-gradient(135deg, #292524 0%, #1c1917 100%); padding: 24px; text-align: center; border-bottom: 3px solid #d97706;">
  <h1 style="margin: 0; font-family: Georgia, serif; color: #fbbf24; font-size: 24px; letter-spacing: 2px;">THE CORPORATE CHRONICLE</h1>
  <p style="margin: 4px 0 0; color: #a8a29e; font-size: 12px; letter-spacing: 4px; text-transform: uppercase;">corporatepranks.com</p>
</div>`;

const FOOTER = (unsubscribeUrl: string) => `
<div style="background: #1c1917; padding: 20px; text-align: center; border-top: 1px solid #44403c;">
  <p style="color: #78716c; font-size: 12px; margin: 0;">
    You're receiving this because you subscribed at corporatepranks.com
  </p>
  <p style="margin: 8px 0 0;">
    <a href="${unsubscribeUrl}" style="color: #d97706; font-size: 12px; text-decoration: underline;">Unsubscribe from the Senate Archives</a>
  </p>
</div>`;

const CTA_BUTTON = (url: string, text: string) => `
<div style="text-align: center; margin: 24px 0;">
  <a href="${url}" style="display: inline-block; background: linear-gradient(135deg, #d97706 0%, #ea580c 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; letter-spacing: 0.5px;">${text}</a>
</div>`;

function hearYe({ title, url }: TemplateData) {
  return {
    subject: `A New Chronicle Has Been Inscribed: ${title}`,
    html: `
<div style="max-width: 600px; margin: 0 auto; font-family: Georgia, serif; background: #292524; color: #e7e5e4;">
  ${BRAND_HEADER}
  <div style="padding: 32px 24px;">
    <p style="text-align: center; color: #d97706; font-size: 14px; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 8px;">📜 HEAR YE, HEAR YE 📜</p>
    <h2 style="text-align: center; font-size: 22px; color: #fbbf24; margin: 12px 0 20px; line-height: 1.3;">${title}</h2>
    <p style="color: #a8a29e; text-align: center; font-style: italic; line-height: 1.6;">
      A new scroll has been added to the Senate Archives. The scribes have toiled through the night to bring you this dispatch.
    </p>
    ${CTA_BUTTON(url, "Read the Full Chronicle →")}
  </div>
  {{FOOTER}}
</div>`,
  };
}

function whispers({ title, url, snippet }: TemplateData) {
  const teaser = snippet
    ? snippet.substring(0, 150) + "..."
    : "The scribes whisper of great upheaval in the Empire. Details remain scarce, but what we've intercepted is most alarming...";
  return {
    subject: "Psst... the scribes have been busy",
    html: `
<div style="max-width: 600px; margin: 0 auto; font-family: Georgia, serif; background: #292524; color: #e7e5e4;">
  ${BRAND_HEADER}
  <div style="padding: 32px 24px;">
    <p style="color: #78716c; font-size: 13px; font-style: italic;">*whispers from behind a marble column*</p>
    <h2 style="font-size: 20px; color: #fbbf24; margin: 16px 0; line-height: 1.3;">${title}</h2>
    <p style="color: #d6d3d1; line-height: 1.8; font-style: italic;">
      "${teaser}"
    </p>
    <p style="color: #78716c; font-size: 14px; margin-top: 12px;">— The rest of the scroll has been sealed by order of the Senate.</p>
    ${CTA_BUTTON(url, "Continue Reading...")}
  </div>
  {{FOOTER}}
</div>`,
  };
}

function senateDispatch({ title, url }: TemplateData) {
  return {
    subject: `OFFICIAL: New Senate Record Filed — ${title}`,
    html: `
<div style="max-width: 600px; margin: 0 auto; font-family: Georgia, serif; background: #292524; color: #e7e5e4;">
  ${BRAND_HEADER}
  <div style="padding: 32px 24px;">
    <div style="border: 2px solid #d97706; padding: 20px; margin-bottom: 24px;">
      <p style="color: #d97706; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 8px;">OFFICIAL SENATE DISPATCH</p>
      <p style="color: #78716c; font-size: 12px; margin: 0;">Filed: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
    </div>
    <h2 style="font-size: 20px; color: #fbbf24; margin: 0 0 16px; line-height: 1.3;">RE: ${title}</h2>
    <p style="color: #a8a29e; line-height: 1.6;">
      This notice serves to inform all citizens that a new record has been entered into the Senate Archives. The document is now available for citizen review at the designated reading chamber.
    </p>
    <p style="color: #78716c; font-size: 13px; font-style: italic; margin-top: 16px;">
      — Office of the Senate Clerk
    </p>
    ${CTA_BUTTON(url, "Access the Record →")}
  </div>
  {{FOOTER}}
</div>`,
  };
}

function scribeWarning({ title, url, snippet }: TemplateData) {
  const teaser = snippet
    ? snippet.substring(0, 120) + "—"
    : "What we uncovered in the archives defies belief. The Senate has ordered all copies destroyed, but we managed to save one—";
  return {
    subject: "You weren't supposed to see this...",
    html: `
<div style="max-width: 600px; margin: 0 auto; font-family: Georgia, serif; background: #292524; color: #e7e5e4;">
  ${BRAND_HEADER}
  <div style="padding: 32px 24px;">
    <p style="color: #ef4444; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 16px;">⚠️ INTERCEPTED DOCUMENT</p>
    <h2 style="font-size: 20px; color: #fbbf24; margin: 0 0 16px; line-height: 1.3;">${title}</h2>
    <p style="color: #d6d3d1; line-height: 1.8;">
      ${teaser}
    </p>
    <p style="color: #ef4444; font-size: 13px; margin-top: 16px;">
      [DOCUMENT ENDS ABRUPTLY — REMAINDER CLASSIFIED BY ORDER OF THE PRAETORIAN GUARD]
    </p>
    ${CTA_BUTTON(url, "See the Full Scroll Before It's Sealed")}
  </div>
  {{FOOTER}}
</div>`,
  };
}

// ─── Handler ──────────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { title, url, snippet, type } = await req.json();

    if (!title || !url) {
      throw new Error("title and url are required");
    }

    console.log(`Sending chronicle email for: ${title}`);

    // Get all active subscribers
    const { data: subscribers, error: subError } = await supabase
      .from("newsletter_subscribers")
      .select("email")
      .eq("is_active", true);

    if (subError) throw subError;
    if (!subscribers || subscribers.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: "No active subscribers", sent: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Sending to ${subscribers.length} subscribers`);

    // Send in batches of 50
    let totalSent = 0;
    for (let i = 0; i < subscribers.length; i += 50) {
      const batch = subscribers.slice(i, i + 50);

      for (const sub of batch) {
        const unsubscribeUrl = `${SUPABASE_URL}/functions/v1/unsubscribe?email=${encodeURIComponent(sub.email)}`;
        const template = getTemplate({ title, url, snippet });
        const finalHtml = template.html.replace("{{FOOTER}}", FOOTER(unsubscribeUrl));

        try {
          await resend.emails.send({
            from: "The Corporate Chronicle <hello@corporatepranks.com>",
            to: [sub.email],
            subject: template.subject,
            html: finalHtml,
          });
          totalSent++;
        } catch (emailErr) {
          console.error(`Failed to send to ${sub.email}:`, emailErr);
        }
      }
    }

    console.log(`Successfully sent ${totalSent}/${subscribers.length} emails`);

    return new Response(
      JSON.stringify({ success: true, sent: totalSent, total: subscribers.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in send-chronicle-email:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
