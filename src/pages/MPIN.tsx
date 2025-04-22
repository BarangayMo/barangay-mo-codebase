
import { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Fingerprint, KeySquare } from "lucide-react";

export default function MPIN() {
  const [otp, setOtp] = useState("");

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-br from-[#2563eb] via-[#3b82f6] to-[#60a5fa] p-6 font-inter">
      {/* Top Section */}
      <div className="w-full max-w-md text-center mt-8">
        <img 
          src="/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png" 
          alt="Logo" 
          className="h-16 w-auto mx-auto mb-6"
        />
        <h2 className="text-4xl font-bold mb-3 text-white font-outfit tracking-tight">Smart Barangay</h2>
        <p className="text-lg text-white/90 mb-6 font-light">"Your community in your hands"</p>
        
        <div className="bg-white/10 backdrop-blur-md rounded-xl py-3.5 px-6 inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <p className="text-white/90 text-lg font-medium">09123456789</p>
        </div>
      </div>

      {/* MPIN Input Section */}
      <div className="w-full max-w-md space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8">
          <h3 className="text-white text-xl font-medium mb-6 text-center">Enter Your MPIN</h3>
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            render={({ slots }) => (
              <InputOTPGroup className="gap-3 justify-center">
                {slots.map((slot, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="w-12 h-12 text-lg border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white rounded-xl focus:border-white/40 transition-colors"
                  />
                ))}
              </InputOTPGroup>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4 mt-8">
            <Button
              variant="secondary"
              className="bg-white/90 hover:bg-white text-blue-600 flex flex-col items-center gap-2 p-6 rounded-xl transition-all duration-200 hover:shadow-lg"
            >
              <Fingerprint className="h-6 w-6" />
              <span className="font-medium">Biometrics</span>
            </Button>
            <Button
              variant="secondary"
              className="bg-white/90 hover:bg-white text-blue-600 flex flex-col items-center gap-2 p-6 rounded-xl transition-all duration-200 hover:shadow-lg"
            >
              <KeySquare className="h-6 w-6" />
              <span className="font-medium">MPIN</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Links */}
      <div className="w-full max-w-md flex justify-between items-center mt-8 mb-4">
        <Link to="/help" className="text-white/90 hover:text-white transition-colors text-sm font-medium">
          Help Center
        </Link>
        <Link to="/forgot-mpin" className="text-white/90 hover:text-white transition-colors text-sm font-medium">
          Forgot MPIN?
        </Link>
      </div>

      {/* Version Number */}
      <div className="text-white/60 text-xs">
        v1.0.0
      </div>
    </div>
  );
}
