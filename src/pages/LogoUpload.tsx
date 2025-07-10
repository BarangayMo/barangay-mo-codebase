import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Upload, X } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function LogoUpload() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const locationState = location.state;

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setPreviewUrl(null);
  };

  const handleNext = () => {
    // You can implement the logic to upload the logo here
    // For now, let's just navigate to the next page
    navigate("/register", { state: locationState });
  };

  const handleBack = () => {
    navigate("/register/officials", { state: locationState });
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Progress Bar - exactly like role page */}
        <div className="w-full bg-gray-200 h-1">
          <div className="h-1 w-4/5 bg-red-600"></div>
        </div>

        {/* Header - exactly like role page */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
          <button onClick={handleBack} className="text-gray-600 hover:text-gray-800">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Upload Logo</h1>
          <div className="w-6" />
        </div>

        {/* Content */}
        <div className="flex-1 p-6 bg-white">
          {/* Upload interface and preview */}
          <div className="space-y-4">
            {previewUrl ? (
              <div className="relative">
                <img src={previewUrl} alt="Logo Preview" className="w-full h-auto rounded-lg" />
                <button
                  onClick={handleRemoveLogo}
                  className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 text-gray-500 mb-4" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">SVG, PNG, JPG (MAX. 800x400px)</p>
                </div>
                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
              </label>
            )}
          </div>
        </div>

        {/* Next Button */}
        <div className="p-6 bg-white border-t">
          <Button
            onClick={handleNext}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 h-12 text-base font-medium rounded-lg"
          >
            {logoFile ? 'Next' : 'Skip for now'}
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
          <div className="h-1 w-4/5 bg-red-600"></div>
        </div>

        {/* Header - exactly like role page */}
        <div className="p-8 bg-white">
          <button onClick={handleBack} className="inline-flex items-center text-sm text-gray-500 mb-6 hover:text-gray-700">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </button>
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Upload Logo</h2>
          </div>

          <div className="space-y-6">
            {/* Upload interface and preview */}
            {previewUrl ? (
              <div className="relative">
                <img src={previewUrl} alt="Logo Preview" className="w-full h-auto rounded-lg" />
                <button
                  onClick={handleRemoveLogo}
                  className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 text-gray-500 mb-4" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">SVG, PNG, JPG (MAX. 800x400px)</p>
                </div>
                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
              </label>
            )}
          </div>

          {/* Next Button */}
          <div className="mt-8">
            <Button
              onClick={handleNext}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-4 h-12 text-base font-medium rounded-lg"
            >
              {logoFile ? 'Next' : 'Skip for now'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
