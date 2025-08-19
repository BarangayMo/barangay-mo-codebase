import { supabase } from "@/integrations/supabase/client";

interface StoredCredentials {
  email: string;
  userId: string;
  password: string; // Encrypted with device key
  lastLoginTime: number;
  refreshToken: string;
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
  storeCredentials(email: string, userId: string, password: string, refreshToken: string): void {
    try {
      const deviceKey = getDeviceFingerprint();
      const encryptedPassword = encryptPassword(password, deviceKey);
      const credentials: StoredCredentials = {
        email,
        userId,
        password: encryptedPassword,
        lastLoginTime: Date.now(),
        refreshToken
      };
      localStorage.setItem(`mpin_creds_${deviceKey}`, JSON.stringify(credentials));
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
  async verifyMpinAndLogin(mpin: string): Promise<{ success: boolean; error?: string }> {
    try {
      const credentials = this.hasStoredCredentials();
      if (!credentials) {
        return { success: false, error: 'No stored credentials found' };
      }

      if (!credentials.refreshToken) {
        return { success: false, error: 'Refresh token missing in stored credentials' };
      }

  // Debug: print the email being sent
  console.log('MPIN Auth Request Email:', credentials.email);

      // Call edge function to verify MPIN
      const response = await fetch('https://lsygeaoqahfryyfvpxrk.supabase.co/functions/v1/mpin-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: credentials.email, 
          mpin,
          refresh_token: credentials.refreshToken
        }),
      });

      const result = await response.json();

      if (!result.success) {
        return { success: false, error: result.error || 'MPIN verification failed' };
      }

      // MPIN verified, now login with stored credentials
      const deviceKey = getDeviceFingerprint();
      const password = decryptPassword(credentials.password, deviceKey);

      if (!password) {
        return { success: false, error: 'Failed to decrypt stored password' };
      }

      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: password
      });

      if (loginError) {
        // If login fails, clear stored credentials as they might be invalid
        this.clearStoredCredentials();
        return { success: false, error: 'Stored credentials are invalid' };
      }

      return { success: true };
    } catch (error) {
      console.error('MPIN verification error:', error);
      return { success: false, error: 'Verification failed' };
    }
  }
};
