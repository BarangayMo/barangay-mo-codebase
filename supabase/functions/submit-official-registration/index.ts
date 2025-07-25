import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

interface OfficialRegistrationData {
  first_name: string;
  middle_name?: string;
  last_name: string;
  suffix?: string;
  phone_number: string;
  landline_number?: string;
  email: string;
  position: string;
  password: string;
  barangay: string;
  municipality: string;
  province: string;
  region: string;
}

serve(async (req) => {
  console.log(`[${new Date().toISOString()}] ${req.method} request received`);
  
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
        JSON.stringify({ error: 'Method not allowed', method: req.method }),
        {
          status: 405,
          headers: corsHeaders,
        }
      );
    }

    console.log('Processing official registration submission');

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

    // Parse and validate request body
    let registrationData: OfficialRegistrationData;
    let rawBody: string = '';
    
    try {
      // Get raw body for logging
      const requestClone = req.clone();
      rawBody = await requestClone.text();
      console.log('Received body:', rawBody);
      
      registrationData = await req.json();
      console.log('Parsed data:', registrationData);
      
      console.log('Registration data received:', { 
        email: registrationData.email, 
        position: registrationData.position,
        barangay: registrationData.barangay,
        first_name: registrationData.first_name,
        last_name: registrationData.last_name
      });
    } catch (parseError) {
      console.error('Failed to parse request JSON:', parseError);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid JSON in request body',
          details: 'Request must contain valid JSON data'
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // Validate required fields - only core registration fields are required
    const requiredFields = [
      'first_name', 
      'last_name', 
      'email', 
      'phone_number', 
      'position'
    ];
    
    // Optional fields that can be null or undefined
    const optionalFields = [
      'middle_name',
      'suffix',
      'password',
      'barangay', 
      'municipality', 
      'province', 
      'region'
    ];
    
    // Check each required field individually for specific error messages
    const fieldValidationErrors = [];
    
    console.log('Validating required fields:', requiredFields);
    console.log('Optional fields accepted:', optionalFields);
    console.log('All received fields:', Object.keys(registrationData || {}));
    
    for (const field of requiredFields) {
      const value = registrationData[field as keyof OfficialRegistrationData];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        let fieldDisplayName = field.replace('_', ' ').toLowerCase();
        switch (field) {
          case 'first_name': fieldDisplayName = 'First Name'; break;
          case 'last_name': fieldDisplayName = 'Last Name'; break;
          case 'phone_number': fieldDisplayName = 'Phone Number'; break;
          case 'email': fieldDisplayName = 'Email'; break;
          case 'position': fieldDisplayName = 'Position'; break;
        }
        fieldValidationErrors.push({
          field: field,
          displayName: fieldDisplayName,
          message: `${fieldDisplayName} is required and cannot be empty`
        });
      }
    }
    
    if (fieldValidationErrors.length > 0) {
      console.error('400 Error - Missing required fields:');
      console.error('Raw input:', rawBody);
      console.error('Parsed data:', registrationData);
      console.error('Expected fields:', requiredFields);
      console.error('Field validation errors:', fieldValidationErrors);
      console.error('Received fields:', Object.keys(registrationData || {}));
      
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields', 
          fieldErrors: fieldValidationErrors,
          missingFields: fieldValidationErrors.map(err => err.field),
          receivedFields: Object.keys(registrationData || {}),
          expectedFields: requiredFields,
          message: `The following fields are required: ${fieldValidationErrors.map(err => err.displayName).join(', ')}`
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registrationData.email.trim())) {
      console.error('400 Error - Invalid email format:');
      console.error('Email provided:', registrationData.email);
      console.error('Email regex pattern:', emailRegex.source);
      
      return new Response(
        JSON.stringify({ 
          error: 'Invalid email format',
          message: 'Please enter a valid email address',
          emailProvided: registrationData.email
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // Check for existing official with same email OR same barangay+position combination
    console.log('Checking for existing registration with email:', registrationData.email);
    console.log('Checking for existing registration in barangay:', registrationData.barangay, 'with position:', registrationData.position);
    
    const { data: existingOfficial, error: checkError } = await supabaseAdmin
      .from('officials')
      .select('id, email, status, barangay, position')
      .or(`email.eq.${registrationData.email.trim()},and(barangay.eq.${registrationData.barangay?.trim()},position.eq.${registrationData.position.trim()})`)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing official:', checkError);
      return new Response(
        JSON.stringify({ 
          error: 'Database error',
          message: 'Unable to verify registration status. Please try again.'
        }),
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }

    if (existingOfficial) {
      console.log('Official already exists:', existingOfficial);
      
      let message = '';
      if (existingOfficial.email === registrationData.email.trim()) {
        message = `A registration with email ${registrationData.email} already exists with status: ${existingOfficial.status}`;
      } else {
        message = `An official with position "${registrationData.position}" already exists in barangay "${registrationData.barangay}" with status: ${existingOfficial.status}`;
      }
      
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Official already exists',
          message: message,
          status: existingOfficial.status
        }),
        {
          status: 409,
          headers: corsHeaders,
        }
      );
    }

    // Validate password strength only if password is provided
    if (registrationData.password && registrationData.password.length < 8) {
      console.error('400 Error - Password validation failed:');
      console.error('Password length:', registrationData.password?.length || 0);
      console.error('Minimum required length: 8');
      
      return new Response(
        JSON.stringify({ 
          error: 'Password too weak',
          message: 'Password must be at least 8 characters long',
          passwordLength: registrationData.password?.length || 0,
          minimumLength: 8
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // Check if email already exists in auth.users
    console.log('Checking if email already exists in auth.users:', registrationData.email);
    
    let existingAuthUser = null;
    try {
      const { data, error } = await supabaseAdmin.auth.admin.getUserByEmail(registrationData.email.trim());
      if (!error) {
        existingAuthUser = data;
      }
    } catch (authCheckError) {
      console.log('Email check completed - user not found (this is expected for new registrations)');
    }
    
    if (existingAuthUser?.user) {
      console.error('Email already exists in auth.users:', registrationData.email);
      return new Response(
        JSON.stringify({ 
          error: 'Email already registered',
          message: `The email ${registrationData.email} is already registered in the authentication system.`
        }),
        {
          status: 409,
          headers: corsHeaders,
        }
      );
    }

    // Create Supabase Auth user immediately
    console.log('Creating Supabase Auth user for:', registrationData.email);
    const createUserPayload = {
      email: registrationData.email.trim().toLowerCase(),
      password: registrationData.password,
      email_confirm: false, // Will send confirmation email
      user_metadata: {
        first_name: registrationData.first_name.trim(),
        middle_name: registrationData.middle_name?.trim() || null,
        last_name: registrationData.last_name.trim(),
        suffix: registrationData.suffix?.trim() || null,
        phone_number: registrationData.phone_number.trim(),
        landline_number: registrationData.landline_number?.trim() || null,
        position: registrationData.position.trim(),
        barangay: registrationData.barangay.trim(),
        municipality: registrationData.municipality.trim(),
        province: registrationData.province.trim(),
        region: registrationData.region.trim(),
        role: 'official',
        status: 'pending' // Store status in metadata for immediate access
      }
    };
    
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser(createUserPayload);

    if (authError) {
      console.error('Error creating Supabase Auth user:', authError);
      let errorMessage = 'Unable to create user account. ';
      let errorReason = authError.message || 'Unknown auth error';
      
      if (authError.message?.includes('already exists') || 
          authError.message?.includes('already registered') ||
          authError.message?.includes('User already registered') ||
          authError.message?.includes('email address is already taken') ||
          authError.message?.includes('Database error creating new user')) {
        errorMessage = 'This email is already registered.';
        errorReason = `The email ${registrationData.email} is already registered in the authentication system.`;
      } else if (authError.message?.includes('invalid') || authError.message?.includes('format')) {
        errorMessage += 'Invalid email format.';
        errorReason = 'The email format is invalid';
      } else {
        errorMessage += 'Please try again or contact support.';
      }
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to create user account',
          message: errorMessage,
          reason: errorReason
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    console.log('Supabase Auth user created successfully:', { 
      id: authUser.user.id, 
      email: authUser.user.email 
    });

    // Insert the official registration using service role (bypasses RLS)
    console.log('Inserting new official registration');
    const insertData = {
      first_name: registrationData.first_name.trim(),
      middle_name: registrationData.middle_name?.trim() || null,
      last_name: registrationData.last_name.trim(),
      suffix: registrationData.suffix?.trim() || null,
      phone_number: registrationData.phone_number.trim(),
      landline_number: registrationData.landline_number?.trim() || null,
      email: registrationData.email.trim().toLowerCase(),
      position: registrationData.position.trim(),
      barangay: registrationData.barangay.trim(),
      municipality: registrationData.municipality.trim(),
      province: registrationData.province.trim(),
      region: registrationData.region.trim(),
      status: 'pending',
      is_approved: false,
      user_id: authUser.user.id, // Link to the created Auth user
      submitted_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: newOfficial, error: insertError } = await supabaseAdmin
      .from('officials')
      .insert([insertData])
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting official registration:', insertError);
      console.error('Insert error code:', insertError.code);
      console.error('Insert error details:', insertError.details);
      
      // Handle duplicate key violations specifically
      if (insertError.code === '23505' || insertError.message?.includes('duplicate key')) {
        console.log('Duplicate key violation detected - cleaning up created auth user');
        
        // Cleanup: Delete the auth user we just created since DB insert failed
        try {
          await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
          console.log('Successfully cleaned up auth user:', authUser.user.id);
        } catch (cleanupError) {
          console.error('Failed to cleanup auth user:', cleanupError);
        }
        
        return new Response(
          JSON.stringify({ 
            success: false,
            error: 'Official already exists',
            message: 'An official with this email or position already exists in this barangay.',
            code: 'DUPLICATE_OFFICIAL'
          }),
          {
            status: 409,
            headers: corsHeaders,
          }
        );
      }
      
      // Handle other database errors
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Registration failed',
          message: 'Unable to submit registration. Please try again.',
          details: Deno.env.get('NODE_ENV') === 'development' ? insertError.message : undefined
        }),
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }

    console.log('Official registration created successfully:', {
      id: newOfficial.id,
      email: newOfficial.email,
      status: newOfficial.status
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Registration submitted successfully! Your application is now pending review.',
        data: {
          id: newOfficial.id,
          email: newOfficial.email,
          status: newOfficial.status,
          submitted_at: newOfficial.submitted_at
        }
      }),
      {
        status: 200,
        headers: corsHeaders,
      }
    );

  } catch (error) {
    console.error('Unexpected error in official registration:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: 'An unexpected error occurred. Please try again later.',
        details: Deno.env.get('NODE_ENV') === 'development' ? error.message : undefined
      }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
});