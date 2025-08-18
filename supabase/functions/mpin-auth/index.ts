import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

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
    const { email, mpin } = await req.json();

    if (!email || !mpin) {
      return new Response(
        JSON.stringify({ error: 'Email and MPIN are required' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create Supabase client with service role key for admin operations
    const supabaseServiceRole = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify MPIN using the database function
    const { data: verifyResult, error: verifyError } = await supabaseServiceRole
      .rpc('verify_user_mpin', { 
        p_email: email, 
        p_mpin: mpin 
      });

    if (verifyError) {
      console.error('MPIN verification error:', verifyError);
      return new Response(
        JSON.stringify({ error: 'Authentication failed' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!verifyResult.ok) {
      // Return specific error based on reason
      const status = verifyResult.reason === 'locked' ? 429 : 401;
      return new Response(
        JSON.stringify({ 
          error: 'Authentication failed',
          reason: verifyResult.reason,
          remaining_attempts: verifyResult.remaining_attempts,
          locked_until: verifyResult.locked_until
        }), 
        { 
          status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get user profile to find auth user
    const { data: profile, error: profileError } = await supabaseServiceRole
      .from('profiles')
      .select('*')
      .eq('id', verifyResult.user_id)
      .single();

    if (profileError || !profile) {
      console.error('Profile lookup error:', profileError);
      return new Response(
        JSON.stringify({ error: 'User not found' }), 
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Find the auth user by email
    const { data: authUser, error: authError } = await supabaseServiceRole.auth.admin
      .listUsers();

    if (authError) {
      console.error('Auth user lookup error:', authError);
      return new Response(
        JSON.stringify({ error: 'Authentication service error' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const user = authUser.users.find(u => u.email === email);
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not found' }), 
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Generate a session for the user
    const { data: sessionData, error: sessionError } = await supabaseServiceRole.auth.admin
      .generateLink({
        type: 'magiclink',
        email: user.email!,
        options: {
          redirectTo: `${req.headers.get('origin') || Deno.env.get('SUPABASE_URL')}/`
        }
      });

    if (sessionError) {
      console.error('Session generation error:', sessionError);
      return new Response(
        JSON.stringify({ error: 'Failed to create session' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create a proper session token response
    return new Response(
      JSON.stringify({ 
        success: true,
        access_token: sessionData.properties?.access_token,
        refresh_token: sessionData.properties?.refresh_token,
        expires_in: sessionData.properties?.expires_in,
        user: {
          id: user.id,
          email: user.email,
          role: profile.role,
          ...profile
        }
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
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