import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

async function verifySignature(payload: string, sigHeader: string, secret: string): Promise<boolean> {
  const parts = sigHeader.split(",").reduce((acc: Record<string, string>, part: string) => {
    const [key, value] = part.split("=");
    acc[key] = value;
    return acc;
  }, {});

  const timestamp = parts["t"];
  const signature = parts["v1"];
  if (!timestamp || !signature) return false;

  const signedPayload = `${timestamp}.${payload}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signedPayload));
  const expectedSig = Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

  return expectedSig === signature;
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await req.text();
    const sigHeader = req.headers.get("stripe-signature");

    if (!sigHeader) {
      throw new Error("No stripe-signature header");
    }

    const isValid = await verifySignature(body, sigHeader, STRIPE_WEBHOOK_SECRET);
    if (!isValid) {
      console.error("Invalid webhook signature");
      return new Response("Invalid signature", { status: 400 });
    }

    const event = JSON.parse(body);
    console.log(`Stripe webhook: ${event.type}`);

    // Handle both checkout.session.completed and payment_intent.succeeded
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const meta = paymentIntent.metadata;

      if (!meta?.user_id) {
        console.log("No user_id in metadata, skipping");
        return new Response("OK", { status: 200 });
      }

      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

      // Check if order already exists (frontend may have created it)
      const { data: existing } = await supabase
        .from("physical_orders")
        .select("id")
        .eq("paypal_order_id", paymentIntent.id)
        .maybeSingle();

      if (existing) {
        console.log("Order already exists, skipping webhook insert");
        return new Response("OK", { status: 200 });
      }

      const orderItems = [{
        name: meta.product_name,
        qty: parseInt(meta.bundle_qty) || 1,
        price: parseFloat(meta.amount_paid) || 0,
        scent_variant: meta.scent_variant,
        card_name: meta.card_name,
        card_front: meta.card_front,
        card_inside: meta.card_inside,
        recipient_name: meta.recipient_name,
        ship_anonymous: meta.ship_anonymous === "true",
      }];

      const { error: dbError } = await supabase.from("physical_orders").insert({
        user_id: meta.user_id,
        nickname: meta.nickname || "Citizen",
        email: meta.email,
        phone: meta.phone,
        address: meta.shipping_address,
        delivery_date: meta.delivery_date,
        items: orderItems,
        amount_paid: parseFloat(meta.amount_paid) || 0,
        payment_method: "Stripe",
        payment_provider: "Stripe",
        paypal_order_id: paymentIntent.id,
        status: "Paid",
      });

      if (dbError) {
        console.error("Failed to insert order:", dbError);
        throw dbError;
      }

      console.log(`Webhook order created for ${meta.user_id}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Webhook error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
});
