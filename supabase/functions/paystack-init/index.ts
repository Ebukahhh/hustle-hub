import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, amount, reference } = await req.json();

    if (!PAYSTACK_SECRET_KEY) {
      throw new Error("Missing PAYSTACK_SECRET_KEY in environment variables.");
    }

    if (!email || !amount || !reference) {
       throw new Error("Missing required parameters: email, amount, reference.");
    }

    // Paystack expects amount in pesewas/kobo (multiply by 100)
    const amountInPesewas = amount * 100;

    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: amountInPesewas,
        reference,
        channels: ["card", "mobile_money"],
      }),
    });

    const data = await paystackResponse.json();

    if (!data.status) {
      throw new Error(data.message || "Failed to initialize Paystack transaction.");
    }

    return new Response(JSON.stringify({ authorization_url: data.data.authorization_url, reference: data.data.reference }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Paystack Init Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
