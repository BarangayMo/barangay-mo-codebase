
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image } from 'lucide-react';
import { Button } from './button';
import { Progress } from './progress';

interface MediaUploadProps {
  value?: string;
  onChange: (url: string | null) => void;
  className?: string;
  accept?: string;
  maxSize?: number;
}

const MediaUpload: React.FC<MediaUploadProps> = ({
  value,
  onChange,
  className = "",
  accept = "image/*",
  maxSize = 5 * 1024 * 1024 // 5MB
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const next = prev + 10;
          if (next >= 100) {
            clearInterval(interval);
            return 100;
          }
          return next;
        });
      }, 100);

      // For now, create a blob URL for preview
      const url = URL.createObjectURL(file);
      onChange(url);
      
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1200);
    } catch (error) {
      console.error('Upload failed:', error);
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { [accept]: [] },
    maxSize,
    multiple: false
  });

  const removeImage = () => {
    onChange(null);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {value ? (
        <div className="relative group">
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
            <img
              src={value}
              alt="Uploaded thumbnail"
              className="w-full h-full object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`aspect-video bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors ${
            isDragActive ? 'border-blue-400 bg-blue-50' : ''
          }`}
        >
          <input {...getInputProps()} />
          <div className="text-center p-6">
            {isUploading ? (
              <div className="space-y-4">
                <Upload className="h-8 w-8 text-blue-500 mx-auto animate-bounce" />
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Uploading...</p>
                  <Progress value={uploadProgress} className="w-32" />
                </div>
              </div>
            ) : (
              <>
                <Image className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  {isDragActive ? 'Drop the image here' : 'Drag & drop an image here'}
                </p>
                <Button type="button" variant="outline" size="sm">
                  Choose Image
                </Button>
                <p className="text-xs text-gray-400 mt-2">
                  PNG, JPG up to {Math.round(maxSize / 1024 / 1024)}MB
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export { MediaUpload };
