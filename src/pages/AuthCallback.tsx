import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type CallbackStatus = 'loading' | 'success' | 'error' | 'expired';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<CallbackStatus>('loading');
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      console.log("🔗 Auth callback triggered");
      
      try {
        // Get all URL parameters
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const type = searchParams.get('type');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        console.log("📝 Callback parameters:", {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          type,
          error,
          errorDescription
        });

        // Handle error cases first
        if (error) {
          console.error("❌ Auth callback error:", error, errorDescription);
          
          if (error === 'access_denied') {
            setStatus('error');
            setMessage('Email verification was cancelled or denied.');
          } else if (errorDescription?.includes('expired')) {
            setStatus('expired');
            setMessage('The verification link has expired. Please request a new one.');
          } else {
            setStatus('error');
            setMessage(errorDescription || 'Authentication failed. Please try again.');
          }
          return;
        }

        // Handle successful verification
        if (accessToken && refreshToken && type === 'signup') {
          console.log("✅ Email verification tokens received");
          
          // Set the session with the tokens
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (sessionError) {
            console.error("❌ Session error:", sessionError);
            setStatus('error');
            setMessage('Failed to confirm email verification. Please try again.');
            return;
          }

          if (data.user) {
            console.log("✅ Email verification successful for:", data.user.email);
            setUserEmail(data.user.email || '');
            setStatus('success');
            setMessage('Email verified successfully! Redirecting to your dashboard...');
            
            // Determine redirect path based on user role
            const userRole = data.user.user_metadata?.role || 'resident';
            const redirectPath = userRole === 'official' ? '/official-dashboard' : 
                               userRole === 'superadmin' ? '/admin' : '/resident-home';
            
            console.log("🔄 Redirecting verified user to:", redirectPath);
            
            // Redirect after a short delay
            setTimeout(() => {
              navigate(redirectPath, { replace: true });
            }, 2000);
          }
        } else {
          // Check if user is already authenticated
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user?.email_confirmed_at) {
            console.log("✅ User already verified, redirecting...");
            const userRole = session.user.user_metadata?.role || 'resident';
            const redirectPath = userRole === 'official' ? '/official-dashboard' : 
                               userRole === 'superadmin' ? '/admin' : '/resident-home';
            navigate(redirectPath, { replace: true });
          } else {
            console.log("🚫 No valid verification tokens found");
            setStatus('error');
            setMessage('Invalid verification link. Please try again or request a new verification email.');
          }
        }
      } catch (error) {
        console.error("💥 Unexpected callback error:", error);
        setStatus('error');
        setMessage('An unexpected error occurred during verification.');
      }
    };

    handleAuthCallback();
  }, [searchParams, navigate]);

  const handleRetry = () => {
    navigate('/email-verification', { replace: true });
  };

  const handleLogin = () => {
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {status === 'loading' && (
              <>
                <Loader2 className="w-16 h-16 text-red-600 animate-spin mx-auto" />
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-gray-900">Verifying your email...</h2>
                  <p className="text-gray-600">Please wait while we confirm your email address.</p>
                </div>
              </>
            )}

            {status === 'success' && (
              <>
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-gray-900">Email Verified!</h2>
                  <p className="text-gray-600">{message}</p>
                  {userEmail && (
                    <p className="text-sm text-gray-500">Welcome, {userEmail}!</p>
                  )}
                </div>
              </>
            )}

            {status === 'error' && (
              <>
                <AlertCircle className="w-16 h-16 text-red-600 mx-auto" />
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">Verification Failed</h2>
                  <p className="text-gray-600">{message}</p>
                  <div className="space-y-2">
                    <Button onClick={handleRetry} className="w-full">
                      Try Again
                    </Button>
                    <Button onClick={handleLogin} variant="outline" className="w-full">
                      Go to Login
                    </Button>
                  </div>
                </div>
              </>
            )}

            {status === 'expired' && (
              <>
                <AlertCircle className="w-16 h-16 text-amber-600 mx-auto" />
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">Link Expired</h2>
                  <p className="text-gray-600">{message}</p>
                  <Button onClick={handleRetry} className="w-full">
                    Request New Verification Email
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}