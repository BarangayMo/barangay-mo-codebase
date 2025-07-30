/ approve-official-with-auth/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';
import { corsHeaders } from '../_utils/cors.ts';

interface ApprovalRequest {
  official_id: string;
}

serve(async (req: Request) => {
  console.log(`[${new Date().toISOString()}] Approval request: ${req.method}`);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 200 });
  }

  try {
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

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Parse request
    let requestData: ApprovalRequest;
    try {
      const body = await req.text();
      requestData = JSON.parse(body);
    } catch (parseError) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request' }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (!requestData.official_id) {
      return new Response(
        JSON.stringify({ error: 'Missing official_id' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Get the official record
    const { data: official, error: fetchError } = await supabase
      .from('officials')
      .select('*')
      .eq('id', requestData.official_id)
      .single();

    if (fetchError || !official) {
      console.error('Official not found:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Official not found' }),
        { status: 404, headers: corsHeaders }
      );
    }

    if (official.status === 'approved') {
      return new Response(
        JSON.stringify({ error: 'Official already approved' }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (!official.original_password) {
      return new Response(
        JSON.stringify({ error: 'Password not available for account creation' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(user => user.email === official.email);
    
    let authUserId: string;

    if (existingUser) {
      // Update existing user
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        { 
          password: official.original_password,
          user_metadata: {
            first_name: official.first_name,
            last_name: official.last_name,
            role: 'official',
            position: official.position,
            barangay: official.barangay,
            municipality: official.municipality,
            province: official.province,
            region: official.region
          },
          app_metadata: { role: 'official' }
        }
      );
      
      if (updateError) {
        console.error('Update user error:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to update user account' }),
          { status: 500, headers: corsHeaders }
        );
      }
      authUserId = existingUser.id;
    } else {
      // Create new user
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: official.email,
        password: official.original_password,
        email_confirm: true,
        user_metadata: {
          first_name: official.first_name,
          last_name: official.last_name,
          role: 'official',
          position: official.position,
          barangay: official.barangay,
          municipality: official.municipality,
          province: official.province,
          region: official.region
        },
        app_metadata: { role: 'official' }
      });

      if (createError) {
        console.error('Create user error:', createError);
        return new Response(
          JSON.stringify({ 
            error: 'Failed to create user account',
            details: createError.message
          }),
          { status: 500, headers: corsHeaders }
        );
      }
      authUserId = newUser.user.id;
    }

    // Update official record
    const { error: updateOfficialError } = await supabase
      .from('officials')
      .update({
        status: 'approved',
        is_approved: true,
        user_id: authUserId,
        original_password: null, // Clear for security
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', requestData.official_id);

    if (updateOfficialError) {
      console.error('Update official error:', updateOfficialError);
      return new Response(
        JSON.stringify({ error: 'Failed to update official status' }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Create/update profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: authUserId,
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
        role: 'official',
        is_approved: true,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (profileError) {
      console.warn('Profile upsert warning:', profileError);
      // Continue anyway as main approval succeeded
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Official approved successfully',
        data: {
          official_id: requestData.official_id,
          user_id: authUserId,
          email: official.email
        }
      }),
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error('Approval error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});
