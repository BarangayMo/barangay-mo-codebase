
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UploadCloud, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface MediaUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
}

// Inspiring/humorous quotes for upload screen
const UPLOAD_QUOTES = [
  "Uploading pixels of brilliance...",
  "Your file is taking the scenic route to the cloud...",
  "Making digital magic happen...",
  "Converting caffeine to content...",
  "Doing the digital dance with your files...",
  "Sending your masterpiece to its new home...",
  "This upload is powered by imagination (and bytes)...",
  "Your file is getting ready for its spotlight...",
  "Creating a digital legacy, one file at a time...",
  "Teleporting your file to the cloud..."
];

interface FileUpload {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  message?: string;
  url?: string;
}

export function MediaUploadDialog({ open, onClose, onUploadComplete }: MediaUploadDialogProps) {
  const { user } = useAuth();
  const [uploads, setUploads] = useState<FileUpload[]>([]);
  const [quote, setQuote] = useState(() => UPLOAD_QUOTES[Math.floor(Math.random() * UPLOAD_QUOTES.length)]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: acceptedFiles => {
      // Create upload objects for each file
      const newUploads = acceptedFiles.map(file => ({
        id: uuidv4(),
        file,
        progress: 0,
        status: 'uploading' as const
      }));
      
      setUploads(current => [...current, ...newUploads]);
      
      // Process each file upload
      newUploads.forEach(upload => handleFileUpload(upload));
      
      // Set a new random quote
      setQuote(UPLOAD_QUOTES[Math.floor(Math.random() * UPLOAD_QUOTES.length)]);
    },
    multiple: true
  });

  const handleFileUpload = async (upload: FileUpload) => {
    if (!user) {
      updateUpload(upload.id, { 
        status: 'error', 
        message: 'User authentication required' 
      });
      return;
    }

    const { file } = upload;
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.email}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

    try {
      // Create a custom upload with progress tracking
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('file', file);
      
      // Set up progress tracking
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const calculatedProgress = Math.round((event.loaded / event.total) * 100);
          updateUpload(upload.id, { progress: calculatedProgress });
        }
      });
      
      // Upload the file using Supabase Storage
      const { data, error } = await supabase.storage
        .from('user_uploads')
        .upload(filePath, file, {
          cacheControl: '3600'
        });

      if (error) throw error;

      // Get the public URL for the file
      const { data: { publicUrl } } = supabase.storage
        .from('user_uploads')
        .getPublicUrl(filePath);

      // Save media file metadata to database
      const { error: dbError } = await supabase
        .from('media_files')
        .insert({
          user_id: user.email,
          category: determineCategory(file.type),
          content_type: file.type,
          filename: file.name,
          file_url: filePath,
          file_size: file.size
        });

      if (dbError) throw dbError;

      // Update upload status to success
      updateUpload(upload.id, { 
        status: 'success', 
        progress: 100, 
        url: publicUrl,
        message: 'Upload completed successfully' 
      });
      
      setTimeout(() => {
        setUploads(current => current.filter(u => u.id !== upload.id));
      }, 2000);
      
      if (uploads.length === 1) {
        setTimeout(() => {
          onUploadComplete();
        }, 2000);
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      
      updateUpload(upload.id, { 
        status: 'error', 
        message: determineErrorMessage(error) 
      });
    }
  };

  const updateUpload = (id: string, updates: Partial<FileUpload>) => {
    setUploads(current => 
      current.map(upload => 
        upload.id === id ? { ...upload, ...updates } : upload
      )
    );
  };

  const determineCategory = (mimeType: string): string => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.startsWith('application/pdf')) return 'document';
    if (mimeType.includes('document') || mimeType.includes('sheet') || mimeType.includes('presentation')) return 'document';
    return 'other';
  };

  const determineErrorMessage = (error: any): string => {
    if (error.message?.includes('storage quota')) {
      return 'Storage quota exceeded. Please free up space and try again.';
    }
    if (error.message?.includes('size limit')) {
      return 'File size is too large. Maximum allowed size is 50MB.';
    }
    if (error.statusCode === 413) {
      return 'File is too large for upload.';
    }
    if (error.statusCode === 415) {
      return 'File type is not supported.';
    }
    if (error.message?.includes('network')) {
      return 'Network error. Please check your connection and try again.';
    }
    return error.message || 'An unexpected error occurred during upload';
  };

  const handleClose = () => {
    // Only allow closing if no uploads are in progress
    if (!uploads.some(upload => upload.status === 'uploading')) {
      setUploads([]);
      onClose();
      onUploadComplete();
    } else {
      toast.warning("Please wait for uploads to complete before closing");
    }
  };

  const cancelUpload = (id: string) => {
    setUploads(current => current.filter(upload => upload.id !== id));
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Media</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {uploads.length === 0 && (
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center space-y-3">
                <UploadCloud className="h-10 w-10 text-gray-400" />
                <p className="text-sm font-medium">
                  {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                </p>
                <p className="text-xs text-gray-500">
                  or click to select files
                </p>
                <Button size="sm" variant="secondary" onClick={e => e.stopPropagation()}>
                  Select Files
                </Button>
              </div>
            </div>
          )}
          
          {uploads.length > 0 && (
            <div>
              <p className="text-sm text-center text-gray-600 italic mb-4">"{quote}"</p>
              <div className="space-y-4 max-h-80 overflow-y-auto p-1">
                {uploads.map(upload => (
                  <div key={upload.id} className="border rounded-lg p-3 relative">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium truncate w-4/5">{upload.file.name}</p>
                      {upload.status !== 'uploading' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 w-7 p-0" 
                          onClick={() => cancelUpload(upload.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    {upload.status === 'uploading' && (
                      <>
                        <Progress value={upload.progress} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">{upload.progress}% complete</p>
                      </>
                    )}
                    
                    {upload.status === 'error' && (
                      <div className="text-xs text-red-500 mt-1">
                        Error: {upload.message}
                      </div>
                    )}
                    
                    {upload.status === 'success' && (
                      <div className="text-xs text-green-500 mt-1">
                        Upload complete!
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (uploads.some(u => u.status === 'uploading')) {
                      setUploads(current => current.filter(u => u.status === 'uploading'));
                      return;
                    }
                    setUploads([]);
                  }}
                  className="mr-2"
                >
                  Clear Completed
                </Button>
                <Button
                  disabled={uploads.some(u => u.status === 'uploading')}
                  onClick={handleClose}
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
