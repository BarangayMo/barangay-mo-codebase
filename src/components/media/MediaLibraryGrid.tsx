import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Trash2, Copy } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { bytesToSize } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useMediaLibrary, MediaFile } from "@/hooks";

// Define types for our profiles
interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
}

interface MediaFileWithProfile extends MediaFile {
  profile?: Profile | null;
}

interface MediaLibraryFilters {
  user: string | null;
  category: string | null;
  startDate: Date | null;
  endDate: Date | null;
}

interface MediaLibraryGridProps {
  filters: MediaLibraryFilters;
  searchQuery?: string;
}

export function MediaLibraryGrid({ filters, searchQuery = "" }: MediaLibraryGridProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaFileWithProfile | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  
  const {
    mediaFiles,
    loadingFiles: isLoading,
    isError,
    handleDownload,
    handleDelete,
    handleCopyUrl
  } = useMediaLibrary(filters, searchQuery);

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

  if (isError) return <div className="text-center py-16 border rounded-lg bg-red-50">
    <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-red-100">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-8 w-8 text-red-600">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    </div>
    <h3 className="mt-4 text-lg font-medium text-red-800">Error loading media</h3>
    <p className="mt-1 text-sm text-red-600">Please check the console for details.</p>
  </div>;

  if (isLoading) return <div className="flex items-center justify-center h-64">
    <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  </div>;

  if (!mediaFiles?.length) return <div className="text-center py-16 border rounded-lg bg-gray-50">
    <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gray-100">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-gray-400"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>
    </div>
    <h3 className="mt-4 text-lg font-medium text-gray-900">No media found</h3>
    <p className="mt-1 text-sm text-gray-500">Upload some files or adjust your filters to see media here.</p>
  </div>;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {mediaFiles.map((file) => {
          // Use signed URL if available
          const fileUrl = file.signedUrl || null;
          const fileIcon = getFileIcon(file.content_type);
          
          return (
            <div 
              key={file.id} 
              className="group relative border rounded-md overflow-hidden bg-white hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedMedia(file as MediaFileWithProfile)}
            >
              <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                {file.content_type.startsWith('image/') ? (
                  <img 
                    src={fileUrl} 
                    alt={file.filename} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      console.error('Image load error:', fileUrl);
                      // Fallback to file icon if image fails to load
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                      const icon = document.createElement('div');
                      icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="w-12 h-12 text-gray-400"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>';
                      e.currentTarget.parentElement?.appendChild(icon);
                    }}
                  />
                ) : file.content_type.startsWith('video/') ? (
                  <video 
                    src={fileUrl}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Video load error:', fileUrl);
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                      const icon = document.createElement('div');
                      icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="w-12 h-12 text-blue-500"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
                      e.currentTarget.parentElement?.appendChild(icon);
                    }}
                  />
                ) : fileIcon}
              </div>
              
              <div className="p-2">
                <p className="text-xs font-medium truncate">{file.filename}</p>
                <p className="text-xs text-gray-500 truncate">
                  {formatDistanceToNow(new Date(file.uploaded_at), { addSuffix: true })}
                </p>
              </div>
              
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="shadow-lg rounded-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMedia(file as MediaFileWithProfile);
                  }}
                >
                  View Details
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Media details dialog */}
      {selectedMedia && (
        <Dialog open={!!selectedMedia} onOpenChange={(open) => !open && setSelectedMedia(null)}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-auto p-0 rounded-xl border-none shadow-2xl">
            <DialogHeader className="px-6 pt-6 pb-2">
              <DialogTitle className="text-xl font-semibold truncate">{selectedMedia.filename}</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              <div className="bg-gray-50 rounded-xl flex items-center justify-center p-4 overflow-hidden">
                {selectedMedia.content_type.startsWith('image/') ? (
                  <img 
                    src={selectedMedia.signedUrl} 
                    alt={selectedMedia.filename}
                    className="max-w-full max-h-[350px] object-contain rounded-lg shadow-sm"
                    onError={(e) => {
                      console.error('Detail view image load error:', selectedMedia.file_url);
                      e.currentTarget.style.display = 'none';
                      const icon = document.createElement('div');
                      icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="w-16 h-16 text-gray-400"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>';
                      e.currentTarget.parentElement?.appendChild(icon);
                    }}
                  />
                ) : selectedMedia.content_type.startsWith('video/') ? (
                  <video 
                    src={selectedMedia.signedUrl}
                    className="max-w-full max-h-[350px] rounded-lg shadow-sm"
                    controls
                    onError={(e) => {
                      console.error('Detail view video load error:', selectedMedia.file_url);
                      e.currentTarget.style.display = 'none';
                      const icon = document.createElement('div');
                      icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="w-16 h-16 text-blue-500"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
                      e.currentTarget.parentElement?.appendChild(icon);
                    }}
                  />
                ) : (
                  <div className="h-40 w-40 flex items-center justify-center">
                    {getFileIcon(selectedMedia.content_type)}
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
                        {formatDistanceToNow(new Date(selectedMedia.uploaded_at), { addSuffix: true })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">File size</span>
                      <span className="text-sm font-medium">
                        {bytesToSize(selectedMedia.file_size)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Type</span>
                      <span className="text-sm font-medium">
                        {selectedMedia.content_type}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Category</span>
                      <span className="text-sm font-medium">
                        {selectedMedia.category || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Bucket</span>
                      <span className="text-sm font-medium">
                        {selectedMedia.bucket_name || "user_uploads"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Uploaded by</span>
                      <span className="text-sm font-medium">
                        {selectedMedia.profile ? 
                          `${selectedMedia.profile.first_name || ''} ${selectedMedia.profile.last_name || ''}`.trim() || 'Unknown User' 
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
                          onClick={() => handleCopyUrl(selectedMedia.signedUrl, selectedMedia.bucket_name, selectedMedia.file_url)}
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
                    onClick={() => handleDownload(
                      selectedMedia.bucket_name || 'user_uploads', 
                      selectedMedia.file_url, 
                      selectedMedia.filename,
                      selectedMedia.signedUrl
                    )}
                  >
                    <Download className="mr-3 h-4 w-4" /> Download
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start bg-white text-red-600 hover:text-red-700 hover:bg-red-50 transition-all rounded-lg h-12 shadow-sm hover:shadow-md"
                    onClick={() => setDeleteConfirmOpen(true)}
                  >
                    <Trash2 className="mr-3 h-4 w-4" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent className="rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this file?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The file will be permanently removed from storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-md">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700 rounded-md"
              onClick={() => {
                if (selectedMedia) {
                  handleDelete(
                    selectedMedia.id,
                    selectedMedia.bucket_name || 'user_uploads',
                    selectedMedia.file_url
                  );
                  setSelectedMedia(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
