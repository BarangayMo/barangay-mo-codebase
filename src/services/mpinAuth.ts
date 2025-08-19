import { supabase } from "@/integrations/supabase/client";

export interface MPINVerifyResult {
  ok: boolean;
  reason?: 'invalid_request' | 'not_found' | 'not_set' | 'locked' | 'invalid';
  user_id?: string;
  remaining_attempts?: number;
  locked_until?: string;
}

export interface LastUserInfo {
  email: string;
  name: string;
  role: string;
  refreshToken?: string;
}

const LAST_USER_KEY = 'smartbarangay_last_user';

// Local storage helpers
export const storeLastUser = (userInfo: LastUserInfo): void => {
  try {
    localStorage.setItem(LAST_USER_KEY, JSON.stringify(userInfo));
  } catch (error) {
    console.warn('Failed to store last user info:', error);
  }
};

export const getLastUser = (): LastUserInfo | null => {
  try {
    const stored = localStorage.getItem(LAST_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.warn('Failed to get last user info:', error);
    return null;
  }
};

export const clearLastUser = (): void => {
  try {
    localStorage.removeItem(LAST_USER_KEY);
  } catch (error) {
    console.warn('Failed to clear last user info:', error);
  }
};

export const hasLastUser = (): boolean => {
  return getLastUser() !== null;
};

// MPIN functions
export const setMPIN = async (mpin: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase.rpc('set_user_mpin', { mpin_text: mpin });
    
    if (error) {
      console.error('Error setting MPIN:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Unexpected error setting MPIN:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
};

export const verifyMPIN = async (email: string, mpin: string): Promise<MPINVerifyResult> => {
  try {
    const { data, error } = await supabase.rpc('verify_user_mpin', {
      p_email: email,
      p_mpin: mpin
    });
    
    if (error) {
      console.error('Error verifying MPIN:', error);
      return { ok: false, reason: 'invalid_request' };
    }
    
    return data as unknown as MPINVerifyResult;
  } catch (error: any) {
    console.error('Unexpected error verifying MPIN:', error);
    return { ok: false, reason: 'invalid_request' };
  }
};

export const loginWithMPIN = async (email: string, mpin: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const verifyResult = await verifyMPIN(email, mpin);
    
    if (!verifyResult.ok) {
      if (verifyResult.reason === 'not_set') {
        return { success: false, error: 'MPIN not set up for this account' };
      } else if (verifyResult.reason === 'locked') {
        const lockedUntil = verifyResult.locked_until 
          ? new Date(verifyResult.locked_until).toLocaleTimeString()
          : '15 minutes';
        return { success: false, error: `Account locked until ${lockedUntil}` };
      } else if (verifyResult.reason === 'invalid') {
        const attempts = verifyResult.remaining_attempts || 0;
        return { success: false, error: `Invalid MPIN. ${attempts} attempts remaining.` };
      } else {
        return { success: false, error: 'MPIN verification failed' };
      }
    }
    
    // Get the last user's refresh token and attempt to restore session
    const lastUser = getLastUser();
    if (lastUser?.refreshToken) {
      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: lastUser.refreshToken
      });
      
      if (data.session && !error) {
        return { success: true };
      }
    }
    
    // If refresh failed, we need the user to login with email/password again
    return { success: false, error: 'Session expired. Please login with email and password.' };
    
  } catch (error: any) {
    console.error('Error in MPIN login:', error);
    return { success: false, error: 'Login failed. Please try again.' };
  }
};

export const hasMPINSetup = async (): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return false;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('mpin_hash')
      .eq('id', user.user.id)
      .single();
    
    if (error) {
      console.warn('Error checking MPIN setup:', error);
      return false;
    }
    
    return !!(data?.mpin_hash);
  } catch (error) {
    console.warn('Unexpected error checking MPIN setup:', error);
    return false;
  }
};