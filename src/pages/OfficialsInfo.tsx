import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function OfficialsInfo() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const locationState = location.state;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [position, setPosition] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");

  const handleNext = () => {
    // Validate if required fields are filled
    if (firstName && lastName && position && contactNumber && email) {
      // Navigate to the next step (Logo Upload) and pass the data
      navigate("/register/logo", {
        state: {
          ...locationState,
          firstName,
          lastName,
          position,
          contactNumber,
          email,
        },
      });
    } else {
      // Optionally, show an error message if fields are missing
      alert("Please fill in all required fields.");
    }
  };

  const handleBack = () => {
    navigate("/register/location");
  };

  const isFormValid = firstName && lastName && position && contactNumber && email;

  if (isMobile) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Progress Bar - exactly like role page */}
        <div className="w-full bg-gray-200 h-1">
          <div className="h-1 w-3/5 bg-red-600"></div>
        </div>

        {/* Header - exactly like role page */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
          <button onClick={handleBack} className="text-gray-600 hover:text-gray-800">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Official Details</h1>
          <div className="w-6" />
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-6 bg-white">
          {/* First Name */}
          <div>
            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 block mb-2">
              First Name
            </Label>
            <Input
              type="text"
              id="firstName"
              placeholder="Enter first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full h-12 rounded-lg"
            />
          </div>

          {/* Last Name */}
          <div>
            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 block mb-2">
              Last Name
            </Label>
            <Input
              type="text"
              id="lastName"
              placeholder="Enter last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full h-12 rounded-lg"
            />
          </div>

          {/* Position */}
          <div>
            <Label htmlFor="position" className="text-sm font-medium text-gray-700 block mb-2">
              Position
            </Label>
            <Input
              type="text"
              id="position"
              placeholder="Enter position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full h-12 rounded-lg"
            />
          </div>

          {/* Contact Number */}
          <div>
            <Label htmlFor="contactNumber" className="text-sm font-medium text-gray-700 block mb-2">
              Contact Number
            </Label>
            <Input
              type="tel"
              id="contactNumber"
              placeholder="Enter contact number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="w-full h-12 rounded-lg"
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700 block mb-2">
              Email Address
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 rounded-lg"
            />
          </div>
        </div>

        {/* Next Button */}
        <div className="p-6 bg-white border-t">
          <Button
            onClick={handleNext}
            disabled={!isFormValid}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 h-12 text-base font-medium rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Next
          </Button>
        </div>
      </div>
    );
  }

  // Desktop version
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Progress Bar - exactly like role page */}
        <div className="w-full bg-gray-200 h-1">
          <div className="h-1 w-3/5 bg-red-600"></div>
        </div>

        {/* Header - exactly like role page */}
        <div className="p-8 bg-white">
          <button onClick={handleBack} className="inline-flex items-center text-sm text-gray-500 mb-6 hover:text-gray-700">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </button>
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Official Details</h2>
          </div>

          <div className="space-y-6">
            {/* First Name */}
            <div>
              <Label htmlFor="firstName-desktop" className="text-sm font-medium text-gray-700 block mb-2">
                First Name
              </Label>
              <Input
                type="text"
                id="firstName-desktop"
                placeholder="Enter first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full h-12 rounded-lg"
              />
            </div>

            {/* Last Name */}
            <div>
              <Label htmlFor="lastName-desktop" className="text-sm font-medium text-gray-700 block mb-2">
                Last Name
              </Label>
              <Input
                type="text"
                id="lastName-desktop"
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full h-12 rounded-lg"
              />
            </div>

            {/* Position */}
            <div>
              <Label htmlFor="position-desktop" className="text-sm font-medium text-gray-700 block mb-2">
                Position
              </Label>
              <Input
                type="text"
                id="position-desktop"
                placeholder="Enter position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full h-12 rounded-lg"
              />
            </div>

            {/* Contact Number */}
            <div>
              <Label htmlFor="contactNumber-desktop" className="text-sm font-medium text-gray-700 block mb-2">
                Contact Number
              </Label>
              <Input
                type="tel"
                id="contactNumber-desktop"
                placeholder="Enter contact number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full h-12 rounded-lg"
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email-desktop" className="text-sm font-medium text-gray-700 block mb-2">
                Email Address
              </Label>
              <Input
                type="email"
                id="email-desktop"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 rounded-lg"
              />
            </div>
          </div>

          {/* Next Button */}
          <div className="mt-8">
            <Button
              onClick={handleNext}
              disabled={!isFormValid}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-4 h-12 text-base font-medium rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
