import { supabase } from "@/integrations/supabase/client";

interface StoredCredentials {
  email: string;
  userId: string;
  password: string; // Encrypted with device key
  lastLoginTime: number;
}

interface MPINVerifyResult {
  ok: boolean;
  reason?: string;
  remaining_attempts?: number;
  locked_until?: string;
  user_id?: string;
}

// Device fingerprint for security
function getDeviceFingerprint(): string {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx!.textBaseline = 'top';
    ctx!.font = '14px Arial';
    ctx!.fillText('Device fingerprint', 2, 2);
    return btoa(
      navigator.userAgent +
      navigator.language +
      screen.width + 'x' + screen.height +
      new Date().getTimezoneOffset() +
      canvas.toDataURL()
    ).substring(0, 32);
  } catch (e) {
    return btoa(navigator.userAgent).substring(0, 16);
  }
}

// Simple encryption for demo purposes (use proper encryption in production)
function encryptPassword(password: string, deviceKey: string): string {
  const combined = password + deviceKey;
  return btoa(combined);
}

function decryptPassword(encrypted: string, deviceKey: string): string {
  try {
    const decoded = atob(encrypted);
    return decoded.replace(deviceKey, '');
  } catch {
    return '';
  }
}

export const mpinAuthService = {
  // Check if device has stored credentials
  hasStoredCredentials(): StoredCredentials | null {
    try {
      const deviceKey = getDeviceFingerprint();
      const stored = localStorage.getItem(`mpin_creds_${deviceKey}`);
      if (stored) {
        const credentials = JSON.parse(stored) as StoredCredentials;
        // Check if credentials are not too old (7 days)
        const isValid = Date.now() - credentials.lastLoginTime < 7 * 24 * 60 * 60 * 1000;
        return isValid ? credentials : null;
      }
      return null;
    } catch {
      return null;
    }
  },

  // Store credentials after successful login
  storeCredentials(email: string, userId: string, password: string, refreshToken?: string): void {
    try {
      const deviceKey = getDeviceFingerprint();
      const encryptedPassword = encryptPassword(password, deviceKey);
      const credentials: StoredCredentials = {
        email,
        userId,
        password: encryptedPassword,
        lastLoginTime: Date.now()
      };
      localStorage.setItem(`mpin_creds_${deviceKey}`, JSON.stringify(credentials));
      
      // Store refresh token separately for MPIN login
      if (refreshToken) {
        localStorage.setItem(`refresh_token_${userId}`, refreshToken);
      }
    } catch (e) {
      console.warn('Failed to store credentials:', e);
    }
  },

  // Clear stored credentials
  clearStoredCredentials(): void {
    try {
      const deviceKey = getDeviceFingerprint();
      localStorage.removeItem(`mpin_creds_${deviceKey}`);
    } catch (e) {
      console.warn('Failed to clear credentials:', e);
    }
  },

  // Verify MPIN and login
  async verifyMpinAndLogin(mpin: string): Promise<{ success: boolean; error?: string; session?: any }> {
    try {
      const credentials = this.hasStoredCredentials();
      if (!credentials) {
        return { success: false, error: 'No stored credentials found' };
      }

      // Get stored refresh token
      const refreshToken = localStorage.getItem(`refresh_token_${credentials.userId}`);
      if (!refreshToken) {
        return { success: false, error: 'No refresh token found' };
      }

      // Call database function directly to verify MPIN
      const { data: verifyResult, error: verifyError } = await supabase.rpc('verify_user_mpin', {
        p_email: credentials.email,
        p_mpin: mpin
      });

      if (verifyError) {
        console.error('MPIN verification error:', verifyError);
        return { success: false, error: 'Verification failed' };
      }

      const result = verifyResult as unknown as MPINVerifyResult;
      if (!result.ok) {
        const reason = result.reason;
        if (reason === 'not_set') {
          return { success: false, error: 'MPIN not set' };
        } else if (reason === 'not_found') {
          return { success: false, error: 'User not found' };
        } else if (reason === 'invalid') {
          const remaining = result.remaining_attempts || 0;
          return { success: false, error: `Invalid MPIN. ${remaining} attempts remaining.` };
        } else if (reason === 'locked') {
          return { success: false, error: 'Account locked due to too many failed attempts' };
        } else {
          return { success: false, error: 'MPIN verification failed' };
        }
      }

      // MPIN verified, now restore session using refresh token
      const { data: sessionData, error: sessionError } = await supabase.auth.refreshSession({
        refresh_token: refreshToken
      });

      if (sessionError) {
        // If refresh fails, clear stored credentials
        this.clearStoredCredentials();
        localStorage.removeItem(`refresh_token_${credentials.userId}`);
        return { success: false, error: 'Session expired. Please login again.' };
      }

      return { success: true, session: sessionData.session };
    } catch (error) {
      console.error('MPIN verification error:', error);
      return { success: false, error: 'Verification failed' };
    }
  }
};