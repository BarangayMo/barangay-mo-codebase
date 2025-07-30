
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
    console.log('Fetching official record for ID:', requestData.official_id);
    const { data: official, error: fetchError } = await supabaseAdmin
      .from('officials')
      .select('*')
      .eq('id', requestData.official_id)
      .single();

    console.log('Query result - Data:', official ? 'found' : 'null', 'Error:', fetchError);

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
      hasPasswordHash: !!official.password_hash,
      hasOriginalPassword: !!official.original_password
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

    // Use the original password provided during registration
    if (!official.original_password) {
      console.error('No original password found for official');
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Original password not found. Official may need to re-register.'
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    console.log('Using original password for user creation');

    // Check if user already exists in auth system
    console.log('Checking if user already exists in auth system');
    const { data: existingAuthUsers, error: userListError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (userListError) {
      console.error('Error checking existing users:', userListError);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Failed to check existing users'
        }),
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }

    const existingUser = existingAuthUsers.users.find(user => user.email === official.email);
    
    let authUser;
    
    if (existingUser) {
      console.log('User already exists in auth system, using existing user:', existingUser.id);
      authUser = { user: existingUser };
      
      // Update the existing user's password and metadata
      console.log('Updating existing user password and metadata');
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        existingUser.id,
        { 
          password: official.original_password,
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
          },
          app_metadata: {
            role: 'official'
          }
        }
      );
      
      if (updateError) {
        console.error('Error updating existing user:', updateError);
        return new Response(
          JSON.stringify({ 
            success: false,
            error: 'Failed to update existing user account'
          }),
          {
            status: 500,
            headers: corsHeaders,
          }
        );
      }
    } else {
    // Create auth user using Admin API
      console.log('Creating new Supabase Auth user');
      const userMetadata = {
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
      };
      
      console.log('DEBUG: Creating user with metadata:', JSON.stringify(userMetadata, null, 2));
      
      const { data: newAuthUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: official.email,
        password: official.original_password,
        email_confirm: true,
        user_metadata: userMetadata,
        app_metadata: {
          role: 'official'
        }
      });

      if (authError) {
        console.error('Error creating auth user:', authError);
        
        return new Response(
          JSON.stringify({ 
            success: false,
            error: 'Failed to create user account',
            details: authError.message
          }),
          {
            status: 500,
            headers: corsHeaders,
          }
        );
      }
      
      authUser = newAuthUser;
      
      // DIRECT FIX: Explicitly update the profile to ensure role is 'official'
      // This bypasses any trigger issues
      console.log('Directly updating profile role to official for user:', authUser.user.id);
      const { error: profileUpdateError } = await supabaseAdmin
        .from('profiles')
        .update({ 
          role: 'official', 
          is_approved: true,
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
          updated_at: new Date().toISOString()
        })
        .eq('id', authUser.user.id);

      if (profileUpdateError) {
        console.error('Error updating profile role:', profileUpdateError);
        // Continue anyway, but log the error
      } else {
        console.log('Profile role successfully updated to official');
      }
    }

    console.log('Auth user processed successfully:', authUser.user.id);

    // Update official status to approved and link to auth user
    console.log('Updating official status to approved and clearing original password');
    const { error: updateError } = await supabaseAdmin
      .from('officials')
      .update({
        status: 'approved',
        is_approved: true,
        user_id: authUser.user.id,
        original_password: null, // Clear the original password for security
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', requestData.official_id);

    if (updateError) {
      console.error('Error updating official status:', updateError);
      
      // Try to clean up created user if we created a new one
      if (!existingUser) {
        await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      }
      
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

    // Create or update profile with official role and data
    console.log('Creating/updating profile with official role');
    const { error: profileUpsertError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: authUser.user.id,
        email: official.email,
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
        role: 'official', // Explicitly set role as official
        is_approved: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });

    if (profileUpsertError) {
      console.error('Error upserting profile:', profileUpsertError);
      // Continue anyway as the main approval was successful
    } else {
      console.log('Profile created/updated successfully with official role');
    }

    console.log('Official approved successfully with auth user created and proper profile');

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Official approved successfully. Auth user created with proper role and profile.',
        data: {
          official_id: requestData.official_id,
          user_id: authUser.user.id,
          email: official.email,
          role: 'official',
          note: 'The official can now login using their original password with official role.'
        }
      }),
      {
        status: 200,
        headers: corsHeaders,
      }
    );

  } catch (error) {
    console.error('Unexpected error in official approval:', error);
    console.error('Error name:', error?.name);
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Internal server error',
        details: error?.message || 'Unknown error occurred'
      }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
});
