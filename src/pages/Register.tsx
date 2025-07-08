
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Register() {
  const location = useLocation();
  const locationState = location.state as any;
  
  const [formData, setFormData] = useState({
    firstName: "",
    suffix: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    role: locationState?.role || "resident",
    hasNoMiddleName: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const suffixOptions = [
    { value: "Jr.", label: "Jr." },
    { value: "Sr.", label: "Sr." },
    { value: "II", label: "II" },
    { value: "III", label: "III" },
    { value: "IV", label: "IV" },
    { value: "V", label: "V" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await register(
        formData.email,
        formData.password,
        {
          role: formData.role,
          firstName: formData.firstName,
          lastName: formData.lastName,
          middleName: formData.hasNoMiddleName ? "" : formData.middleName,
          suffix: formData.suffix,
          // Include location and officials data if available
          ...(locationState?.region && {
            region: locationState.region,
            province: locationState.province,
            municipality: locationState.municipality,
            barangay: locationState.barangay,
          }),
          ...(locationState?.officials && {
            officials: locationState.officials
          }),
          ...(locationState?.phoneNumber && {
            phoneNumber: locationState.phoneNumber
          }),
          ...(locationState?.landlineNumber && {
            landlineNumber: locationState.landlineNumber
          }),
          ...(locationState?.logoUrl && {
            logoUrl: locationState.logoUrl
          })
        }
      );

      if (error) {
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: error.message
        });
      } else {
        navigate("/email-verification", { 
          state: { 
            email: formData.email,
            role: formData.role,
            previousPath: location.pathname
          } 
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "An unexpected error occurred"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value,
      // Clear middle name when "no middle name" is checked
      ...(name === "hasNoMiddleName" && checked ? { middleName: "" } : {})
    }));
  };

  const getBackLink = () => {
    if (locationState?.role === "official") {
      // Check if they came from logo upload
      if (locationState?.logoUrl !== undefined) {
        return "/register/logo";
      }
      return "/register/officials";
    }
    return "/register/role";
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-white flex flex-col overflow-hidden">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-1">
          <div className="bg-red-600 h-1 w-full"></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <Link to={getBackLink()} className="text-gray-600 hover:text-gray-800">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">Register</h1>
          <div className="w-6" />
        </div>

        {/* Content - Scrollable container with proper height calculation */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Logo and Title */}
            <div className="text-center mb-4">
              <img 
                src="/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png" 
                alt="Barangay Mo Logo" 
                className="h-10 w-auto mx-auto mb-2" 
              />
              <h2 className="text-lg font-bold text-gray-900 mb-1">Complete Registration</h2>
              <p className="text-gray-600 text-sm">Enter your personal details</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Personal Information */}
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <Label htmlFor="firstName" className="text-gray-700 text-sm">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="mt-1 h-9 text-sm border-gray-300 focus:border-red-500 focus:ring-red-500"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="suffix" className="text-gray-700 text-sm">Suffix</Label>
                    <Select 
                      value={formData.suffix} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, suffix: value }))}
                    >
                      <SelectTrigger className="mt-1 h-9 text-sm border-gray-300 focus:border-red-500 focus:ring-red-500">
                        <SelectValue placeholder="None" />
                      </SelectTrigger>
                      <SelectContent>
                        {suffixOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="middleName" className="text-gray-700 text-sm">Middle Name</Label>
                  <Input
                    id="middleName"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleInputChange}
                    disabled={formData.hasNoMiddleName}
                    className="mt-1 h-9 text-sm border-gray-300 focus:border-red-500 focus:ring-red-500 disabled:bg-gray-100"
                  />
                  <div className="flex items-center mt-1">
                    <input
                      type="checkbox"
                      id="hasNoMiddleName"
                      name="hasNoMiddleName"
                      checked={formData.hasNoMiddleName}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500 w-3 h-3"
                    />
                    <label htmlFor="hasNoMiddleName" className="ml-2 text-xs text-gray-600">
                      I have no middle name
                    </label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="lastName" className="text-gray-700 text-sm">Last Name *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="mt-1 h-9 text-sm border-gray-300 focus:border-red-500 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-700 text-sm">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 h-9 text-sm border-gray-300 focus:border-red-500 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-gray-700 text-sm">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="mt-1 h-9 text-sm border-gray-300 focus:border-red-500 focus:ring-red-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start space-x-2 pt-1">
                <input type="checkbox" id="terms" className="rounded border-gray-300 text-red-600 focus:ring-red-500 mt-0.5 w-3 h-3" required />
                <label htmlFor="terms" className="text-xs text-gray-600">
                  I agree to the <Link to="/terms" className="text-red-600 font-medium hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-red-600 font-medium hover:underline">Privacy Policy</Link>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 h-10 text-sm font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create new account"}
              </Button>
            </form>

            {/* Login Link */}
            <div className="text-center pb-4">
              <p className="text-gray-500 text-sm">
                Already have an account?{" "}
                <Link to="/mpin" className="font-medium text-red-600 hover:text-red-700 hover:underline">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop version - similar structure but with desktop styling
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 px-4 py-8">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-1">
          <div className="bg-red-600 h-1 w-full"></div>
        </div>

        <div className="p-8">
          <Link to={getBackLink()} className="inline-flex items-center text-sm text-gray-500 mb-6 hover:text-gray-700">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Link>
          
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <img 
              src="/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png" 
              alt="Barangay Mo Logo" 
              className="h-16 w-auto mx-auto mb-4" 
            />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Complete Registration</h1>
            <p className="text-gray-600">Enter your personal details</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <Label htmlFor="firstName-desktop" className="text-gray-700">First Name *</Label>
                  <Input
                    id="firstName-desktop"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="suffix-desktop" className="text-gray-700">Suffix</Label>
                  <Select 
                    value={formData.suffix} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, suffix: value }))}
                  >
                    <SelectTrigger className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500">
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent>
                      {suffixOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="middleName-desktop" className="text-gray-700">Middle Name</Label>
                <Input
                  id="middleName-desktop"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleInputChange}
                  disabled={formData.hasNoMiddleName}
                  className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500 disabled:bg-gray-100"
                />
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    id="hasNoMiddleName-desktop"
                    name="hasNoMiddleName"
                    checked={formData.hasNoMiddleName}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <label htmlFor="hasNoMiddleName-desktop" className="ml-2 text-sm text-gray-600">
                    I have no middle name
                  </label>
                </div>
              </div>

              <div>
                <Label htmlFor="lastName-desktop" className="text-gray-700">Last Name *</Label>
                <Input
                  id="lastName-desktop"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email-desktop" className="text-gray-700">Email Address *</Label>
                <Input
                  id="email-desktop"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password-desktop" className="text-gray-700">Password *</Label>
                <Input
                  id="password-desktop"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start space-x-2 pt-2">
              <input type="checkbox" id="terms-desktop" className="rounded border-gray-300 text-red-600 focus:ring-red-500 mt-0.5" required />
              <label htmlFor="terms-desktop" className="text-sm text-gray-600">
                I agree to the <Link to="/terms" className="text-red-600 font-medium hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-red-600 font-medium hover:underline">Privacy Policy</Link>
              </label>
            </div>
            
            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-base font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create new account"}
            </Button>
          </form>
          
          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-red-600 hover:text-red-700 hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
