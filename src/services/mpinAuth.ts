import { supabase } from "@/integrations/supabase/client";

export interface StoredCredentials {
  email: string;
  encryptedRefreshToken: string;
  userId: string;
  role: string;
  timestamp: number;
}

const STORAGE_KEY = 'smartbarangay_last_user';
const ENCRYPTION_KEY = 'sb_encrypt_key_v1'; // Simple encryption key for demo

// Simple encryption/decryption for local storage
const encrypt = (text: string): string => {
  return btoa(text); // Base64 encoding for demo (use proper encryption in production)
};

const decrypt = (encrypted: string): string => {
  try {
    return atob(encrypted);
  } catch {
    return '';
  }
};

export const mpinAuth = {
  // Store user credentials after successful login
  storeCredentials: async (email: string, refreshToken: string, userId: string, role: string) => {
    const credentials: StoredCredentials = {
      email,
      encryptedRefreshToken: encrypt(refreshToken),
      userId,
      role,
      timestamp: Date.now()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
  },

  // Get stored credentials if available
  getStoredCredentials: (): StoredCredentials | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      
      const credentials = JSON.parse(stored) as StoredCredentials;
      
      // Check if credentials are less than 30 days old
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;
      if (Date.now() - credentials.timestamp > thirtyDays) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      
      return credentials;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  },

  // Verify MPIN with stored user
  verifyMpin: async (mpin: string): Promise<{ success: boolean; error?: string; user?: any }> => {
    const credentials = mpinAuth.getStoredCredentials();
    if (!credentials) {
      return { success: false, error: 'No stored user found' };
    }

    try {
      // Call our database function to verify MPIN
      const { data, error } = await supabase.rpc('verify_user_mpin', {
        p_email: credentials.email,
        p_mpin: mpin
      });

      if (error) {
        console.error('MPIN verification error:', error);
        return { success: false, error: 'Verification failed' };
      }

      const result = data as any; // Type assertion for database function result
      if (!result.ok) {
        switch (result.reason) {
          case 'not_set':
            return { success: false, error: 'MPIN not set up' };
          case 'locked':
            return { success: false, error: `Account locked until ${new Date(result.locked_until).toLocaleTimeString()}` };
          case 'invalid':
            return { success: false, error: `Invalid MPIN. ${result.remaining_attempts} attempts remaining` };
          default:
            return { success: false, error: 'MPIN verification failed' };
        }
      }

      // MPIN verified, now restore session using stored refresh token
      const refreshToken = decrypt(credentials.encryptedRefreshToken);
      if (!refreshToken) {
        return { success: false, error: 'Invalid stored credentials' };
      }

      const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
        access_token: '', // Will be refreshed
        refresh_token: refreshToken
      });

      if (sessionError || !sessionData.user) {
        // Refresh token expired, clear storage
        localStorage.removeItem(STORAGE_KEY);
        return { success: false, error: 'Session expired, please login again' };
      }

      return { success: true, user: sessionData.user };
    } catch (error) {
      console.error('MPIN verification error:', error);
      return { success: false, error: 'Verification failed' };
    }
  },

  // Set MPIN for current user
  setMpin: async (mpin: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.rpc('set_user_mpin', { mpin_text: mpin });

      if (error) {
        console.error('MPIN setup error:', error);
        return { success: false, error: 'Failed to set MPIN' };
      }

      return { success: true };
    } catch (error) {
      console.error('MPIN setup error:', error);
      return { success: false, error: 'Failed to set MPIN' };
    }
  },

  // Check if user has MPIN set up
  hasMpinSetup: async (): Promise<boolean> => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('mpin_hash')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      return !!profile?.mpin_hash;
    } catch {
      return false;
    }
  },

  // Clear stored credentials
  clearStoredCredentials: () => {
    localStorage.removeItem(STORAGE_KEY);
  }
};