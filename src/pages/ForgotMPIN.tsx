
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { ChevronLeft, Mail, Phone } from "lucide-react";

export default function ForgotMPIN() {
  const [step, setStep] = useState<'method' | 'phone' | 'email' | 'success'>('method');
  const [resetMethod, setResetMethod] = useState<'phone' | 'email'>('phone');
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const handlePhoneReset = () => {
    setResetMethod('phone');
    setStep('success');
  };

  const handleEmailReset = () => {
    setResetMethod('email');
    setStep('success');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-inter">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12">
        <Link to="/mpin" className="text-gray-600 hover:text-gray-800 transition-colors">
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

        {step === 'method' && (
          <>
            <div className="text-center mb-12">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Reset your MPIN</h1>
              <p className="text-gray-500">Choose how you'd like to reset your Barangay Mo PIN</p>
            </div>

            <div className="w-full max-w-sm space-y-4">
              <Button
                variant="outline"
                className="w-full h-16 border-2 border-gray-200 hover:border-red-500 hover:bg-red-50 transition-all duration-150"
                onClick={() => setStep('phone')}
              >
                <Phone className="mr-3 h-5 w-5 text-red-500" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">Via SMS</div>
                  <div className="text-sm text-gray-500">We'll send a code to your phone</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full h-16 border-2 border-gray-200 hover:border-red-500 hover:bg-red-50 transition-all duration-150"
                onClick={() => setStep('email')}
              >
                <Mail className="mr-3 h-5 w-5 text-red-500" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">Via Email</div>
                  <div className="text-sm text-gray-500">We'll send a reset link to your email</div>
                </div>
              </Button>
            </div>
          </>
        )}

        {step === 'phone' && (
          <>
            <div className="text-center mb-12">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Enter your phone number</h1>
              <p className="text-gray-500">We'll send you a verification code</p>
            </div>

            <div className="w-full max-w-sm space-y-6">
              <Input
                type="tel"
                placeholder="+63 9XX XXX XXXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="h-14 text-center text-lg border-2 focus:border-red-500"
              />

              <Button
                className="w-full h-14 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-150"
                onClick={handlePhoneReset}
                disabled={!phoneNumber}
              >
                Send Code
              </Button>
            </div>
          </>
        )}

        {step === 'email' && (
          <>
            <div className="text-center mb-12">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Enter your email</h1>
              <p className="text-gray-500">We'll send you a reset link</p>
            </div>

            <div className="w-full max-w-sm space-y-6">
              <Input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 text-center text-lg border-2 focus:border-red-500"
              />

              <Button
                className="w-full h-14 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-150"
                onClick={handleEmailReset}
                disabled={!email}
              >
                Send Reset Link
              </Button>
            </div>
          </>
        )}

        {step === 'success' && (
          <>
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-3 h-1.5 bg-white rounded-full transform rotate-45 translate-x-0.5"></div>
                  <div className="w-1.5 h-3 bg-white rounded-full transform -rotate-45 -translate-x-0.5 -translate-y-0.5"></div>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Check your messages</h1>
              <p className="text-gray-500">
                We've sent instructions to reset your MPIN. Please check your {resetMethod === 'phone' ? 'SMS' : 'email'}.
              </p>
            </div>

            <div className="w-full max-w-sm">
              <Button
                variant="outline"
                className="w-full h-14 border-2 border-red-500 text-red-500 hover:bg-red-50 rounded-xl font-medium transition-all duration-150"
                asChild
              >
                <Link to="/mpin">Back to Login</Link>
              </Button>
            </div>
          </>
        )}

        {step !== 'success' && (
          <div className="mt-8">
            <Link 
              to="/mpin" 
              className="text-gray-400 hover:text-gray-600 font-medium transition-colors duration-150"
            >
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
