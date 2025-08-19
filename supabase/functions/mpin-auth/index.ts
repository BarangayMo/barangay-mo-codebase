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
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    const supabaseServiceRole = createClient(
      supabaseUrl ?? '',
      serviceRoleKey ?? ''
    );

    // Verify MPIN using database function
    const { data: mpinValid, error: mpinError } = await supabaseServiceRole
      .rpc('verify_user_mpin', { 
        p_email: email, 
        p_mpin: mpin 
      });

    if (mpinError) {
      console.error('MPIN verification RPC failed:', mpinError);
      return new Response(
        JSON.stringify({ error: 'MPIN verification failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!mpinValid?.ok) {
      const reason = mpinValid?.reason;
      const errorMap = {
        not_found: 'User not found',
        not_set: 'MPIN not set',
        locked: 'Account locked',
        invalid: 'Invalid MPIN',
      } as const;
      const error = errorMap[reason as keyof typeof errorMap] ?? 'Invalid MPIN';
      
      return new Response(
        JSON.stringify({ error }), 
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // MPIN verified successfully
    return new Response(
      JSON.stringify({ success: true, user_id: mpinValid.user_id }),
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