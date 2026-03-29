/**
 * Beehiiv Newsletter Integration (via Supabase Edge Function)
 *
 * To activate:
 * 1. Max creates a Beehiiv account at beehiiv.com
 * 2. Get the API key from Settings > Integrations > API
 * 3. Get the Publication ID from Settings > Publication
 * 4. Set as Supabase secrets:
 *    supabase secrets set BEEHIIV_API_KEY=<key> BEEHIIV_PUBLICATION_ID=<id> --project-ref kywwyzoxegmehfdzqokx
 * 5. Deploy the subscribe-beehiiv edge function
 *
 * IMPORTANT: API key must stay server-side (edge function), NOT in VITE_ env vars.
 * VITE_ vars are bundled into the client JS and visible to anyone in DevTools.
 */

import { supabase } from "@/integrations/supabase/client";

/**
 * Subscribe an email to the Beehiiv publication via edge function.
 * Fails silently — Supabase is the source of truth, Beehiiv is a relay.
 */
export async function subscribeToBeehiiv(email: string): Promise<void> {
  try {
    const { error } = await supabase.functions.invoke("subscribe-beehiiv", {
      body: { email },
    });
    if (error) {
      console.error("Beehiiv subscription failed:", error.message);
    }
  } catch (err) {
    console.error("Beehiiv error:", err);
  }
}
