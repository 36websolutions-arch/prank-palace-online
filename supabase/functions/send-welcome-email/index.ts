import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  nickname: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, nickname }: WelcomeEmailRequest = await req.json();

    console.log(`Sending welcome email to ${email} for user ${nickname}`);

    const emailResponse = await resend.emails.send({
      from: "Corporate Pranks <hello@corporateprank.com>",
      to: [email],
      subject: "Welcome to Corporate Pranks! 🎭",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #6d28d9;">Hi ${nickname},</h1>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Thanks for your interest in our platform — we're glad you're here.
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            You'll be receiving light-hearted, funny content along with occasional updates on creative workplace engagement ideas and corporate pranks.
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333; margin-top: 30px;">
            Best,<br><br>
            <strong>Corporate Pranks</strong>
          </p>
        </div>
      `,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
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
