
import { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Fingerprint, SkipForward } from "lucide-react";
import { NumPad } from "@/components/ui/numpad";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

export default function MPIN() {
  const [otp, setOtp] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("+63");
  const navigate = useNavigate();
  const { userRole } = useAuth();

  const handleNumPadInput = (value: string) => {
    if (otp.length < 6) {
      setOtp(prev => prev + value);
    }
  };

  const handleNumPadDelete = () => {
    setOtp(prev => prev.slice(0, -1));
  };

  const handleSkip = () => {
    switch(userRole) {
      case "official":
        navigate("/official-dashboard");
        break;
      case "superadmin":
        navigate("/admin");
        break;
      case "resident":
      default:
        navigate("/resident-home");
        break;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-br from-[#2563eb] via-[#3b82f6] to-[#60a5fa] p-4 md:p-6 font-inter">
      <div className="w-full max-w-md text-center mt-4 md:mt-8">
        <img 
          src="/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png" 
          alt="Logo" 
          className="h-16 w-auto mx-auto mb-6"
        />
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white font-outfit tracking-tight">Smart Barangay</h2>
        <p className="text-base md:text-lg text-white/90 mb-6 font-light">"Your community in your hands"</p>
        
        <div className="bg-white/10 backdrop-blur-md rounded-xl py-3 px-4 md:px-6 inline-flex items-center gap-3 mx-auto">
          <img
            src="/lovable-uploads/69289dcf-6417-4971-9806-b93b578586d6.png"
            alt="Philippines Flag"
            className="h-5 w-5 rounded-full object-cover"
          />
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <Input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="bg-transparent border-none text-white/90 text-base md:text-lg font-medium w-36 p-0 focus:ring-0"
            placeholder="+63 XXX XXX XXXX"
          />
        </div>
      </div>

      <div className="w-full max-w-md space-y-6 px-4">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8">
          <h3 className="text-white text-xl font-medium mb-6 text-center">Enter Your MPIN</h3>
          <div className="flex justify-center mb-6">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
              render={({ slots }) => (
                <InputOTPGroup className="gap-2 justify-center">
                  {slots.map((slot, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      {...slot}
                      className="w-10 h-12 text-lg border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white rounded-xl focus:border-white/40 transition-colors"
                    />
                  ))}
                </InputOTPGroup>
              )}
            />
          </div>
          
          <div className="mt-6">
            <NumPad 
              onNumberClick={handleNumPadInput}
              onDelete={handleNumPadDelete}
              className="mx-auto max-w-[280px]"
            />
          </div>

          <div className="flex flex-col gap-3 mt-6">
            <Button
              variant="secondary"
              className="bg-white/90 hover:bg-white text-blue-600 flex items-center justify-center gap-2 py-4 rounded-xl transition-all duration-200 hover:shadow-lg w-full"
            >
              <Fingerprint className="h-5 w-5" />
              <span className="font-medium">Use Biometrics</span>
            </Button>
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-white/80 hover:text-white hover:bg-white/10 flex items-center justify-center gap-2 py-4 rounded-xl transition-all duration-200 w-full"
            >
              <SkipForward className="h-5 w-5" />
              <span className="font-medium">Skip for now</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md flex justify-between items-center mt-6 mb-4 px-4">
        <Link to="/help" className="text-white/90 hover:text-white transition-colors text-sm font-medium">
          Help Center
        </Link>
        <Link to="/forgot-mpin" className="text-white/90 hover:text-white transition-colors text-sm font-medium">
          Forgot MPIN?
        </Link>
      </div>

      <div className="text-white/60 text-xs mb-2">
        v1.0.0
      </div>
    </div>
  );
}
