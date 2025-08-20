import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Eye, EyeOff, MapPin, UserCheck } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { RegistrationProgress } from "@/components/ui/registration-progress";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toastManager } from "@/lib/toast-manager";

interface LocationState {
  role: string;
  region: string;
  province: string;
  municipality: string;
  barangay: string;
  officials?: any[];
  logoUrl?: string;
  verifiedPhoneNumber?: string;
  userRole?: 'resident' | 'official';
}

const COMMON_SUFFIXES = [
  "Jr.",
  "Sr.", 
  "II",
  "III",
  "IV",
  "V"
];

export default function Register() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const locationState = location.state as LocationState;
  const { register } = useAuth();
  const { toast } = useToast();

  // Get registration data from localStorage or location state
  const role = localStorage.getItem('registration_role') || locationState?.role;
  const region = localStorage.getItem('registration_region') || locationState?.region;
  const province = localStorage.getItem('registration_province') || locationState?.province;
  const municipality = localStorage.getItem('registration_municipality') || locationState?.municipality;
  const barangay = localStorage.getItem('registration_barangay') || locationState?.barangay;
  const verifiedPhoneNumber = locationState?.verifiedPhoneNumber;

  // Check if we need to redirect to role selection
  const needsRedirect = !role || !region || !province || !municipality || !barangay;

  // Create locationState object with collected data
  const registrationData = {
    role,
    region,
    province,
    municipality,
    barangay,
    officials: locationState?.officials,
    logoUrl: locationState?.logoUrl
  };

  // Handle redirect in useEffect to avoid render phase navigation
  useEffect(() => {
    if (needsRedirect) {
      navigate('/register/role');
    } else if (role === 'official') {
      // Redirect officials to the new registration flow
      navigate('/register/official', { state: registrationData });
    }
  }, [needsRedirect, role, navigate, registrationData]);

  // Show loading or return null while redirecting
  if (needsRedirect || role === 'official') {
    return null;
  }

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    suffix: "",
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSuffixChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      suffix: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Submitting registration with role:', registrationData.role);
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.middleName,
        suffix: formData.suffix,
        role: registrationData.role,
        region: registrationData.region,
        province: registrationData.province,
        municipality: registrationData.municipality,
        barangay: registrationData.barangay,
        phoneNumber: verifiedPhoneNumber || null,
        landlineNumber: null,
        logoUrl: registrationData.logoUrl || null,
        officials: registrationData.officials || null
      };
      
      console.log('Complete userData being sent:', userData);
      const { error } = await register(formData.email, formData.password, userData);
      
      if (error) {
        console.error('Registration error:', error);
        
        // Provide more specific error messages based on the error type
        let errorMessage = "An error occurred during registration.";
        
        if (error.message.includes('User already registered') || error.message.includes('user_already_exists')) {
          errorMessage = "This email address is already registered. Please use a different email or try logging in instead.";
        } else if (error.message.includes('email')) {
          errorMessage = "This email address is invalid. Please check and try again.";
        } else if (error.message.includes('password')) {
          errorMessage = "Password must be at least 6 characters long.";
        } else if (error.message.includes('foreign key')) {
          errorMessage = "There was a database error. Please try again.";
        } else if (error.message.includes('duplicate')) {
          errorMessage = "This account already exists. Please try logging in instead.";
        }
        
        toastManager.showToast(() => {
          toast({
            title: "Registration Failed",
            description: errorMessage,
            variant: "destructive"
          });
        }, "registration-error");
      } else {
        // Clear localStorage after successful registration
        localStorage.removeItem('registration_role');
        localStorage.removeItem('registration_region');
        localStorage.removeItem('registration_province');
        localStorage.removeItem('registration_municipality');
        localStorage.removeItem('registration_barangay');
        
        console.log('✅ Registration successful - Check your inbox to verify your email!');
        toastManager.showToast(() => {
          toast({
            title: "Registration Successful! 📧",
            description: "Check your inbox to verify your email and unlock access to all features."
          });
        }, "registration-success");
        
        navigate("/email-verification", {
          state: {
            email: formData.email,
            role: registrationData.role
          }
        });
      }
    } catch (error) {
      console.error('Unexpected registration error:', error);
      toastManager.showToast(() => {
        toast({
          title: "Registration Failed",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive"
        });
      }, "registration-unexpected-error");
    } finally {
      setIsLoading(false);
    }
  };

  const getBackLink = () => {
    if (registrationData.role === "official") {
      return registrationData.logoUrl ? "/register/logo" : "/register/officials";
    }
    return "/register/location";
  };

  // Use official logo if role is official, otherwise use resident logo
  const logoUrl = registrationData.role === 'official' 
    ? "/lovable-uploads/141c2a56-35fc-4123-a51f-358481e0f167.png"
    : "/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png";

  if (isMobile) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className={`flex items-center justify-between px-4 py-4 text-white ${registrationData.role === 'official' ? 'bg-red-600' : 'bg-blue-600'}`}>
          <button onClick={() => navigate(getBackLink(), { state: registrationData })} className="text-white hover:text-gray-200">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-bold">Complete Registration</h1>
          <div className="w-6" />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between p-4 bg-white">
          <div className="space-y-6">
            {/* Logo and Title */}
            <div className="text-center">
              <img src={logoUrl} alt="eGov.PH Logo" className="h-12 w-auto mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-4">Complete Your Registration</h2>
              
              {/* Compact role and location display */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                <Card className="p-2 bg-gradient-to-r from-blue-50 to-white">
                  <CardContent className="p-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 font-medium">
                        Role: <Badge variant="secondary" className={`${registrationData.role === 'official' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'} capitalize font-semibold text-xs ml-1`}>
                          {registrationData.role}
                        </Badge>
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-2 bg-gradient-to-r from-green-50 to-white">
                  <CardContent className="p-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 font-medium">
                        Barangay: <span className="text-xs font-semibold text-gray-900 ml-1">{registrationData.barangay}</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="firstName" className="text-gray-700 text-sm">First Name *</Label>
                  <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required className={`mt-1 h-12 text-sm border-gray-300 ${registrationData.role === 'official' ? 'focus:border-red-500 focus:ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'}`} />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-gray-700 text-sm">Last Name *</Label>
                  <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required className={`mt-1 h-12 text-sm border-gray-300 ${registrationData.role === 'official' ? 'focus:border-red-500 focus:ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'}`} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="middleName" className="text-gray-700 text-sm">Middle Name</Label>
                  <Input id="middleName" name="middleName" value={formData.middleName} onChange={handleInputChange} className={`mt-1 h-12 text-sm border-gray-300 ${registrationData.role === 'official' ? 'focus:border-red-500 focus:ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'}`} />
                </div>
                <div>
                  <Label htmlFor="suffix" className="text-gray-700 text-sm">Suffix</Label>
                  <Select value={formData.suffix} onValueChange={handleSuffixChange}>
                    <SelectTrigger className={`mt-1 h-12 text-sm border-gray-300 ${registrationData.role === 'official' ? 'focus:border-red-500 focus:ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'}`}>
                      <SelectValue placeholder="Select suffix" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMMON_SUFFIXES.map((suffix) => (
                        <SelectItem key={suffix} value={suffix}>
                          {suffix}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-700 text-sm">Email Address *</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required className={`mt-1 h-12 text-sm border-gray-300 ${registrationData.role === 'official' ? 'focus:border-red-500 focus:ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'}`} />
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-700 text-sm">Password *</Label>
                <div className="relative mt-1">
                  <Input id="password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleInputChange} required className={`h-12 text-sm border-gray-300 pr-10 ${registrationData.role === 'official' ? 'focus:border-red-500 focus:ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'}`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="text-center text-xs text-gray-600 leading-4">
                By tapping Create new account, you agree with the{" "}
                <a href="/terms" className={registrationData.role === 'official' ? 'text-red-600 hover:underline' : 'text-blue-600 hover:underline'}>
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a href="/privacy" className={registrationData.role === 'official' ? 'text-red-600 hover:underline' : 'text-blue-600 hover:underline'}>
                  Privacy Notice
                </a>
              </div>

              <Button type="submit" disabled={isLoading} className={`w-full text-white py-3 h-12 text-base font-medium ${registrationData.role === 'official' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                {isLoading ? "Creating Account..." : "Create new account"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Desktop version
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header with Progress Bar */}
      <div className="sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => navigate(getBackLink(), { state: registrationData })} className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </button>
            <img src={logoUrl} alt="eGov.PH Logo" className="h-8 w-auto" />
          </div>
          <RegistrationProgress currentStep="register" userRole={registrationData.role as 'resident' | 'official'} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Complete Your Registration</h1>
          
          {/* Compact role and location display */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Card className="p-3 bg-gradient-to-r from-blue-50 to-white">
              <CardContent className="p-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xs text-gray-500 font-medium">
                    Role: <Badge variant="secondary" className={`${registrationData.role === 'official' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'} capitalize font-semibold text-xs ml-1`}>
                      {registrationData.role}
                    </Badge>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="p-3 bg-gradient-to-r from-green-50 to-white">
              <CardContent className="p-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xs text-gray-500 font-medium">
                    Barangay: <span className="text-sm font-semibold text-gray-900 ml-1">{registrationData.barangay}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName-desktop" className="text-gray-700">First Name *</Label>
              <Input id="firstName-desktop" name="firstName" value={formData.firstName} onChange={handleInputChange} required className={`mt-1 h-12 border-gray-300 ${registrationData.role === 'official' ? 'focus:border-red-500 focus:ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'}`} />
            </div>
            <div>
              <Label htmlFor="lastName-desktop" className="text-gray-700">Last Name *</Label>
              <Input id="lastName-desktop" name="lastName" value={formData.lastName} onChange={handleInputChange} required className={`mt-1 h-12 border-gray-300 ${registrationData.role === 'official' ? 'focus:border-red-500 focus:ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'}`} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="middleName-desktop" className="text-gray-700">Middle Name</Label>
              <Input id="middleName-desktop" name="middleName" value={formData.middleName} onChange={handleInputChange} className={`mt-1 h-12 border-gray-300 ${registrationData.role === 'official' ? 'focus:border-red-500 focus:ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'}`} />
            </div>
            <div>
              <Label htmlFor="suffix-desktop" className="text-gray-700">Suffix</Label>
              <Select value={formData.suffix} onValueChange={handleSuffixChange}>
                <SelectTrigger className={`mt-1 h-12 border-gray-300 ${registrationData.role === 'official' ? 'focus:border-red-500 focus:ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'}`}>
                  <SelectValue placeholder="Select suffix" />
                </SelectTrigger>
                <SelectContent>
                  {COMMON_SUFFIXES.map((suffix) => (
                    <SelectItem key={suffix} value={suffix}>
                      {suffix}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="email-desktop" className="text-gray-700">Email Address *</Label>
            <Input id="email-desktop" name="email" type="email" value={formData.email} onChange={handleInputChange} required className={`mt-1 h-12 border-gray-300 ${registrationData.role === 'official' ? 'focus:border-red-500 focus:ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'}`} />
          </div>

          <div>
            <Label htmlFor="password-desktop" className="text-gray-700">Password *</Label>
            <div className="relative mt-1">
              <Input id="password-desktop" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleInputChange} required className={`h-12 border-gray-300 pr-10 ${registrationData.role === 'official' ? 'focus:border-red-500 focus:ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'}`} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="text-center text-sm text-gray-600 leading-5">
            By tapping Create new account, you agree with the{" "}
            <a href="/terms" className={registrationData.role === 'official' ? 'text-red-600 hover:underline' : 'text-blue-600 hover:underline'}>
              Terms and Conditions
            </a>{" "}
            and{" "}
            <a href="/privacy" className={registrationData.role === 'official' ? 'text-red-600 hover:underline' : 'text-blue-600 hover:underline'}>
              Privacy Notice
            </a>
          </div>

          <Button type="submit" disabled={isLoading} className={`w-full text-white py-3 h-12 text-base font-medium ${registrationData.role === 'official' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {isLoading ? "Creating Account..." : "Create new account"}
          </Button>
        </form>
      </div>
    </div>
  );
}
