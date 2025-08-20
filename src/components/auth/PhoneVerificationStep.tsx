import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Shield, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PhoneVerificationStepProps {
  userRole: 'resident' | 'official';
  onBack: () => void;
}

const PhoneVerificationStep = ({ userRole, onBack }: PhoneVerificationStepProps) => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSending, setIsSending] = useState(false);

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits except + at the beginning
    const cleaned = value.replace(/[^\d+]/g, '');
    
    // Limit to reasonable international phone number length
    return cleaned.slice(0, 16);
  };

  const validatePhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/[^\d+]/g, '');
    
    // Basic international phone number validation
    // Must start with + and have 7-15 digits after country code
    const phoneRegex = /^\+\d{7,15}$/;
    
    if (phoneRegex.test(cleaned)) {
      return cleaned;
    }
    
    return null;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const handleSendOTP = async () => {
    const validatedPhone = validatePhoneNumber(phoneNumber);
    
    if (!validatedPhone) {
      toast.error("Please enter a valid international phone number (e.g., +1234567890)");
      return;
    }

    setIsSending(true);

    try {
      console.log('Attempting to send OTP to:', validatedPhone, 'for role:', userRole);
      
      // Use Supabase client to invoke the edge function
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: {
          phoneNumber: validatedPhone,
          userRole: userRole
        }
      });

      if (error) {
        console.error('OTP sending error:', error);
        
        // Handle specific error cases
        if (error.message?.includes('SMS service not configured') || 
            error.message?.includes('503')) {
          toast.error("Phone verification service is currently unavailable. Please contact support.");
        } else {
          toast.error(error.message || "Failed to send OTP");
        }
        return;
      }

      if (data && data.success) {
        toast.success("OTP sent to your phone number!");
        
        // Navigate to OTP verification page
        navigate('/otp-verification', {
          state: {
            phoneNumber: validatedPhone,
            userRole: userRole
          }
        });
      } else {
        console.error('OTP sending failed:', data);
        
        // Show specific error message based on the error type
        let errorMessage = data?.message || data?.error || "Failed to send OTP";
        
        // Handle specific Twilio errors
        if (data?.twilioCode === 21408) {
          errorMessage = "SMS is not available for your region. Please contact support.";
        } else if (data?.twilioCode === 21211) {
          errorMessage = "Please enter a valid international phone number format.";
        } else if (data?.twilioCode === 21608) {
          errorMessage = "Phone number needs verification. Please contact support or try a different number.";
        } else if (data?.twilioCode === 21610) {
          errorMessage = "This phone number needs verification. Please contact support.";
        } else if (data?.twilioCode === 21612) {
          errorMessage = "International SMS not enabled. Please contact support or try a different number.";
        }
        
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendOTP();
    }
  };

  const getPlaceholderText = () => {
    return "+1234567890";
  };

  const getHelpText = () => {
    return "Enter your international phone number to receive a verification code";
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Phone className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Verify Your Phone Number
          </CardTitle>
          <p className="text-gray-600 text-sm">
            {getHelpText()}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <Input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              onKeyPress={handleKeyPress}
              placeholder={getPlaceholderText()}
              className=""
              maxLength={16}
              autoComplete="tel"
              autoFocus
            />
            <p className="text-xs text-gray-500">
              We'll send a 6-digit verification code to this number
            </p>
          </div>

          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-medium">Secure Verification</p>
              <p className="text-blue-600">Your phone number will be used for account security and notifications.</p>
            </div>
          </div>

          <Button
            onClick={handleSendOTP}
            disabled={isSending || !phoneNumber.trim()}
            className="w-full"
            size="lg"
          >
            {isSending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending Code...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Send Verification Code
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={onBack}
            className="w-full"
          >
            Back to Role Selection
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhoneVerificationStep;
