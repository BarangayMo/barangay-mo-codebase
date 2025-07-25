
import { supabase } from "@/integrations/supabase/client";

export const demoLogin = async (role: 'official' | 'resident' | 'superadmin') => {
  const credentials = {
    official: {
      email: 'demo.official@smartbarangay.ph',
      password: 'demo123456'
    },
    resident: {
      email: 'demo.resident@smartbarangay.ph',
      password: 'demo123456'
    },
    superadmin: {
      email: 'demo.admin@smartbarangay.ph',
      password: 'demo123456'
    }
  };

  try {
    const { email, password } = credentials[role];
    console.log(`🎮 Demo login attempt for ${role} with email: ${email}`);
    
    // Clear any existing session first
    await supabase.auth.signOut();
    
    const response = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });
    
    if (response.error) {
      console.error('❌ Demo login error:', response.error.message);
      return response;
    } else {
      console.log('✅ Demo login successful:', response.data.user?.email);
      return response;
    }
  } catch (error) {
    console.error('💥 Unexpected error in demo login:', error);
    throw error;
  }
};
