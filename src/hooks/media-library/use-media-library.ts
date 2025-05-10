
import { MediaFile, MediaLibraryFilters } from "./types";
import { useBuckets } from "./use-buckets";
import { useFileSelection } from "./use-file-selection";
import { useFileOperations } from "./use-file-operations";
import { useAuthState } from "./use-auth-state";
import { useMediaQuery } from "./use-media-query";

/**
 * Custom hook to manage media library functionality
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
  
  // Get buckets
  const { buckets, loadingBuckets, fetchBuckets } = useBuckets();
  
  // Get file selection state and functions
  const { 
    selectedFiles, 
    toggleFileSelection, 
    toggleAllFiles,
    toggleAllFilesSimple 
  } = useFileSelection();

  // Get media query results
  const {
    mediaFiles,
    isLoading: loadingFiles,
    isError,
    error,
    refetch
  } = useMediaQuery(filters, searchQuery, isAdmin, buckets.map(b => b.name));
  
  // Get file operations
  const {
    handleDownload,
    handleDelete,
    handleCopyUrl,
    getBucketAndPath,
  } = useFileOperations(refetch);

  return {
    // State
    mediaFiles,
    buckets,
    selectedFiles,
    
    // Loading/error states
    loadingBuckets,
    loadingFiles,
    isError,
    error,
    
    // File selection
    toggleFileSelection,
    toggleAllFiles,
    toggleAllFilesSimple,
    
    // File operations
    handleDownload,
    handleDelete,
    handleCopyUrl,
    getBucketAndPath,
    
    // Refresh
    refetch
  };
}
