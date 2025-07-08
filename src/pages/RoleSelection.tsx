
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Users, Shield, Check } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState("");
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleNext = () => {
    if (selectedRole === "official") {
      navigate("/register/location");
    } else {
      navigate("/register/details", { state: { role: selectedRole } });
    }
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-1">
          <div className="bg-blue-600 h-1 w-1/4"></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <Link to="/welcome" className="text-gray-600 hover:text-gray-800">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">Select Role</h1>
          <div className="w-6" />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between p-4">
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 h-12 text-base font-medium"
          >
            Next
          </Button>
        </div>
      </div>
    );
  }

  // Desktop version
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50 px-4 py-8">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-1">
          <div className="bg-blue-600 h-1 w-1/4"></div>
        </div>

        <div className="p-8">
          <Link to="/welcome" className="inline-flex items-center text-sm text-gray-500 mb-6 hover:text-gray-700">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Link>
          
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <img 
              src="/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png" 
              alt="eGov.PH Logo" 
              className="h-16 w-auto mx-auto mb-4" 
            />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Role</h1>
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-medium"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
