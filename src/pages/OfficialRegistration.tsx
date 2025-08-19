import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { RegistrationProgress } from "@/components/ui/registration-progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { createClient } from '@supabase/supabase-js';
import { useRegionOfficialData } from '@/hooks/use-region-official-data';

interface LocationState {
  role: string;
  region: string;
  province: string;
  municipality: string;
  barangay: string;
  officials?: any[];
  logoUrl?: string;
}

const COMMON_SUFFIXES = [
  "Jr.",
  "Sr.", 
  "II",
  "III",
  "IV",
  "V"
];

const OFFICIAL_POSITIONS = [
  "Punong Barangay",
  "Barangay Secretary",
  "Barangay Treasurer",
  "Sangguniang Barangay Member",
  "SK Chairperson"
];

// Initialize Supabase client
const supabaseUrl = 'https://lsygeaoqahfryyfvpxrk.supabase.co'; // <-- Replace with your Supabase URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzeWdlYW9xYWhmcnl5ZnZweHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyMjcxODEsImV4cCI6MjA2MDgwMzE4MX0.G1OJ6IjdvIujheeEH8MeBqOaEvO2AMvS1XapMzEUpI4'; // <-- Replace with your anon key
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function OfficialRegistration() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const locationState = location.state as LocationState;
  const { toast } = useToast();

  // Get registration data from localStorage or location state
  const role = localStorage.getItem('registration_role') || locationState?.role;
  const region = localStorage.getItem('registration_region') || locationState?.region;
  const province = localStorage.getItem('registration_province') || locationState?.province;
  const municipality = localStorage.getItem('registration_municipality') || locationState?.municipality;
  const barangay = localStorage.getItem('registration_barangay') || locationState?.barangay;

  // Check if we need to redirect to role selection
  const needsRedirect = !role || role !== 'official' || !region || !province || !municipality || !barangay;

  // Handle redirect in useEffect to avoid render phase navigation
  useEffect(() => {
    if (needsRedirect) {
      navigate('/register/role');
    }
  }, [needsRedirect, navigate]);

  // Show loading or return null while redirecting
  if (needsRedirect) {
    return null;
  }

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

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    suffix: "",
    email: "",
    phoneNumber: "",
    landlineNumber: "",
    position: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch official data from region tables
  const { officialData, loading: fetchingData } = useRegionOfficialData(region!, barangay!, formData.position);

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

  const handlePositionChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      position: value
    }));
  };

  // Auto-populate form when official data is fetched
  useEffect(() => {
    if (officialData) {
      setFormData(prev => ({
        ...prev,
        firstName: officialData.firstName,
        lastName: officialData.lastName,
        middleName: officialData.middleName,
        suffix: officialData.suffix,
        landlineNumber: officialData.landlineNumber
      }));
    }
  }, [officialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    

    // Validate password strength
    if (formData.password.length < 8) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const registrationData = {
        first_name: formData.firstName,
        middle_name: formData.middleName || undefined,
        last_name: formData.lastName,
        suffix: formData.suffix || undefined,
        email: formData.email,
        phone_number: formData.phoneNumber,
        landline_number: formData.landlineNumber || undefined,
        position: formData.position,
        original_password: formData.password,
        barangay: barangay!,
        municipality: municipality!,
        province: province!,
        region: region!
      };
      const { data, error } = await supabase
        .from('officials')
        .insert([registrationData]);
      if (error) throw error;
      toast({
        title: "Registration Submitted!",
        description: "Your official registration has been submitted successfully and is now pending review.",
      });
      localStorage.removeItem('registration_role');
      localStorage.removeItem('registration_region');
      localStorage.removeItem('registration_province');
      localStorage.removeItem('registration_municipality');
      localStorage.removeItem('registration_barangay');
      navigate("/register/official-success", {
        state: {
          email: formData.email,
          name: `${formData.firstName} ${formData.lastName}`
        }
      });
    } catch (error: any) {
      console.error('Registration submission failed:', error);
      let errorMessage = "Failed to submit registration. Please try again.";
      if (error?.message) {
        if (error.message.includes('already exists') ||
            error.message.includes('Missing required fields') ||
            error.message.includes('Invalid email') ||
            error.message.includes('Registration already exists')) {
          errorMessage = error.message;
        } else if (error.message.includes('Failed to fetch') ||
                   error.message.includes('network')) {
          errorMessage = "Network error. Please check your connection and try again.";
        }
      }
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBackLink = () => {
    return registrationData.logoUrl ? "/register/logo" : "/register/officials";
  };

  const logoUrl = "/lovable-uploads/141c2a56-35fc-4123-a51f-358481e0f167.png";

  if (isMobile) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 text-white bg-red-600">
          <button onClick={() => navigate(getBackLink(), { state: registrationData })} className="text-white hover:text-gray-200">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-bold">Official Registration</h1>
          <div className="w-6" />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between p-4 bg-white">
          <div className="space-y-6">
            {/* Logo and Title */}
            <div className="text-center">
              <img src={logoUrl} alt="eGov.PH Logo" className="h-12 w-auto mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-4">Official Registration Form</h2>
              
              {/* Compact role and location display */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                <Card className="p-2 bg-gradient-to-r from-red-50 to-white">
                  <CardContent className="p-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 font-medium">
                        Role: <Badge variant="secondary" className="bg-red-100 text-red-700 capitalize font-semibold text-xs ml-1">
                          Official
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
                <Input 
                  id="firstName" 
                  name="firstName" 
                  value={formData.firstName} 
                  onChange={handleInputChange} 
                  required 
                  disabled={fetchingData}
                  className="mt-1 h-12 text-sm border-gray-300 focus:border-red-500 focus:ring-red-500 disabled:bg-gray-100" 
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
                  disabled={fetchingData}
                  className="mt-1 h-12 text-sm border-gray-300 focus:border-red-500 focus:ring-red-500 disabled:bg-gray-100" 
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
                  disabled={fetchingData}
                  className="mt-1 h-12 text-sm border-gray-300 focus:border-red-500 focus:ring-red-500 disabled:bg-gray-100" 
                />
              </div>
              <div>
                <Label htmlFor="suffix" className="text-gray-700 text-sm">Suffix</Label>
                <Select value={formData.suffix} onValueChange={handleSuffixChange} disabled={fetchingData}>
                  <SelectTrigger className="mt-1 h-12 text-sm border-gray-300 focus:border-red-500 focus:ring-red-500 disabled:bg-gray-100">
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
                <Label htmlFor="position" className="text-gray-700 text-sm">Position *</Label>
                <Select value={formData.position} onValueChange={handlePositionChange}>
                  <SelectTrigger className="mt-1 h-12 text-sm border-gray-300 focus:border-red-500 focus:ring-red-500">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {OFFICIAL_POSITIONS.map((position) => (
                      <SelectItem key={position} value={position}>
                        {position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  className="mt-1 h-12 text-sm border-gray-300 focus:border-red-500 focus:ring-red-500" 
                />
              </div>

              <div>
                <Label htmlFor="phoneNumber" className="text-gray-700 text-sm">Phone Number *</Label>
                <Input 
                  id="phoneNumber" 
                  name="phoneNumber" 
                  type="tel" 
                  value={formData.phoneNumber} 
                  onChange={handleInputChange} 
                  required 
                  className="mt-1 h-12 text-sm border-gray-300 focus:border-red-500 focus:ring-red-500" 
                />
              </div>

              <div>
                <Label htmlFor="landlineNumber" className="text-gray-700 text-sm">Landline Number</Label>
                <Input 
                  id="landlineNumber" 
                  name="landlineNumber" 
                  type="tel" 
                  value={formData.landlineNumber} 
                  onChange={handleInputChange} 
                  disabled={fetchingData}
                  className="mt-1 h-12 text-sm border-gray-300 focus:border-red-500 focus:ring-red-500 disabled:bg-gray-100" 
                />
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
                    className="h-12 text-sm border-gray-300 focus:border-red-500 focus:ring-red-500 pr-10" 
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
              </div>


              <div className="text-center text-xs text-gray-600 leading-4">
                By submitting this form, you agree with the{" "}
                <a href="/terms" className="text-red-600 hover:underline">
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-red-600 hover:underline">
                  Privacy Notice
                </a>
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 h-12 text-base font-medium"
              >
                {isSubmitting ? "Registering..." : "Register Form"}
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
          <RegistrationProgress currentStep="register" userRole="official" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Official Registration Form</h1>
          
          {/* Compact role and location display */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Card className="p-3 bg-gradient-to-r from-red-50 to-white">
              <CardContent className="p-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xs text-gray-500 font-medium">
                    Role: <Badge variant="secondary" className="bg-red-100 text-red-700 capitalize font-semibold text-xs ml-1">
                      Official
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
              <Input 
                id="firstName-desktop" 
                name="firstName" 
                value={formData.firstName} 
                onChange={handleInputChange} 
                required 
                disabled={fetchingData}
                className="mt-1 h-12 border-gray-300 focus:border-red-500 focus:ring-red-500 disabled:bg-gray-100" 
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
                disabled={fetchingData}
                className="mt-1 h-12 border-gray-300 focus:border-red-500 focus:ring-red-500 disabled:bg-gray-100" 
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
                disabled={fetchingData}
                className="mt-1 h-12 border-gray-300 focus:border-red-500 focus:ring-red-500 disabled:bg-gray-100" 
              />
            </div>
            <div>
              <Label htmlFor="suffix-desktop" className="text-gray-700">Suffix</Label>
              <Select value={formData.suffix} onValueChange={handleSuffixChange} disabled={fetchingData}>
                <SelectTrigger className="mt-1 h-12 border-gray-300 focus:border-red-500 focus:ring-red-500 disabled:bg-gray-100">
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
            <Label htmlFor="position-desktop" className="text-gray-700">Position *</Label>
            <Select value={formData.position} onValueChange={handlePositionChange}>
              <SelectTrigger className="mt-1 h-12 border-gray-300 focus:border-red-500 focus:ring-red-500">
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                {OFFICIAL_POSITIONS.map((position) => (
                  <SelectItem key={position} value={position}>
                    {position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              className="mt-1 h-12 border-gray-300 focus:border-red-500 focus:ring-red-500" 
            />
          </div>

          <div>
            <Label htmlFor="phoneNumber-desktop" className="text-gray-700">Phone Number *</Label>
            <Input 
              id="phoneNumber-desktop" 
              name="phoneNumber" 
              type="tel" 
              value={formData.phoneNumber} 
              onChange={handleInputChange} 
              required 
              className="mt-1 h-12 border-gray-300 focus:border-red-500 focus:ring-red-500" 
            />
          </div>

          <div>
            <Label htmlFor="landlineNumber-desktop" className="text-gray-700">Landline Number</Label>
            <Input 
              id="landlineNumber-desktop" 
              name="landlineNumber" 
              type="tel" 
              value={formData.landlineNumber} 
              onChange={handleInputChange} 
              disabled={fetchingData}
              className="mt-1 h-12 border-gray-300 focus:border-red-500 focus:ring-red-500 disabled:bg-gray-100" 
            />
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
                className="h-12 border-gray-300 focus:border-red-500 focus:ring-red-500 pr-10" 
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
          </div>


          <div className="text-center text-sm text-gray-600 leading-5">
            By submitting this form, you agree with the{" "}
            <a href="/terms" className="text-red-600 hover:underline">
              Terms and Conditions
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-red-600 hover:underline">
              Privacy Notice
            </a>
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 h-12 text-base font-medium"
          >
            {isSubmitting ? "Registering..." : "Register Form"}
          </Button>
        </form>
      </div>
    </div>
  );
}
