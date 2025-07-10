
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Eye, EyeOff, User, Phone, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useMediaQuery } from "@/hooks/use-media-query";
import { RegistrationProgress } from "@/components/ui/registration-progress";

interface RegistrationData {
  role: string;
  region: string;
  province: string;
  municipality: string;
  barangay: string;
  officials?: any[];
  logoUrl?: string;
  phoneNumber?: string;
  landlineNumber?: string;
}

export default function Register() {
  const location = useLocation();
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const registrationData = location.state as RegistrationData;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid =
    firstName &&
    lastName &&
    email &&
    password &&
    confirmPassword &&
    password === confirmPassword;

  const handleRegister = async () => {
    if (!isFormValid) {
      toast({
        title: "Error",
        description: "Please fill in all fields correctly.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const userData = {
        firstName,
        lastName,
        role: registrationData?.role || 'resident',
        region: registrationData?.region,
        province: registrationData?.province,
        municipality: registrationData?.municipality,
        barangay: registrationData?.barangay,
        officials: registrationData?.officials,
        logoUrl: registrationData?.logoUrl,
        phoneNumber: registrationData?.phoneNumber,
        landlineNumber: registrationData?.landlineNumber,
      };

      const { error } = await register(email, password, userData);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Account created successfully! Check your email to verify your account.",
      });
      navigate("/email-confirmation");
    } catch (error: any) {
      console.error("Registration failed:", error);
      toast({
        title: "Error",
        description: error.message || "Registration failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (registrationData?.role === "official") {
      navigate("/register/logo", { state: registrationData });
    } else {
      navigate("/register/location", { state: registrationData });
    }
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Progress Bar */}
        <div className={`w-full bg-gray-200 h-1`}>
          <div className={`h-1 transition-all duration-300 ${
            registrationData?.role === 'official' ? 'bg-red-600' : 'bg-blue-600'
          }`} style={{ width: '100%' }}></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 bg-white border-b">
          <button onClick={handleBack} className="text-gray-600 hover:text-gray-800">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Complete Registration</h1>
          <div className="w-6" />
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-6 bg-white">
          {/* First Name */}
          <div>
            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 block mb-2">
              First Name
            </Label>
            <Input
              type="text"
              id="firstName"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full h-12"
            />
          </div>

          {/* Last Name */}
          <div>
            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 block mb-2">
              Last Name
            </Label>
            <Input
              type="text"
              id="lastName"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full h-12"
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700 block mb-2">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12"
            />
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password" className="text-sm font-medium text-gray-700 block mb-2">
              Password
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 pr-12"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 block mb-2">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-12 pr-12"
              />
            </div>
          </div>
        </div>

        {/* Register Button */}
        <div className="p-6 bg-white border-t">
          <Button
            onClick={handleRegister}
            disabled={!isFormValid || isLoading}
            className={`w-full text-white py-4 h-12 text-base font-medium rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed ${
              registrationData?.role === 'official' 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? "Creating Account..." : "Complete Registration"}
          </Button>
        </div>
      </div>
    );
  }

  // Desktop version
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Progress Bar */}
        <div className={`w-full bg-gray-200 h-1`}>
          <div className={`h-1 transition-all duration-300 ${
            registrationData?.role === 'official' ? 'bg-red-600' : 'bg-blue-600'
          }`} style={{ width: '100%' }}></div>
        </div>

        {/* Header */}
        <div className="px-8 py-6 border-b bg-white">
          <button onClick={handleBack} className="inline-flex items-center text-sm text-gray-500 mb-4 hover:text-gray-700">
            <ChevronLeft className="w-4 h-4 mr-1" />
          </button>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Complete Registration</h2>
          </div>
        </div>

        <div className="p-8 bg-white">
          {/* First Name */}
          <div className="mb-4">
            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 block mb-2">
              First Name
            </Label>
            <Input
              type="text"
              id="firstName"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full h-12"
            />
          </div>

          {/* Last Name */}
          <div className="mb-4">
            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 block mb-2">
              Last Name
            </Label>
            <Input
              type="text"
              id="lastName"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full h-12"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700 block mb-2">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700 block mb-2">
              Password
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 pr-12"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 block mb-2">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-12 pr-12"
              />
            </div>
          </div>

          {/* Register Button */}
          <div className="mt-8">
            <Button
              onClick={handleRegister}
              disabled={!isFormValid || isLoading}
              className={`w-full text-white py-4 h-12 text-base font-medium rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed ${
                registrationData?.role === 'official' 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? "Creating Account..." : "Complete Registration"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
