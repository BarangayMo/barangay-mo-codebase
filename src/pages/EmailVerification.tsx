
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Mail } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toastManager } from "@/lib/toast-manager";

export default function EmailVerification() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { toast } = useToast();
  
  const locationState = location.state as any;
  const [email, setEmail] = useState(locationState?.email || "");
  const [isResending, setIsResending] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(30);

  // Check if user is already verified and redirect if so
  const checkVerificationStatus = async () => {
    try {
      console.log('🔄 Forcing session refresh to get latest verification status...');
      
      // Force refresh session to get latest state from server
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError) {
        console.log('⚠️ Session refresh error (may be normal):', refreshError.message);
      } else {
        console.log('✅ Session refreshed successfully');
      }
      
      // Now get the fresh session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('❌ Error getting session:', sessionError);
        return;
      }
      
      console.log('📊 Fresh session data:', {
        hasUser: !!session?.user,
        email: session?.user?.email,
        emailConfirmed: !!session?.user?.email_confirmed_at,
        confirmationTime: session?.user?.email_confirmed_at
      });
      
      if (session?.user?.email_confirmed_at) {
        console.log('✅ Email verified! Redirecting user...');
        const userRole = session.user.user_metadata?.role || 'resident';
        const redirectPath = userRole === 'official' ? '/official-dashboard' : userRole === 'superadmin' ? '/admin' : '/resident-home';
        console.log('🚀 Redirecting verified user to:', redirectPath);
        navigate(redirectPath, { replace: true });
        return;
      } else if (session?.user) {
        console.log('🚫 Email NOT verified yet for:', session.user.email);
      } else {
        console.log('👤 No active session found');
      }
    } catch (error) {
      console.error('💥 Unexpected error in checkVerificationStatus:', error);
    }
  };

  // Effect 1: Initial setup and auth state listener
  useEffect(() => {
    console.log('🎬 Setting up email verification page...');
    
    // Initial check
    checkVerificationStatus();

    // Listen for auth state changes (verification on other devices)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('📧 Auth state changed:', event, {
        hasUser: !!session?.user,
        emailConfirmed: !!session?.user?.email_confirmed_at
      });
      
      if (session?.user?.email_confirmed_at) {
        console.log('✅ Email verified via auth state change, redirecting...');
        const userRole = session.user.user_metadata?.role || 'resident';
        const redirectPath = userRole === 'official' ? '/official-dashboard' : userRole === 'superadmin' ? '/admin' : '/resident-home';
        console.log('🚀 Redirecting verified user to:', redirectPath);
        navigate(redirectPath, { replace: true });
      }
    });

    return () => {
      console.log('🧹 Cleaning up auth state listener');
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Effect 2: Periodic session checking for cross-device verification
  useEffect(() => {
    console.log('⏰ Setting up periodic session check (every 3 seconds)');
    
    const sessionCheckInterval = setInterval(async () => {
      console.log('🔄 Periodic session check triggered...');
      await checkVerificationStatus();
    }, 3000);

    return () => {
      console.log('🧹 Cleaning up periodic session check');
      clearInterval(sessionCheckInterval);
    };
  }, [navigate]);

  // Effect 3: Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleResend = async () => {
    if (!email) {
      console.log("❌ Resend failed: No email provided");
      toastManager.showToast(() => {
        toast({
          variant: "destructive",
          title: "Email required",
          description: "Please enter your email address to resend verification"
        });
      }, "email-required");
      return;
    }

    console.log("📧 Resending verification email to:", email);
    setIsResending(true);
    
    try {
      const emailRedirectUrl = `${window.location.origin}/auth/callback`;
      console.log("📧 Using email redirect URL for resend:", emailRedirectUrl);
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: emailRedirectUrl
        }
      });

      if (error) {
        console.error("❌ Resend error:", error);
        toastManager.showToast(() => {
          toast({
            variant: "destructive",
            title: "Resend failed",
            description: error.message
          });
        }, "resend-error");
      } else {
        console.log("✅ Verification email resent successfully to:", email);
        toastManager.showToast(() => {
          toast({
            title: "Email sent! 📧",
            description: "Verification email has been resent. Please check your inbox."
          });
        }, "resend-success");
        setCanResend(false);
        setCountdown(30);
      }
    } catch (error) {
      console.error("💥 Unexpected resend error:", error);
      toastManager.showToast(() => {
        toast({
          variant: "destructive",
          title: "Resend failed",
          description: "An unexpected error occurred"
        });
      }, "resend-unexpected-error");
    } finally {
      setIsResending(false);
    }
  };

  const getBackLink = () => {
    // Determine back link based on role and registration flow
    if (locationState?.role === "official") {
      return "/register/details";
    }
    return "/register/details";
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <Link to={getBackLink()} className="text-gray-600 hover:text-gray-800">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">Verify Email</h1>
          <div className="w-6" />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center px-4 py-8">
          <div className="text-center space-y-6">
            {/* Icon */}
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8 text-red-600" />
            </div>

            {/* Title and Description */}
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-gray-900">Check your inbox to verify your email</h2>
              <p className="text-gray-600 text-sm">
                We've sent a verification link to
              </p>
              <p className="font-medium text-gray-900 text-sm">{email}</p>
              <p className="text-gray-500 text-xs mt-2">
                Click the link in your email to verify your account and unlock access to all features.
              </p>
            </div>

            {/* Email Input for Resend */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-gray-700 text-sm">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 h-9 text-sm border-gray-300 focus:border-red-500 focus:ring-red-500"
                  placeholder="Enter your email"
                />
              </div>

              {/* Resend Button */}
              <Button
                onClick={handleResend}
                disabled={!canResend || isResending}
                variant="outline"
                className="w-full border-red-600 text-red-600 hover:bg-red-50"
              >
                {isResending ? "Sending..." : canResend ? "Resend verification email" : `Resend in ${countdown}s`}
              </Button>
            </div>

            {/* Help Text */}
            <div className="text-center text-xs text-gray-500">
              <p>Didn't receive the email? Check your spam folder or try resending.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop version
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 px-4 py-8">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="p-8">
          <Link to={getBackLink()} className="inline-flex items-center text-sm text-gray-500 mb-6 hover:text-gray-700">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Link>

          <div className="text-center space-y-6">
            {/* Icon */}
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-10 h-10 text-red-600" />
            </div>

            {/* Title and Description */}
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-gray-900">Check your inbox to verify your email</h1>
              <p className="text-gray-600">
                We've sent a verification link to
              </p>
              <p className="font-medium text-gray-900">{email}</p>
              <p className="text-gray-500 text-sm mt-2">
                Click the link in your email to verify your account and unlock access to all features.
              </p>
            </div>

            {/* Email Input for Resend */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="email-desktop" className="text-gray-700">Email Address</Label>
                <Input
                  id="email-desktop"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  placeholder="Enter your email"
                />
              </div>

              {/* Resend Button */}
              <Button
                onClick={handleResend}
                disabled={!canResend || isResending}
                variant="outline"
                className="w-full border-red-600 text-red-600 hover:bg-red-50"
              >
                {isResending ? "Sending..." : canResend ? "Resend verification email" : `Resend in ${countdown}s`}
              </Button>
            </div>

            {/* Help Text */}
            <div className="text-center text-sm text-gray-500">
              <p>Didn't receive the email? Check your spam folder or try resending.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
