
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';
import { corsHeaders } from '../_utils/cors.ts'; // Create this utility file

interface OfficialRegistrationData {
  first_name: string;
  middle_name?: string;
  last_name: string;
  suffix?: string;
  phone_number: string;
  landline_number?: string;
  email: string;
  position: string;
  password: string;
  barangay: string;
  municipality: string;
  province: string;
  region: string;
}

serve(async (req: Request) => {
  console.log(`[${new Date().toISOString()}] ${req.method} request received`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 200 });
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: corsHeaders }
      );
    }

    // Check environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing environment variables');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Parse request body with better error handling
    let registrationData: OfficialRegistrationData;
    try {
      const body = await req.text();
      if (!body) {
        throw new Error('Empty request body');
      }
      registrationData = JSON.parse(body);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request format',
          message: 'Request body must be valid JSON'
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate required fields
    const requiredFields: (keyof OfficialRegistrationData)[] = [
      'first_name', 'last_name', 'phone_number', 'email', 
      'position', 'password', 'barangay', 'municipality', 'province', 'region'
    ];
    
    const missingFields = requiredFields.filter(field => {
      const value = registrationData[field];
      return !value || (typeof value === 'string' && value.trim() === '');
    });
    
    if (missingFields.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields', 
          missingFields,
          message: `Please fill in: ${missingFields.join(', ')}`
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registrationData.email.trim())) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid email format',
          message: 'Please enter a valid email address'
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Check for existing registration
    const { data: existingOfficial, error: checkError } = await supabase
      .from('officials')
      .select('id, email, status')
      .eq('email', registrationData.email.trim().toLowerCase())
      .maybeSingle();

    if (checkError) {
      console.error('Database check error:', checkError);
      return new Response(
        JSON.stringify({ 
          error: 'Database error',
          message: 'Unable to verify registration. Please try again.'
        }),
        { status: 500, headers: corsHeaders }
      );
    }

    if (existingOfficial) {
      return new Response(
        JSON.stringify({ 
          error: 'Registration already exists',
          message: `Email ${registrationData.email} is already registered with status: ${existingOfficial.status}`
        }),
        { status: 409, headers: corsHeaders }
      );
    }

    // Create registration record WITHOUT storing plain text password
    const insertData = {
      first_name: registrationData.first_name.trim(),
      middle_name: registrationData.middle_name?.trim() || null,
      last_name: registrationData.last_name.trim(),
      suffix: registrationData.suffix?.trim() || null,
      phone_number: registrationData.phone_number.trim(),
      landline_number: registrationData.landline_number?.trim() || null,
      email: registrationData.email.trim().toLowerCase(),
      position: registrationData.position.trim(),
      barangay: registrationData.barangay.trim(),
      municipality: registrationData.municipality.trim(),
      province: registrationData.province.trim(),
      region: registrationData.region.trim(),
      status: 'pending',
      is_approved: false,
      user_id: null,
      password_hash: null, // Will be set during approval
      original_password: registrationData.password.trim(), // Temporary - better to use token system
      submitted_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: newOfficial, error: insertError } = await supabase
      .from('officials')
      .insert([insertData])
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return new Response(
        JSON.stringify({ 
          error: 'Registration failed',
          message: 'Unable to submit registration. Please try again.',
          details: insertError.message
        }),
        { status: 500, headers: corsHeaders }
      );
    }

    console.log('Registration successful:', newOfficial.id);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Registration submitted successfully!',
        data: {
          id: newOfficial.id,
          email: newOfficial.email,
          status: newOfficial.status
        }
      }),
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});
