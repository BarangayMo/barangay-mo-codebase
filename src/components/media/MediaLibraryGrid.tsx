import { useState, useRef } from "react";
import { useMediaLibrary } from "@/hooks";
import { MediaFile } from "@/hooks/media-library/types";
import { MediaFileCard } from "./grid/MediaFileCard";
import { MediaDetailsDialog } from "./grid/MediaDetailsDialog";
import { DeleteConfirmDialog } from "./grid/DeleteConfirmDialog";
import { EmptyMediaState } from "./grid/EmptyMediaState";
import { LoadingState } from "./grid/LoadingState";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const lastSelectedIndex = useRef<number | null>(null);
  
  const {
    mediaFiles,
    loadingFiles: isLoading,
    isError,
    deletingFiles,
    isDeleting,
    selectedFiles,
    toggleFileSelection,
    toggleAllFiles,
    clearSelections,
    handleDownload,
    handleDelete,
    handleCopyUrl,
    refetch
  } = useMediaLibrary(filters, searchQuery);

  // Enhanced toggle function with range selection support
  const handleToggleFileSelection = (file: MediaFile, index: number, event: React.MouseEvent) => {
    if ((event.shiftKey || event.metaKey || event.ctrlKey) && lastSelectedIndex.current !== null && mediaFiles) {
      // Range selection
      const start = Math.min(lastSelectedIndex.current, index);
      const end = Math.max(lastSelectedIndex.current, index);
      
      // Select all files in the range
      for (let i = start; i <= end; i++) {
        const fileInRange = mediaFiles[i];
        if (fileInRange && !selectedFiles.includes(fileInRange.id)) {
          toggleFileSelection(fileInRange.id);
        }
      }
    } else {
      // Single selection
      toggleFileSelection(file.id);
      lastSelectedIndex.current = index;
    }
  };

  // Handler for deleting the selected media
  const handleConfirmDelete = () => {
    if (selectedMedia) {
      handleDelete(
        selectedMedia.id,
        selectedMedia.bucket_name || 'user_uploads',
        selectedMedia.file_url
      );
      setSelectedMedia(null);
      setDeleteConfirmOpen(false);
    }
  };

  // Handler for bulk delete
  const handleBulkDelete = async () => {
    if (selectedFiles.length === 0) return;

    const filesToDelete = mediaFiles?.filter(file => selectedFiles.includes(file.id)) || [];
    
    for (const file of filesToDelete) {
      await handleDelete(
        file.id,
        file.bucket_name || 'user_uploads',
        file.file_url
      );
    }
    
    clearSelections();
    setBulkDeleteOpen(false);
  };

  // Add function to update file metadata
  const handleUpdateFile = async (fileId: string, updates: { filename?: string; alt_text?: string }) => {
    try {
      const { error } = await supabase
        .from('media_files')
        .update(updates)
        .eq('id', fileId);

      if (error) throw error;

      toast.success('File updated successfully');
      refetch(); // Refresh the media list
      
      // Update the selected media if it's the same file
      if (selectedMedia && selectedMedia.id === fileId) {
        setSelectedMedia({ ...selectedMedia, ...updates });
      }
    } catch (error) {
      console.error('Error updating file:', error);
      toast.error('Failed to update file');
    }
  };

  if (isError) {
    return <EmptyMediaState isError={true} />;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (!mediaFiles?.length) {
    return <EmptyMediaState />;
  }

  const allSelected = selectedFiles.length === mediaFiles.length;
  const someSelected = selectedFiles.length > 0 && selectedFiles.length < mediaFiles.length;

  return (
    <>
      {/* Loading overlay when deleting files */}
      {deletingFiles.size > 0 && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="text-sm text-gray-600">
                Deleting {deletingFiles.size} file{deletingFiles.size > 1 ? 's' : ''}...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bulk selection header - only show when items are selected */}
      {selectedFiles.length > 0 && (
        <div className="flex items-center justify-between mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={allSelected}
              onCheckedChange={() => toggleAllFiles(mediaFiles)}
              className={`${someSelected ? "data-[state=checked]:bg-blue-500" : ""} data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 h-4 w-4`}
            />
            <span className="text-sm font-medium text-blue-800">
              {selectedFiles.length > 0 
                ? `${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''} selected`
                : 'Select all files'
              }
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearSelections}
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              Clear Selection
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setBulkDeleteOpen(true)}
              className="bg-red-500 hover:bg-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected ({selectedFiles.length})
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {mediaFiles.map((file, index) => (
          <MediaFileCard 
            key={file.id} 
            file={file}
            index={index}
            onSelect={(file) => setSelectedMedia(file as MediaFileWithProfile)}
            onToggleSelect={(event) => handleToggleFileSelection(file, index, event)}
            isSelected={selectedFiles.includes(file.id)}
            isDeleting={isDeleting(file.id)}
          />
        ))}
      </div>

      {/* Media details dialog */}
      <MediaDetailsDialog 
        file={selectedMedia}
        isOpen={!!selectedMedia}
        onClose={() => setSelectedMedia(null)}
        onDelete={() => setDeleteConfirmOpen(true)}
        onDownload={handleDownload}
        onCopyUrl={handleCopyUrl}
        onUpdateFile={handleUpdateFile}
      />

      {/* Delete confirmation dialog */}
      <DeleteConfirmDialog 
        isOpen={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleConfirmDelete}
      />

      {/* Bulk delete confirmation dialog */}
      <DeleteConfirmDialog 
        isOpen={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        onConfirm={handleBulkDelete}
        title={`Delete ${selectedFiles.length} files?`}
        description={`Are you sure you want to delete ${selectedFiles.length} selected file${selectedFiles.length > 1 ? 's' : ''}? This action cannot be undone.`}
      />
    </>
  );
}
