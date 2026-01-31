import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Ko-fi webhook verification token (set in Ko-fi settings and as Supabase secret)
const KOFI_VERIFICATION_TOKEN = Deno.env.get("KOFI_VERIFICATION_TOKEN");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface KofiWebhookData {
  verification_token: string;
  message_id: string;
  timestamp: string;
  type: "Donation" | "Subscription" | "Commission" | "Shop Order";
  is_public: boolean;
  from_name: string;
  message: string | null;
  amount: string;
  url: string;
  email: string;
  currency: string;
  is_subscription_payment: boolean;
  is_first_subscription_payment: boolean;
  kofi_transaction_id: string;
  shop_items: Array<{ direct_link_code: string }> | null;
  tier_name: string | null;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Ko-fi only sends POST requests
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    // Ko-fi sends data as application/x-www-form-urlencoded
    const formData = await req.formData();
    const dataString = formData.get("data");

    if (!dataString || typeof dataString !== "string") {
      console.error("No data field in request");
      return new Response("Bad request: missing data", { status: 400 });
    }

    const data: KofiWebhookData = JSON.parse(dataString);
    console.log("Received Ko-fi webhook:", data.type, "from:", data.from_name);

    // Verify the webhook (optional but recommended)
    if (KOFI_VERIFICATION_TOKEN && data.verification_token !== KOFI_VERIFICATION_TOKEN) {
      console.error("Invalid verification token");
      return new Response("Unauthorized", { status: 401 });
    }

    // Create Supabase client with service role (bypasses RLS)
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Try to find the user by email
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, email")
      .eq("email", data.email.toLowerCase())
      .limit(1);

    const userId = profiles && profiles.length > 0 ? profiles[0].id : null;

    // Insert the donation record
    const { error: insertError } = await supabase.from("kofi_donations").insert({
      kofi_transaction_id: data.kofi_transaction_id || data.message_id,
      email: data.email.toLowerCase(),
      from_name: data.from_name,
      amount: parseFloat(data.amount),
      currency: data.currency,
      type: data.type,
      tier_name: data.tier_name,
      is_subscription_payment: data.is_subscription_payment,
      is_first_subscription_payment: data.is_first_subscription_payment,
      is_public: data.is_public,
      message: data.message,
      user_id: userId,
    });

    if (insertError) {
      // Check if it's a duplicate (already processed)
      if (insertError.code === "23505") {
        console.log("Duplicate transaction, already processed:", data.kofi_transaction_id);
        return new Response("OK", { status: 200 });
      }
      console.error("Error inserting donation:", insertError);
      return new Response("Database error", { status: 500 });
    }

    console.log("Donation recorded successfully:", data.kofi_transaction_id);

    // If we found a user, manually trigger tier update
    // (The trigger should handle this, but let's also do it explicitly)
    if (userId) {
      // Calculate total donations for this user
      const { data: donations } = await supabase
        .from("kofi_donations")
        .select("amount")
        .or(`user_id.eq.${userId},email.eq.${data.email.toLowerCase()}`);

      const totalDonated = donations?.reduce((sum, d) => sum + parseFloat(d.amount), 0) || 0;

      // Determine tier
      let newTier = "citizen";
      if (totalDonated >= 100) {
        newTier = "emperor";
      } else if (totalDonated >= 25) {
        newTier = "consul";
      } else if (totalDonated >= 5) {
        newTier = "senator";
      }

      // Update user's tier
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          total_donated: totalDonated,
          citizen_tier: newTier,
        })
        .eq("id", userId);

      if (updateError) {
        console.error("Error updating user tier:", updateError);
      } else {
        console.log(`Updated user ${userId} to tier: ${newTier} (total: $${totalDonated})`);
      }
    } else {
      console.log("No registered user found for email:", data.email);
      // The donation is still recorded - if they sign up later with this email,
      // you could run a migration to link their donations
    }

    // Ko-fi expects a 200 response
    return new Response("OK", { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Ko-fi webhook error:", errorMessage);
    return new Response(`Error: ${errorMessage}`, { status: 500 });
  }
});
