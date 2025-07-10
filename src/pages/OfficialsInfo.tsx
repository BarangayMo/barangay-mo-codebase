import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  name: string;
  position: string;
}

const isValidName = (name: string) => {
  // Allows letters, spaces, periods, hyphens, and apostrophes
  return /^[a-zA-Z\s.'-]+$/.test(name);
};

const isValidPosition = (position: string) => {
  // Allows letters, spaces, periods, and hyphens
  return /^[a-zA-Z\s.-]+$/.test(position);
};

export default function OfficialsInfo() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const locationState = location.state as LocationState;

  const [officials, setOfficials] = useState<Official[]>([]);
  const [newOfficialName, setNewOfficialName] = useState("");
  const [newOfficialPosition, setNewOfficialPosition] = useState("");

  const handleAddOfficial = () => {
    if (!isValidName(newOfficialName)) {
      alert("Please enter a valid name for the official.");
      return;
    }

    if (!isValidPosition(newOfficialPosition)) {
      alert("Please enter a valid position for the official.");
      return;
    }

    const newOfficial = { name: newOfficialName, position: newOfficialPosition };
    setOfficials([...officials, newOfficial]);
    setNewOfficialName("");
    setNewOfficialPosition("");
  };

  const handleRemoveOfficial = (index: number) => {
    const updatedOfficials = [...officials];
    updatedOfficials.splice(index, 1);
    setOfficials(updatedOfficials);
  };

  const handleNext = () => {
    navigate("/register/logo", { 
      state: { 
        ...locationState,
        officials
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
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-1">
          <div className="bg-red-600 h-1 transition-all duration-300" style={{ width: '60%' }}></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 bg-white border-b">
          <button onClick={handleBack} className="text-gray-600 hover:text-gray-800">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Barangay Officials</h1>
          <div className="w-6" />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between p-4">
          {/* Officials List */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">List of Officials</h2>
            {officials.map((official, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-semibold text-gray-900">{official.name}</div>
                  <div className="text-sm text-gray-600">{official.position}</div>
                </div>
                <button onClick={() => handleRemoveOfficial(index)} className="text-red-600 hover:text-red-800">
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Official Form */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Add New Official</h2>
            <div>
              <Label htmlFor="official-name" className="block text-sm font-medium text-gray-700">
                Name
              </Label>
              <Input
                type="text"
                id="official-name"
                value={newOfficialName}
                onChange={(e) => setNewOfficialName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="official-position" className="block text-sm font-medium text-gray-700">
                Position
              </Label>
              <Input
                type="text"
                id="official-position"
                value={newOfficialPosition}
                onChange={(e) => setNewOfficialPosition(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button onClick={handleAddOfficial} className="w-full bg-green-600 hover:bg-green-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Official
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleNext}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 h-12 text-base font-medium"
            >
              NEXT
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Desktop version
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-1">
          <div className="bg-red-600 h-1 transition-all duration-300" style={{ width: '60%' }}></div>
        </div>

        {/* Header */}
        <div className="px-8 py-6 border-b bg-white">
          <button onClick={handleBack} className="inline-flex items-center text-sm text-gray-500 mb-4 hover:text-gray-700">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </button>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Barangay Officials</h2>
          </div>
        </div>

        <div className="p-8">
          {/* Officials List */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">List of Officials</h2>
            {officials.map((official, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-2">
                <div>
                  <div className="font-semibold text-gray-900">{official.name}</div>
                  <div className="text-sm text-gray-600">{official.position}</div>
                </div>
                <button onClick={() => handleRemoveOfficial(index)} className="text-red-600 hover:text-red-800">
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Official Form */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Add New Official</h2>
            <div>
              <Label htmlFor="official-name-desktop" className="block text-sm font-medium text-gray-700">
                Name
              </Label>
              <Input
                type="text"
                id="official-name-desktop"
                value={newOfficialName}
                onChange={(e) => setNewOfficialName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="official-position-desktop" className="block text-sm font-medium text-gray-700">
                Position
              </Label>
              <Input
                type="text"
                id="official-position-desktop"
                value={newOfficialPosition}
                onChange={(e) => setNewOfficialPosition(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button onClick={handleAddOfficial} className="w-full bg-green-600 hover:bg-green-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Official
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="mt-8">
            <Button
              onClick={handleNext}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-base font-medium"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
