
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Edit2 } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { RegistrationProgress } from "@/components/ui/registration-progress";

interface LocationState {
  role: string;
  region: string;
  province: string;
  municipality: string;
  barangay: string;
}

interface OfficialData {
  name: string;
  position: string;
  isEditing: boolean;
}

export default function OfficialsInfo() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const locationState = location.state as LocationState;

  const [officials, setOfficials] = useState<OfficialData[]>([
    { name: "BILLY JOEL CAPISTRANO", position: "Punong Barangay", isEditing: false },
    { name: "LUIS CAPINPIN", position: "Sangguniang Barangay Member", isEditing: false },
    { name: "MERCEDES CAPISTRANO", position: "Sangguniang Barangay Member", isEditing: false },
  ]);

  const handleEditOfficial = (index: number) => {
    const updatedOfficials = [...officials];
    updatedOfficials[index].isEditing = !updatedOfficials[index].isEditing;
    setOfficials(updatedOfficials);
  };

  const handleOfficialNameChange = (index: number, newName: string) => {
    const updatedOfficials = [...officials];
    updatedOfficials[index].name = newName;
    setOfficials(updatedOfficials);
  };

  const handleNext = () => {
    navigate("/register/logo", { 
      state: { 
        ...locationState,
        officials: officials
      } 
    });
  };

  const handleBack = () => {
    navigate("/register/location", { 
      state: locationState 
    });
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 bg-red-600 text-white">
          <button onClick={handleBack} className="text-white hover:text-gray-200">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-bold">Edit Barangay Official</h1>
          <div className="w-6" />
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4">
          <RegistrationProgress currentStep="details" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Barangay Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-1">Your Barangay Details:</h3>
              <h2 className="text-lg font-bold text-gray-900">{locationState?.barangay}</h2>
            </div>

            {/* Officials List */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Please check the names of your officials</h3>
              
              {officials.map((official, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 text-sm">👤</span>
                    </div>
                    <div className="flex-1">
                      {official.isEditing ? (
                        <Input
                          value={official.name}
                          onChange={(e) => handleOfficialNameChange(index, e.target.value)}
                          className="font-medium"
                          onBlur={() => handleEditOfficial(index)}
                        />
                      ) : (
                        <div>
                          <p className="font-medium text-gray-900">{official.name}</p>
                          <p className="text-sm text-gray-600">{official.position}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleEditOfficial(index)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Verification Section */}
            <div className="space-y-4 mt-6">
              <h3 className="font-semibold text-gray-900">Verify/Confirm your official barangay number</h3>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🇵🇭</span>
                </div>
                <span className="text-sm text-gray-600">+63</span>
                <Input placeholder="12345" className="flex-1" />
              </div>
            </div>

            {/* Landline Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Landline</h3>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">📞</span>
                </div>
                <span className="text-sm text-gray-600">02</span>
                <Input placeholder="047-222-5173" className="flex-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Next Button */}
        <div className="p-4 border-t">
          <Button
            onClick={handleNext}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 h-12 text-base font-medium"
          >
            NEXT
          </Button>
        </div>
      </div>
    );
  }

  // Desktop version
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 px-4 py-8">
      <div className="max-w-2xl w-full bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Progress Bar */}
        <div className="px-8 py-6 border-b">
          <RegistrationProgress currentStep="details" />
        </div>

        <div className="p-8 max-h-[80vh] overflow-y-auto">
          <button onClick={handleBack} className="inline-flex items-center text-sm text-gray-500 mb-6 hover:text-gray-700">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </button>
          
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Edit Barangay Official</h1>
            <p className="text-gray-600">Update official information for your barangay</p>
          </div>

          {/* Content - similar structure to mobile but with desktop styling */}
          <div className="space-y-6">
            {/* Barangay Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-1">Your Barangay Details:</h3>
              <h2 className="text-lg font-bold text-gray-900">{locationState?.barangay}</h2>
            </div>

            {/* Officials List */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Please check the names of your officials</h3>
              
              {officials.map((official, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 text-sm">👤</span>
                    </div>
                    <div className="flex-1">
                      {official.isEditing ? (
                        <Input
                          value={official.name}
                          onChange={(e) => handleOfficialNameChange(index, e.target.value)}
                          className="font-medium"
                          onBlur={() => handleEditOfficial(index)}
                        />
                      ) : (
                        <div>
                          <p className="font-medium text-gray-900">{official.name}</p>
                          <p className="text-sm text-gray-600">{official.position}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleEditOfficial(index)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Verification and contact sections */}
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Verify/Confirm your official barangay number</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">🇵🇭</span>
                  </div>
                  <span className="text-sm text-gray-600">+63</span>
                  <Input placeholder="12345" className="flex-1" />
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Landline</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">📞</span>
                  </div>
                  <span className="text-sm text-gray-600">02</span>
                  <Input placeholder="047-222-5173" className="flex-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Next Button */}
          <Button
            onClick={handleNext}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-base font-medium mt-8"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
