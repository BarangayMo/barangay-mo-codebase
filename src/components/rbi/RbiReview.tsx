import { ShieldCheck } from "lucide-react";

const RbiReview = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <ShieldCheck className="text-blue-600 w-6 h-6" />
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
              <p><span className="font-medium">Name:</span> Juan Dela Cruz</p>
            </div>
          </div>
          
          {/* Address Details Summary */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-2">Address Details</h3>
            <div className="text-sm text-gray-700">
              <p><span className="font-medium">Address:</span> 123 Sample St., Barangay New Cabalan</p>
            </div>
          </div>
          
          {/* Other Details Summary */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-2">Other Details</h3>
            <div className="text-sm text-gray-700">
              <p><span className="font-medium">Date of Birth:</span> January 1, 1990</p>
              <p><span className="font-medium">Sex:</span> Male</p>
            </div>
          </div>
          
          {/* Show More Button */}
          <div className="text-center pt-2">
            <button className="text-sm text-blue-600 hover:underline px-4 py-2 bg-blue-50 rounded-lg">
              Show All Details
            </button>
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
