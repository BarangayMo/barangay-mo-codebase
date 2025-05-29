
import { MediaFile } from "@/hooks/media-library/types";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface MediaFileCardProps {
  file: MediaFile;
  onSelect: (file: MediaFile) => void;
  onToggleSelect?: (event: React.MouseEvent) => void;
  isSelected?: boolean;
  isDeleting?: boolean;
  index?: number;
}

export function MediaFileCard({ 
  file, 
  onSelect, 
  onToggleSelect, 
  isSelected = false, 
  isDeleting = false,
  index = 0
}: MediaFileCardProps) {
  
  const handleCardClick = (e: React.MouseEvent) => {
    // If we have selection functionality and any files are selected, treat card click as selection
    if (onToggleSelect) {
      // Check if shift key is pressed for range selection
      if (e.shiftKey || e.metaKey || e.ctrlKey) {
        onToggleSelect(e);
        return;
      }
      
      // If not holding modifier keys, check if we should select or open details
      const hasSelectedFiles = document.querySelectorAll('[data-file-selected="true"]').length > 0;
      
      if (hasSelectedFiles || isSelected) {
        // In selection mode - toggle selection
        onToggleSelect(e);
        return;
      }
    }
    
    // Default behavior - open details
    onSelect(file);
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSelect?.(e);
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer hover:shadow-md transition-all duration-200 relative overflow-hidden",
        isDeleting && "opacity-50 pointer-events-none",
        isSelected && "ring-2 ring-blue-500 ring-offset-2"
      )}
      onClick={handleCardClick}
      data-file-selected={isSelected}
      data-file-index={index}
    >
      {/* Selection checkbox */}
      {onToggleSelect && (
        <div 
          className="absolute top-2 left-2 z-10" 
          data-checkbox
          onClick={handleCheckboxClick}
        >
          <Checkbox
            checked={isSelected}
            className="bg-white/90 shadow-lg border border-gray-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 h-4 w-4"
          />
        </div>
      )}

      {isDeleting && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        </div>
      )}
      
      <div className="aspect-square p-2">
        <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
          {file.signedUrl ? (
            <img 
              src={file.signedUrl} 
              alt={file.filename}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const icon = document.createElement('div');
                icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="w-8 h-8 text-gray-400"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>';
                e.currentTarget.parentElement?.appendChild(icon);
              }}
            />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-gray-400">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
              <circle cx="12" cy="13" r="3"></circle>
            </svg>
          )}
        </div>
      </div>
      
      <div className="px-2 pb-2">
        <p className="text-xs text-gray-600 truncate">{file.filename}</p>
      </div>
    </Card>
  );
}
