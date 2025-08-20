import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SendOTPRequest {
  phoneNumber: string;
  userRole: 'resident' | 'official';
}

const handler = async (req: Request): Promise<Response> => {
  console.log('Send OTP function called, method:', req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Processing OTP request...');
    
    const body = await req.text();
    console.log('Request body:', body);
    
    let phoneNumber: string;
    let userRole: 'resident' | 'official';
    
    try {
      const parsed = JSON.parse(body);
      phoneNumber = parsed.phoneNumber;
      userRole = parsed.userRole;
      console.log('Parsed request:', { phoneNumber, userRole });
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate input
    if (!phoneNumber || !userRole) {
      console.error('Missing required fields:', { phoneNumber: !!phoneNumber, userRole: !!userRole });
      return new Response(
        JSON.stringify({ error: 'Phone number and user role are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s+/g, ''))) {
      console.error('Invalid phone number format:', phoneNumber);
      return new Response(
        JSON.stringify({ error: 'Invalid phone number format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get Twilio credentials first
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

    console.log('Twilio credentials check:', {
      accountSid: !!accountSid,
      authToken: !!authToken,
      twilioPhoneNumber: !!twilioPhoneNumber
    });

    if (!accountSid || !authToken || !twilioPhoneNumber) {
      console.error('Missing Twilio credentials - SMS service not configured');
      return new Response(
        JSON.stringify({ 
          error: 'SMS service not configured',
          message: 'Phone verification is currently unavailable. Please contact support.'
        }),
        { 
          status: 503, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated OTP:', otpCode);

    // Clean phone number
    const cleanPhone = phoneNumber.replace(/\s+/g, '');

    // Delete any existing OTP for this phone number
    const { error: deleteError } = await supabase
      .from('otp_verifications')
      .delete()
      .eq('phone_number', cleanPhone);

    if (deleteError) {
      console.error('Error deleting existing OTP:', deleteError);
    }

    // Send SMS via Twilio first
    const smsMessage = `Your Smart Barangay verification code is: ${otpCode}. This code will expire in 10 minutes.`;
    
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const twilioData = new URLSearchParams({
      From: twilioPhoneNumber,
      To: cleanPhone,
      Body: smsMessage
    });

    const twilioAuth = btoa(`${accountSid}:${authToken}`);
    console.log('Sending SMS to:', cleanPhone);

    const twilioResponse = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${twilioAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: twilioData,
    });

    const twilioResult = await twilioResponse.json();
    console.log('Twilio response:', twilioResult);

    if (!twilioResponse.ok) {
      console.error('Twilio error:', twilioResult);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send SMS',
          message: 'Unable to send verification code. Please check your phone number and try again.'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Only store OTP in database after SMS is successfully sent
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const { error: dbError } = await supabase
      .from('otp_verifications')
      .insert({
        phone_number: cleanPhone,
        otp_code: otpCode,
        user_role: userRole,
        expires_at: expiresAt.toISOString()
      });

    if (dbError) {
      console.error('Database error after SMS sent:', dbError);
      // SMS was sent but we couldn't store in DB - this is a critical error
      return new Response(
        JSON.stringify({ 
          error: 'Verification setup failed',
          message: 'SMS sent but verification setup failed. Please try again.'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('OTP sent successfully');
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'OTP sent successfully',
        expiresAt: expiresAt.toISOString()
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in send-otp function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);
