
import { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Upload, X } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { RegistrationProgress } from "@/components/ui/registration-progress";

export default function LogoUpload() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const locationState = location.state;
  
  // If no required data, redirect to role selection
  if (!locationState?.role || !locationState?.region) {
    navigate('/register/role');
    return null;
  }

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleBack = () => {
    navigate("/register/official-documents", { state: locationState });
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('barangay-logos')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return null;
      }

      const { data } = supabase.storage
        .from('barangay-logos')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };

  const handleNext = async () => {
    setUploading(true);
    
    try {
      let logoUrl = '';
      
      if (selectedFile) {
        const uploadedUrl = await uploadFile(selectedFile);
        if (!uploadedUrl) {
          console.error('Failed to upload logo');
          setUploading(false);
          return;
        }
        logoUrl = uploadedUrl;

        // Update the Barangays table with the new logo URL
        const { error: updateError } = await supabase
          .from('Barangays')
          .update({ Logo: logoUrl })
          .eq('BARANGAY', locationState.barangay);

        if (updateError) {
          console.error('Error updating barangay logo:', updateError);
        }
      }

      const registrationData = {
        ...locationState,
        logoUrl
      };

      navigate("/register", { state: registrationData });
    } catch (error) {
      console.error('Error proceeding to registration:', error);
    } finally {
      setUploading(false);
    }
  };

  // Determine theme colors based on role
  const isOfficial = locationState.role === 'official';
  const progressColor = isOfficial ? 'bg-red-600' : 'bg-blue-600';
  const textColor = isOfficial ? 'text-red-600' : 'text-blue-600';
  const hoverTextColor = isOfficial ? 'hover:text-red-700' : 'hover:text-blue-700';
  const buttonColor = isOfficial ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700';

  if (isMobile) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-1">
          <div className={`h-1 w-4/5 ${progressColor}`}></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
          <button onClick={handleBack} className={`${textColor} ${hoverTextColor}`}>
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className={`text-lg font-semibold ${textColor}`}>Upload Logo</h1>
          <div className="w-6" />
        </div>

        {/* Content */}
        <div className="flex-1 p-4 space-y-4 bg-gray-50">
          {/* Upload Area - More Mobile Friendly */}
          <div
            className={`relative border-2 border-dashed ${
              dragActive ? 'border-red-400 bg-red-50' : 'border-gray-300'
            } rounded-lg p-4 transition-colors`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="logo-upload"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept="image/*"
              onChange={handleChange}
            />
            
            {selectedFile ? (
              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    className="max-h-20 max-w-full object-contain rounded"
                  />
                </div>
                <p className="text-sm text-gray-600 mb-2 truncate">{selectedFile.name}</p>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="inline-flex items-center text-sm text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4 mr-1" />
                  Remove
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Upload your barangay logo
                </p>
                <p className="text-xs text-gray-500 mb-2">
                  Tap to browse or drag and drop
                </p>
                <p className="text-xs text-gray-400">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            )}
          </div>

          {/* Skip Option */}
          <div className="text-center">
            <button
              onClick={handleNext}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Skip for now
            </button>
          </div>
        </div>

        {/* Next Button */}
        <div className="p-4 bg-gray-50 border-t">
          <Button
            onClick={handleNext}
            disabled={uploading}
            className={`w-full text-white py-3 h-12 text-base font-medium rounded-lg ${buttonColor}`}
          >
            {uploading ? "Uploading..." : "Next"}
          </Button>
        </div>
      </div>
    );
  }

  // Desktop version - Full screen
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header with Progress Bar */}
      <div className="sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <button onClick={handleBack} className={`inline-flex items-center text-sm ${textColor} ${hoverTextColor}`}>
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </button>
            <img 
              src={isOfficial 
                ? "/lovable-uploads/141c2a56-35fc-4123-a51f-358481e0f167.png"
                : "/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png"
              } 
              alt="eGov.PH Logo" 
              className="h-8 w-auto" 
            />
          </div>
          <RegistrationProgress currentStep="logo" userRole={locationState.role as 'resident' | 'official'} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Upload Your Logo</h1>
            <p className="text-gray-600">Add your barangay's official logo</p>
          </div>

          {/* Upload Area */}
          <div
            className={`relative border-2 border-dashed ${
              dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
            } rounded-lg p-8 transition-colors`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="logo-upload"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept="image/*"
              onChange={handleChange}
            />
            
            {selectedFile ? (
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    className="max-h-32 max-w-full object-contain"
                  />
                </div>
                <p className="text-sm text-gray-600 mb-2">{selectedFile.name}</p>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="inline-flex items-center text-sm text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4 mr-1" />
                  Remove
                </button>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Upload your barangay logo
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Drag and drop your logo here, or click to browse
                </p>
                <p className="text-xs text-gray-400">
                  Supports PNG, JPG, GIF up to 10MB
                </p>
              </div>
            )}
          </div>

          {/* Skip Option */}
          <div className="text-center">
            <button
              onClick={handleNext}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Skip for now
            </button>
          </div>

          {/* Next Button */}
          <Button
            onClick={handleNext}
            disabled={uploading}
            className={`w-full text-white py-3 text-base font-medium rounded-lg ${buttonColor}`}
          >
            {uploading ? "Uploading..." : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
