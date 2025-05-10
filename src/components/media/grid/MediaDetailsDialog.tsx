
import { formatDistanceToNow } from "date-fns";
import { Download, Trash2, Copy } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { bytesToSize } from "@/lib/utils";
import { MediaFile } from "@/hooks/media-library/types";

// Define types for our profiles
interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
}

interface MediaFileWithProfile extends MediaFile {
  profile?: Profile | null;
}

interface MediaDetailsDialogProps {
  file: MediaFileWithProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  onDownload: (bucketName: string, fileUrl: string, fileName: string, signedUrl?: string) => void;
  onCopyUrl: (signedUrl?: string, bucketName?: string, fileUrl?: string) => void;
}

export function MediaDetailsDialog({ 
  file, 
  isOpen, 
  onClose, 
  onDelete, 
  onDownload, 
  onCopyUrl 
}: MediaDetailsDialogProps) {
  if (!file) return null;

  // Helper function to get file icon
  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith('image/')) {
      return null; // Will render the actual image
    } else if (contentType.startsWith('video/')) {
      return <div className="flex items-center justify-center h-16 w-16">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-blue-500"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
      </div>;
    } else if (contentType.startsWith('audio/')) {
      return <div className="flex items-center justify-center h-16 w-16">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-green-500"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
      </div>;
    } else {
      return <div className="flex items-center justify-center h-16 w-16">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-gray-500"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
      </div>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-auto p-0 rounded-xl border-none shadow-2xl">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-semibold truncate">{file.filename}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div className="bg-gray-50 rounded-xl flex items-center justify-center p-4 overflow-hidden">
            {file.content_type.startsWith('image/') ? (
              <img 
                src={file.signedUrl} 
                alt={file.filename}
                className="max-w-full max-h-[350px] object-contain rounded-lg shadow-sm"
                onError={(e) => {
                  console.error('Detail view image load error:', file.file_url);
                  e.currentTarget.style.display = 'none';
                  const icon = document.createElement('div');
                  icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="w-16 h-16 text-gray-400"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>';
                  e.currentTarget.parentElement?.appendChild(icon);
                }}
              />
            ) : file.content_type.startsWith('video/') ? (
              <video 
                src={file.signedUrl}
                className="max-w-full max-h-[350px] rounded-lg shadow-sm"
                controls
                onError={(e) => {
                  console.error('Detail view video load error:', file.file_url);
                  e.currentTarget.style.display = 'none';
                  const icon = document.createElement('div');
                  icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="w-16 h-16 text-blue-500"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
                  e.currentTarget.parentElement?.appendChild(icon);
                }}
              />
            ) : (
              <div className="h-40 w-40 flex items-center justify-center">
                {getFileIcon(file.content_type)}
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-4 border shadow-sm">
              <h3 className="text-sm font-medium text-gray-700 mb-3">File details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Uploaded</span>
                  <span className="text-sm font-medium">
                    {formatDistanceToNow(new Date(file.uploaded_at), { addSuffix: true })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">File size</span>
                  <span className="text-sm font-medium">
                    {bytesToSize(file.file_size)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Type</span>
                  <span className="text-sm font-medium">
                    {file.content_type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Category</span>
                  <span className="text-sm font-medium">
                    {file.category || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Bucket</span>
                  <span className="text-sm font-medium">
                    {file.bucket_name || "user_uploads"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Uploaded by</span>
                  <span className="text-sm font-medium">
                    {file.profile ? 
                      `${file.profile.first_name || ''} ${file.profile.last_name || ''}`.trim() || 'Unknown User' 
                      : 'Unknown User'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start bg-white hover:bg-gray-50 transition-all rounded-lg h-12 shadow-sm hover:shadow-md"
                      onClick={() => onCopyUrl(file.signedUrl, file.bucket_name, file.file_url)}
                    >
                      <Copy className="mr-3 h-4 w-4" /> Copy URL (7 days)
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Copy a shareable URL that works for 7 days</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Button 
                variant="outline" 
                className="w-full justify-start bg-white hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-all rounded-lg h-12 shadow-sm hover:shadow-md"
                onClick={() => onDownload(
                  file.bucket_name || 'user_uploads', 
                  file.file_url, 
                  file.filename,
                  file.signedUrl
                )}
              >
                <Download className="mr-3 h-4 w-4" /> Download
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start bg-white text-red-600 hover:text-red-700 hover:bg-red-50 transition-all rounded-lg h-12 shadow-sm hover:shadow-md"
                onClick={onDelete}
              >
                <Trash2 className="mr-3 h-4 w-4" /> Delete
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
