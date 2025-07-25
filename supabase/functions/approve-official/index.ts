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
  console.log(`[${new Date().toISOString()}] ${req.method} request received for approve-official`);
  
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

    console.log('Processing official approval request');

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

    // Parse request body
    let requestData: ApprovalRequest;
    try {
      requestData = await req.json();
      console.log('Approval request data received:', { official_id: requestData.official_id });
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
    if (!requestData.official_id) {
      console.error('Missing official_id in request');
      return new Response(
        JSON.stringify({ 
          error: 'Missing required field: official_id',
          message: 'Please provide the official ID to approve'
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // Get the official record
    console.log('Fetching official record:', requestData.official_id);
    const { data: official, error: fetchError } = await supabaseAdmin
      .from('officials')
      .select('*')
      .eq('id', requestData.official_id)
      .single();

    if (fetchError) {
      console.error('Error fetching official:', fetchError);
      return new Response(
        JSON.stringify({ 
          error: 'Official not found',
          message: 'The specified official registration could not be found'
        }),
        {
          status: 404,
          headers: corsHeaders,
        }
      );
    }

    if (!official) {
      console.error('Official not found:', requestData.official_id);
      return new Response(
        JSON.stringify({ 
          error: 'Official not found',
          message: 'The specified official registration could not be found'
        }),
        {
          status: 404,
          headers: corsHeaders,
        }
      );
    }

    console.log('Official found:', { 
      id: official.id, 
      email: official.email, 
      status: official.status,
      password_hash: official.password_hash ? 'present' : 'missing'
    });

    // Check if official is already approved
    if (official.status === 'approved') {
      console.log('Official already approved:', official.email);
      return new Response(
        JSON.stringify({ 
          error: 'Already approved',
          message: 'This official registration has already been approved'
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // Check if password is set
    if (!official.password_hash) {
      console.error('Official has no password set:', official.email);
      return new Response(
        JSON.stringify({ 
          error: 'No password set',
          message: 'This official registration does not have a password set. They need to register again with a password.'
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // Create Supabase Auth user
    console.log('Creating Supabase Auth user for:', official.email);
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: official.email,
      password: Math.random().toString(36).slice(-8), // Temporary password, they'll use their stored password hash
      email_confirm: false, // Will send confirmation email
      user_metadata: {
        first_name: official.first_name,
        middle_name: official.middle_name,
        last_name: official.last_name,
        suffix: official.suffix,
        phone_number: official.phone_number,
        landline_number: official.landline_number,
        position: official.position,
        barangay: official.barangay,
        municipality: official.municipality,
        province: official.province,
        region: official.region,
        role: 'official'
      }
    });

    if (authError) {
      console.error('Error creating Supabase Auth user:', authError);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to create user account',
          message: authError.message || 'Unable to create user account. This email may already be registered.'
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    console.log('Supabase Auth user created successfully:', { 
      id: authUser.user.id, 
      email: authUser.user.email 
    });

    // Send email verification
    console.log('Sending email verification to:', official.email);
    const { error: emailError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      official.email,
      {
        redirectTo: `${Deno.env.get('SUPABASE_URL')}/auth/v1/verify?token={token}&type=invite&redirect_to=${Deno.env.get('SITE_URL') || 'http://localhost:5173'}/login`
      }
    );

    if (emailError) {
      console.error('Error sending email verification:', emailError);
      // Don't fail the approval if email fails, just log it
    } else {
      console.log('Email verification sent successfully');
    }

    // Update official status to approved and link to Auth user
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
      // Try to clean up the created auth user
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to approve official',
          message: 'Unable to update official status. Please try again.'
        }),
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }

    console.log('Official approval completed successfully for:', official.email);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Official approved successfully! An email verification has been sent.',
        data: {
          official_id: requestData.official_id,
          email: official.email,
          auth_user_id: authUser.user.id,
          status: 'approved'
        }
      }),
      {
        status: 200,
        headers: corsHeaders,
      }
    );

  } catch (error) {
    console.error('Unexpected error in approve-official:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: 'An unexpected error occurred. Please try again later.',
        details: Deno.env.get('NODE_ENV') === 'development' ? error.message : undefined
      }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
});