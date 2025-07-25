import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
  barangay: string;
  municipality: string;
  province: string;
  region: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Official registration submission started');

    // Create Supabase client with service role for admin operations
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

    // Parse request body
    const registrationData: OfficialRegistrationData = await req.json();
    console.log('Received registration data:', { 
      email: registrationData.email, 
      position: registrationData.position,
      barangay: registrationData.barangay 
    });

    // Validate required fields
    const requiredFields = ['first_name', 'last_name', 'phone_number', 'email', 'position', 'barangay', 'municipality', 'province', 'region'];
    const missingFields = requiredFields.filter(field => !registrationData[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields', 
          fields: missingFields 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registrationData.email)) {
      console.error('Invalid email format:', registrationData.email);
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Check if email already exists in officials table
    const { data: existingOfficial, error: checkError } = await supabaseAdmin
      .from('officials')
      .select('id, email, status')
      .eq('email', registrationData.email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error checking existing official:', checkError);
      return new Response(
        JSON.stringify({ error: 'Database error while checking existing registration' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (existingOfficial) {
      console.log('Official already exists with email:', registrationData.email);
      return new Response(
        JSON.stringify({ 
          error: 'An official registration with this email already exists',
          status: existingOfficial.status
        }),
        {
          status: 409,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Insert the official registration using service role
    const { data: newOfficial, error: insertError } = await supabaseAdmin
      .from('officials')
      .insert([{
        first_name: registrationData.first_name,
        middle_name: registrationData.middle_name || null,
        last_name: registrationData.last_name,
        suffix: registrationData.suffix || null,
        phone_number: registrationData.phone_number,
        landline_number: registrationData.landline_number || null,
        email: registrationData.email,
        position: registrationData.position,
        barangay: registrationData.barangay,
        municipality: registrationData.municipality,
        province: registrationData.province,
        region: registrationData.region,
        status: 'pending',
        is_approved: false,
        user_id: null // Explicitly set to null since no user is authenticated
      }])
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting official registration:', insertError);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to submit registration',
          details: insertError.message 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Official registration created successfully:', newOfficial.id);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Registration submitted successfully',
        id: newOfficial.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Unexpected error in official registration:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});