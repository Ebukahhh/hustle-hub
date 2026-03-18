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
      console.error("[paystack-webhook] ❌ Invalid signature.");
      return new Response("Invalid signature", { status: 401 });
    }

    const event = JSON.parse(bodyText);
    console.log(`[paystack-webhook] Received event: ${event.event}`);

    if (event.event === "charge.success") {
      const reference = event.data.reference;
      const amountPaid = event.data.amount / 100; // Convert from pesewas/kobo
      
      console.log(`[paystack-webhook] Processing successful charge for reference: ${reference}, amount: ${amountPaid}`);

      // 1. Update vendor payment status
      const { data: updatedVendor, error: updateError } = await supabase
        .from("vendors")
        .update({ payment_status: 'confirmed' })
        .eq("reference_id", reference)
        .select("full_name, email, business_name")
        .single();

      if (updateError) {
        console.error("[paystack-webhook] ❌ Supabase update error:", updateError.message);
        throw updateError;
      }

      if (!updatedVendor) {
        console.error(`[paystack-webhook] ❌ No vendor found with reference_id: ${reference}`);
        return new Response(JSON.stringify({ error: "Vendor not found" }), { status: 404 });
      }

      console.log(`[paystack-webhook] ✅ Vendor status updated to 'confirmed' for: ${updatedVendor.email}`);

      // 2. Trigger confirmation email via the vendor-confirmation Edge Function
      try {
        console.log(`[paystack-webhook] Triggering confirmation email for ${updatedVendor.email}...`);

        const emailResponse = await fetch(`${SUPABASE_URL}/functions/v1/vendor-confirmation`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          },
          body: JSON.stringify({
            full_name: updatedVendor.full_name,
            email: updatedVendor.email,
            business_name: updatedVendor.business_name,
          }),
        });

        const emailResult = await emailResponse.json();

        if (emailResponse.ok && emailResult.success) {
          console.log(`[paystack-webhook] ✅ Confirmation email sent to ${updatedVendor.email}`);
        } else {
          console.error(`[paystack-webhook] ⚠️ Email function returned error:`, emailResult.error || "Unknown error");
          // Don't throw — the payment is already confirmed. Log the email failure but don't fail the webhook.
        }
      } catch (emailError: any) {
        console.error(`[paystack-webhook] ⚠️ Failed to trigger confirmation email:`, emailError.message);
        // Don't throw — the payment is already confirmed. Email failure is non-fatal.
      }

      console.log(`[paystack-webhook] ✅ Webhook fully processed for reference: ${reference}`);
    }

    return new Response("Webhook processed", { status: 200 });

  } catch (error: any) {
    console.error("[paystack-webhook] ❌ Fatal webhook error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
});
