import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const RbiReview = ({ formData }) => {
  const [showAllDetails, setShowAllDetails] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="bg-blue-100 p-2 rounded-lg">
          <ShieldCheck className="text-blue-600 w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Review Your Information</h2>
          <p className="text-sm text-gray-500 mt-1">
            Please verify all details before final submission
          </p>
        </div>
      </div>
      
      <div className="space-y-6">
        <p className="text-gray-600">
          Please review your RBI (Record of Barangay Inhabitant) information before submission. Make sure all details are correct and complete.
        </p>
        
        <div className="space-y-4">
          {/* Personal Details Summary */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-2">Personal Details</h3>
            <div className="text-sm text-gray-700">
              <p><span className="font-medium">Name:</span> {formData?.personalDetails?.firstName || ""} {formData?.personalDetails?.middleName || ""} {formData?.personalDetails?.lastName || ""} {formData?.personalDetails?.suffix || ""}</p>
            </div>
          </div>
          
          {/* Address Details Summary */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-2">Address Details</h3>
            <div className="text-sm text-gray-700">
              <p><span className="font-medium">Address:</span> {formData?.address?.houseNumber || ""} {formData?.address?.street || ""}, {formData?.address?.barangay || ""}</p>
            </div>
          </div>
          
          {/* Other Details Summary */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-2">Other Details</h3>
            <div className="text-sm text-gray-700">
              <p><span className="font-medium">Date of Birth:</span> {formData?.otherDetails?.dateOfBirth || ""}</p>
              <p><span className="font-medium">Sex:</span> {formData?.otherDetails?.sex || ""}</p>
            </div>
          </div>
          
          {/* Show All Details */}
          {showAllDetails && (
            <>
              {/* Education Details */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-medium text-blue-800 mb-2">Education & Skills</h3>
                <div className="text-sm text-gray-700">
                  <p><span className="font-medium">Educational Attainment:</span> {formData?.education?.attainment || ""}</p>
                  <p><span className="font-medium">Profession:</span> {formData?.education?.profession || ""}</p>
                  <p><span className="font-medium">Skills:</span> {formData?.education?.skills || ""}</p>
                </div>
              </div>
              
              {/* Health Details */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-medium text-blue-800 mb-2">Health Details</h3>
                <div className="text-sm text-gray-700">
                  <p><span className="font-medium">Height:</span> {formData?.health?.height || ""} cm</p>
                  <p><span className="font-medium">Weight:</span> {formData?.health?.weight || ""} kg</p>
                  <p><span className="font-medium">Has Health Condition:</span> {formData?.health?.hasCondition || "No"}</p>
                </div>
              </div>
              
              {/* More sections as needed */}
            </>
          )}
          
          {/* Show More Button */}
          <div className="text-center pt-2">
            <Button 
              type="button"
              className="text-sm text-blue-600 hover:underline px-4 py-2 bg-blue-50 rounded-lg"
              onClick={() => setShowAllDetails(!showAllDetails)}
            >
              {showAllDetails ? "Show Less Details" : "Show All Details"}
            </Button>
          </div>
        </div>
        
        <div className="border-t pt-6 mt-4">
          <div className="bg-blue-100 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              By submitting this form, you certify that the information provided is true and correct to the best of your knowledge.
              False information may result in penalties as prescribed by law.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RbiReview;
