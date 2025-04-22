
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

export default function Verify() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

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
      setTimeout(() => {
        setIsLoading(false);
        navigate("/rbi-registration");
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-6">
      <Link to="/phone" className="flex items-center gap-2 text-gray-600 mb-6">
        <ChevronLeft className="h-5 w-5" />
        Back
      </Link>

      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl font-semibold text-center mb-2">Verify Account</h1>
        </motion.div>
        
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <img 
            src="/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png"
            alt="Barangay Mo Logo"
            className="w-32 h-32 object-contain"
          />
        </motion.div>

        <motion.h2 
          className="text-xl font-medium text-center mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          Enter The Verification Code Sent To
        </motion.h2>
        
        <div className="flex items-center gap-2 mb-8">
          <p className="text-gray-600">+639171234567</p>
          <Link to="/phone" className="text-sm text-emerald-600">
            Wrong Number?
          </Link>
        </div>

        <motion.div 
          className="w-full space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex justify-center">
            <InputOTP
              maxLength={4}
              value={otp}
              onChange={setOtp}
              render={({ slots }) => (
                <InputOTPGroup className="gap-2 md:gap-4">
                  {slots.map((slot, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      {...slot}
                      className="w-16 h-16 text-2xl border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  ))}
                </InputOTPGroup>
              )}
            />
          </div>

          <Button 
            onClick={handleVerify}
            disabled={otp.length !== 4 || isLoading}
            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700"
          >
            {isLoading ? "Verifying..." : "Verify"}
          </Button>
        </motion.div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-1">
            Didn't Receive the Code?
          </p>
          <button 
            className={`text-sm font-medium ${timeLeft === 0 ? 'text-emerald-600' : 'text-gray-400'}`}
            onClick={timeLeft === 0 ? handleResendCode : undefined}
            disabled={timeLeft > 0}
          >
            {timeLeft > 0 ? `Resend in ${timeLeft}s` : "Resend"}
          </button>
        </div>
      </div>
    </div>
  );
}
