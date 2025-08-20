import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Phone, Shield, Timer } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface LocationState {
  phoneNumber: string;
  userRole: 'resident' | 'official';
}

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [otpCode, setOtpCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [remainingAttempts, setRemainingAttempts] = useState(3);

  // Redirect if no phone number in state
  useEffect(() => {
    if (!state?.phoneNumber || !state?.userRole) {
      toast.error("Invalid access. Please start the registration process again.");
      navigate('/register');
    }
  }, [state, navigate]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatPhoneNumber = (phone: string) => {
    if (phone.length <= 4) return phone;
    const lastFour = phone.slice(-4);
    const masked = '*'.repeat(phone.length - 4);
    return masked + lastFour;
  };

  const handleVerifyOTP = async () => {
    if (!otpCode || otpCode.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP code");
      return;
    }

    setIsVerifying(true);

    try {
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: {
          phoneNumber: state.phoneNumber,
          otpCode: otpCode.trim()
        }
      });

      if (error) {
        console.error('Verification error:', error);
        toast.error("Failed to verify OTP. Please try again.");
        return;
      }

      if (data.success) {
        toast.success("Phone number verified successfully!");
        
        // Navigate to appropriate registration form with verified phone number
        if (state.userRole === 'official') {
          navigate('/register/official', { 
            state: { 
              verifiedPhoneNumber: state.phoneNumber,
              userRole: state.userRole 
            } 
          });
        } else {
          navigate('/register', { 
            state: { 
              verifiedPhoneNumber: state.phoneNumber,
              userRole: state.userRole 
            } 
          });
        }
      } else {
        if (data.remainingAttempts !== undefined) {
          setRemainingAttempts(data.remainingAttempts);
        }
        toast.error(data.error || "Invalid OTP code");
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error("Failed to verify OTP. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: {
          phoneNumber: state.phoneNumber,
          userRole: state.userRole
        }
      });

      if (error) {
        console.error('Resend error:', error);
        toast.error("Failed to resend OTP. Please try again.");
        return;
      }

      if (data.success) {
        toast.success("OTP sent successfully!");
        setTimeLeft(600); // Reset timer to 10 minutes
        setRemainingAttempts(3); // Reset attempts
        setOtpCode(""); // Clear current input
      } else {
        toast.error(data.error || "Failed to send OTP");
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleOTPChange = (value: string) => {
    // Only allow digits and limit to 6 characters
    const cleanValue = value.replace(/\D/g, '').slice(0, 6);
    setOtpCode(cleanValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && otpCode.length === 6) {
      handleVerifyOTP();
    }
  };

  if (!state?.phoneNumber) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Verify Your Phone Number
            </CardTitle>
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" />
                <span>We sent a code to {formatPhoneNumber(state.phoneNumber)}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Timer className="w-4 h-4" />
                <span>Code expires in {formatTime(timeLeft)}</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Enter 6-digit verification code
              </label>
              <Input
                type="text"
                value={otpCode}
                onChange={(e) => handleOTPChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="000000"
                className="text-center text-lg tracking-widest font-mono"
                maxLength={6}
                autoComplete="one-time-code"
                autoFocus
              />
              {remainingAttempts < 3 && (
                <p className="text-sm text-amber-600">
                  {remainingAttempts} attempt{remainingAttempts !== 1 ? 's' : ''} remaining
                </p>
              )}
            </div>

            <Button
              onClick={handleVerifyOTP}
              disabled={isVerifying || otpCode.length !== 6 || timeLeft === 0}
              className="w-full"
              size="lg"
            >
              {isVerifying ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </div>
              ) : (
                'Verify OTP'
              )}
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Didn't receive the code?
              </p>
              <Button
                variant="outline"
                onClick={handleResendOTP}
                disabled={isResending || timeLeft > 540} // Allow resend after 1 minute
                size="sm"
              >
                {isResending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </div>
                ) : timeLeft > 540 ? (
                  `Resend in ${formatTime(600 - timeLeft)}`
                ) : (
                  'Resend Code'
                )}
              </Button>
            </div>

            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="w-full"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OTPVerification;