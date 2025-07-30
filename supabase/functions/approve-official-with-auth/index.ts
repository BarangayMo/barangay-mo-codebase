import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  console.log('✅ Edge function called');

  try {
    if (req.method !== 'POST') {
      console.log('❌ Method not allowed:', req.method);
      return new Response(
        JSON.stringify({ success: false, error: 'Method not allowed' }),
        { status: 405, headers: corsHeaders }
      );
    }

    const requestData = await req.json();
    console.log('📦 Request body:', requestData);

    if (!requestData.official_id) {
      console.log('❌ Missing official_id in request body');
      return new Response(
        JSON.stringify({ success: false, error: 'Missing official_id' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('🔐 Supabase admin client initialized');

    // Get official
    const { data: official, error: fetchError } = await supabaseAdmin
      .from('officials')
      .select('*')
      .eq('id', requestData.official_id)
      .single();

    if (fetchError || !official) {
      console.log('❌ Official not found:', fetchError);
      return new Response(
        JSON.stringify({ success: false, error: 'Official not found' }),
        { status: 404, headers: corsHeaders }
      );
    }

    console.log('👤 Official fetched:', official.email);

    if (official.status === 'approved') {
      console.log('ℹ️ Official already approved');
      return new Response(
        JSON.stringify({ success: false, error: 'Already approved' }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (!official.original_password) {
      console.log('❌ No password found for official');
      return new Response(
        JSON.stringify({ success: false, error: 'No password found' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Check existing user
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers.users.find(u => u.email === official.email);

    console.log(existingUser
      ? '🔁 Existing user found in Auth'
      : '🆕 Creating new user in Auth');

    let authUser;

    if (existingUser) {
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
        console.log('❌ Failed to create user:', authError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to create user' }),
          { status: 500, headers: corsHeaders }
        );
      }

      authUser = newUser;
    }

    console.log('✅ Auth user ready:', authUser.user.id);

    // Update profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: authUser.user.id,
        email: official.email,
        first_name: official.first_name,
        last_name: official.last_name,
        role: 'official',
        is_approved: true
      });

    if (profileError) {
      console.log('❌ Failed to update profile:', profileError);
    } else {
      console.log('✅ Profile updated');
    }

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
      console.log('❌ Failed to update official row:', updateError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to update official' }),
        { status: 500, headers: corsHeaders }
      );
    }

    console.log('🎉 Official approved successfully');

    return new Response(
      JSON.stringify({ success: true, message: 'Official approved successfully' }),
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error('❌ Internal error caught:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: corsHeaders }
    );
  }
});
