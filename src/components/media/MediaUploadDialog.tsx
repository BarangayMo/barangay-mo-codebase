
import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UploadCloud, X, CheckCircle, AlertOctagon, Info, Image, FileText, File } from "lucide-react";
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
  const { user, session } = useAuth();
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
    if (!session?.user) {
      updateUpload(upload.id, { 
        status: 'error', 
        message: 'User authentication required' 
      });
      return;
    }

    // Fix: Use the actual UUID of the user from the session
    const userId = session.user.id;

    const { file } = upload;
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

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

      // Save media file metadata to database, use the user.id (UUID) instead of email
      const { error: dbError } = await supabase
        .from('media_files')
        .insert({
          user_id: userId, // Fix: Use the UUID instead of email
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

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image className="h-5 w-5 text-blue-500" />;
    if (mimeType.startsWith('application/pdf')) return <FileText className="h-5 w-5 text-red-500" />;
    if (mimeType.includes('document')) return <FileText className="h-5 w-5 text-blue-700" />;
    if (mimeType.includes('sheet')) return <FileText className="h-5 w-5 text-green-600" />;
    if (mimeType.includes('presentation')) return <FileText className="h-5 w-5 text-orange-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Upload Media</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-1">
          {uploads.length === 0 && (
            <div 
              {...getRootProps()} 
              className={`
                border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors 
                flex flex-col items-center justify-center min-h-[300px]
                ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}
              `}
            >
              <input {...getInputProps()} />
              <div className="p-6 rounded-full bg-primary/5 mb-6">
                <UploadCloud className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">
                {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
              </h3>
              <p className="text-sm text-gray-500 mb-6 max-w-md">
                Upload your images, documents, and other files by dropping them here or click to browse your files
              </p>
              <Button size="lg" variant="default">
                Browse Files
              </Button>
            </div>
          )}
          
          {uploads.length > 0 && (
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center pb-6 pt-4">
                <p className="text-lg text-center text-primary font-medium italic mb-2">"{quote}"</p>
                <p className="text-sm text-gray-500">
                  {uploads.filter(u => u.status === 'uploading').length} file(s) uploading
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-80 overflow-y-auto p-2">
                {uploads.map(upload => (
                  <div 
                    key={upload.id} 
                    className={`
                      border rounded-lg p-4 relative transition-all 
                      ${upload.status === 'error' ? 'border-red-300 bg-red-50' : ''}
                      ${upload.status === 'success' ? 'border-green-300 bg-green-50' : ''}
                    `}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      {getFileIcon(upload.file.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{upload.file.name}</p>
                        <p className="text-xs text-gray-500">{Math.round(upload.file.size / 1024)} KB</p>
                      </div>
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
                      <div className="space-y-2">
                        <Progress value={upload.progress} className="h-2" />
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-gray-500">Uploading...</p>
                          <p className="text-xs font-medium">{upload.progress}%</p>
                        </div>
                      </div>
                    )}
                    
                    {upload.status === 'error' && (
                      <div className="flex items-center gap-2 mt-2 text-red-600">
                        <AlertOctagon className="h-4 w-4" />
                        <p className="text-xs">{upload.message}</p>
                      </div>
                    )}
                    
                    {upload.status === 'success' && (
                      <div className="flex items-center gap-2 mt-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <p className="text-xs">Upload complete</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (uploads.some(u => u.status === 'uploading')) {
                      toast.info("Waiting for uploads to complete");
                      return;
                    }
                    setUploads([]);
                  }}
                  className="mr-2"
                  disabled={uploads.some(u => u.status === 'uploading')}
                >
                  Clear All
                </Button>

                {isDragActive && (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-sm font-medium text-primary">Drop files to upload</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <Button variant="outline">
                      Add More Files
                    </Button>
                  </div>
                  <Button
                    disabled={uploads.some(u => u.status === 'uploading')}
                    onClick={handleClose}
                    variant="default"
                  >
                    {uploads.some(u => u.status === 'uploading') ? 'Uploading...' : 'Done'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
