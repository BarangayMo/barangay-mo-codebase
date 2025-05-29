
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Download, ExternalLink, Trash2, Edit, X, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { bytesToSize } from "@/lib/utils";

interface MediaFile {
  id: string;
  filename: string;
  alt_text?: string;
  uploaded_at: string;
  file_size: number;
  content_type: string;
  bucket_name: string;
  file_url: string;
  references?: number;
  signedUrl?: string;
  category?: string;
}

interface MediaDetailsDialogProps {
  file: MediaFile | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  onDownload: (bucketName: string, fileUrl: string, fileName: string, signedUrl?: string) => void;
  onCopyUrl: (signedUrl?: string, bucketName?: string, fileUrl?: string) => void;
  onUpdateFile: (fileId: string, updates: { filename?: string; alt_text?: string }) => void;
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedFilename, setEditedFilename] = useState("");
  const [editedAltText, setEditedAltText] = useState("");

  if (!file) return null;

  const handleEdit = () => {
    setEditedFilename(file.filename);
    setEditedAltText(file.alt_text || "");
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdateFile(file.id, {
      filename: editedFilename,
      alt_text: editedAltText
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedFilename("");
    setEditedAltText("");
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'image': return 'bg-blue-100 text-blue-800';
      case 'video': return 'bg-purple-100 text-purple-800';
      case 'audio': return 'bg-green-100 text-green-800';
      case 'document': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Media Details</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Preview */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              {file.signedUrl ? (
                <img 
                  src={file.signedUrl} 
                  alt={file.alt_text || file.filename}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16">
                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                    <circle cx="12" cy="13" r="3"></circle>
                  </svg>
                </div>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => onDownload(file.bucket_name, file.file_url, file.filename, file.signedUrl)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                onClick={() => onCopyUrl(file.signedUrl, file.bucket_name, file.file_url)}
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Copy URL
              </Button>
              <Button
                variant="destructive"
                onClick={onDelete}
                className="bg-red-500 hover:bg-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* File Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="filename" className="text-sm font-medium text-gray-700">
                  File Name
                </Label>
                {isEditing ? (
                  <Input
                    id="filename"
                    value={editedFilename}
                    onChange={(e) => setEditedFilename(e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-sm text-gray-900 break-all">{file.filename}</p>
                    <Button variant="ghost" size="sm" onClick={handleEdit}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="alt-text" className="text-sm font-medium text-gray-700">
                  Alt Text
                </Label>
                {isEditing ? (
                  <Textarea
                    id="alt-text"
                    value={editedAltText}
                    onChange={(e) => setEditedAltText(e.target.value)}
                    placeholder="Describe this image for accessibility"
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{file.alt_text || "No alt text provided"}</p>
                )}
              </div>

              {isEditing && (
                <div className="flex gap-2">
                  <Button onClick={handleSave} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Check className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={handleCancel} size="sm">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-900">File Information</h4>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">File Size</p>
                  <p className="font-medium">{bytesToSize(file.file_size)}</p>
                </div>
                
                <div>
                  <p className="text-gray-500">Type</p>
                  <p className="font-medium">{file.content_type}</p>
                </div>
                
                <div>
                  <p className="text-gray-500">Uploaded</p>
                  <p className="font-medium">
                    {formatDistanceToNow(new Date(file.uploaded_at), { addSuffix: true })}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-500">References</p>
                  <p className="font-medium">{file.references || 0}</p>
                </div>
              </div>
              
              {file.category && (
                <div>
                  <p className="text-gray-500 text-sm">Category</p>
                  <Badge className={`mt-1 ${getCategoryColor(file.category)}`}>
                    {file.category}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
