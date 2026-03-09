import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import nodemailer from "npm:nodemailer@6.9.11";

// These will be securely loaded from Supabase secrets
const GMAIL_USER = Deno.env.get("GMAIL_USER");
const GMAIL_APP_PASSWORD = Deno.env.get("GMAIL_APP_PASSWORD");

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
    const payload = await req.json();

    // Verify this is an INSERT trigger payload from Supabase
    if (payload.type === 'INSERT' && payload.table === 'registrations') {
      const { name, email } = payload.record;

      if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
        throw new Error("Missing GMAIL_USER or GMAIL_APP_PASSWORD inside Supabase Secrets");
      }

      // Configure the Nodemailer transporter for Gmail
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: GMAIL_USER,
          pass: GMAIL_APP_PASSWORD, // Must be a 16-character Google App Password, NOT the normal email password
        },
      });

      // The actual email being sent
      const mailOptions = {
        from: `"Hustle Hub" <${GMAIL_USER}>`,
        to: email, // Free Gmail lets you send to ANY valid email!
        subject: `Welcome to Hustle Hub 2026 - Vendor Confirmation`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FAFAFA; color: #4A2411;">
            <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #F59E0B;">
              <h1 style="color: #4A2411; margin: 0;">Hustle <span style="color: #F59E0B;">Hub.</span></h1>
            </div>
            <div style="padding: 20px 0;">
              <h2 style="font-size: 24px; margin-top: 0;">You're In, ${name}! 🎉</h2>
              <p style="font-size: 16px; line-height: 1.5;">Your vendor registration for the ultimate campus trade fair has been securely received.</p>
              <p style="font-size: 16px; line-height: 1.5;">Keep a close eye on your inbox over the coming weeks as we will follow up with the official vendor packet, stall pricing, and setup instructions.</p>
              <div style="margin: 30px 0; padding: 20px; background-color: #4A2411; color: white; border-radius: 12px; text-align: center;">
                <h3 style="margin: 0 0 10px 0; color: #F59E0B;">Event Details</h3>
                <p style="margin: 5px 0;"><strong>Date:</strong> April 11, 2026 @ 11:00 AM</p>
                <p style="margin: 5px 0;"><strong>Location:</strong> Pentecost University</p>
              </div>
              <p style="font-size: 16px; line-height: 1.5;">Prepare your creative ideas, get your hustle on, and get ready for an unforgettable experience.</p>
              <p style="font-size: 16px;">Best,</p>
              <p style="font-size: 16px; font-weight: bold;">The Comm. Studies Dept. Team</p>
            </div>
          </div>
        `,
      };

      // Send the email
      await transporter.sendMail(mailOptions);

      // Return a successful response to Supabase
      return new Response(JSON.stringify({ success: true, emailSentTo: email }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // If it wasn't an insert to the right table, ignore it
    return new Response(JSON.stringify({ message: "Payload ignored" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Webhook Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
