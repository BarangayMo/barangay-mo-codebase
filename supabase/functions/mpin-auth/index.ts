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

    // Create Supabase client with service role key
    const supabaseServiceRole = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify MPIN using database function first
    const { data: mpinValid, error: mpinError } = await supabaseServiceRole
      .rpc('verify_user_mpin', { 
        p_email: email, 
        p_mpin: mpin 
      });

    if (mpinError) {
      console.error('verify_user_mpin error:', mpinError);

      // Fallback: handle legacy MPINs that were stored with a simple hash
      const { data: legacyProfile, error: legacyFetchError } = await supabaseServiceRole
        .from('profiles')
        .select('id, mpin_hash')
        .eq('email', email)
        .maybeSingle();

      if (legacyFetchError) {
        console.error('Legacy profile fetch error:', legacyFetchError);
        return new Response(
          JSON.stringify({ error: 'Internal server error' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!legacyProfile) {
        return new Response(
          JSON.stringify({ error: 'User not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!legacyProfile.mpin_hash) {
        return new Response(
          JSON.stringify({ error: 'MPIN not set' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const stored = String(legacyProfile.mpin_hash);
      const isBcrypt = stored.startsWith('$2');

      // If it looks like bcrypt, then the RPC should have worked; report error
      if (isBcrypt) {
        return new Response(
          JSON.stringify({ error: 'Internal server error' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Simple legacy hash used previously on the client
      const simpleHash = (val: string) => {
        let hash = 0;
        for (let i = 0; i < val.length; i++) {
          hash = ((hash << 5) - hash) + val.charCodeAt(i);
          hash |= 0;
        }
        return hash.toString();
      };

      if (simpleHash(mpin) !== stored) {
        return new Response(
          JSON.stringify({ error: 'Invalid MPIN' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Legacy MPIN matched – create a session using the profile id
      const { data: legacySession, error: legacySessionError } = await supabaseServiceRole.auth.admin
        .createSession({ user_id: legacyProfile.id, session_data: {} });

      if (legacySessionError) {
        console.error('Legacy session creation error:', legacySessionError);
        return new Response(
          JSON.stringify({ error: 'Failed to create session' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          access_token: legacySession.session.access_token,
          refresh_token: legacySession.session.refresh_token,
          user: legacySession.user
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!mpinValid?.ok) {
      const reason = mpinValid?.reason;
      const map = {
        not_found: { status: 404, error: 'User not found' },
        not_set: { status: 400, error: 'MPIN not set' },
        locked: { status: 423, error: 'Account locked' },
        invalid: { status: 401, error: 'Invalid MPIN' },
      } as const;
      const res = map[reason as keyof typeof map] ?? { status: 401, error: 'Invalid MPIN' };
      return new Response(
        JSON.stringify({ error: res.error }), 
        { 
          status: res.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const userId = mpinValid.user_id;
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User not found' }), 
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create a session for the authenticated user
    const { data: sessionData, error: sessionError } = await supabaseServiceRole.auth.admin
      .createSession({
        user_id: userId,
        session_data: {}
      });

    if (sessionError) {
      console.error('Session creation error:', sessionError);
      return new Response(
        JSON.stringify({ error: 'Failed to create session' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Return session tokens for simple login
    return new Response(
      JSON.stringify({ 
        success: true,
        access_token: sessionData.session.access_token,
        refresh_token: sessionData.session.refresh_token,
        user: sessionData.user
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