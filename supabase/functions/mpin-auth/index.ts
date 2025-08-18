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
    console.log('🔍 MPIN auth request started');
    const { email, mpin } = await req.json();
    console.log('📧 Request data:', { email, mpinLength: mpin?.length });

    if (!email || !mpin) {
      console.log('❌ Missing email or MPIN');
      return new Response(
        JSON.stringify({ error: 'Email and MPIN are required' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    console.log('🔑 Environment check:', { 
      hasUrl: !!supabaseUrl, 
      hasServiceKey: !!serviceRoleKey,
      urlPrefix: supabaseUrl?.substring(0, 20) + '...'
    });
    
    const supabaseServiceRole = createClient(
      supabaseUrl ?? '',
      serviceRoleKey ?? ''
    );
    console.log('✅ Supabase client created');

    // Verify MPIN using database function first
    console.log('🔐 Attempting MPIN verification via RPC');
    const { data: mpinValid, error: mpinError } = await supabaseServiceRole
      .rpc('verify_user_mpin', { 
        p_email: email, 
        p_mpin: mpin 
      });
    console.log('🔐 RPC result:', { mpinValid, mpinError });

    if (mpinError) {
      console.error('❌ verify_user_mpin RPC failed:', mpinError);
      console.log('🔄 Attempting legacy MPIN fallback');

      // Fallback: handle legacy MPINs that were stored with a simple hash
      const { data: legacyProfile, error: legacyFetchError } = await supabaseServiceRole
        .from('profiles')
        .select('id, mpin_hash')
        .eq('email', email)
        .maybeSingle();
      
      console.log('👤 Legacy profile lookup:', { 
        found: !!legacyProfile, 
        hasId: !!legacyProfile?.id,
        hasMpinHash: !!legacyProfile?.mpin_hash,
        mpinHashType: legacyProfile?.mpin_hash ? typeof legacyProfile.mpin_hash : 'none',
        error: legacyFetchError 
      });

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
      console.log('🔢 Calculating legacy hash for comparison');
      const simpleHash = (val: string) => {
        let hash = 0;
        for (let i = 0; i < val.length; i++) {
          hash = ((hash << 5) - hash) + val.charCodeAt(i);
          hash |= 0;
        }
        return hash.toString();
      };

      const calculatedHash = simpleHash(mpin);
      console.log('🔢 Hash comparison:', { 
        stored, 
        calculated: calculatedHash, 
        match: calculatedHash === stored 
      });

      if (calculatedHash !== stored) {
        console.log('❌ Legacy MPIN hash mismatch');
        return new Response(
          JSON.stringify({ error: 'Invalid MPIN' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Legacy MPIN matched – return success; client will restore session from stored tokens
      console.log('✅ Legacy MPIN matched. Returning success without server-side session');
      return new Response(
        JSON.stringify({ success: true, user_id: legacyProfile.id }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!mpinValid?.ok) {
      console.log('✅ RPC verification successful, creating session');
      const reason = mpinValid?.reason;
      const map = {
        not_found: { status: 404, error: 'User not found' },
        not_set: { status: 400, error: 'MPIN not set' },
        locked: { status: 423, error: 'Account locked' },
        invalid: { status: 401, error: 'Invalid MPIN' },
      } as const;
      const res = map[reason as keyof typeof map] ?? { status: 401, error: 'Invalid MPIN' };
      console.log('❌ RPC verification failed:', { reason, response: res });
      return new Response(
        JSON.stringify({ error: res.error }), 
        { 
          status: res.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('✅ MPIN verification successful, proceeding with session creation');
    const userId = mpinValid.user_id;
    console.log('👤 User ID from verification:', userId);
    if (!userId) {
      console.log('❌ No user ID returned from verification');
      return new Response(
        JSON.stringify({ error: 'User not found' }), 
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Success: return minimal response; session will be restored on client using stored tokens
    console.log('✅ MPIN verified. Returning success without server-side session');
    return new Response(
      JSON.stringify({ success: true, user_id: userId }),
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