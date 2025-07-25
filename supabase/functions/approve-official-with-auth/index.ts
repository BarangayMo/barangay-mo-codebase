import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

interface ApprovalRequest {
  official_id: string;
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
        JSON.stringify({ success: false, error: 'Method not allowed' }),
        {
          status: 405,
          headers: corsHeaders,
        }
      );
    }

    console.log('Processing official approval with auth user creation');

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
    let requestData: ApprovalRequest;
    try {
      requestData = await req.json();
      console.log('Approval request received for official ID:', requestData.official_id);
    } catch (parseError) {
      console.error('Failed to parse request JSON:', parseError);
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
    console.log('Fetching official record');
    const { data: official, error: fetchError } = await supabaseAdmin
      .from('officials')
      .select('*')
      .eq('id', requestData.official_id)
      .single();

    if (fetchError || !official) {
      console.error('Error fetching official or official not found:', fetchError);
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

    console.log('Official found:', { 
      email: official.email, 
      status: official.status,
      hasPasswordHash: !!official.password_hash
    });

    if (official.status === 'approved') {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Official is already approved'
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    if (!official.password_hash) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'No password found for this official registration'
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // Create auth user using Admin API
    console.log('Creating Supabase Auth user');
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: official.email,
      password: '', // We'll set password later using the hash
      email_confirm: true, // Skip email verification for approved officials
      user_metadata: {
        first_name: official.first_name,
        last_name: official.last_name,
        middle_name: official.middle_name,
        suffix: official.suffix,
        phone_number: official.phone_number,
        landline_number: official.landline_number,
        barangay: official.barangay,
        municipality: official.municipality,
        province: official.province,
        region: official.region,
        role: 'official',
        position: official.position
      }
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      
      // Check if user already exists
      if (authError.message?.includes('already registered') || authError.message?.includes('duplicate')) {
        return new Response(
          JSON.stringify({ 
            success: false,
            error: 'User with this email already exists in the authentication system'
          }),
          {
            status: 409,
            headers: corsHeaders,
          }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Failed to create user account'
        }),
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }

    console.log('Auth user created successfully:', authUser.user.id);

    // Update password hash directly in auth.users table
    console.log('Setting password hash for user');
    const { error: passwordError } = await supabaseAdmin
      .from('auth.users')
      .update({ 
        encrypted_password: official.password_hash,
        password_hash: official.password_hash 
      })
      .eq('id', authUser.user.id);

    if (passwordError) {
      console.error('Warning: Could not set password hash directly:', passwordError);
      // Continue anyway - user can reset password if needed
    }

    // Update official status to approved and link to auth user
    console.log('Updating official status to approved');
    const { error: updateError } = await supabaseAdmin
      .from('officials')
      .update({
        status: 'approved',
        is_approved: true,
        user_id: authUser.user.id,
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', requestData.official_id);

    if (updateError) {
      console.error('Error updating official status:', updateError);
      
      // Try to clean up created user
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Failed to update official status'
        }),
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }

    console.log('Official approved successfully with auth user created');

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Official approved successfully. Auth user created.',
        data: {
          official_id: requestData.official_id,
          user_id: authUser.user.id,
          email: official.email
        }
      }),
      {
        status: 200,
        headers: corsHeaders,
      }
    );

  } catch (error) {
    console.error('Unexpected error in official approval:', error);
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