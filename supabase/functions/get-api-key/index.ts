
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("🔍 Edge function called - Method:", req.method);
  console.log("🔍 Request URL:", req.url);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("✅ Handling CORS preflight request");
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("📥 Parsing request body...");
    const requestBody = await req.json();
    console.log("📥 Request body:", requestBody);
    
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
    
    // Get the API key from Supabase secrets
    const apiKey = Deno.env.get(keyName);
    
    console.log("🔑 API key found:", !!apiKey);
    console.log("🔑 API key length:", apiKey ? apiKey.length : 0);
    console.log("🔑 API key starts with:", apiKey ? apiKey.substring(0, 10) + "..." : "N/A");

    if (!apiKey) {
      console.error(`❌ API key ${keyName} not found in environment`);
      console.log("🔍 Available environment variables:", Object.keys(Deno.env.toObject()));
      return new Response(
        JSON.stringify({ error: `API key ${keyName} not found` }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("✅ Successfully returning API key");
    return new Response(
      JSON.stringify({ apiKey }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("❌ Error in edge function:", error);
    console.error("❌ Error stack:", error.stack);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
