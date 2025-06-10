
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, SkipForward } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { RoleButton } from "@/components/ui/role-button";

export default function Verify() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isCheckingRbi, setIsCheckingRbi] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const checkRbiFormStatus = async () => {
    if (!user?.id) return false;
    
    try {
      const { data, error } = await supabase
        .from('rbi_draft_forms')
        .select('id')
        .eq('user_id', user.id)
        .single();
        
      return !!data && !error;
    } catch (error) {
      return false;
    }
  };

  const handleResendCode = () => {
    setTimeLeft(60);
    toast({
      title: "Code Resent",
      description: "A new verification code has been sent to your phone.",
    });
  };

  const handleVerify = () => {
    if (otp.length === 4) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(async () => {
        setIsLoading(false);
        const hasRbiForm = await checkRbiFormStatus();
        navigate(hasRbiForm ? "/resident-home" : "/rbi-registration");
      }, 1000);
    }
  };

  const handleSkip = async () => {
    setIsCheckingRbi(true);
    try {
      const hasRbiForm = await checkRbiFormStatus();
      navigate(hasRbiForm ? "/resident-home" : "/rbi-registration");
    } catch (error) {
      console.error("Error checking RBI form status:", error);
      navigate("/rbi-registration");
    } finally {
      setIsCheckingRbi(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-6">
      <Link to="/phone" className="flex items-center gap-2 text-gray-600 mb-6 hover:text-gray-800 transition-colors">
        <ChevronLeft className="h-5 w-5" />
        Back
      </Link>

      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">Verify Account</h1>
        </motion.div>
        
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-white rounded-full p-6 shadow-lg">
            <img 
              src="/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png"
              alt="Barangay Mo Logo"
              className="w-24 h-24 object-contain"
            />
          </div>
        </motion.div>

        <motion.h2 
          className="text-lg font-medium text-center mb-2 text-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          Enter The Verification Code Sent To
        </motion.h2>
        
        <div className="flex items-center gap-2 mb-8">
          <p className="text-gray-600 font-medium">+639171234567</p>
          <Link to="/phone" className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors">
            Wrong Number?
          </Link>
        </div>

        <motion.div 
          className="w-full space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex justify-center">
            <InputOTP
              maxLength={4}
              value={otp}
              onChange={setOtp}
              pattern="[0-9]*"
            >
              <InputOTPGroup className="gap-3">
                {Array.from({ length: 4 }, (_, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="w-14 h-14 text-xl font-semibold border-2 border-gray-300 rounded-xl bg-white shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 hover:border-gray-400"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="space-y-3">
            <RoleButton 
              onClick={handleVerify}
              disabled={otp.length !== 4 || isLoading}
              className="w-full h-12 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Verify"}
            </RoleButton>

            <RoleButton 
              type="button"
              variant="ghost"
              onClick={handleSkip}
              disabled={isCheckingRbi}
              className="w-full h-12 text-gray-600 hover:text-gray-800 hover:bg-white/50 flex items-center gap-2 justify-center font-medium rounded-xl transition-all duration-200"
            >
              <SkipForward className="w-5 h-5" />
              {isCheckingRbi ? "Checking..." : "Skip Verification"}
            </RoleButton>
          </div>
        </motion.div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-2">
            Didn't Receive the Code?
          </p>
          <button 
            className={`text-sm font-medium transition-colors ${timeLeft === 0 ? 'text-emerald-600 hover:text-emerald-700' : 'text-gray-400 cursor-not-allowed'}`}
            onClick={timeLeft === 0 ? handleResendCode : undefined}
            disabled={timeLeft > 0}
          >
            {timeLeft > 0 ? `Resend in ${timeLeft}s` : "Resend Code"}
          </button>
        </div>
      </div>
    </div>
  );
}
