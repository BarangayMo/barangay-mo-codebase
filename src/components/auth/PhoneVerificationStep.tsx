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
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '');
    
    // Handle different phone number formats
    if (cleaned.length <= 10) {
      // Local format: 09XXXXXXXXX
      return cleaned;
    } else if (cleaned.length === 12 && cleaned.startsWith('63')) {
      // International format: 639XXXXXXXXX
      return cleaned;
    } else if (cleaned.length === 13 && cleaned.startsWith('639')) {
      // With country code: +639XXXXXXXXX
      return cleaned;
    }
    
    return cleaned.slice(0, 13); // Limit to max length
  };

  const validatePhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    
    // Check if it's a valid Philippine mobile number
    if (cleaned.length === 11 && cleaned.startsWith('09')) {
      return `+63${cleaned.slice(1)}`; // Convert to international format
    } else if (cleaned.length === 12 && cleaned.startsWith('63')) {
      return `+${cleaned}`;
    } else if (cleaned.length === 13 && cleaned.startsWith('639')) {
      return `+${cleaned}`;
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
      toast.error("Please enter a valid Philippine mobile number (e.g., 09123456789)");
      return;
    }

    setIsSending(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: {
          phoneNumber: validatedPhone,
          userRole: userRole
        }
      });

      if (error) {
        console.error('Send OTP error:', error);
        toast.error("Failed to send OTP. Please try again.");
        return;
      }

      if (data.success) {
        toast.success("OTP sent to your phone number!");
        
        // Navigate to OTP verification page
        navigate('/otp-verification', {
          state: {
            phoneNumber: validatedPhone,
            userRole: userRole
          }
        });
      } else {
        toast.error(data.error || "Failed to send OTP");
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error("Failed to send OTP. Please try again.");
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
    return "09123456789";
  };

  const getHelpText = () => {
    return "Enter your Philippine mobile number to receive a verification code";
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
              Mobile Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-sm">🇵🇭 +63</span>
              </div>
              <Input
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                onKeyPress={handleKeyPress}
                placeholder={getPlaceholderText()}
                className="pl-16"
                maxLength={15}
                autoComplete="tel"
                autoFocus
              />
            </div>
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