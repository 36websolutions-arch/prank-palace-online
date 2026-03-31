/**
 * Welcome Email via Resend (Supabase Edge Function)
 *
 * Sends the branded welcome email with PRANKSTER50 promo code
 * whenever a new subscriber signs up. Uses Resend API server-side.
 *
 * The function name is still "subscribe-beehiiv" for backwards compat
 * but the edge function now uses Resend instead.
 */

import { supabase } from "@/integrations/supabase/client";

/**
 * Send welcome email to new subscriber via Resend.
 * Fails silently — Supabase is the source of truth, email is a bonus.
 */
export async function subscribeToBeehiiv(email: string): Promise<void> {
  try {
    const { error } = await supabase.functions.invoke("subscribe-beehiiv", {
      body: { email },
    });
    if (error) {
      console.error("Welcome email failed:", error.message);
    }
  } catch (err) {
    console.error("Welcome email error:", err);
  }
}
