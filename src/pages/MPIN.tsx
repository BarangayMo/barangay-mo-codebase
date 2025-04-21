
import { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Fingerprint, KeySquare } from "lucide-react";

export default function MPIN() {
  const [otp, setOtp] = useState("");

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-b from-sky-400 to-sky-200 p-6 font-inter">
      {/* Top Section */}
      <div className="w-full max-w-md text-center mt-8">
        <h2 className="text-3xl font-bold mb-2 text-white font-outfit">Smart Barangay</h2>
        <p className="text-lg text-white/90 mb-4">"Your community in your hands"</p>
        
        <div className="bg-white/20 backdrop-blur-md rounded-full py-3 px-6 mb-8">
          <p className="text-white text-lg">09123456789</p>
        </div>
      </div>

      {/* Login Options */}
      <div className="w-full max-w-md space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="secondary"
            className="p-8 bg-white hover:bg-white/90 flex flex-col items-center gap-3"
          >
            <Fingerprint className="h-8 w-8 text-blue-600" />
            <span className="text-blue-600 font-medium">Biometrics Login</span>
          </Button>
          <Button
            variant="secondary"
            className="p-8 bg-white hover:bg-white/90 flex flex-col items-center gap-3"
          >
            <KeySquare className="h-8 w-8 text-blue-600" />
            <span className="text-blue-600 font-medium">MPIN Login</span>
          </Button>
        </div>

        <div className="mt-8">
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
                    className="w-12 h-12 text-lg border-2 border-white/40 bg-white/20 backdrop-blur-sm text-white"
                  />
                ))}
              </InputOTPGroup>
            )}
          />
        </div>
      </div>

      {/* Bottom Links */}
      <div className="w-full max-w-md flex justify-between items-center mt-8 mb-4">
        <Link to="/help" className="text-white hover:underline">
          Help Center
        </Link>
        <Link to="/forgot-mpin" className="text-white hover:underline">
          Forgot MPIN?
        </Link>
      </div>

      {/* Version Number */}
      <div className="text-white/60 text-sm">
        v1.0.0
      </div>
    </div>
  );
}
