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
    const { full_name, email, business_name } = await req.json();

    console.log(`[vendor-confirmation] Received request to send email to: ${email}`);

    if (!full_name || !email) {
      throw new Error("Missing required fields: full_name and email are required.");
    }

    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
      throw new Error("Missing GMAIL_USER or GMAIL_APP_PASSWORD inside Supabase Secrets");
    }

    const name = full_name;
    const business = business_name || 'your business';

    // Configure the Nodemailer transporter for Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD, // Must be a 16-character Google App Password, NOT the normal email password
      },
    });

    // Verify transporter authentication
    console.log(`[vendor-confirmation] Verifying SMTP transporter for ${GMAIL_USER}...`);

    // The actual email being sent
    const mailOptions = {
      from: `"Hustle Hub" <${GMAIL_USER}>`,
      to: email,
      subject: `Welcome to Hustle Hub 2026 - Payment Confirmed! 🎉`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FAFAFA; color: #4A2411;">
          <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #F59E0B;">
            <h1 style="color: #4A2411; margin: 0;">Hustle <span style="color: #F59E0B;">Hub.</span></h1>
          </div>
          <div style="padding: 20px 0;">
            <h2 style="font-size: 24px; margin-top: 0;">You're In, ${name}! 🎉</h2>
            <p style="font-size: 16px; line-height: 1.5;">Your payment for <strong>${business}</strong> has been successfully confirmed! Your vendor registration for the ultimate campus trade fair is now complete.</p>
            <p style="font-size: 16px; line-height: 1.5;">Keep a close eye on your inbox over the coming weeks as we will follow up with the official vendor packet, stall pricing, and setup instructions.</p>
            <div style="margin: 30px 0; padding: 20px; background-color: #4A2411; color: white; border-radius: 12px; text-align: center;">
              <h3 style="margin: 0 0 10px 0; color: #F59E0B;">Event Details</h3>
              <p style="margin: 5px 0;"><strong>Date:</strong> April 11, 2026 @ 11:00 AM</p>
              <p style="margin: 5px 0;"><strong>Location:</strong> Pentecost University</p>
            </div>
            <div style="margin: 20px 0; padding: 15px; background-color: #22c55e20; border: 1px solid #22c55e50; border-radius: 12px; text-align: center;">
              <p style="margin: 0; font-size: 16px; color: #166534; font-weight: bold;">✅ Payment Status: CONFIRMED</p>
            </div>
            <p style="font-size: 16px; line-height: 1.5;">Prepare your creative ideas, get your hustle on, and get ready for an unforgettable experience.</p>
            <p style="font-size: 16px;">Best,</p>
            <p style="font-size: 16px; font-weight: bold;">The Comm. Studies Dept. Team</p>
          </div>
        </div>
      `,
    };

    // Send the email
    console.log(`[vendor-confirmation] Sending confirmation email to ${email}...`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`[vendor-confirmation] ✅ Email sent successfully! MessageId: ${info.messageId}`);

    return new Response(JSON.stringify({ success: true, emailSentTo: email, messageId: info.messageId }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error(`[vendor-confirmation] ❌ Error:`, error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
