import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.4.1/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, mpin, refresh_token } = await req.json();

    if (!email || !mpin || !refresh_token) {
      return new Response(
        JSON.stringify({ error: 'Email, MPIN and refresh token are required' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    const supabaseServiceRole = createClient(
      supabaseUrl ?? '',
      serviceRoleKey ?? ''
    );

    // Get user profile and verify MPIN - use maybeSingle to avoid errors
    console.log('Looking up user profile for email:', email);
    const { data: profile, error: profileError } = await supabaseServiceRole
      .from('profiles')
      .select('id, mpin_hash, mpin_attempts, mpin_locked_until')
      .eq('email', email)
      .maybeSingle();
    
    console.log('Profile lookup result:', { profile, profileError });

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if account is locked
    if (profile.mpin_locked_until && new Date(profile.mpin_locked_until) > new Date()) {
      return new Response(
        JSON.stringify({ error: 'Account locked', lockExpiry: profile.mpin_locked_until }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify MPIN
    if (!profile.mpin_hash) {
      return new Response(
        JSON.stringify({ error: 'MPIN not set' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const isValid = await bcrypt.compare(mpin, profile.mpin_hash);

    if (!isValid) {
      // Increment attempts and possibly lock account
      const attempts = (profile.mpin_attempts || 0) + 1;
      const updates: any = { mpin_attempts: attempts };
      
      if (attempts >= 5) {
        // Lock for 30 minutes after 5 failed attempts
        updates.mpin_locked_until = new Date(Date.now() + 30 * 60 * 1000).toISOString();
      }

      await supabaseServiceRole
        .from('profiles')
        .update(updates)
        .eq('id', profile.id);

      return new Response(
        JSON.stringify({ error: 'Invalid MPIN', attempts_remaining: 5 - attempts }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Reset attempts on successful verification
    await supabaseServiceRole
      .from('profiles')
      .update({ 
        mpin_attempts: 0,
        mpin_locked_until: null
      })
      .eq('id', profile.id);

    // Exchange refresh token for new session
    const { data: { session }, error: sessionError } = await supabaseServiceRole.auth.refreshSession({
      refresh_token
    });

    if (sessionError) {
      return new Response(
        JSON.stringify({ error: 'session_expired' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        session
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('MPIN auth error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
