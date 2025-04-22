
import { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Fingerprint, KeySquare, Flag } from "lucide-react";
import { NumPad } from "@/components/ui/numpad";

export default function MPIN() {
  const [otp, setOtp] = useState("");
  const [showNumpad, setShowNumpad] = useState(false);

  const handleNumPadInput = (value: string) => {
    if (otp.length < 6) {
      setOtp(prev => prev + value);
    }
  };

  const handleNumPadDelete = () => {
    setOtp(prev => prev.slice(0, -1));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-br from-[#2563eb] via-[#3b82f6] to-[#60a5fa] p-4 md:p-6 font-inter">
      {/* Top Section */}
      <div className="w-full max-w-md text-center mt-4 md:mt-8">
        <img 
          src="/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png" 
          alt="Logo" 
          className="h-16 w-auto mx-auto mb-6"
        />
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white font-outfit tracking-tight">Smart Barangay</h2>
        <p className="text-base md:text-lg text-white/90 mb-6 font-light">"Your community in your hands"</p>
        
        <div className="bg-white/10 backdrop-blur-md rounded-xl py-3 px-4 md:px-6 inline-flex items-center gap-3">
          <Flag className="h-5 w-5 text-white" />
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <p className="text-white/90 text-base md:text-lg font-medium">+63 912 345 6789</p>
        </div>
      </div>

      {/* MPIN Input Section */}
      <div className="w-full max-w-md space-y-6 px-4">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8">
          <h3 className="text-white text-xl font-medium mb-6 text-center">Enter Your MPIN</h3>
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            render={({ slots }) => (
              <InputOTPGroup className="gap-2 justify-center">
                {slots.map((slot, index) => (
                  <InputOTPSlot
                    key={index}
                    {...slot}
                    className="w-10 h-12 text-lg border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white rounded-xl focus:border-white/40 transition-colors"
                  />
                ))}
              </InputOTPGroup>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <Button
              variant="secondary"
              className="bg-white/90 hover:bg-white text-blue-600 flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200 hover:shadow-lg"
              onClick={() => setShowNumpad(prev => !prev)}
            >
              <KeySquare className="h-6 w-6" />
              <span className="font-medium text-sm">Use Keypad</span>
            </Button>
            <Button
              variant="secondary"
              className="bg-white/90 hover:bg-white text-blue-600 flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200 hover:shadow-lg"
            >
              <Fingerprint className="h-6 w-6" />
              <span className="font-medium text-sm">Use Biometrics</span>
            </Button>
          </div>

          {showNumpad && (
            <div className="mt-6">
              <NumPad 
                onNumberClick={handleNumPadInput}
                onDelete={handleNumPadDelete}
              />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Links */}
      <div className="w-full max-w-md flex justify-between items-center mt-6 mb-4 px-4">
        <Link to="/help" className="text-white/90 hover:text-white transition-colors text-sm font-medium">
          Help Center
        </Link>
        <Link to="/forgot-mpin" className="text-white/90 hover:text-white transition-colors text-sm font-medium">
          Forgot MPIN?
        </Link>
      </div>

      {/* Version Number */}
      <div className="text-white/60 text-xs mb-2">
        v1.0.0
      </div>
    </div>
  );
}
