import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Upload, Image } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { RegistrationProgress } from "@/components/ui/registration-progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LocationState {
  role: string;
  region: string;
  province: string;
  municipality: string;
  barangay: string;
  officials: any[];
  phoneNumber: string;
  landlineNumber: string;
}

export default function LogoUpload() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const locationState = location.state as LocationState;
  const { toast } = useToast();

  const [logoUrl, setLogoUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { data, error } = await supabase.storage
        .from('companylogo')
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      // Get public URL - Fixed method name from getPublicURL to getPublicUrl
      const { data: { publicUrl } } = supabase.storage
        .from('companylogo')
        .getPublicUrl(filePath);

      setLogoUrl(publicUrl);
      
      toast({
        title: "Logo uploaded successfully",
        description: "Your barangay logo has been uploaded",
      });
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload logo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleNext = () => {
    navigate("/register/details", { 
      state: { 
        ...locationState,
        logoUrl
      } 
    });
  };

  const handleBack = () => {
    navigate("/register/officials", { 
      state: locationState 
    });
  };

  const handleSkip = () => {
    navigate("/register/details", { 
      state: { 
        ...locationState,
        logoUrl: ""
      } 
    });
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-1">
          <div className="bg-red-600 h-1 transition-all duration-300" style={{ width: '80%' }}></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 bg-white border-b">
          <button onClick={handleBack} className="text-gray-600 hover:text-gray-800">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Upload Logo</h1>
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
              <h2 className="text-xl font-bold text-gray-900 mb-2">Upload Barangay Logo</h2>
              <p className="text-gray-600 text-sm">Add your official barangay logo (optional)</p>
            </div>

            {/* Upload Area */}
            <div className="space-y-4">
              {logoUrl ? (
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-lg overflow-hidden border-2 border-gray-200">
                    <img 
                      src={logoUrl} 
                      alt="Uploaded logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-sm text-green-600 font-medium">Logo uploaded successfully!</p>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-4">
                    Click to upload your barangay logo
                  </p>
                  <p className="text-xs text-gray-400">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              )}

              <input
                type="file"
                id="logo-upload"
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
              />

              <Button
                onClick={() => document.getElementById('logo-upload')?.click()}
                variant="outline"
                className="w-full"
                disabled={isUploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? "Uploading..." : logoUrl ? "Change Logo" : "Upload Logo"}
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleNext}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 h-12 text-base font-medium"
            >
              NEXT
            </Button>
            <Button
              onClick={handleSkip}
              variant="ghost"
              className="w-full text-gray-600 hover:text-gray-800"
            >
              Skip for now
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
          <div className="bg-red-600 h-1 transition-all duration-300" style={{ width: '80%' }}></div>
        </div>

        {/* Header */}
        <div className="px-8 py-6 border-b bg-white">
          <button onClick={handleBack} className="inline-flex items-center text-sm text-gray-500 mb-4 hover:text-gray-700">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </button>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Upload Logo</h2>
          </div>
        </div>

        <div className="p-8">
          {/* Logo and Title */}
          <div className="text-center">
            <img 
              src="/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png" 
              alt="eGov.PH Logo" 
              className="h-16 w-auto mx-auto mb-4" 
            />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Upload Barangay Logo</h1>
            <p className="text-gray-600">Add your official barangay logo (optional)</p>
          </div>

          {/* Upload Area */}
          <div className="space-y-6 mb-8">
            {logoUrl ? (
              <div className="text-center">
                <div className="w-40 h-40 mx-auto mb-4 rounded-lg overflow-hidden border-2 border-gray-200">
                  <img 
                    src={logoUrl} 
                    alt="Uploaded logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-sm text-green-600 font-medium">Logo uploaded successfully!</p>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  Click to upload your barangay logo
                </p>
                <p className="text-xs text-gray-400">
                  PNG, JPG up to 5MB
                </p>
              </div>
            )}

            <input
              type="file"
              id="logo-upload-desktop"
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
            />

            <Button
              onClick={() => document.getElementById('logo-upload-desktop')?.click()}
              variant="outline"
              className="w-full"
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? "Uploading..." : logoUrl ? "Change Logo" : "Upload Logo"}
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleNext}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-base font-medium"
            >
              Next
            </Button>
            <Button
              onClick={handleSkip}
              variant="ghost"
              className="w-full text-gray-600 hover:text-gray-800"
            >
              Skip for now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
