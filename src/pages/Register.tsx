import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { RegistrationProgress } from "@/components/ui/registration-progress";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface LocationState {
  role: string;
  region: string;
  province: string;
  municipality: string;
  barangay: string;
  officials?: any[];
  logoUrl?: string;
}

export default function Register() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const locationState = location.state as LocationState;
  const { register } = useAuth();
  const { toast } = useToast();

  // If no location state, redirect to role selection
  if (!locationState?.role) {
    navigate('/register/role');
    return null;
  }

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    suffix: "",
    email: "",
    password: "",
    phoneNumber: "",
    landlineNumber: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTermsChange = (checked: boolean | "indeterminate") => {
    setAcceptTerms(checked === true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptTerms) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Submitting registration with role:', locationState.role);
      
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.middleName,
        suffix: formData.suffix,
        role: locationState.role,
        region: locationState.region,
        province: locationState.province,
        municipality: locationState.municipality,
        barangay: locationState.barangay,
        phoneNumber: formData.phoneNumber || null,
        landlineNumber: formData.landlineNumber || null,
        logoUrl: locationState.logoUrl || null,
        officials: locationState.officials || null
      };

      console.log('Complete userData being sent:', userData);

      const { error } = await register(formData.email, formData.password, userData);

      if (error) {
        console.error('Registration error:', error);
        toast({
          title: "Registration Failed",
          description: error.message || "An error occurred during registration.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration Successful",
          description: "Please check your email to verify your account.",
        });
        navigate("/email-verification", { 
          state: { 
            email: formData.email,
            role: locationState.role
          } 
        });
      }
    } catch (error) {
      console.error('Unexpected registration error:', error);
      toast({
        title: "Registration Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getBackLink = () => {
    if (locationState.role === "official") {
      return locationState.logoUrl ? "/register/logo" : "/register/officials";
    }
    return "/register/location";
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Progress Bar - at very top */}
        <div className="w-full bg-gray-200 h-1">
          <div className={`h-1 w-full ${locationState.role === 'official' ? 'bg-red-600' : 'bg-blue-600'}`}></div>
        </div>

        {/* Header - white background */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
          <button 
            onClick={() => navigate(getBackLink(), { state: locationState })}
            className="text-gray-600 hover:text-gray-800"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Complete Registration</h1>
          <div className="w-6" />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between p-4 bg-white">
          <div className="space-y-6">
            {/* Logo and Title */}
            <div className="text-center">
              <img 
                src="/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png" 
                alt="eGov.PH Logo" 
                className="h-12 w-auto mx-auto mb-4" 
              />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Complete Your Registration</h2>
              <p className="text-gray-600 text-sm">
                Registering as: <span className={`font-semibold capitalize ${
                  locationState.role === 'official' ? 'text-red-600' : 'text-blue-600'
                }`}>{locationState.role}</span>
              </p>
              <p className="text-gray-600 text-sm">
                Barangay: <span className="font-semibold">{locationState.barangay}</span>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="firstName" className="text-gray-700 text-sm">First Name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className={`mt-1 h-9 text-sm border-gray-300 ${
                      locationState.role === 'official' 
                        ? 'focus:border-red-500 focus:ring-red-500' 
                        : 'focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-gray-700 text-sm">Last Name *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className={`mt-1 h-9 text-sm border-gray-300 ${
                      locationState.role === 'official' 
                        ? 'focus:border-red-500 focus:ring-red-500' 
                        : 'focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="middleName" className="text-gray-700 text-sm">Middle Name</Label>
                  <Input
                    id="middleName"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleInputChange}
                    className={`mt-1 h-9 text-sm border-gray-300 ${
                      locationState.role === 'official' 
                        ? 'focus:border-red-500 focus:ring-red-500' 
                        : 'focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                </div>
                <div>
                  <Label htmlFor="suffix" className="text-gray-700 text-sm">Suffix</Label>
                  <Input
                    id="suffix"
                    name="suffix"
                    value={formData.suffix}
                    onChange={handleInputChange}
                    placeholder="Jr., Sr., III"
                    className={`mt-1 h-9 text-sm border-gray-300 ${
                      locationState.role === 'official' 
                        ? 'focus:border-red-500 focus:ring-red-500' 
                        : 'focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-700 text-sm">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={`mt-1 h-9 text-sm border-gray-300 ${
                    locationState.role === 'official' 
                      ? 'focus:border-red-500 focus:ring-red-500' 
                      : 'focus:border-blue-500 focus:ring-blue-500'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="phoneNumber" className="text-gray-700 text-sm">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="09XX XXX XXXX"
                    className={`mt-1 h-9 text-sm border-gray-300 ${
                      locationState.role === 'official' 
                        ? 'focus:border-red-500 focus:ring-red-500' 
                        : 'focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                </div>
                <div>
                  <Label htmlFor="landlineNumber" className="text-gray-700 text-sm">Landline</Label>
                  <Input
                    id="landlineNumber"
                    name="landlineNumber"
                    value={formData.landlineNumber}
                    onChange={handleInputChange}
                    placeholder="(02) 8XXX XXXX"
                    className={`mt-1 h-9 text-sm border-gray-300 ${
                      locationState.role === 'official' 
                        ? 'focus:border-red-500 focus:ring-red-500' 
                        : 'focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-700 text-sm">Password *</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className={`h-9 text-sm border-gray-300 pr-10 ${
                      locationState.role === 'official' 
                        ? 'focus:border-red-500 focus:ring-red-500' 
                        : 'focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={handleTermsChange}
                  className={locationState.role === 'official' ? 'border-red-300' : 'border-blue-300'}
                />
                <Label htmlFor="terms" className="text-xs text-gray-600 leading-4">
                  I agree to the{" "}
                  <a href="/terms" className={locationState.role === 'official' ? 'text-red-600 hover:underline' : 'text-blue-600 hover:underline'}>
                    Terms and Conditions
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className={locationState.role === 'official' ? 'text-red-600 hover:underline' : 'text-blue-600 hover:underline'}>
                    Privacy Policy
                  </a>
                </Label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className={`w-full text-white py-3 h-12 text-base font-medium ${
                  locationState.role === 'official' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isLoading ? "Creating Account..." : "CREATE ACCOUNT"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Desktop version
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Progress Bar - at very top */}
        <div className="w-full bg-gray-200 h-1">
          <div className={`h-1 w-full ${locationState.role === 'official' ? 'bg-red-600' : 'bg-blue-600'}`}></div>
        </div>

        <div className="p-8 bg-white">
          <button 
            onClick={() => navigate(getBackLink(), { state: locationState })}
            className="inline-flex items-center text-sm text-gray-500 mb-6 hover:text-gray-700"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </button>
          
          {/* Header */}
          <div className="text-center mb-8">
            <img 
              src="/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png" 
              alt="eGov.PH Logo" 
              className="h-16 w-auto mx-auto mb-4" 
            />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Registration</h1>
            <p className="text-gray-600">
              Registering as: <span className={`font-semibold capitalize ${
                locationState.role === 'official' ? 'text-red-600' : 'text-blue-600'
              }`}>{locationState.role}</span>
            </p>
            <p className="text-gray-600">
              Barangay: <span className="font-semibold">{locationState.barangay}</span>
            </p>
          </div>
          
          {/* Form - keeping same structure as mobile but with desktop classes */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName-desktop" className="text-gray-700">First Name *</Label>
                <Input
                  id="firstName-desktop"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className={`mt-1 border-gray-300 ${
                    locationState.role === 'official' 
                      ? 'focus:border-red-500 focus:ring-red-500' 
                      : 'focus:border-blue-500 focus:ring-blue-500'
                  }`}
                />
              </div>
              <div>
                <Label htmlFor="lastName-desktop" className="text-gray-700">Last Name *</Label>
                <Input
                  id="lastName-desktop"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className={`mt-1 border-gray-300 ${
                    locationState.role === 'official' 
                      ? 'focus:border-red-500 focus:ring-red-500' 
                      : 'focus:border-blue-500 focus:ring-blue-500'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="middleName-desktop" className="text-gray-700">Middle Name</Label>
                <Input
                  id="middleName-desktop"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleInputChange}
                  className={`mt-1 border-gray-300 ${
                    locationState.role === 'official' 
                      ? 'focus:border-red-500 focus:ring-red-500' 
                      : 'focus:border-blue-500 focus:ring-blue-500'
                  }`}
                />
              </div>
              <div>
                <Label htmlFor="suffix-desktop" className="text-gray-700">Suffix</Label>
                <Input
                  id="suffix-desktop"
                  name="suffix"
                  value={formData.suffix}
                  onChange={handleInputChange}
                  placeholder="Jr., Sr., III"
                  className={`mt-1 border-gray-300 ${
                    locationState.role === 'official' 
                      ? 'focus:border-red-500 focus:ring-red-500' 
                      : 'focus:border-blue-500 focus:ring-blue-500'
                  }`}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email-desktop" className="text-gray-700">Email Address *</Label>
              <Input
                id="email-desktop"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className={`mt-1 border-gray-300 ${
                  locationState.role === 'official' 
                    ? 'focus:border-red-500 focus:ring-red-500' 
                    : 'focus:border-blue-500 focus:ring-blue-500'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phoneNumber-desktop" className="text-gray-700">Phone Number</Label>
                <Input
                  id="phoneNumber-desktop"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="09XX XXX XXXX"
                  className={`mt-1 border-gray-300 ${
                    locationState.role === 'official' 
                      ? 'focus:border-red-500 focus:ring-red-500' 
                      : 'focus:border-blue-500 focus:ring-blue-500'
                  }`}
                />
              </div>
              <div>
                <Label htmlFor="landlineNumber-desktop" className="text-gray-700">Landline</Label>
                <Input
                  id="landlineNumber-desktop"
                  name="landlineNumber"
                  value={formData.landlineNumber}
                  onChange={handleInputChange}
                  placeholder="(02) 8XXX XXXX"
                  className={`mt-1 border-gray-300 ${
                    locationState.role === 'official' 
                      ? 'focus:border-red-500 focus:ring-red-500' 
                      : 'focus:border-blue-500 focus:ring-blue-500'
                  }`}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password-desktop" className="text-gray-700">Password *</Label>
              <div className="relative mt-1">
                <Input
                  id="password-desktop"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className={`border-gray-300 pr-10 ${
                    locationState.role === 'official' 
                      ? 'focus:border-red-500 focus:ring-red-500' 
                      : 'focus:border-blue-500 focus:ring-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms-desktop"
                checked={acceptTerms}
                onCheckedChange={handleTermsChange}
                className={locationState.role === 'official' ? 'border-red-300' : 'border-blue-300'}
              />
              <Label htmlFor="terms-desktop" className="text-sm text-gray-600 leading-5">
                I agree to the{" "}
                <a href="/terms" className={locationState.role === 'official' ? 'text-red-600 hover:underline' : 'text-blue-600 hover:underline'}>
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a href="/privacy" className={locationState.role === 'official' ? 'text-red-600 hover:underline' : 'text-blue-600 hover:underline'}>
                  Privacy Policy
                </a>
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white py-3 text-base font-medium ${
                locationState.role === 'official' 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
