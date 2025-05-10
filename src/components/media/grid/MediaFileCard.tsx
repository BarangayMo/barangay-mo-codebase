
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MediaFile } from "@/hooks/media-library/types";

interface MediaFileCardProps {
  file: MediaFile;
  onSelect: (file: MediaFile) => void;
}

export function MediaFileCard({ file, onSelect }: MediaFileCardProps) {
  // Helper function to get appropriate file icon based on content type
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

  // Use signed URL if available
  const fileUrl = file.signedUrl || null;
  const fileIcon = getFileIcon(file.content_type);
  
  return (
    <div 
      className="group relative border rounded-md overflow-hidden bg-white hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelect(file)}
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
          {new Date(file.uploaded_at).toLocaleDateString()}
        </p>
      </div>
      
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
        <Button 
          variant="secondary" 
          size="sm" 
          className="shadow-lg rounded-lg"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(file);
          }}
        >
          View Details
        </Button>
      </div>
    </div>
  );
}
