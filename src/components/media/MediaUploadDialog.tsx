
import { useState, useCallback, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UploadCloud, X, CheckCircle, AlertOctagon, Image, FileText, File } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface MediaUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onUploadComplete: (fileId?: string) => void;
  onUploadStart?: (files: { id: string; file: File; progress: number; status: 'uploading' }[]) => void;
  onUploadProgress?: (fileId: string, progress: number) => void;
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
  xhr?: XMLHttpRequest;
}

export function MediaUploadDialog({ open, onClose, onUploadComplete, onUploadStart, onUploadProgress }: MediaUploadDialogProps) {
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
      
      // Notify parent component about upload start
      if (onUploadStart) {
        onUploadStart(newUploads);
      }
      
      // Close modal immediately
      onClose();
      
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

    const userId = session.user.id;
    const { file } = upload;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    try {
      console.log(`=== UPLOAD START ===`);
      console.log(`File: ${file.name}`);
      console.log(`Bucket: user_uploads`);
      console.log(`Path: ${filePath}`);
      
      // Real progress tracking with XMLHttpRequest
      const xhr = new XMLHttpRequest();
      
      // Update upload with xhr reference for cancellation
      updateUpload(upload.id, { xhr });
      
      // Track real upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          updateUpload(upload.id, { progress: percentComplete });
          
          // Notify parent about progress
          if (onUploadProgress) {
            onUploadProgress(upload.id, percentComplete);
          }
        }
      });

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);

      // Get upload URL from Supabase
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user_uploads')
        .createSignedUploadUrl(filePath);

      if (uploadError) throw uploadError;

      // Upload using XMLHttpRequest for real progress tracking
      await new Promise<void>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };
        
        xhr.onerror = () => reject(new Error('Upload failed'));
        xhr.onabort = () => reject(new Error('Upload cancelled'));
        
        xhr.open('PUT', uploadData.signedUrl);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
      });

      console.log("File uploaded successfully");

      // Get the signed URL for the file (valid for 7 days)
      const { data: urlData, error: urlError } = await supabase.storage
        .from('user_uploads')
        .createSignedUrl(filePath, 604800); // 7 days

      if (urlError) {
        console.warn("Could not create signed URL:", urlError);
      }

      // Save media file metadata to database
      const { error: dbError } = await supabase
        .from('media_files')
        .insert({
          user_id: userId,
          category: determineCategory(file.type),
          content_type: file.type,
          filename: file.name,
          file_url: filePath,
          file_size: file.size
        });

      if (dbError) {
        console.error("Database save error:", dbError);
        throw dbError;
      }

      console.log(`=== UPLOAD SUCCESS ===`);
      console.log(`Database record created with file_url: ${filePath}`);

      // Update upload status to success
      updateUpload(upload.id, { 
        status: 'success', 
        progress: 100, 
        url: urlData?.signedUrl,
        message: 'Upload completed successfully' 
      });
      
      // Notify parent about completion
      if (onUploadProgress) {
        onUploadProgress(upload.id, 100);
      }
      
      // Trigger gallery refresh and remove from uploading list
      setTimeout(() => {
        onUploadComplete(upload.id);
        setUploads(current => current.filter(u => u.id !== upload.id));
      }, 1000); // Small delay to show completion
      
    } catch (error: any) {
      console.error("Upload error:", error);
      
      updateUpload(upload.id, { 
        status: 'error', 
        message: determineErrorMessage(error) 
      });
      
      // Remove failed upload after delay
      setTimeout(() => {
        onUploadComplete(upload.id);
        setUploads(current => current.filter(u => u.id !== upload.id));
      }, 3000);
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
      // Trigger gallery refresh when closing
      onUploadComplete();
    } else {
      toast.warning("Please wait for uploads to complete before closing");
    }
  };

  // Function to cancel an ongoing upload
  const cancelUpload = (id: string) => {
    const upload = uploads.find(u => u.id === id);
    
    // If upload is in progress and has an XHR reference, abort it
    if (upload?.xhr && upload.status === 'uploading') {
      upload.xhr.abort();
    }
    
    // Remove from uploads list
    setUploads(current => current.filter(u => u.id !== id));
    onUploadComplete(id);
    toast.info('Upload canceled');
  };

  // Function to get file preview
  const getFilePreview = (file: File): string | null => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-[0_10px_50px_-15px_rgba(0,0,0,0.3)] rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Upload Media</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-1">
          <div 
            {...getRootProps()} 
            className={`
              border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all 
              flex flex-col items-center justify-center min-h-[300px]
              ${isDragActive 
                ? 'border-blue-500 bg-blue-50 shadow-[0_0_0_1px_rgba(59,130,246,0.3),0_0_0_4px_rgba(59,130,246,0.1)]' 
                : 'border-gray-300 hover:border-blue-500 hover:shadow-[0_0_0_1px_rgba(59,130,246,0.2),0_0_0_4px_rgba(59,130,246,0.05)]'
              }
            `}
          >
            <input {...getInputProps()} />
            <div className="p-6 rounded-full bg-blue-50 mb-6 shadow-[0_0_20px_5px_rgba(59,130,246,0.1)]">
              <UploadCloud className="h-12 w-12 text-blue-500" />
            </div>
            <h3 className="text-xl font-medium mb-2">
              {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md">
              Upload your images, documents, and other files by dropping them here or click to browse your files
            </p>
            <Button 
              size="lg" 
              className="bg-blue-500 hover:bg-blue-600 text-white shadow-[0_6px_16px_rgba(59,130,246,0.3),0_2px_8px_rgba(59,130,246,0.15)] hover:shadow-[0_8px_20px_rgba(59,130,246,0.4),0_4px_10px_rgba(59,130,246,0.2)] transition-all duration-200 rounded-lg"
            >
              Browse Files
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
