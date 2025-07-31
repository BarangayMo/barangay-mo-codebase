import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

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

serve(async (req) => {
  console.log(`[${new Date().toISOString()}] ${req.method} request received`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { 
      status: 200,
      headers: corsHeaders 
    });
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      console.log(`Method ${req.method} not allowed`);
      return new Response(
        JSON.stringify({ error: 'Method not allowed', method: req.method }),
        {
          status: 405,
          headers: corsHeaders,
        }
      );
    }

    console.log('Processing official registration submission');

    // Create Supabase admin client with service role
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    console.log('Supabase admin client created');

    // Parse and validate request body
    let registrationData: OfficialRegistrationData;
    try {
      registrationData = await req.json();
      console.log('Registration data received:', { 
        email: registrationData.email, 
        position: registrationData.position,
        barangay: registrationData.barangay,
        first_name: registrationData.first_name,
        last_name: registrationData.last_name
      });
    } catch (parseError) {
      console.error('Failed to parse request JSON:', parseError);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid JSON in request body',
          details: 'Request must contain valid JSON data'
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // Validate required fields
    const requiredFields = [
      'first_name', 
      'last_name', 
      'phone_number', 
      'email', 
      'position', 
      'password',
      'barangay', 
      'municipality', 
      'province', 
      'region'
    ];
    
    const missingFields = requiredFields.filter(field => {
      const value = registrationData[field as keyof OfficialRegistrationData];
      return !value || (typeof value === 'string' && value.trim() === '');
    });
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields', 
          missingFields: missingFields,
          message: `Please fill in all required fields: ${missingFields.join(', ')}`
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registrationData.email.trim())) {
      console.error('Invalid email format:', registrationData.email);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid email format',
          message: 'Please enter a valid email address'
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // Check if email already exists in officials table
    console.log('Checking for existing registration with email:', registrationData.email);
    const { data: existingOfficial, error: checkError } = await supabaseAdmin
      .from('officials')
      .select('id, email, status')
      .eq('email', registrationData.email.trim())
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing official:', checkError);
      return new Response(
        JSON.stringify({ 
          error: 'Database error',
          message: 'Unable to verify registration status. Please try again.'
        }),
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }

    if (existingOfficial) {
      console.log('Official already exists with email:', registrationData.email, 'Status:', existingOfficial.status);
      return new Response(
        JSON.stringify({ 
          error: 'Registration already exists',
          message: `A registration with email ${registrationData.email} already exists with status: ${existingOfficial.status}`,
          status: existingOfficial.status
        }),
        {
          status: 409,
          headers: corsHeaders,
        }
      );
    }

    // Hash the password for secure storage
    console.log('Hashing password for secure storage');
    const { data: hashedPasswordData, error: hashError } = await supabaseAdmin.rpc('hash_password', {
      password_text: registrationData.password.trim()
    });

    if (hashError) {
      console.error('Error hashing password:', hashError);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Password processing failed',
          message: 'Unable to process registration. Please try again.'
        }),
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }

    // Insert the official registration using service role (bypasses RLS)
    console.log('Inserting new official registration');
    const insertData = {
      first_name: registrationData.first_name.trim(),
      middle_name: registrationData.middle_name?.trim() || null,
      last_name: registrationData.last_name.trim(),
      suffix: registrationData.suffix?.trim() || null,
      phone_number: registrationData.phone_number.trim(),
      landline_number: registrationData.landline_number?.trim() || null,
      email: registrationData.email.trim().toLowerCase(),
      position: registrationData.position.trim(),
      password_hash: hashedPasswordData, // Store hashed password
      original_password: registrationData.original_password.trim(), // Store original password for account creation
      barangay: registrationData.barangay.trim(),
      municipality: registrationData.municipality.trim(),
      province: registrationData.province.trim(),
      region: registrationData.region.trim(),
      status: 'pending',
      is_approved: false,
      user_id: null, // No user associated yet
      submitted_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: newOfficial, error: insertError } = await supabaseAdmin
      .from('officials')
      .insert([insertData])
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting official registration:', insertError);
      return new Response(
        JSON.stringify({ 
          error: 'Registration failed',
          message: 'Unable to submit registration. Please try again.',
          details: process.env.NODE_ENV === 'development' ? insertError.message : undefined
        }),
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }

    console.log('Official registration created successfully:', {
      id: newOfficial.id,
      email: newOfficial.email,
      status: newOfficial.status
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Registration submitted successfully! Your application is now pending review.',
        data: {
          id: newOfficial.id,
          email: newOfficial.email,
          status: newOfficial.status,
          submitted_at: newOfficial.submitted_at
        }
      }),
      {
        status: 200,
        headers: corsHeaders,
      }
    );

  } catch (error) {
    console.error('Unexpected error in official registration:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: 'An unexpected error occurred. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
});
