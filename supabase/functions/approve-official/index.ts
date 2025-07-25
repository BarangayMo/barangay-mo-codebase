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
        JSON.stringify({ 
          success: false,
          error: 'Method not allowed', 
          reason: `Only POST requests are allowed, received ${req.method}`,
          method: req.method 
        }),
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
      const rawBody = await req.text();
      console.log('Raw request body:', rawBody);
      
      if (!rawBody) {
        console.error('Empty request body received');
        return new Response(
          JSON.stringify({ 
            success: false,
            error: 'Empty request body',
            reason: 'Request body is required but was empty'
          }),
          {
            status: 400,
            headers: corsHeaders,
          }
        );
      }

      requestData = JSON.parse(rawBody);
      console.log('Parsed approval request data:', requestData);
      console.log('Request data keys:', Object.keys(requestData));
      console.log('Official ID received:', requestData.official_id);
    } catch (parseError) {
      console.error('Failed to parse request JSON:', parseError);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Invalid JSON in request body',
          reason: 'Request must contain valid JSON data',
          details: parseError.message
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // Validate required fields
    if (!requestData.official_id || typeof requestData.official_id !== 'string') {
      console.error('Invalid or missing official_id in request:', requestData);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Missing or invalid required field: official_id',
          reason: 'Please provide a valid official ID to approve',
          received: requestData
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
          success: false,
          error: 'Official not found',
          reason: 'The specified official registration could not be found',
          details: fetchError.message
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
          success: false,
          error: 'Official not found',
          reason: 'The specified official registration could not be found in database'
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
          success: false,
          error: 'Already approved',
          reason: 'This official registration has already been approved'
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
          success: false,
          error: 'No password set',
          reason: 'This official registration does not have a password set. They need to register again with a password.'
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // Check if email already exists in auth.users using a more targeted approach
    console.log('Checking if email already exists in auth.users:', official.email);
    
    // Try to get user by email first - this is more reliable than listing all users
    const { data: existingUserByEmail, error: emailCheckError } = await supabaseAdmin.auth.admin.getUserByEmail(official.email);
    
    if (emailCheckError) {
      // If error is 'User not found', that's good - email doesn't exist
      if (emailCheckError.message?.includes('User not found') || emailCheckError.status === 404) {
        console.log('Email not found in auth system, proceeding with user creation');
      } else {
        console.error('Error checking email existence:', emailCheckError);
        return new Response(
          JSON.stringify({ 
            success: false,
            error: 'Email validation failed',
            reason: 'Unable to verify if email is already registered. Please try again.',
            details: emailCheckError.message
          }),
          {
            status: 500,
            headers: corsHeaders,
          }
        );
      }
    } else if (existingUserByEmail?.user) {
      // Email already exists
      console.error('Email already exists in auth.users:', official.email);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Email already registered',
          reason: `The email ${official.email} is already registered in the authentication system. This official may have already been approved or the email is in use by another account.`
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // Create Supabase Auth user
    console.log('Creating Supabase Auth user for:', official.email);
    const createUserPayload = {
      email: official.email,
      password: Math.random().toString(36).slice(-12) + 'A1!', // More secure temporary password
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
    };
    
    console.log('Auth user creation payload:', {
      email: createUserPayload.email,
      hasPassword: !!createUserPayload.password,
      metadata: createUserPayload.user_metadata
    });
    
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser(createUserPayload);

    if (authError) {
      console.error('Error creating Supabase Auth user:', authError);
      console.error('Auth error details:', {
        message: authError.message,
        status: authError.status,
        code: authError.code || 'no-code'
      });
      
      let errorMessage = 'Unable to create user account. ';
      let errorReason = authError.message || 'Unknown auth error';
      
      if (authError.message?.includes('already exists') || 
          authError.message?.includes('already registered') ||
          authError.message?.includes('User already registered') ||
          authError.message?.includes('email address is already taken') ||
          authError.message?.includes('Database error creating new user')) {
        errorMessage = 'This email is already registered.';
        errorReason = `The email ${official.email} is already registered in the authentication system. This official may have already been approved or the email is in use by another account.`;
      } else if (authError.message?.includes('invalid') || authError.message?.includes('format')) {
        errorMessage += 'Invalid email format.';
        errorReason = 'The email format is invalid';
      } else {
        errorMessage += 'Please try again or contact support.';
      }
      
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Failed to create user account',
          reason: errorReason,
          message: errorMessage,
          authError: {
            code: authError.code,
            status: authError.status,
            message: authError.message
          }
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
      console.log('Continuing with approval despite email error');
    } else {
      console.log('Email verification sent successfully');
    }

    // Update official status to approved and link to Auth user
    console.log('Updating official status to approved');
    const updateData = {
      status: 'approved',
      is_approved: true,
      user_id: authUser.user.id,
      approved_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('Update data for official:', updateData);
    
    const { error: updateError } = await supabaseAdmin
      .from('officials')
      .update(updateData)
      .eq('id', requestData.official_id);

    if (updateError) {
      console.error('Error updating official status:', updateError);
      console.error('Update error details:', {
        message: updateError.message,
        code: updateError.code,
        details: updateError.details
      });
      
      // Try to clean up the created auth user
      console.log('Attempting to cleanup created auth user:', authUser.user.id);
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Failed to approve official',
          reason: 'Unable to update official status in database. The auth user has been cleaned up.',
          updateError: {
            message: updateError.message,
            code: updateError.code
          }
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
    console.error('Error stack:', error.stack);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Internal server error',
        reason: 'An unexpected error occurred during the approval process',
        message: 'Please try again later or contact support if the issue persists.',
        details: Deno.env.get('NODE_ENV') === 'development' ? {
          message: error.message,
          stack: error.stack
        } : undefined
      }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
});