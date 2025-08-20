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
      console.log('🔍 Checking stored credentials with device key:', deviceKey.substring(0, 8) + '...');
      
      const stored = localStorage.getItem(`mpin_creds_${deviceKey}`);
      console.log('📦 Raw stored data found:', !!stored);
      
      if (stored) {
        const credentials = JSON.parse(stored) as StoredCredentials;
        console.log('📋 Parsed credentials:', {
          email: credentials.email,
          userId: credentials.userId?.substring(0, 8) + '...',
          hasPassword: !!credentials.password,
          passwordLength: credentials.password?.length,
          hasRefreshToken: !!credentials.refreshToken,
          refreshTokenLength: credentials.refreshToken?.length,
          lastLoginTime: new Date(credentials.lastLoginTime).toISOString(),
          isValid: Date.now() - credentials.lastLoginTime < 7 * 24 * 60 * 60 * 1000
        });
        
        // Check if credentials are not too old (7 days)
        const isValid = Date.now() - credentials.lastLoginTime < 7 * 24 * 60 * 60 * 1000;
        if (!isValid) {
          console.log('⚠️ Stored credentials expired');
        }
        return isValid ? credentials : null;
      }
      console.log('❌ No stored credentials found');
      return null;
    } catch (error) {
      console.error('❌ Error checking stored credentials:', error);
      return null;
    }
  },

  // Store credentials after successful login
  storeCredentials(email: string, userId: string, password: string, refreshToken: string): void {
    try {
      // Validate refresh token before storing (more lenient now)
      if (!refreshToken || refreshToken.length < 10) {
        console.warn('⚠️ Refresh token seems short but storing anyway:', refreshToken?.length || 0);
      }

      const deviceKey = getDeviceFingerprint();
      console.log('💾 Storing credentials:', {
        email,
        userId: userId.substring(0, 8) + '...',
        hasPassword: !!password,
        passwordLength: password.length,
        hasRefreshToken: !!refreshToken,
        refreshTokenLength: refreshToken.length,
        deviceKey: deviceKey.substring(0, 8) + '...'
      });
      
      const encryptedPassword = encryptPassword(password, deviceKey);
      const credentials: StoredCredentials = {
        email,
        userId,
        password: encryptedPassword,
        lastLoginTime: Date.now(),
        refreshToken
      };
      
      const storageKey = `mpin_creds_${deviceKey}`;
      localStorage.setItem(storageKey, JSON.stringify(credentials));
      console.log('✅ Credentials stored successfully with key:', storageKey.substring(0, 20) + '...');
      
      // Verify storage worked
      const verification = localStorage.getItem(storageKey);
      if (verification) {
        const parsed = JSON.parse(verification);
        console.log('🔍 Storage verification passed, token length:', parsed.refreshToken.length);
      }
    } catch (e) {
      console.error('❌ Failed to store credentials:', e);
      throw e; // Re-throw to let caller know storage failed
    }
  },

  // Clear stored credentials
  clearStoredCredentials(): void {
    try {
      const deviceKey = getDeviceFingerprint();
      const storageKey = `mpin_creds_${deviceKey}`;
      console.log('🗑️ Clearing stored credentials with key:', storageKey.substring(0, 20) + '...');
      localStorage.removeItem(storageKey);
      console.log('✅ Credentials cleared');
    } catch (e) {
      console.warn('⚠️ Failed to clear credentials:', e);
    }
  },

  // Verify MPIN and login
  async verifyMpinAndLogin(mpin: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🔐 Starting MPIN verification process...');
      
      const credentials = this.hasStoredCredentials();
      if (!credentials) {
        console.log('❌ No valid stored credentials found');
        return { success: false, error: 'No stored credentials found. Please set up MPIN first.' };
      }

      console.log('📤 Verifying MPIN for user:', credentials.email);

      // First, verify the MPIN using the database function
      const { data: verifyResult, error: verifyError } = await supabase.rpc('verify_user_mpin', {
        p_email: credentials.email,
        p_mpin: mpin
      });

      console.log('📋 MPIN verification result:', { verifyResult, verifyError });

      if (verifyError) {
        console.error('❌ MPIN verification error:', verifyError);
        return { success: false, error: 'MPIN verification failed' };
      }

      // Type guard and validation for the result
      const result = verifyResult as any;
      if (!result || !result.ok) {
        let errorMessage = 'Invalid MPIN';
        
        if (result && typeof result === 'object') {
          if (result.reason === 'locked') {
            errorMessage = 'Account locked due to too many failed attempts';
          } else if (result.reason === 'not_found') {
            errorMessage = 'User not found';
          } else if (result.reason === 'not_set') {
            errorMessage = 'MPIN not set. Please set up MPIN first.';
          } else if (result.reason === 'invalid') {
            const remaining = result.remaining_attempts || 0;
            errorMessage = `Invalid MPIN. ${remaining} attempts remaining.`;
          }
        }

        return { success: false, error: errorMessage };
      }

      // MPIN verified successfully! Now log in with stored password
      console.log('✅ MPIN verified! Attempting login with stored credentials...');
      
      const deviceKey = getDeviceFingerprint();
      const password = decryptPassword(credentials.password, deviceKey);

      if (!password) {
        console.log('❌ Failed to decrypt stored password');
        this.clearStoredCredentials();
        return { success: false, error: 'Failed to decrypt password. Please set up MPIN again.' };
      }

      // Log in with email and password
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: password
      });

      if (loginError) {
        console.error('❌ Login error:', loginError);
        
        // If password is wrong, clear stored credentials
        if (loginError.message?.includes('Invalid login credentials')) {
          this.clearStoredCredentials();
          return { success: false, error: 'Stored password is invalid. Please set up MPIN again.' };
        }
        
        return { success: false, error: loginError.message || 'Login failed' };
      }

      if (loginData.session && loginData.user) {
        console.log('✅ MPIN login successful for user:', loginData.user.email);
        
        // Update stored credentials with fresh refresh token
        try {
          this.storeCredentials(
            credentials.email,
            credentials.userId,
            password, // Use the decrypted password
            loginData.session.refresh_token
          );
          console.log('🔄 Updated stored credentials with fresh token');
        } catch (e) {
          console.warn('⚠️ Failed to update credentials, but login was successful:', e);
        }
        
        return { success: true };
      }

      return { success: false, error: 'Login succeeded but no session created' };
      
    } catch (error) {
      console.error('💥 MPIN verification error:', error);
      return { success: false, error: 'Verification failed' };
    }
  }
};
