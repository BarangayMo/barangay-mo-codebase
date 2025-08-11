import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Users, Shield, Check } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { RegistrationProgress } from "@/components/ui/registration-progress";

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState("");
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Restore role from localStorage on component mount
  useEffect(() => {
    const savedRole = localStorage.getItem('registration_role');
    if (savedRole) {
      setSelectedRole(savedRole);
    }
  }, []);

  // Save role to localStorage whenever it changes
  useEffect(() => {
    if (selectedRole) {
      localStorage.setItem('registration_role', selectedRole);
    }
  }, [selectedRole]);

  const handleNext = () => {
    // Save role to localStorage before navigation
    localStorage.setItem('registration_role', selectedRole);
    
    // Both resident and official go to location selection first
    navigate("/register/location", { state: { role: selectedRole } });
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-1">
          <div className={`h-1 w-1/4 ${selectedRole === 'official' ? 'bg-red-600' : 'bg-blue-600'}`}></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
          <Link to="/welcome" className="text-gray-600 hover:text-gray-800">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">Select Role</h1>
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
              <h2 className="text-xl font-bold text-gray-900 mb-2">Choose Your Role</h2>
              <p className="text-gray-600 text-sm">Select how you'll be using the platform</p>
            </div>

            {/* Role Selection */}
            <RadioGroup
              value={selectedRole}
              onValueChange={setSelectedRole}
              className="space-y-4"
            >
              <div>
                <RadioGroupItem value="resident" id="resident" className="peer sr-only" />
                <Label 
                  htmlFor="resident" 
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedRole === "resident" 
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200" 
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center space-x-4 w-full">
                    <div className={`p-3 rounded-full ${
                      selectedRole === "resident" ? "bg-blue-200 text-blue-700" : "bg-blue-100 text-blue-600"
                    }`}>
                      <Users className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Resident</div>
                      <div className="text-sm text-gray-500">Access community services</div>
                    </div>
                    {selectedRole === "resident" && (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </Label>
              </div>

              <div>
                <RadioGroupItem value="official" id="official" className="peer sr-only" />
                <Label 
                  htmlFor="official" 
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedRole === "official" 
                      ? "border-red-500 bg-red-50 ring-2 ring-red-200" 
                      : "border-gray-200 hover:border-red-300"
                  }`}
                >
                  <div className="flex items-center space-x-4 w-full">
                    <div className={`p-3 rounded-full ${
                      selectedRole === "official" ? "bg-red-200 text-red-700" : "bg-red-100 text-red-600"
                    }`}>
                      <Shield className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Barangay Official</div>
                      <div className="text-sm text-gray-500">Manage barangay services</div>
                    </div>
                    {selectedRole === "official" && (
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Next Button */}
          <Button
            onClick={handleNext}
            disabled={!selectedRole}
            className={`w-full text-white py-3 h-12 text-base font-medium ${
              selectedRole === 'official' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }

  // Desktop version - Full screen
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header with Progress Bar */}
      <div className="sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <Link to="/welcome" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Link>
            <img 
              src={selectedRole === 'official' 
                ? "/lovable-uploads/141c2a56-35fc-4123-a51f-358481e0f167.png"
                : "/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png"
              } 
              alt="eGov.PH Logo" 
              className="h-8 w-auto" 
            />
          </div>
          <RegistrationProgress currentStep="role" userRole={selectedRole as 'resident' | 'official'} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Choose Your Role</h1>
          <p className="text-gray-600">Select how you'll be using the platform</p>
        </div>
        
        {/* Role Selection */}
        <RadioGroup
          value={selectedRole}
          onValueChange={setSelectedRole}
          className="space-y-4 mb-8"
        >
          <div>
            <RadioGroupItem value="resident" id="resident-desktop" className="peer sr-only" />
            <Label 
              htmlFor="resident-desktop" 
              className={`flex items-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                selectedRole === "resident" 
                  ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200" 
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className="flex items-center space-x-4 w-full">
                <div className={`p-3 rounded-full ${
                  selectedRole === "resident" ? "bg-blue-200 text-blue-700" : "bg-blue-100 text-blue-600"
                }`}>
                  <Users className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Resident</div>
                  <div className="text-sm text-gray-500">Access community services</div>
                </div>
                {selectedRole === "resident" && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </Label>
          </div>

          <div>
            <RadioGroupItem value="official" id="official-desktop" className="peer sr-only" />
            <Label 
              htmlFor="official-desktop" 
              className={`flex items-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                selectedRole === "official" 
                  ? "border-red-500 bg-red-50 ring-2 ring-red-200" 
                  : "border-gray-200 hover:border-red-300"
              }`}
            >
              <div className="flex items-center space-x-4 w-full">
                <div className={`p-3 rounded-full ${
                  selectedRole === "official" ? "bg-red-200 text-red-700" : "bg-red-100 text-red-600"
                }`}>
                  <Shield className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Barangay Official</div>
                  <div className="text-sm text-gray-500">Manage barangay services</div>
                </div>
                {selectedRole === "official" && (
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </Label>
          </div>
        </RadioGroup>

        {/* Next Button */}
        <Button
          onClick={handleNext}
          disabled={!selectedRole}
          className={`w-full text-white py-3 text-base font-medium ${
            selectedRole === 'official' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
