
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

  const { email, password } = credentials[role];
  return await supabase.auth.signInWithPassword({ email, password });
};
