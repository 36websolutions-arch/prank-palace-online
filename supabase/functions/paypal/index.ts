import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PAYPAL_CLIENT_ID = Deno.env.get("PAYPAL_CLIENT_ID")!;
const PAYPAL_CLIENT_SECRET = Deno.env.get("PAYPAL_CLIENT_SECRET")!;
const PAYPAL_MODE = Deno.env.get("PAYPAL_MODE") || "sandbox";

const PAYPAL_API_URL = PAYPAL_MODE === "live" 
  ? "https://api-m.paypal.com" 
  : "https://api-m.sandbox.paypal.com";

async function getAccessToken(): Promise<string> {
  console.log("Getting PayPal access token...");
  
  const auth = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`);
  
  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Failed to get access token:", error);
    throw new Error("Failed to get PayPal access token");
  }

  const data = await response.json();
  console.log("Access token obtained successfully");
  return data.access_token;
}

async function createOrder(amount: string, currency: string = "USD"): Promise<any> {
  console.log(`Creating PayPal order for ${amount} ${currency}`);
  
  const accessToken = await getAccessToken();

  const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount,
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Failed to create order:", error);
    throw new Error("Failed to create PayPal order");
  }

  const order = await response.json();
  console.log("Order created:", order.id);
  return order;
}

async function captureOrder(orderId: string): Promise<any> {
  console.log(`Capturing PayPal order: ${orderId}`);
  
  const accessToken = await getAccessToken();

  const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Failed to capture order:", error);
    throw new Error("Failed to capture PayPal order");
  }

  const capture = await response.json();
  console.log("Order captured:", capture.status);
  return capture;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, amount, orderId } = await req.json();
    console.log(`PayPal action: ${action}`);

    if (action === "create") {
      if (!amount) {
        throw new Error("Amount is required for creating an order");
      }
      const order = await createOrder(amount);
      return new Response(JSON.stringify({ orderId: order.id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "capture") {
      if (!orderId) {
        throw new Error("Order ID is required for capturing");
      }
      const capture = await captureOrder(orderId);
      return new Response(JSON.stringify({ 
        status: capture.status,
        id: capture.id,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "get-client-id") {
      return new Response(JSON.stringify({ clientId: PAYPAL_CLIENT_ID }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Invalid action");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("PayPal error:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
