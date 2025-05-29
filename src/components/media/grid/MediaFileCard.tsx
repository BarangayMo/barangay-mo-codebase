
import { MediaFile } from "@/hooks/media-library/types";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface MediaFileCardProps {
  file: MediaFile;
  onSelect: (file: MediaFile) => void;
  onToggleSelect?: () => void;
  isSelected?: boolean;
  isDeleting?: boolean;
}

export function MediaFileCard({ 
  file, 
  onSelect, 
  onToggleSelect, 
  isSelected = false, 
  isDeleting = false 
}: MediaFileCardProps) {
  
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent card click when clicking checkbox
    if ((e.target as HTMLElement).closest('[data-checkbox]')) {
      return;
    }
    onSelect(file);
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSelect?.();
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer hover:shadow-md transition-all duration-200 relative overflow-hidden",
        isDeleting && "opacity-50 pointer-events-none",
        isSelected && "ring-2 ring-blue-500 ring-offset-2"
      )}
      onClick={handleCardClick}
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
            className="bg-white shadow-sm border-2"
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
