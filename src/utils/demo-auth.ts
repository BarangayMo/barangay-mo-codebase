
import { supabase } from "@/integrations/supabase/client";

export const demoLogin = async (role: "resident" | "official" | "superadmin") => {
  console.log(`Attempting demo login for ${role} with email: demo.${role}@smartbarangay.ph`);
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: `demo.${role}@smartbarangay.ph`,
      password: "password123",
    });
    
    if (error) {
      console.error("Demo login error:", error.message);
      return { error };
    } else {
      console.log("Demo login successful:", data.user?.email);
      return { error: null };
    }
  } catch (error) {
    console.error("Unexpected demo login error:", error);
    return { error: error as Error };
  }
};
