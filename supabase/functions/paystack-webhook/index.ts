import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY");
// For Edge Functions, Supabase uses SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY automatically
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

serve(async (req) => {
  try {
    const signature = req.headers.get("x-paystack-signature");
    const bodyText = await req.text();

    if (!PAYSTACK_SECRET_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing required environment variables.");
    }

    // Since Deno WebCrypto doesn't easily do createHmac with "hex" output in one line like Node:
    // We import crypto from Node polyfill for simplicity:
    const crypto = await import("https://deno.land/std@0.168.0/node/crypto.ts");
    
    // Verify webhook signature
    const hash = crypto.createHmac("sha512", PAYSTACK_SECRET_KEY)
      .update(bodyText)
      .digest("hex");

    if (hash !== signature) {
      console.error("Invalid signature.");
      return new Response("Invalid signature", { status: 401 });
    }

    const event = JSON.parse(bodyText);

    if (event.event === "charge.success") {
      const reference = event.data.reference;
      
      // Update vendor payment status
      const { error } = await supabase
        .from("vendors")
        .update({ payment_status: 'confirmed' })
        .eq("reference_id", reference);

      if (error) {
        console.error("Supabase Error updating vendor:", error);
        throw error;
      }
      
      console.log(`Successfully updated vendor with reference: ${reference}`);
    }

    return new Response("Webhook processed", { status: 200 });

  } catch (error: any) {
    console.error("Webhook Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
});
