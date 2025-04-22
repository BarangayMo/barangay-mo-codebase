
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export default function Verify() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleVerify = () => {
    if (otp.length === 4) {
      navigate("/mpin");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-6">
      <Link to="/phone" className="flex items-center gap-2 text-gray-600 mb-6">
        <ChevronLeft className="h-5 w-5" />
        Back
      </Link>

      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        <h1 className="text-2xl font-semibold text-center mb-2">Verify Account</h1>
        
        <div className="flex justify-center mb-8">
          <img 
            src="/lovable-uploads/69289dcf-6417-4971-9806-b93b578586d6.png"
            alt="OTP Verification"
            className="w-32 h-32 object-contain"
          />
        </div>

        <h2 className="text-xl font-medium text-center mb-2">
          Enter The Verification Code Sent To
        </h2>
        <div className="flex items-center gap-2 mb-8">
          <p className="text-gray-600">+639171234567</p>
          <Link to="/phone" className="text-sm text-emerald-600">
            Wrong Number?
          </Link>
        </div>

        <div className="w-full space-y-6">
          <InputOTP
            maxLength={4}
            value={otp}
            onChange={setOtp}
            render={({ slots }) => (
              <InputOTPGroup className="gap-2 justify-center">
                {slots.map((slot, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    {...slot}
                    className="w-14 h-14 text-2xl border-2 rounded-xl"
                  />
                ))}
              </InputOTPGroup>
            )}
          />

          <Button 
            onClick={handleVerify}
            disabled={otp.length !== 4}
            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700"
          >
            Verify
          </Button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-1">
            Didn't Receive the Code?
          </p>
          <button className="text-sm font-medium text-emerald-600">
            Resend
          </button>
        </div>
      </div>
    </div>
  );
}
