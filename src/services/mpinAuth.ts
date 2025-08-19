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
      console.log('🔍 Storage verification:', !!verification);
    } catch (e) {
      console.error('❌ Failed to store credentials:', e);
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
        return { success: false, error: 'No stored credentials found' };
      }

      if (!credentials.refreshToken) {
        console.log('❌ No refresh token in stored credentials');
        return { success: false, error: 'Refresh token missing in stored credentials' };
      }

      // Debug: Check current session state
      const { data: currentSession } = await supabase.auth.getSession();
      console.log('🔍 Current session state:', {
        hasSession: !!currentSession.session,
        sessionUserId: currentSession.session?.user?.id?.substring(0, 8) + '...',
        sessionEmail: currentSession.session?.user?.email,
        accessTokenLength: currentSession.session?.access_token?.length,
        refreshTokenLength: currentSession.session?.refresh_token?.length,
        storedRefreshTokenLength: credentials.refreshToken.length,
        tokensMatch: currentSession.session?.refresh_token === credentials.refreshToken
      });

      // Check if we should use current session's refresh token instead
      let refreshTokenToUse = credentials.refreshToken;
      if (currentSession.session?.refresh_token && 
          currentSession.session.user?.email === credentials.email) {
        console.log('🔄 Using current session refresh token instead of stored one');
        refreshTokenToUse = currentSession.session.refresh_token;
      }

      console.log('📤 MPIN Auth Request Details:', {
        email: credentials.email,
        mpinLength: mpin.length,
        refreshTokenLength: refreshTokenToUse.length,
        refreshTokenStart: refreshTokenToUse.substring(0, 10) + '...',
        refreshTokenEnd: '...' + refreshTokenToUse.substring(refreshTokenToUse.length - 10)
      });

      // Call edge function to verify MPIN
      const response = await fetch('https://lsygeaoqahfryyfvpxrk.supabase.co/functions/v1/mpin-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: credentials.email, 
          mpin,
          refresh_token: refreshTokenToUse
        }),
      });

      console.log('📥 Edge function response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      const result = await response.json();
      console.log('📋 Edge function result:', {
        success: result.success,
        error: result.error,
        hasSession: !!result.session
      });

      if (!result.success) {
        // If refresh token is invalid, clear credentials and require re-login
        if (result.error === 'refresh_token_expired' || result.error === 'Invalid or expired refresh token') {
          console.log('🔄 Refresh token expired, clearing stored credentials...');
          this.clearStoredCredentials();
          return { success: false, error: 'Session expired. Please log in again to set up MPIN.' };
        }
        
        // Try to update refresh token if we have a current session
        if (result.error === 'session_expired' && currentSession.session?.refresh_token) {
          console.log('🔄 Updating stored credentials with current session...');
          this.storeCredentials(
            credentials.email,
            credentials.userId,
            credentials.password,
            currentSession.session.refresh_token
          );
          return { success: false, error: 'Refresh token updated. Please try again.' };
        }
        
        return { success: false, error: result.error || 'MPIN verification failed' };
      }

      // MPIN verified, now login with stored credentials
      const deviceKey = getDeviceFingerprint();
      const password = decryptPassword(credentials.password, deviceKey);

      if (!password) {
        console.log('❌ Failed to decrypt stored password');
        return { success: false, error: 'Failed to decrypt stored password' };
      }

      console.log('🔐 Attempting Supabase login with decrypted credentials...');
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: password
      });

      if (loginError) {
        console.error('❌ Supabase login error:', loginError);
        // If login fails, clear stored credentials as they might be invalid
        this.clearStoredCredentials();
        return { success: false, error: 'Stored credentials are invalid' };
      }

      console.log('✅ MPIN login successful!');
      return { success: true };
    } catch (error) {
      console.error('💥 MPIN verification error:', error);
      return { success: false, error: 'Verification failed' };
    }
  }
};
