import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const locationState = location.state;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const isFormValid =
    email &&
    password &&
    confirmPassword &&
    fullName &&
    password === confirmPassword;

  const handleSubmit = async () => {
    if (!isFormValid) {
      toast.error("Please fill in all fields and ensure passwords match.");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: fullName,
            role: locationState?.role,
            region: locationState?.region,
            province: locationState?.province,
            municipality: locationState?.municipality,
            barangay: locationState?.barangay,
          },
        },
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Account created! Check your email to verify.");
        navigate("/welcome");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/register/officials");
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Progress Bar - exactly like role page */}
        <div className="w-full bg-gray-200 h-1">
          <div className={`h-1 w-full ${locationState?.role === 'official' ? 'bg-red-600' : 'bg-blue-600'}`}></div>
        </div>

        {/* Header - exactly like role page */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
          <button onClick={handleBack} className="text-gray-600 hover:text-gray-800">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Create Account</h1>
          <div className="w-6" />
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-6 bg-white">
          {/* Full Name Input */}
          <div>
            <Label htmlFor="fullName" className="text-sm font-medium text-gray-700 block mb-2">
              Full Name
            </Label>
            <Input
              type="text"
              id="fullName"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-12"
            />
          </div>

          {/* Email Input */}
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700 block mb-2">
              Email Address
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12"
            />
          </div>

          {/* Password Input */}
          <div>
            <Label htmlFor="password" className="text-sm font-medium text-gray-700 block mb-2">
              Password
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 pr-12"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 block mb-2">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 pr-12"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="p-6 bg-white border-t">
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid || isLoading}
            className={`w-full text-white py-4 h-12 text-base font-medium rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed ${
              locationState?.role === 'official'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </div>
      </div>
    );
  }

  // Desktop version
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Progress Bar - exactly like role page */}
        <div className="w-full bg-gray-200 h-1">
          <div className={`h-1 w-full ${locationState?.role === 'official' ? 'bg-red-600' : 'bg-blue-600'}`}></div>
        </div>

        {/* Header - exactly like role page */}
        <div className="p-8 bg-white">
          <button onClick={handleBack} className="inline-flex items-center text-sm text-gray-500 mb-6 hover:text-gray-700">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </button>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
          </div>

          <div className="space-y-6">
            {/* Full Name Input */}
            <div>
              <Label htmlFor="fullName-desktop" className="text-sm font-medium text-gray-700 block mb-2">
                Full Name
              </Label>
              <Input
                type="text"
                id="fullName-desktop"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-12"
              />
            </div>

            {/* Email Input */}
            <div>
              <Label htmlFor="email-desktop" className="text-sm font-medium text-gray-700 block mb-2">
                Email Address
              </Label>
              <Input
                type="email"
                id="email-desktop"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
              />
            </div>

            {/* Password Input */}
            <div>
              <Label htmlFor="password-desktop" className="text-sm font-medium text-gray-700 block mb-2">
                Password
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password-desktop"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pr-12"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <Label htmlFor="confirmPassword-desktop" className="text-sm font-medium text-gray-700 block mb-2">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword-desktop"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 pr-12"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid || isLoading}
              className={`w-full text-white py-4 h-12 text-base font-medium rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed ${
                locationState?.role === 'official'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
