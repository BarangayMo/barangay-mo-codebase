
import { useState } from "react";
import { useMediaLibrary } from "@/hooks";
import { MediaFile } from "@/hooks/media-library/types";
import { MediaFileCard } from "./grid/MediaFileCard";
import { MediaDetailsDialog } from "./grid/MediaDetailsDialog";
import { DeleteConfirmDialog } from "./grid/DeleteConfirmDialog";
import { EmptyMediaState } from "./grid/EmptyMediaState";
import { LoadingState } from "./grid/LoadingState";
import { LoadingScreen } from "@/components/ui/loading";

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
    deletingFiles,
    isDeleting,
    handleDownload,
    handleDelete,
    handleCopyUrl
  } = useMediaLibrary(filters, searchQuery);

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

  if (isError) {
    return <EmptyMediaState isError={true} />;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (!mediaFiles?.length) {
    return <EmptyMediaState />;
  }

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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {mediaFiles.map((file) => (
          <MediaFileCard 
            key={file.id} 
            file={file}
            onSelect={(file) => setSelectedMedia(file as MediaFileWithProfile)}
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
      />

      {/* Delete confirmation dialog */}
      <DeleteConfirmDialog 
        isOpen={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
