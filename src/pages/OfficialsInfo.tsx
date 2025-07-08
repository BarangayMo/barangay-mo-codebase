import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, AlertTriangle } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";

interface LocationState {
  role: string;
  region: string;
  province: string;
  municipality: string;
  barangay: string;
}

export default function OfficialsInfo() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const locationState = location.state as LocationState;

  const [formData, setFormData] = useState({
    // Barangay Captain
    captain: "",
    
    // 7 Councilors (arranged by ranking)
    councilor1: "",
    councilor2: "",
    councilor3: "",
    councilor4: "",
    councilor5: "",
    councilor6: "",
    councilor7: "",
    
    // SK Chairman
    skChairman: "",
    
    // 7 SK Councilors
    skCouncilor1: "",
    skCouncilor2: "",
    skCouncilor3: "",
    skCouncilor4: "",
    skCouncilor5: "",
    skCouncilor6: "",
    skCouncilor7: "",
    
    // Barangay Secretary
    secretary: "",
    
    // Optional fields
    treasurer: "",
    indigenousPeople: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    return formData.captain && 
           formData.councilor1 && 
           formData.skChairman && 
           formData.skCouncilor1 && 
           formData.secretary;
  };

  const handleNext = () => {
    if (isFormValid()) {
      navigate("/register/details", { 
        state: { 
          ...locationState,
          officials: formData
        } 
      });
    }
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-1">
          <div className="bg-blue-600 h-1 w-3/4"></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <Link to="/register/location" className="text-gray-600 hover:text-gray-800">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">Officials Info</h1>
          <div className="w-6" />
        </div>

        {/* Already Registered Alert */}
        <div className="mx-4 mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-orange-800">Already Registered</p>
              <p className="text-xs text-orange-700 mt-1">
                The barangay is already a Registered Smart Barangay. Please respect your barangay.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-6">
            {/* Selected Location */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">{locationState?.barangay}</h3>
              <p className="text-sm text-gray-600">Registered Smart Barangay</p>
            </div>

            {/* Barangay Officials */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Barangay Officials</h3>
              
              {/* Barangay Captain */}
              <div>
                <Label htmlFor="captain" className="text-sm font-medium text-gray-700">
                  Barangay Captain *
                </Label>
                <Input
                  id="captain"
                  name="captain"
                  value={formData.captain}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  className="mt-1"
                  required
                />
              </div>

              {/* Councilors */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Barangay Councilors (by ranking)</Label>
                {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                  <Input
                    key={num}
                    name={`councilor${num}`}
                    value={formData[`councilor${num}` as keyof typeof formData]}
                    onChange={handleInputChange}
                    placeholder={`Councilor ${num}${num === 1 ? ' *' : ''}`}
                    required={num === 1}
                  />
                ))}
              </div>
            </div>

            {/* SK Officials */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Sangguniang Kabataan Officials</h3>
              
              {/* SK Chairman */}
              <div>
                <Label htmlFor="skChairman" className="text-sm font-medium text-gray-700">
                  SK Chairman *
                </Label>
                <Input
                  id="skChairman"
                  name="skChairman"
                  value={formData.skChairman}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  className="mt-1"
                  required
                />
              </div>

              {/* SK Councilors */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">SK Councilors</Label>
                {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                  <Input
                    key={num}
                    name={`skCouncilor${num}`}
                    value={formData[`skCouncilor${num}` as keyof typeof formData]}
                    onChange={handleInputChange}
                    placeholder={`SK Councilor ${num}${num === 1 ? ' *' : ''}`}
                    required={num === 1}
                  />
                ))}
              </div>
            </div>

            {/* Other Officials */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Other Officials</h3>
              
              {/* Secretary */}
              <div>
                <Label htmlFor="secretary" className="text-sm font-medium text-gray-700">
                  Barangay Secretary *
                </Label>
                <Input
                  id="secretary"
                  name="secretary"
                  value={formData.secretary}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  className="mt-1"
                  required
                />
              </div>

              {/* Treasurer (Optional) */}
              <div>
                <Label htmlFor="treasurer" className="text-sm font-medium text-gray-700">
                  Treasurer (Optional)
                </Label>
                <Input
                  id="treasurer"
                  name="treasurer"
                  value={formData.treasurer}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  className="mt-1"
                />
              </div>

              {/* Indigenous People (Optional) */}
              <div>
                <Label htmlFor="indigenousPeople" className="text-sm font-medium text-gray-700">
                  Indigenous People Representative (Optional)
                </Label>
                <Input
                  id="indigenousPeople"
                  name="indigenousPeople"
                  value={formData.indigenousPeople}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Next Button */}
        <div className="p-4 border-t">
          <Button
            onClick={handleNext}
            disabled={!isFormValid()}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 h-12 text-base font-medium"
          >
            NEXT
          </Button>
        </div>
      </div>
    );
  }

  // Desktop version - similar structure but with desktop styling
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50 px-4 py-8">
      <div className="max-w-2xl w-full bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-1">
          <div className="bg-blue-600 h-1 w-3/4"></div>
        </div>

        <div className="p-8 max-h-[80vh] overflow-y-auto">
          <Link to="/register/location" className="inline-flex items-center text-sm text-gray-500 mb-6 hover:text-gray-700">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Link>
          
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Barangay Officials Information</h1>
            <p className="text-gray-600">Please provide the names of current barangay officials</p>
          </div>

          {/* Content - similar to mobile but with desktop styling */}
          <div className="space-y-6">
            {/* Selected Location */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">{locationState?.barangay}</h3>
              <p className="text-sm text-gray-600">Registered Smart Barangay</p>
            </div>

            {/* Barangay Officials */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Barangay Officials</h3>
              
              {/* Barangay Captain */}
              <div>
                <Label htmlFor="captain-desktop" className="text-sm font-medium text-gray-700">
                  Barangay Captain *
                </Label>
                <Input
                  id="captain-desktop"
                  name="captain"
                  value={formData.captain}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  className="mt-1"
                  required
                />
              </div>

              {/* Councilors */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Barangay Councilors (by ranking)</Label>
                {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                  <Input
                    key={num}
                    name={`councilor${num}`}
                    value={formData[`councilor${num}` as keyof typeof formData]}
                    onChange={handleInputChange}
                    placeholder={`Councilor ${num}${num === 1 ? ' *' : ''}`}
                    required={num === 1}
                  />
                ))}
              </div>
            </div>

            {/* SK Officials */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Sangguniang Kabataan Officials</h3>
              
              {/* SK Chairman */}
              <div>
                <Label htmlFor="skChairman-desktop" className="text-sm font-medium text-gray-700">
                  SK Chairman *
                </Label>
                <Input
                  id="skChairman-desktop"
                  name="skChairman"
                  value={formData.skChairman}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  className="mt-1"
                  required
                />
              </div>

              {/* SK Councilors */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">SK Councilors</Label>
                {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                  <Input
                    key={num}
                    name={`skCouncilor${num}`}
                    value={formData[`skCouncilor${num}` as keyof typeof formData]}
                    onChange={handleInputChange}
                    placeholder={`SK Councilor ${num}${num === 1 ? ' *' : ''}`}
                    required={num === 1}
                  />
                ))}
              </div>
            </div>

            {/* Other Officials */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Other Officials</h3>
              
              {/* Secretary */}
              <div>
                <Label htmlFor="secretary-desktop" className="text-sm font-medium text-gray-700">
                  Barangay Secretary *
                </Label>
                <Input
                  id="secretary-desktop"
                  name="secretary"
                  value={formData.secretary}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  className="mt-1"
                  required
                />
              </div>

              {/* Treasurer (Optional) */}
              <div>
                <Label htmlFor="treasurer-desktop" className="text-sm font-medium text-gray-700">
                  Treasurer (Optional)
                </Label>
                <Input
                  id="treasurer-desktop"
                  name="treasurer"
                  value={formData.treasurer}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  className="mt-1"
                />
              </div>

              {/* Indigenous People (Optional) */}
              <div>
                <Label htmlFor="indigenousPeople-desktop" className="text-sm font-medium text-gray-700">
                  Indigenous People Representative (Optional)
                </Label>
                <Input
                  id="indigenousPeople-desktop"
                  name="indigenousPeople"
                  value={formData.indigenousPeople}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Next Button */}
          <Button
            onClick={handleNext}
            disabled={!isFormValid()}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-base font-medium mt-8"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
