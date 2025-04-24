
import { supabase } from "@/integrations/supabase/client";

export const demoLogin = async (role: 'official' | 'resident' | 'superadmin') => {
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

  const { email, password } = credentials[role];
  return await supabase.auth.signInWithPassword({ email, password });
};
