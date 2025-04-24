
import { supabase } from "@/integrations/supabase/client";

export const demoLogin = async (role: 'official' | 'resident' | 'superadmin') => {
  // These credentials should match exactly what's in the Supabase auth system
  const credentials = {
    official: {
      email: 'official.demo@barangaymo.ph',
      password: 'demo123456'
    },
    resident: {
      email: 'resident.demo@barangaymo.ph',
      password: 'demo123456'
    },
    superadmin: {
      email: 'admin.demo@barangaymo.ph',
      password: 'demo123456'
    }
  };

  try {
    const { email, password } = credentials[role];
    console.log(`Attempting demo login for ${role} with email: ${email}`);
    const response = await supabase.auth.signInWithPassword({ email, password });
    
    if (response.error) {
      console.error('Demo login error:', response.error.message);
    } else {
      console.log('Demo login successful');
    }
    
    return response;
  } catch (error) {
    console.error('Unexpected error in demo login:', error);
    throw error;
  }
};
