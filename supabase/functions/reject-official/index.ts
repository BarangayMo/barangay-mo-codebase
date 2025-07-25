import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

interface RejectionRequest {
  official_id: string;
  reason?: string;
}

serve(async (req) => {
  console.log(`[${new Date().toISOString()}] ${req.method} request received for reject-official`);
  
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
        JSON.stringify({ 
          success: false,
          error: 'Method not allowed', 
          reason: `Only POST requests are allowed, received ${req.method}`,
          method: req.method 
        }),
        {
          status: 405,
          headers: corsHeaders,
        }
      );
    }

    console.log('Processing official rejection request');

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

    // Parse request body
    let requestData: RejectionRequest;
    try {
      const rawBody = await req.text();
      console.log('Raw request body:', rawBody);
      
      if (!rawBody) {
        console.error('Empty request body received');
        return new Response(
          JSON.stringify({ 
            success: false,
            error: 'Empty request body',
            reason: 'Request body is required but was empty'
          }),
          {
            status: 400,
            headers: corsHeaders,
          }
        );
      }

      requestData = JSON.parse(rawBody);
      console.log('Parsed rejection request data:', requestData);
    } catch (parseError) {
      console.error('Failed to parse request JSON:', parseError);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Invalid JSON in request body',
          reason: 'Request must contain valid JSON data',
          details: parseError.message
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // Validate required fields
    if (!requestData.official_id || typeof requestData.official_id !== 'string') {
      console.error('Invalid or missing official_id in request:', requestData);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Missing or invalid required field: official_id',
          reason: 'Please provide a valid official ID to reject',
          received: requestData
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // Get the official record
    console.log('Fetching official record:', requestData.official_id);
    const { data: official, error: fetchError } = await supabaseAdmin
      .from('officials')
      .select('*')
      .eq('id', requestData.official_id)
      .single();

    if (fetchError) {
      console.error('Error fetching official:', fetchError);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Official not found',
          reason: 'The specified official registration could not be found',
          details: fetchError.message
        }),
        {
          status: 404,
          headers: corsHeaders,
        }
      );
    }

    if (!official) {
      console.error('Official not found:', requestData.official_id);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Official not found',
          reason: 'The specified official registration could not be found in database'
        }),
        {
          status: 404,
          headers: corsHeaders,
        }
      );
    }

    console.log('Official found:', { 
      id: official.id, 
      email: official.email, 
      status: official.status,
      user_id: official.user_id
    });

    // Check if official is already rejected
    if (official.status === 'rejected') {
      console.log('Official already rejected:', official.email);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Already rejected',
          reason: 'This official registration has already been rejected'
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // Delete or disable the Auth user if it exists
    if (official.user_id) {
      console.log('Deleting Auth user:', official.user_id);
      const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(official.user_id);
      
      if (deleteAuthError) {
        console.error('Error deleting Auth user:', deleteAuthError);
        // Continue with rejection even if auth user deletion fails
        console.log('Continuing with rejection despite auth deletion error');
      } else {
        console.log('Auth user deleted successfully');
      }
    } else {
      console.log('No Auth user to delete');
    }

    // Update official status to rejected
    console.log('Updating official status to rejected');
    const updateData = {
      status: 'rejected',
      is_approved: false,
      rejection_reason: requestData.reason || null,
      approved_by: null,
      approved_at: null,
      updated_at: new Date().toISOString()
    };
    
    console.log('Update data for official:', updateData);
    
    const { error: updateError } = await supabaseAdmin
      .from('officials')
      .update(updateData)
      .eq('id', requestData.official_id);

    if (updateError) {
      console.error('Error updating official status:', updateError);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Failed to reject official',
          reason: 'Unable to update official status in database',
          updateError: {
            message: updateError.message,
            code: updateError.code
          }
        }),
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }

    console.log('Official rejection completed successfully for:', official.email);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Official rejected successfully. The authentication account has been disabled.',
        data: {
          official_id: requestData.official_id,
          email: official.email,
          status: 'rejected',
          reason: requestData.reason || null
        }
      }),
      {
        status: 200,
        headers: corsHeaders,
      }
    );

  } catch (error) {
    console.error('Unexpected error in reject-official:', error);
    console.error('Error stack:', error.stack);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Internal server error',
        reason: 'An unexpected error occurred during the rejection process',
        message: 'Please try again later or contact support if the issue persists.',
        details: Deno.env.get('NODE_ENV') === 'development' ? {
          message: error.message,
          stack: error.stack
        } : undefined
      }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
});