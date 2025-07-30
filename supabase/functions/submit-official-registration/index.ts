import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders });
    }

    const body = await req.json();

    // Validate required fields
    const required = ['first_name', 'last_name', 'email', 'password', 'barangay', 'municipality', 'province', 'region', 'phone_number', 'position'];
    for (const field of required) {
      if (!body[field] || typeof body[field] !== 'string' || body[field].trim() === '') {
        return new Response(JSON.stringify({ error: `Missing or invalid field: ${field}` }), { status: 400, headers: corsHeaders });
      }
    }

    // Create Supabase admin client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 1. Create Auth user
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true,
      user_metadata: {
        first_name: body.first_name,
        last_name: body.last_name,
        middle_name: body.middle_name,
        suffix: body.suffix,
        phone_number: body.phone_number,
        landline_number: body.landline_number,
        barangay: body.barangay,
        municipality: body.municipality,
        province: body.province,
        region: body.region,
        role: 'resident',
        position: body.position
      }
    });

    if (authError) {
      return new Response(JSON.stringify({ error: 'Failed to create user', details: authError.message }), { status: 400, headers: corsHeaders });
    }

    // 2. Insert into officials (approved)
    const { error: officialError } = await supabase.from('officials').insert([{
      user_id: authUser.user.id,
      email: body.email,
      first_name: body.first_name,
      last_name: body.last_name,
      middle_name: body.middle_name,
      suffix: body.suffix,
      phone_number: body.phone_number,
      landline_number: body.landline_number,
      barangay: body.barangay,
      municipality: body.municipality,
      province: body.province,
      region: body.region,
      position: body.position,
      status: 'approved',
      is_approved: true,
      approved_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }]);

    if (officialError) {
      // Clean up auth user if official insert fails
      await supabase.auth.admin.deleteUser(authUser.user.id);
      return new Response(JSON.stringify({ error: 'Failed to insert official', details: officialError.message }), { status: 400, headers: corsHeaders });
    }

    // 3. Insert into profiles (approved resident)
    const { error: profileError } = await supabase.from('profiles').insert([{
      id: authUser.user.id,
      email: body.email,
      first_name: body.first_name,
      last_name: body.last_name,
      middle_name: body.middle_name,
      suffix: body.suffix,
      phone_number: body.phone_number,
      landline_number: body.landline_number,
      barangay: body.barangay,
      municipality: body.municipality,
      province: body.province,
      region: body.region,
      role: 'resident',
      is_approved: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }]);

    if (profileError) {
      // Clean up everything if profile insert fails
      await supabase.from('officials').delete().eq('user_id', authUser.user.id);
      await supabase.auth.admin.deleteUser(authUser.user.id);
      return new Response(JSON.stringify({ error: 'Failed to insert profile', details: profileError.message }), { status: 400, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ success: true, message: 'Registration successful. You can now log in.' }), { status: 200, headers: corsHeaders });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error', details: error.message || error }), { status: 500, headers: corsHeaders });
  }
});
