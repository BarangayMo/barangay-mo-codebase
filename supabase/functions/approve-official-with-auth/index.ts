import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};
console.log("Edge function called");
console.log("Request body:", req.body);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ success: false, error: 'Method not allowed' }),
        { status: 405, headers: corsHeaders }
      );
    }

    const requestData = await req.json();
    if (!requestData.official_id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing official_id' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get official
    const { data: official, error: fetchError } = await supabaseAdmin
      .from('officials')
      .select('*')
      .eq('id', requestData.official_id)
      .single();

    if (fetchError || !official) {
      return new Response(
        JSON.stringify({ success: false, error: 'Official not found' }),
        { status: 404, headers: corsHeaders }
      );
    }

    if (official.status === 'approved') {
      return new Response(
        JSON.stringify({ success: false, error: 'Already approved' }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (!official.original_password) {
      return new Response(
        JSON.stringify({ success: false, error: 'No password found' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Check existing user
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers.users.find(u => u.email === official.email);
    
    let authUser;

    if (existingUser) {
      // Update existing user
      await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
        password: official.original_password,
        user_metadata: {
          first_name: official.first_name,
          last_name: official.last_name,
          role: 'official'
        }
      });
      authUser = { user: existingUser };
    } else {
      // Create new user
      const { data: newUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: official.email,
        password: official.original_password,
        email_confirm: true,
        user_metadata: {
          first_name: official.first_name,
          last_name: official.last_name,
          role: 'official'
        }
      });

      if (authError) {
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to create user' }),
          { status: 500, headers: corsHeaders }
        );
      }
      authUser = newUser;
    }

    // Update profile - CRITICAL FIX
    await supabaseAdmin
      .from('profiles')
      .upsert({
        id: authUser.user.id,
        email: official.email,
        first_name: official.first_name,
        last_name: official.last_name,
        role: 'official',
        is_approved: true
      });

    // Update official status
    const { error: updateError } = await supabaseAdmin
      .from('officials')
      .update({
        status: 'approved',
        is_approved: true,
        user_id: authUser.user.id,
        original_password: null,
        approved_at: new Date().toISOString()
      })
      .eq('id', requestData.official_id);

    if (updateError) {
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to update official' }),
        { status: 500, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Official approved successfully' }),
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: corsHeaders }
    );
  }
});
