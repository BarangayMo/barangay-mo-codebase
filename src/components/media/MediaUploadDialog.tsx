
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
  xhr?: XMLHttpRequest; // Add reference to XHR for cancellation
}

interface StorageBucket {
  id: string;
  name: string;
  owner: string;
  created_at: string;
  updated_at: string;
  public: boolean;
}

export function MediaUploadDialog({ open, onClose, onUploadComplete }: MediaUploadDialogProps) {
  const { user, session } = useAuth();
  const [uploads, setUploads] = useState<FileUpload[]>([]);
  const [quote, setQuote] = useState(() => UPLOAD_QUOTES[Math.floor(Math.random() * UPLOAD_QUOTES.length)]);
  const [availableBuckets, setAvailableBuckets] = useState<StorageBucket[]>([]);
  const [defaultBucket, setDefaultBucket] = useState('user_uploads');
  
  // Fetch all available storage buckets
  useEffect(() => {
    if (!open) return;
    
    const fetchBuckets = async () => {
      try {
        const { data: buckets, error } = await supabase.storage.listBuckets();
        if (error) {
          console.error("Error fetching buckets:", error);
          toast.error("Failed to fetch storage buckets");
          return;
        }
        
        if (buckets && buckets.length > 0) {
          console.log("Available buckets for upload:", buckets);
          setAvailableBuckets(buckets);
          
          // Set the default bucket to user_uploads if it exists, otherwise use the first bucket
          const userUploadsBucket = buckets.find(b => b.name === 'user_uploads');
          if (userUploadsBucket) {
            setDefaultBucket('user_uploads');
          } else if (buckets.length > 0) {
            setDefaultBucket(buckets[0].name);
          }
        }
      } catch (error) {
        console.error("Exception fetching buckets:", error);
        toast.error("Failed to fetch storage buckets");
      }
    };
    
    fetchBuckets();
  }, [open]);

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
      
      // Store XHR reference for potential cancellation
      updateUpload(upload.id, { xhr });
      
      // Set up progress tracking
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const calculatedProgress = Math.round((event.loaded / event.total) * 100);
          updateUpload(upload.id, { progress: calculatedProgress });
        }
      });

      // Make sure we have a valid bucket to upload to
      const bucketToUse = defaultBucket || 'user_uploads';
      
      // Upload the file using Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucketToUse)
        .upload(filePath, file, {
          cacheControl: '3600'
        });

      if (error) throw error;

      // Get the public URL for the file
      const { data: urlData } = await supabase.storage
        .from(bucketToUse)
        .createSignedUrl(filePath, 604800); // 7 days

      // Save media file metadata to database, use the user.id (UUID) instead of email
      const { error: dbError } = await supabase
        .from('media_files')
        .insert({
          user_id: userId,
          category: determineCategory(file.type),
          content_type: file.type,
          filename: file.name,
          file_url: filePath, // Store the path, including the bucket
          file_size: file.size
        });

      if (dbError) throw dbError;

      // Update upload status to success
      updateUpload(upload.id, { 
        status: 'success', 
        progress: 100, 
        url: urlData?.signedUrl,
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

  // Function to cancel an ongoing upload
  const cancelUpload = (id: string) => {
    const upload = uploads.find(u => u.id === id);
    
    // If upload is in progress and has an XHR reference, abort it
    if (upload?.xhr && upload.status === 'uploading') {
      upload.xhr.abort();
    }
    
    // Remove from uploads list
    setUploads(current => current.filter(u => u.id !== id));
    toast.info('Upload canceled');
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
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-[0_10px_50px_-15px_rgba(0,0,0,0.3)] rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Upload Media</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-1">
          {uploads.length === 0 && (
            <div 
              {...getRootProps()} 
              className={`
                border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all 
                flex flex-col items-center justify-center min-h-[300px]
                ${isDragActive 
                  ? 'border-primary bg-primary/5 shadow-[0_0_0_1px_rgba(59,130,246,0.3),0_0_0_4px_rgba(59,130,246,0.1)]' 
                  : 'border-gray-300 hover:border-primary hover:shadow-[0_0_0_1px_rgba(59,130,246,0.2),0_0_0_4px_rgba(59,130,246,0.05)]'
                }
              `}
            >
              <input {...getInputProps()} />
              <div className="p-6 rounded-full bg-primary/5 mb-6 shadow-[0_0_20px_5px_rgba(59,130,246,0.1)]">
                <UploadCloud className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">
                {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
              </h3>
              <p className="text-sm text-gray-500 mb-6 max-w-md">
                Upload your images, documents, and other files by dropping them here or click to browse your files
              </p>
              <Button 
                size="lg" 
                variant="default"
                className="shadow-[0_6px_16px_rgba(59,130,246,0.3),0_2px_8px_rgba(59,130,246,0.15)] hover:shadow-[0_8px_20px_rgba(59,130,246,0.4),0_4px_10px_rgba(59,130,246,0.2)] transition-all duration-200"
              >
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
                      border rounded-lg p-4 relative transition-all shadow-sm hover:shadow
                      ${upload.status === 'error' ? 'border-red-300 bg-red-50' : ''}
                      ${upload.status === 'success' ? 'border-green-300 bg-green-50' : ''}
                    `}
                  >
                    {/* Cancel button for uploads in progress */}
                    {upload.status === 'uploading' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full hover:bg-gray-200" 
                        onClick={() => cancelUpload(upload.id)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Cancel</span>
                      </Button>
                    )}
                    
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
                    <Button 
                      variant="outline"
                      className="shadow-sm hover:shadow-md"
                    >
                      Add More Files
                    </Button>
                  </div>
                  <Button
                    disabled={uploads.some(u => u.status === 'uploading')}
                    onClick={handleClose}
                    variant="default"
                    className="shadow-[0_4px_12px_rgba(59,130,246,0.2),0_2px_6px_rgba(59,130,246,0.15)] hover:shadow-[0_6px_16px_rgba(59,130,246,0.3),0_3px_8px_rgba(59,130,246,0.2)] transition-all duration-200"
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
