
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ScanFace } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function MPIN() {
  const [otp, setOtp] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("+63 952 483 0859");
  const navigate = useNavigate();
  const { userRole, isAuthenticated } = useAuth();

  const handleNumPadInput = (value: string) => {
    if (otp.length < 4) {
      setOtp(prev => prev + value);
    }
  };

  const handleNumPadDelete = () => {
    setOtp(prev => prev.slice(0, -1));
  };

  const handleLogin = () => {
    // Simulate login process
    if (otp.length === 4) {
      // This would normally validate the MPIN
      // For demo purposes, we'll redirect based on role or default
      if (isAuthenticated) {
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
      } else {
        // If not authenticated, redirect to resident home as default
        navigate("/resident-home");
      }
    }
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

  const numbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', '⌫']
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white font-inter overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12">
        <Link to="/welcome" className="text-gray-600 hover:text-gray-800 transition-colors">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <div className="flex-1" />
      </div>

      {/* Content Container */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        {/* Logo */}
        <div className="mb-8">
          <img 
            src="/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png" 
            alt="Barangay Mo Logo" 
            className="h-12 w-auto mx-auto"
          />
        </div>

        {/* Phone Number Display */}
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{phoneNumber}</h1>
          <p className="text-gray-500">Walter</p>
        </div>

        {/* PIN Dots */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full transition-colors duration-200 ${
                index < otp.length ? 'bg-red-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Title */}
        <h2 className="text-lg text-gray-600 mb-12 text-center">Enter your Barangay Mo PIN</h2>

        {/* Number Pad */}
        <div className="w-full max-w-xs mb-8">
          <div className="grid grid-cols-3 gap-8">
            {numbers.map((row, rowIndex) => (
              row.map((num, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    h-16 w-16 mx-auto flex items-center justify-center text-2xl font-medium
                    ${!num ? 'invisible' : 'hover:bg-red-50 active:bg-red-100 rounded-full transition-all duration-150 active:scale-95'}
                  `}
                  onClick={() => {
                    if (num === '⌫') {
                      handleNumPadDelete();
                    } else if (num) {
                      handleNumPadInput(num);
                    }
                  }}
                >
                  {num}
                </button>
              ))
            ))}
          </div>
        </div>

        {/* Face ID Button */}
        <Button
          variant="outline"
          className="w-full max-w-xs h-14 mb-4 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white border-none rounded-xl font-medium transition-all duration-150 active:scale-95"
          onClick={handleLogin}
        >
          <ScanFace className="mr-2 h-5 w-5" />
          Use Face ID
        </Button>

        {/* Skip Button */}
        <Button
          variant="ghost"
          onClick={handleSkip}
          className="text-gray-400 hover:text-gray-600 mb-8 transition-colors duration-150"
        >
          Skip for now
        </Button>

        {/* Forgot PIN Link */}
        <Link 
          to="/forgot-mpin" 
          className="text-red-500 hover:text-red-600 font-medium transition-colors duration-150"
        >
          Forgot MPIN?
        </Link>
      </div>
    </div>
  );
}
