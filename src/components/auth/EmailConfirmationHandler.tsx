import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

type ConfirmationStatus = 'loading' | 'success' | 'error' | 'expired' | 'already_confirmed' | 'login_required';

export const EmailConfirmationHandler = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<ConfirmationStatus>('loading');
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // Function to determine redirect path based on user role
  const getRedirectPath = (userMetadata: any, email: string) => {
    const role = userMetadata?.role;
    
    if (role === 'official') {
      return '/official-dashboard';
    } else if (role === 'superadmin' || email.includes('admin')) {
      return '/admin';
    } else if (email.includes('official')) {
      return '/official-dashboard';
    } else {
      return '/resident-home';
    }
  };

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        console.log('Starting email confirmation process...');
        
        // Check URL hash for auth callback data
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        // Also check query parameters as backup
        const queryParams = new URLSearchParams(window.location.search);
        
        // Get all possible parameters from both sources
        const getParam = (key: string) => hashParams.get(key) || queryParams.get(key);
        
        const error = getParam('error');
        const errorCode = getParam('error_code');
        const errorDescription = getParam('error_description');
        const accessToken = getParam('access_token');
        const refreshToken = getParam('refresh_token');
        const type = getParam('type');
        
        console.log('Confirmation params:', { 
          error, 
          errorCode, 
          errorDescription, 
          hasAccessToken: !!accessToken, 
          hasRefreshToken: !!refreshToken, 
          type 
        });

        // Handle errors first
        if (error) {
          console.log('Auth callback error:', { error, errorCode, errorDescription });
          
          if (errorCode === 'otp_expired') {
            setStatus('expired');
            setMessage('Your email confirmation link has expired. Please request a new confirmation email.');
          } else if (errorDescription?.includes('already_confirmed')) {
            setStatus('already_confirmed');
            setMessage('Your email has already been confirmed. Please sign in to continue.');
          } else {
            setStatus('error');
            setMessage(errorDescription ? decodeURIComponent(errorDescription.replace(/\+/g, ' ')) : 'Email confirmation failed');
          }
          return;
        }

        // Handle successful confirmation with tokens
        if (accessToken && refreshToken && type === 'signup') {
          console.log('Processing successful email confirmation...');
          
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (sessionError) {
            console.error('Session setting error:', sessionError);
            setStatus('error');
            setMessage('Failed to establish session. Please try signing in manually.');
            return;
          }

          if (data.session?.user) {
            console.log('User confirmed successfully:', data.session.user.email);
            setUserEmail(data.session.user.email || '');
            
            // Get the redirect path based on user role
            const redirectPath = getRedirectPath(data.session.user.user_metadata, data.session.user.email || '');
            
            // Create/update profile with registration data
            const userData = data.session.user.user_metadata;
            if (userData) {
              const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                  id: data.session.user.id,
                  first_name: userData.first_name,
                  last_name: userData.last_name,
                  middle_name: userData.middle_name,
                  suffix: userData.suffix,
                  role: userData.role,
                  barangay: userData.barangay,
                  region: userData.region,
                  province: userData.province,
                  municipality: userData.municipality,
                  phone_number: userData.phone_number,
                  landline_number: userData.landline_number,
                  logo_url: userData.logo_url,
                  officials_data: userData.officials ? JSON.stringify(userData.officials) : null,
                  email: data.session.user.email
                })
                .select();

              if (profileError) {
                console.error('Profile update error:', profileError);
              } else {
                console.log('Profile updated successfully');
              }
            }
            
            setStatus('success');
            setMessage('Email confirmed successfully! Redirecting to your dashboard...');
            
            // Force auth context refresh by triggering auth state change
            setTimeout(async () => {
              // Refresh the session to ensure auth context is updated
              await supabase.auth.refreshSession();
              navigate(redirectPath, { replace: true });
            }, 1500);
          } else {
            setStatus('error');
            setMessage('Authentication failed. Please try registering again.');
          }
          return;
        }

        // If no tokens in URL, check if user is already authenticated
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session check error:', sessionError);
          setStatus('login_required');
          setMessage('Unable to verify authentication status. Please sign in to continue.');
          return;
        }

        if (sessionData.session?.user) {
          console.log('User already authenticated:', sessionData.session.user.email);
          setUserEmail(sessionData.session.user.email || '');
          
          // Get the redirect path based on user role
          const redirectPath = getRedirectPath(sessionData.session.user.user_metadata, sessionData.session.user.email || '');
          
          setStatus('success');
          setMessage('You are already signed in! Redirecting to your dashboard...');
          
          setTimeout(() => {
            navigate(redirectPath, { replace: true });
          }, 1000);
          return;
        }

        // No valid tokens and no existing session - user needs to login
        setStatus('login_required');
        setMessage('Email confirmation completed. Please sign in to access your account.');
        
      } catch (error) {
        console.error('Unexpected error during email confirmation:', error);
        setStatus('error');
        setMessage('An unexpected error occurred during confirmation.');
      }
    };

    handleEmailConfirmation();
  }, [navigate]);

  const handleRetry = () => {
    navigate('/register');
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleResendConfirmation = async () => {
    if (!userEmail) {
      navigate('/register', { 
        state: { 
          message: 'Please register again to receive a new confirmation email.' 
        } 
      });
      return;
    }

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: userEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/email-confirmation`
        }
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to resend confirmation email. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Email Sent",
          description: "A new confirmation email has been sent to your inbox.",
        });
        navigate('/email-verification', { state: { email: userEmail } });
      }
    } catch (error) {
      console.error('Resend confirmation error:', error);
      toast({
        title: "Error",
        description: "Failed to resend confirmation email.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e4ecfc] via-[#fff] to-[#fbedda] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            {status === 'loading' && (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 text-red-600 animate-spin" />
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

            {status === 'already_confirmed' && (
              <div className="flex flex-col items-center gap-4">
                <CheckCircle className="h-12 w-12 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Already Confirmed</h2>
                <p className="text-gray-600">{message}</p>
                <div className="flex gap-3 mt-4">
                  <Button onClick={handleGoToLogin} className="bg-red-600 hover:bg-red-700">
                    Sign In
                  </Button>
                  <Button onClick={handleGoHome} variant="outline">
                    Go Home
                  </Button>
                </div>
              </div>
            )}

            {status === 'login_required' && (
              <div className="flex flex-col items-center gap-4">
                <CheckCircle className="h-12 w-12 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Email Confirmed</h2>
                <p className="text-gray-600">{message}</p>
                <div className="flex gap-3 mt-4">
                  <Button onClick={handleGoToLogin} className="bg-red-600 hover:bg-red-700">
                    Sign In Now
                  </Button>
                  <Button onClick={handleGoHome} variant="outline">
                    Go Home
                  </Button>
                </div>
              </div>
            )}

            {status === 'expired' && (
              <div className="flex flex-col items-center gap-4">
                <AlertTriangle className="h-12 w-12 text-amber-600" />
                <h2 className="text-xl font-semibold text-gray-900">Link Expired</h2>
                <p className="text-gray-600">{message}</p>
                <div className="flex gap-3 mt-4">
                  <Button onClick={handleResendConfirmation} className="bg-amber-600 hover:bg-amber-700">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Resend Email
                  </Button>
                  <Button onClick={handleRetry} variant="outline">
                    Register Again
                  </Button>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center gap-4">
                <XCircle className="h-12 w-12 text-red-600" />
                <h2 className="text-xl font-semibold text-gray-900">Confirmation Failed</h2>
                <p className="text-gray-600">{message}</p>
                <div className="flex gap-3 mt-4">
                  <Button onClick={handleGoToLogin} className="bg-red-600 hover:bg-red-700">
                    Sign In
                  </Button>
                  <Button onClick={handleGoHome} variant="outline">
                    Go Home
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
