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

    // Check if user already exists in auth system first
    console.log('Checking if user already exists in auth system');
    const { data: existingAuthUser, error: authCheckError } = await supabaseAdmin.auth.admin.listUsers();
    
    let authUser;
    if (authCheckError) {
      console.error('Error checking existing users:', authCheckError);
    } else {
      const userExists = existingAuthUser.users.find(user => user.email === official.email);
      if (userExists) {
        console.log('User already exists in auth system:', userExists.id);
        authUser = { user: userExists };
      }
    }

    // If user doesn't exist, create them
    if (!authUser) {
      // Generate a secure temporary password
      const tempPassword = crypto.randomUUID().substring(0, 12) + '!A1';
      console.log('Generated temporary password for user creation');

      // Create auth user using Admin API - this will trigger Supabase's email confirmation
      console.log('Creating Supabase Auth user with email:', official.email);
      const { data: newAuthUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: official.email,
        password: tempPassword,
        email_confirm: false, // Let Supabase handle email confirmation
        user_metadata: {
          first_name: official.first_name,
          last_name: official.last_name,
          role: 'official'
        }
      });

      if (authError) {
        console.error('Detailed auth error:', {
          message: authError.message,
          status: authError.status,
          code: authError.code || 'unknown',
          details: authError
        });
        
        return new Response(
          JSON.stringify({ 
            success: false,
            error: `Failed to create user account: ${authError.message}`,
            details: authError.code || 'unknown_error'
          }),
          {
            status: 500,
            headers: corsHeaders,
          }
        );
      }

      authUser = newAuthUser;
      console.log('Auth user created successfully:', authUser.user.id);
    } else {
      console.log('Using existing auth user:', authUser.user.id);
    }

    // Send password reset email using Supabase's built-in system
    console.log('Sending password reset email via Supabase');
    const { data: resetData, error: resetError } = await supabaseAdmin.auth.resetPasswordForEmail(
      official.email,
      { 
        redirectTo: `${req.headers.get('origin') || 'https://trybarangaymo.com'}/auth/reset-password`
      }
    );

    if (resetError) {
      console.error('Failed to send password reset email:', resetError);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: `Failed to send password setup email: ${resetError.message}`
        }),
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    } else {
      console.log('Password reset email sent successfully to:', official.email);
    }

    // Update user metadata with full information after successful approval
    console.log('Updating user metadata with complete information');
    const { error: metadataUpdateError } = await supabaseAdmin.auth.admin.updateUserById(
      authUser.user.id,
      {
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
      }
    );

    if (metadataUpdateError) {
      console.error('Warning: Could not update user metadata:', metadataUpdateError);
      // Continue anyway
    }

    // Update official status to approved and link to auth user
    console.log('Updating official status to approved');
    const { error: officialUpdateError } = await supabaseAdmin
      .from('officials')
      .update({
        status: 'approved',
        is_approved: true,
        user_id: authUser.user.id,
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', requestData.official_id);

    if (officialUpdateError) {
      console.error('Error updating official status:', officialUpdateError);
      
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
        message: 'Official approved successfully. Auth user created and password setup email sent.',
        data: {
          official_id: requestData.official_id,
          user_id: authUser.user.id,
          email: official.email,
          note: 'A password setup email has been sent via Supabase.'
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