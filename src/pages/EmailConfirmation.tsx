
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2, AlertTriangle } from "lucide-react";

export default function EmailConfirmation() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check URL hash for auth callback data or errors
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        // Check for error parameters first
        const error = hashParams.get('error');
        const errorCode = hashParams.get('error_code');
        const errorDescription = hashParams.get('error_description');

        if (error) {
          console.log('Auth callback error:', { error, errorCode, errorDescription });
          
          if (errorCode === 'otp_expired') {
            setStatus('expired');
            setMessage('Your email confirmation link has expired. Please request a new confirmation email.');
          } else {
            setStatus('error');
            setMessage(errorDescription ? decodeURIComponent(errorDescription.replace(/\+/g, ' ')) : 'Authentication failed');
          }
          return;
        }

        // Check for successful auth tokens
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const tokenType = hashParams.get('token_type');
        const type = hashParams.get('type');

        console.log('Auth callback params:', { accessToken: !!accessToken, refreshToken: !!refreshToken, type });

        if (accessToken && refreshToken && type === 'signup') {
          // Set the session using the tokens from the URL
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (sessionError) {
            console.error('Session setting error:', sessionError);
            setStatus('error');
            setMessage(sessionError.message);
            return;
          }

          if (data.session?.user) {
            console.log('User authenticated successfully:', data.session.user.email);
            setStatus('success');
            setMessage('Email confirmed successfully! Redirecting to your dashboard...');
            
            // Determine user role and redirect
            const userRole = data.session.user.user_metadata?.role || 'resident';
            const redirectPath = userRole === 'official' 
              ? '/official-dashboard' 
              : userRole === 'superadmin' 
              ? '/admin' 
              : '/resident-home';

            // Show success message briefly before redirecting
            setTimeout(() => {
              navigate(redirectPath, { replace: true });
            }, 2000);
          } else {
            setStatus('error');
            setMessage('Authentication failed. Please try registering again.');
          }
        } else {
          // Try to get existing session
          const { data, error: sessionError } = await supabase.auth.getSession();

          if (sessionError) {
            console.error('Session error:', sessionError);
            setStatus('error');
            setMessage(sessionError.message);
            return;
          }

          if (data.session?.user) {
            console.log('Existing session found:', data.session.user.email);
            setStatus('success');
            setMessage('Already authenticated! Redirecting to your dashboard...');
            
            const userRole = data.session.user.user_metadata?.role || 'resident';
            const redirectPath = userRole === 'official' 
              ? '/official-dashboard' 
              : userRole === 'superadmin' 
              ? '/admin' 
              : '/resident-home';

            setTimeout(() => {
              navigate(redirectPath, { replace: true });
            }, 1000);
          } else {
            setStatus('error');
            setMessage('No authentication data found. Please try registering again.');
          }
        }
      } catch (error) {
        console.error('Unexpected error during email confirmation:', error);
        setStatus('error');
        setMessage('An unexpected error occurred');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  const handleRetry = () => {
    navigate('/register');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleResendConfirmation = () => {
    // For expired tokens, we need to guide user to register again
    navigate('/register', { 
      state: { 
        message: 'Please register again to receive a new confirmation email.' 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e4ecfc] via-[#fff] to-[#fbedda] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            {status === 'loading' && (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                <h2 className="text-xl font-semibold text-gray-900">Confirming your email...</h2>
                <p className="text-gray-600">Please wait while we verify your email address.</p>
              </div>
            )}

            {status === 'success' && (
              <div className="flex flex-col items-center gap-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">Email Confirmed!</h2>
                <p className="text-gray-600">{message}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-gray-500">Redirecting...</span>
                </div>
              </div>
            )}

            {status === 'expired' && (
              <div className="flex flex-col items-center gap-4">
                <AlertTriangle className="h-12 w-12 text-amber-600" />
                <h2 className="text-xl font-semibold text-gray-900">Link Expired</h2>
                <p className="text-gray-600">{message}</p>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleResendConfirmation}
                    className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    Register Again
                  </button>
                  <button
                    onClick={handleGoHome}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Go Home
                  </button>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center gap-4">
                <XCircle className="h-12 w-12 text-red-600" />
                <h2 className="text-xl font-semibold text-gray-900">Confirmation Failed</h2>
                <p className="text-gray-600">{message}</p>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleRetry}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={handleGoHome}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Go Home
                  </button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
