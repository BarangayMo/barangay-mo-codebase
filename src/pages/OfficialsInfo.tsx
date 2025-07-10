import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { RegistrationProgress } from "@/components/ui/registration-progress";

interface LocationState {
  role: string;
  region: string;
  province: string;
  municipality: string;
  barangay: string;
}

interface Official {
  position: string;
  name: string;
  contact: string;
}

const officialPositions = [
  "Barangay Captain",
  "Kagawad (Councilor) - Peace and Order",
  "Kagawad (Councilor) - Health",
  "Kagawad (Councilor) - Agriculture",
  "Kagawad (Councilor) - Education",
  "Kagawad (Councilor) - Infrastructure",
  "Kagawad (Councilor) - Women and Family",
  "Barangay Secretary",
  "Barangay Treasurer"
];

export default function OfficialsInfo() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const locationState = location.state as LocationState;

  // If no location state, redirect to role selection
  if (!locationState?.role) {
    navigate('/register/role');
    return null;
  }

  const [officials, setOfficials] = useState<Official[]>([]);

  const addOfficial = () => {
    setOfficials([...officials, { position: "", name: "", contact: "" }]);
  };

  const updateOfficial = (index: number, field: string, value: string) => {
    const updatedOfficials = [...officials];
    updatedOfficials[index][field] = value;
    setOfficials(updatedOfficials);
  };

  const removeOfficial = (index: number) => {
    const updatedOfficials = officials.filter((_, i) => i !== index);
    setOfficials(updatedOfficials);
  };

  const handleNext = () => {
    const nextState = {
      role: locationState.role,
      region: locationState.region,
      province: locationState.province,
      municipality: locationState.municipality,
      barangay: locationState.barangay,
      officials: officials
    };
    navigate("/register/logo", { state: nextState });
  };

  const handleBack = () => {
     navigate("/register/location", { state: locationState });
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Progress Bar at the very top */}
        <div className="w-full">
          <RegistrationProgress currentStep="details" userRole="official" />
        </div>

        {/* White Header */}
        <div className="flex items-center justify-between px-4 py-4 bg-white border-b">
          <button onClick={handleBack} className="text-gray-600 hover:text-gray-800">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Barangay Officials</h1>
          <div className="w-6" />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between p-4 bg-white">
          <div className="space-y-4">
            <div className="text-center">
              <img
                src="/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png"
                alt="eGov.PH Logo"
                className="h-12 w-auto mx-auto mb-4"
              />
              <h2 className="text-xl font-bold text-gray-900">Barangay Officials Information</h2>
              <p className="text-gray-600 text-sm">Add the contact information for your barangay officials</p>
            </div>

            {officials.map((official, index) => (
              <div key={index} className="border rounded-md p-4">
                <div className="mb-2">
                  <Label htmlFor={`position-${index}`} className="block text-sm font-medium text-gray-700">
                    Position
                  </Label>
                  <select
                    id={`position-${index}`}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                    value={official.position}
                    onChange={(e) => updateOfficial(index, "position", e.target.value)}
                  >
                    <option value="">Select Position</option>
                    {officialPositions.map((position) => (
                      <option key={position} value={position}>
                        {position}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <Label htmlFor={`name-${index}`} className="block text-sm font-medium text-gray-700">
                    Name
                  </Label>
                  <Input
                    type="text"
                    id={`name-${index}`}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                    value={official.name}
                    onChange={(e) => updateOfficial(index, "name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`contact-${index}`} className="block text-sm font-medium text-gray-700">
                    Contact Number
                  </Label>
                  <Input
                    type="text"
                    id={`contact-${index}`}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                    value={official.contact}
                    onChange={(e) => updateOfficial(index, "contact", e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="mt-2 text-red-600 hover:text-red-800 text-sm"
                  onClick={() => removeOfficial(index)}
                >
                  <Trash2 className="h-4 w-4 inline-block mr-1 align-text-top" />
                  Remove
                </button>
              </div>
            ))}

            <Button variant="outline" className="w-full justify-center" onClick={addOfficial}>
              <Plus className="h-4 w-4 mr-2" />
              Add Official
            </Button>
          </div>

          <div className="space-y-3">
            <Button onClick={handleNext} className="w-full bg-red-600 hover:bg-red-700 text-white">
              Next
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Desktop version
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="max-w-2xl w-full bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Progress Bar at the very top */}
        <div className="w-full">
          <RegistrationProgress currentStep="details" userRole="official" />
        </div>

        {/* White Header */}
        <div className="px-8 py-6 border-b bg-white">
          <button onClick={handleBack} className="inline-flex items-center text-sm text-gray-500 mb-4 hover:text-gray-700">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Barangay Officials Information</h1>
            <p className="text-gray-600 mt-2">Add the contact information for your barangay officials</p>
          </div>
        </div>

        <div className="p-8 bg-white max-h-[70vh] overflow-y-auto">
          <div className="space-y-4">
            <div className="text-center">
              <img
                src="/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png"
                alt="eGov.PH Logo"
                className="h-16 w-auto mx-auto mb-4"
              />
            </div>

            {officials.map((official, index) => (
              <div key={index} className="border rounded-md p-4">
                <div className="mb-2">
                  <Label htmlFor={`position-${index}-desktop`} className="block text-sm font-medium text-gray-700">
                    Position
                  </Label>
                  <select
                    id={`position-${index}-desktop`}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                    value={official.position}
                    onChange={(e) => updateOfficial(index, "position", e.target.value)}
                  >
                    <option value="">Select Position</option>
                    {officialPositions.map((position) => (
                      <option key={position} value={position}>
                        {position}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <Label htmlFor={`name-${index}-desktop`} className="block text-sm font-medium text-gray-700">
                    Name
                  </Label>
                  <Input
                    type="text"
                    id={`name-${index}-desktop`}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                    value={official.name}
                    onChange={(e) => updateOfficial(index, "name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`contact-${index}-desktop`} className="block text-sm font-medium text-gray-700">
                    Contact Number
                  </Label>
                  <Input
                    type="text"
                    id={`contact-${index}-desktop`}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                    value={official.contact}
                    onChange={(e) => updateOfficial(index, "contact", e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="mt-2 text-red-600 hover:text-red-800 text-sm"
                  onClick={() => removeOfficial(index)}
                >
                  <Trash2 className="h-4 w-4 inline-block mr-1 align-text-top" />
                  Remove
                </button>
              </div>
            ))}

            <Button variant="outline" className="w-full justify-center" onClick={addOfficial}>
              <Plus className="h-4 w-4 mr-2" />
              Add Official
            </Button>
          </div>

          <div className="mt-8">
            <Button onClick={handleNext} className="w-full bg-red-600 hover:bg-red-700 text-white">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
