import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY")!;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      productName,
      scentVariant,
      bundleQty,
      totalPrice,
      cardName,
      cardFront,
      cardInside,
      shippingAddress,
      recipientName,
      shipAnonymous,
      phone,
      deliveryDate,
      userId,
      email,
      nickname,
    } = await req.json();

    if (!totalPrice || !userId || !email) {
      throw new Error("Missing required fields");
    }

    const shippingCost = bundleQty >= 2 ? 0 : 4.99;
    const amountInCents = Math.round((totalPrice + shippingCost) * 100);

    // Create a Stripe PaymentIntent
    const params = new URLSearchParams({
      "amount": String(amountInCents),
      "currency": "usd",
      "automatic_payment_methods[enabled]": "true",
      // Metadata for webhook / order creation
      "metadata[user_id]": userId,
      "metadata[nickname]": nickname || "Citizen",
      "metadata[email]": email,
      "metadata[phone]": phone || "",
      "metadata[shipping_address]": shippingAddress || "",
      "metadata[delivery_date]": deliveryDate || "",
      "metadata[product_name]": productName,
      "metadata[scent_variant]": scentVariant || "",
      "metadata[bundle_qty]": String(bundleQty),
      "metadata[card_name]": cardName || "",
      "metadata[card_front]": cardFront || "",
      "metadata[card_inside]": cardInside || "",
      "metadata[recipient_name]": recipientName || "",
      "metadata[ship_anonymous]": String(shipAnonymous || false),
      "metadata[amount_paid]": String(totalPrice + shippingCost),
      "metadata[shipping_cost]": String(shippingCost),
      "description": `${productName} — ${bundleQty} pack(s) — ${scentVariant}`,
      "receipt_email": email,
    });

    const stripeResponse = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!stripeResponse.ok) {
      const errorText = await stripeResponse.text();
      console.error("Stripe API error:", errorText);
      throw new Error("Failed to create payment intent");
    }

    const paymentIntent = await stripeResponse.json();
    console.log("PaymentIntent created:", paymentIntent.id);

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: amountInCents,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Stripe error:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
