
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Download, Trash2, Copy, Edit2, Save, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  onUpdateFile?: (fileId: string, updates: { filename?: string; alt_text?: string }) => void;
}

export function MediaDetailsDialog({ 
  file, 
  isOpen, 
  onClose, 
  onDelete, 
  onDownload, 
  onCopyUrl,
  onUpdateFile 
}: MediaDetailsDialogProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingAlt, setIsEditingAlt] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedAlt, setEditedAlt] = useState("");

  if (!file) return null;

  const handleEditName = () => {
    setEditedName(file.filename);
    setIsEditingName(true);
  };

  const handleEditAlt = () => {
    setEditedAlt(file.alt_text || "");
    setIsEditingAlt(true);
  };

  const handleSaveName = () => {
    if (onUpdateFile && editedName.trim() !== file.filename) {
      onUpdateFile(file.id, { filename: editedName.trim() });
    }
    setIsEditingName(false);
  };

  const handleSaveAlt = () => {
    if (onUpdateFile && editedAlt !== (file.alt_text || "")) {
      onUpdateFile(file.id, { alt_text: editedAlt });
    }
    setIsEditingAlt(false);
  };

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
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            {isEditingName ? (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveName();
                    if (e.key === 'Escape') setIsEditingName(false);
                  }}
                  autoFocus
                />
                <Button size="sm" onClick={handleSaveName}>
                  <Save className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => setIsEditingName(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-1">
                <span className="truncate">{file.filename}</span>
                <Button size="sm" variant="ghost" onClick={handleEditName}>
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </DialogTitle>
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

            {/* Alt Text Section */}
            <div className="bg-white rounded-lg p-4 border shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">Alt Text</h3>
                {!isEditingAlt && (
                  <Button size="sm" variant="ghost" onClick={handleEditAlt}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {isEditingAlt ? (
                <div className="space-y-2">
                  <Textarea
                    value={editedAlt}
                    onChange={(e) => setEditedAlt(e.target.value)}
                    placeholder="Add alt text for accessibility..."
                    className="min-h-[80px]"
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') setIsEditingAlt(false);
                    }}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveAlt}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setIsEditingAlt(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  {file.alt_text || "No alt text provided"}
                </p>
              )}
            </div>
            
            {/* Action Buttons - Inline */}
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1 bg-white hover:bg-gray-50 transition-all rounded-lg shadow-sm hover:shadow-md"
                      onClick={() => onCopyUrl(file.signedUrl, file.bucket_name, file.file_url)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Copy URL</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1 bg-white hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-all rounded-lg shadow-sm hover:shadow-md"
                onClick={() => onDownload(
                  file.bucket_name || 'user_uploads', 
                  file.file_url, 
                  file.filename,
                  file.signedUrl
                )}
              >
                <Download className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1 bg-white text-red-600 hover:text-red-700 hover:bg-red-50 transition-all rounded-lg shadow-sm hover:shadow-md"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
