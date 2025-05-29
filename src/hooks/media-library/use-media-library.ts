
import { MediaFile, MediaLibraryFilters } from "./types";
import { useFileSelection } from "./use-file-selection";
import { useFileOperations } from "./use-file-operations";
import { useAuthState } from "./use-auth-state";
import { useMediaQuery } from "./use-media-query";
import { useDeleteState } from "./use-delete-state";

/**
 * Custom hook to manage media library functionality - Database Only Version
 * @param filters Optional filters to apply to the media query
 * @param searchQuery Optional search query to filter media by filename
 * @returns Media library state and functions
 */
export function useMediaLibrary(
  filters: MediaLibraryFilters = { 
    user: null, 
    category: null, 
    startDate: null, 
    endDate: null 
  },
  searchQuery: string = ""
) {
  // Get auth state
  const { isAdmin } = useAuthState();
  
  // Get file selection state and functions
  const { 
    selectedFiles, 
    toggleFileSelection, 
    toggleAllFiles,
    toggleAllFilesSimple,
    clearSelections
  } = useFileSelection();

  // Get delete state management
  const { deletingFiles, setDeleting, isDeleting } = useDeleteState();

  // Get media query results from database only
  const {
    mediaFiles,
    isLoading: loadingFiles,
    isError,
    error,
    refetch
  } = useMediaQuery(filters, searchQuery, isAdmin, []); // Empty array for buckets since we don't use them
  
  // Get file operations with delete state management
  const {
    handleDownload,
    handleDelete: originalHandleDelete,
    handleCopyUrl,
    getBucketAndPath,
    handleUpdateFile
  } = useFileOperations(refetch);

  // Enhanced delete function with loading state
  const handleDelete = async (fileId: string, bucketName: string, fileUrl: string) => {
    setDeleting(fileId, true);
    try {
      const result = await originalHandleDelete(fileId, bucketName, fileUrl);
      return result;
    } finally {
      setDeleting(fileId, false);
    }
  };

  return {
    // State
    mediaFiles,
    buckets: [], // Empty array since we don't use buckets anymore
    selectedFiles,
    
    // Loading/error states
    loadingBuckets: false, // Always false since we don't load buckets
    loadingFiles,
    isError,
    error,
    
    // Delete state
    deletingFiles,
    isDeleting,
    
    // File selection
    toggleFileSelection,
    toggleAllFiles,
    toggleAllFilesSimple,
    clearSelections,
    
    // File operations
    handleDownload,
    handleDelete,
    handleCopyUrl,
    handleUpdateFile,
    getBucketAndPath,
    
    // Refresh
    refetch
  };
}
