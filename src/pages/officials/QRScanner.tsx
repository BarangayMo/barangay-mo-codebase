
import { useState } from "react";
import { ArrowLeft, Camera, FlashlightIcon as Flashlight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const QRScanner = () => {
  const navigate = useNavigate();
  const [isFlashOn, setIsFlashOn] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-red-600 text-white p-4">
        <div className="flex items-center gap-3">
          <ArrowLeft 
            className="h-6 w-6 cursor-pointer" 
            onClick={() => navigate(-1)}
          />
          <h1 className="text-lg font-semibold">QR ID Scanner</h1>
        </div>
      </div>

      {/* Scanner Area */}
      <div className="relative bg-gray-900 h-96 flex items-center justify-center">
        {/* Blue scanning lines */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-0 right-0 h-0.5 bg-blue-500 animate-pulse"></div>
          <div className="absolute top-32 left-0 right-0 h-0.5 bg-blue-500 animate-pulse" style={{animationDelay: '0.5s'}}></div>
        </div>
        
        {/* Scanning Frame */}
        <div className="relative w-48 h-48 border-2 border-transparent">
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-cyan-400"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-cyan-400"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-cyan-400"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-cyan-400"></div>
          
          {/* ID Card placeholder */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-20 h-12 bg-white rounded-sm border border-gray-300 flex items-center justify-center">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Flash toggle button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 text-white hover:bg-white/20"
          onClick={() => setIsFlashOn(!isFlashOn)}
        >
          <Flashlight className={`h-5 w-5 ${isFlashOn ? 'text-yellow-400' : 'text-white'}`} />
        </Button>
      </div>

      {/* Content Area with curved top */}
      <div className="bg-white rounded-t-3xl -mt-8 relative z-10 p-6 min-h-96">
        {/* Red logo/icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
            <div className="text-white font-bold text-xl">🆔</div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
          Scan Resident Barangay ID
        </h2>
        
        <p className="text-gray-600 text-center mb-6">
          Position the ID within the frame for scanning
        </p>

        {/* Instructions */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
            <span className="text-gray-700">Ensure good lighting</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
            <span className="text-gray-700">Hold your device steady</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
            <span className="text-gray-700">Avoid glare on the ID</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button 
            className="flex-1 bg-red-600 hover:bg-red-700"
            onClick={() => {
              // Handle manual input or other actions
              console.log("Manual input or other action");
            }}
          >
            Manual Input
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
