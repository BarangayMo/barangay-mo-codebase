
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("🔍 Edge function called - Method:", req.method);
  console.log("🔍 Request URL:", req.url);
  console.log("🔍 Request headers:", Object.fromEntries(req.headers.entries()));
  console.log("🔍 Function is now PUBLIC (verify_jwt = false)");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("✅ Handling CORS preflight request");
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("📥 Parsing request body...");
    const requestBody = await req.json();
    console.log("📥 Request body received:", requestBody);
    
    const { keyName } = requestBody;

    if (!keyName) {
      console.error("❌ No keyName provided in request");
      return new Response(
        JSON.stringify({ error: "keyName is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("🔑 Looking for API key:", keyName);
    
    // Debug: Check Deno environment
    console.log("🔍 Deno.env availability:", typeof Deno.env);
    console.log("🔍 Deno.env.get function:", typeof Deno.env.get);
    
    // List all available environment variables (safely)
    try {
      const envObject = Deno.env.toObject();
      const envKeys = Object.keys(envObject);
      console.log("🔍 Total environment variables found:", envKeys.length);
      console.log("🔍 Available environment keys:", envKeys.filter(key => 
        !key.toLowerCase().includes('password') && 
        !key.toLowerCase().includes('secret') &&
        !key.toLowerCase().includes('private')
      ));
      
      // Check if our specific key exists
      const hasMapboxKey = envKeys.includes(keyName);
      console.log(`🔍 ${keyName} exists in environment:`, hasMapboxKey);
      
    } catch (envError) {
      console.error("❌ Error accessing environment:", envError);
    }
    
    // Get the API key from Supabase secrets
    const apiKey = Deno.env.get(keyName);
    
    if (!apiKey) {
      console.error(`❌ API key ${keyName} not found in environment`);
      
      // Provide more debugging information
      const allKeys = Object.keys(Deno.env.toObject());
      const possibleKeys = allKeys.filter(key => 
        key.includes('MAPBOX') || 
        key.includes('API') || 
        key.includes('TOKEN') || 
        key.includes('KEY')
      );
      
      console.log("🔍 Possible related keys found:", possibleKeys);
      
      return new Response(
        JSON.stringify({ 
          error: `API key ${keyName} not found`,
          debugInfo: {
            totalEnvVars: allKeys.length,
            possibleKeys: possibleKeys,
            searchedFor: keyName
          }
        }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("✅ API key found successfully");
    console.log("🔑 API key length:", apiKey.length);
    console.log("🔑 API key preview:", apiKey.substring(0, 10) + "...");

    // Validate the API key format for Mapbox
    if (keyName === 'MAPBOX_PUBLIC_TOKEN') {
      if (!apiKey.startsWith('pk.')) {
        console.error("❌ Invalid Mapbox API key format - should start with 'pk.'");
        return new Response(
          JSON.stringify({ 
            error: "Invalid Mapbox API key format - should start with 'pk.'",
            keyPreview: apiKey.substring(0, 10) + "...",
            expectedFormat: "pk.xxxxxxxx..."
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      console.log("✅ Mapbox API key format validation passed");
    }

    console.log("🎉 Returning API key successfully");
    return new Response(
      JSON.stringify({ 
        apiKey,
        success: true,
        keyName: keyName,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("❌ Error in edge function:", error);
    console.error("❌ Error message:", error.message);
    console.error("❌ Error stack:", error.stack);
    console.error("❌ Error name:", error.name);
    
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        details: error.message,
        errorType: error.name,
        timestamp: new Date().toISOString(),
        debugInfo: "Check function logs for detailed error information"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
