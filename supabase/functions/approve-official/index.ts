import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

interface ApproveOfficialRequest {
  officialId: string;
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

    console.log('Processing official approval');

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
    let approvalData: ApproveOfficialRequest;
    try {
      approvalData = await req.json();
      console.log('Approval data received:', { officialId: approvalData.officialId });
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
    if (!approvalData.officialId || typeof approvalData.officialId !== 'string') {
      console.error('Missing or invalid officialId');
      return new Response(
        JSON.stringify({ 
          error: 'Missing required field', 
          message: 'officialId is required and must be a string'
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // Get the official record
    console.log('Fetching official record:', approvalData.officialId);
    const { data: official, error: fetchError } = await supabaseAdmin
      .from('officials')
      .select('*')
      .eq('id', approvalData.officialId)
      .single();

    if (fetchError) {
      console.error('Error fetching official:', fetchError);
      return new Response(
        JSON.stringify({ 
          error: 'Official not found',
          message: 'The specified official registration could not be found.'
        }),
        {
          status: 404,
          headers: corsHeaders,
        }
      );
    }

    if (!official) {
      console.error('Official not found:', approvalData.officialId);
      return new Response(
        JSON.stringify({ 
          error: 'Official not found',
          message: 'The specified official registration does not exist.'
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
      hasPassword: !!official.password_hash
    });

    // Check if already approved
    if (official.status === 'approved') {
      console.log('Official already approved:', official.email);
      return new Response(
        JSON.stringify({ 
          error: 'Already approved',
          message: 'This official registration is already approved.'
        }),
        {
          status: 409,
          headers: corsHeaders,
        }
      );
    }

    // Check if password is available
    if (!official.password_hash) {
      console.error('No password hash found for official:', official.email);
      return new Response(
        JSON.stringify({ 
          error: 'Password not set',
          message: 'Official must have a password set before approval.'
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // Create the Supabase Auth user using Admin API
    console.log('Creating Supabase Auth user for:', official.email);
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: official.email,
      password: 'temp-password-will-be-reset', // Temporary password
      email_confirm: false, // User will need to confirm email
      user_metadata: {
        first_name: official.first_name,
        last_name: official.last_name,
        middle_name: official.middle_name,
        suffix: official.suffix,
        phone_number: official.phone_number,
        landline_number: official.landline_number,
        role: 'official',
        barangay: official.barangay,
        municipality: official.municipality,
        province: official.province,
        region: official.region,
        position: official.position
      }
    });

    if (authError) {
      console.error('Error creating Supabase Auth user:', authError);
      
      // Handle duplicate email error
      if (authError.message?.includes('already registered') || authError.message?.includes('User already registered')) {
        return new Response(
          JSON.stringify({ 
            error: 'User already exists',
            message: 'A user with this email already exists in the system.'
          }),
          {
            status: 409,
            headers: corsHeaders,
          }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to create user account',
          message: 'Unable to create user account. Please try again.',
          details: authError.message
        }),
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }

    console.log('Supabase Auth user created successfully:', authUser.user.id);

    // Update the officials record with approval and user_id
    console.log('Updating official record with approval status');
    const { error: updateError } = await supabaseAdmin
      .from('officials')
      .update({
        status: 'approved',
        is_approved: true,
        user_id: authUser.user.id,
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', approvalData.officialId);

    if (updateError) {
      console.error('Error updating official record:', updateError);
      
      // Try to clean up the auth user if official update failed
      try {
        await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
        console.log('Cleaned up auth user after failed official update');
      } catch (cleanupError) {
        console.error('Failed to cleanup auth user:', cleanupError);
      }
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to update official record',
          message: 'User account was created but official record update failed. Please contact support.'
        }),
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }

    // Send email verification to the newly created user
    console.log('Sending email verification to:', official.email);
    const { error: emailError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup',
      email: official.email,
      options: {
        redirectTo: `${Deno.env.get('SUPABASE_URL')?.replace('/supabase', '')}/email-confirmation`
      }
    });

    if (emailError) {
      console.error('Error sending verification email:', emailError);
      // Don't fail the request for email errors, just log them
    } else {
      console.log('Email verification sent successfully');
    }

    console.log('Official approval completed successfully:', {
      officialId: official.id,
      userId: authUser.user.id,
      email: official.email
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Official approved successfully! The official will receive an email verification link.',
        data: {
          id: official.id,
          email: official.email,
          userId: authUser.user.id,
          status: 'approved'
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
        error: 'Internal server error',
        message: 'An unexpected error occurred. Please try again later.',
        details: error.message
      }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
});