
import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Camera, FlashlightIcon as Flashlight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import QrScanner from 'qr-scanner';

const QRScanner = () => {
  const navigate = useNavigate();
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);

  useEffect(() => {
    const initializeScanner = async () => {
      if (videoRef.current) {
        try {
          const qrScanner = new QrScanner(
            videoRef.current,
            (result) => {
              console.log('QR Code detected:', result.data);
              setScannedData(result.data);
              setIsScanning(false);
              // Handle the scanned data here
              handleScanResult(result.data);
            },
            {
              returnDetailedScanResult: true,
              highlightScanRegion: true,
              highlightCodeOutline: true,
            }
          );
          
          qrScannerRef.current = qrScanner;
          await qrScanner.start();
          setIsScanning(true);
        } catch (error) {
          console.error('Error initializing QR scanner:', error);
        }
      }
    };

    initializeScanner();

    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.stop();
        qrScannerRef.current.destroy();
      }
    };
  }, []);

  const handleScanResult = (data: string) => {
    // Process the scanned QR code data
    console.log('Processing scanned data:', data);
    // You can add your logic here to handle the scanned resident ID
    alert(`Scanned ID: ${data}`);
  };

  const toggleFlash = async () => {
    if (qrScannerRef.current) {
      try {
        if (isFlashOn) {
          await qrScannerRef.current.turnFlashOff();
        } else {
          await qrScannerRef.current.turnFlashOn();
        }
        setIsFlashOn(!isFlashOn);
      } catch (error) {
        console.error('Error toggling flash:', error);
      }
    }
  };

  const startScanning = async () => {
    if (qrScannerRef.current && !isScanning) {
      try {
        await qrScannerRef.current.start();
        setIsScanning(true);
        setScannedData(null);
      } catch (error) {
        console.error('Error starting scanner:', error);
      }
    }
  };

  const stopScanning = () => {
    if (qrScannerRef.current && isScanning) {
      qrScannerRef.current.stop();
      setIsScanning(false);
    }
  };

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
      <div className="relative bg-gray-900 h-96 flex items-center justify-center overflow-hidden">
        {/* Video element for camera feed */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
        />
        
        {/* Scanning Frame Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-48 h-48 border-2 border-transparent">
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-cyan-400"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-cyan-400"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-cyan-400"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-cyan-400"></div>
          </div>
        </div>

        {/* Flash toggle button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 text-white hover:bg-white/20"
          onClick={toggleFlash}
        >
          <Flashlight className={`h-5 w-5 ${isFlashOn ? 'text-yellow-400' : 'text-white'}`} />
        </Button>

        {/* Scanning status indicator */}
        {isScanning && (
          <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
            Scanning...
          </div>
        )}
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

        {/* Scanned result display */}
        {scannedData && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">Scanned Successfully!</h3>
            <p className="text-green-700 text-sm break-all">{scannedData}</p>
          </div>
        )}

        {/* Instructions */}
        <div className="space-y-3 mb-6">
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

        {/* Control Buttons */}
        <div className="flex gap-3 mb-4">
          {!isScanning ? (
            <Button 
              className="flex-1 bg-red-600 hover:bg-red-700"
              onClick={startScanning}
            >
              <Camera className="h-4 w-4 mr-2" />
              Start Scanning
            </Button>
          ) : (
            <Button 
              variant="outline"
              className="flex-1"
              onClick={stopScanning}
            >
              Stop Scanning
            </Button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
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
              // Handle manual ID input
              const manualId = prompt("Enter Resident ID manually:");
              if (manualId) {
                handleScanResult(manualId);
              }
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
