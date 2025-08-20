
import React, { useState, useRef } from 'react';
import { Button } from './button';
import { Upload, X, Image } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface MediaUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  className?: string;
  accept?: string;
  bucketName?: string;
  filePath?: string;
}

export const MediaUpload = ({ 
  value, 
  onChange, 
  onRemove, 
  className,
  accept = "image/*",
  bucketName = "official-documents",
  filePath
}: MediaUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    
    try {
      if (filePath && bucketName) {
        // Upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${filePath}_${Date.now()}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          console.error('Supabase upload error:', error);
          // Fall back to blob URL if upload fails
          const url = URL.createObjectURL(file);
          onChange(url);
        } else {
          // Get the public URL
          const { data: urlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(fileName);
          
          onChange(urlData.publicUrl);
        }
      } else {
        // Fall back to blob URL if no path specified
        const url = URL.createObjectURL(file);
        onChange(url);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      // Fall back to blob URL on any error
      const url = URL.createObjectURL(file);
      onChange(url);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (value) {
    return (
      <div className={cn("relative group", className)}>
        <div className="aspect-video bg-muted rounded-lg overflow-hidden border">
          <img 
            src={value} 
            alt="Uploaded thumbnail" 
            className="w-full h-full object-cover"
          />
        </div>
        <Button
          variant="destructive"
          size="sm"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleRemove}
          type="button"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="sr-only"
      />
      
      <div
        className={cn(
          "aspect-video border-2 border-dashed rounded-lg transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          "hover:border-primary hover:bg-primary/5 cursor-pointer"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </>
          ) : (
            <>
              <Image className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm font-medium text-foreground mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, GIF up to 10MB
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
