import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

interface CreateAuthUserRequest {
  official_id: string;
}

serve(async (req) => {
  console.log(`[${new Date().toISOString()}] ${req.method} request received`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 200,
      headers: corsHeaders 
    });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ success: false, error: 'Method not allowed' }),
        {
          status: 405,
          headers: corsHeaders,
        }
      );
    }

    // Create Supabase admin client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    let requestData: CreateAuthUserRequest;
    try {
      requestData = await req.json();
    } catch (parseError) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Invalid JSON in request body'
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    if (!requestData.official_id) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Missing official_id'
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // Get the official record
    const { data: official, error: fetchError } = await supabaseAdmin
      .from('officials')
      .select('*')
      .eq('id', requestData.official_id)
      .single();

    if (fetchError || !official) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Official not found'
        }),
        {
          status: 404,
          headers: corsHeaders,
        }
      );
    }

    if (official.status !== 'approved') {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Official is not approved'
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // Check if auth user already exists
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
    const userExists = existingUser.users.some(user => user.email === official.email);

    if (userExists) {
      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Auth user already exists',
          user_id: official.user_id
        }),
        {
          status: 200,
          headers: corsHeaders,
        }
      );
    }

    // Create auth user
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: official.email,
      password: official.original_password || 'temporary123', // Use original password or generate one
      email_confirm: true,
      user_metadata: {
        first_name: official.first_name,
        last_name: official.last_name,
        middle_name: official.middle_name || '',
        suffix: official.suffix || '',
        phone_number: official.phone_number,
        landline_number: official.landline_number || '',
        barangay: official.barangay,
        municipality: official.municipality,
        province: official.province,
        region: official.region,
        role: 'official',
        position: official.position
      }
    });

    if (authError) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Failed to create auth user',
          details: authError.message
        }),
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }

    // Update the official record with the auth user ID
    const { error: updateError } = await supabaseAdmin
      .from('officials')
      .update({ user_id: authUser.user.id })
      .eq('id', requestData.official_id);

    if (updateError) {
      console.error('Error updating official with user_id:', updateError);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Auth user created successfully',
        user_id: authUser.user.id
      }),
      {
        status: 200,
        headers: corsHeaders,
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Internal server error'
      }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}); 
