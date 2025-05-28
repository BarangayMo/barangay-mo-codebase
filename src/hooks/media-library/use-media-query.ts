
import { useQuery } from "@tanstack/react-query";
import { MediaFile, MediaLibraryFilters } from "./types";
import { useFileProcessing } from "./use-file-processing";

/**
 * Custom hook to manage media file queries - Storage Only Version
 * @param filters Optional filters to apply to the media query (for future client-side filtering)
 * @param searchQuery Optional search query to filter media by filename
 * @param isAdmin Whether the current user is an admin
 * @param buckets Available storage buckets
 * @returns Query state and data for media files from storage only
 */
export function useMediaQuery(
  filters: MediaLibraryFilters,
  searchQuery: string,
  isAdmin: boolean,
  buckets: string[]
) {
  const { loadFilesFromStorage } = useFileProcessing();
  
  // Query to fetch ALL media files from storage buckets only
  const { 
    data: mediaFiles, 
    isLoading, 
    isError, 
    error,
    refetch
  } = useQuery({
    queryKey: ['media-files-storage-only', searchQuery, buckets.length, isAdmin],
    queryFn: async () => {
      console.log("=== STORAGE-ONLY MEDIA QUERY START ===");
      console.log("Search query:", searchQuery);
      console.log("Is Admin:", isAdmin);
      console.log("Available buckets count:", buckets.length);
      console.log("Available buckets:", buckets);
      
      try {
        let allMediaFiles: MediaFile[] = [];
        
        // Load ALL files from storage buckets (this is now our only source of truth)
        console.log("Loading ALL files from storage buckets (storage-only mode)");
        
        if (buckets.length === 0) {
          console.warn("No buckets available - storage buckets may not be configured properly");
          return [];
        }
        
        console.log(`Loading files from buckets: ${buckets.join(', ')}`);
        const storageFiles = await loadFilesFromStorage(buckets);
        
        if (storageFiles.length > 0) {
          console.log(`SUCCESS: Found ${storageFiles.length} files directly from storage buckets`);
          
          // Apply search filter if needed (client-side filtering)
          const filteredStorageFiles = searchQuery 
            ? storageFiles.filter(f => f.filename.toLowerCase().includes(searchQuery.toLowerCase()))
            : storageFiles;
          
          if (filteredStorageFiles.length !== storageFiles.length) {
            console.log(`Search filter applied: ${filteredStorageFiles.length}/${storageFiles.length} files match "${searchQuery}"`);
          }
          
          allMediaFiles = [...filteredStorageFiles];
        } else {
          console.log("No files found in storage buckets");
        }
        
        console.log(`=== FINAL RESULT: ${allMediaFiles.length} total media files (storage-only) ===`);
        allMediaFiles.forEach((file, i) => {
          console.log(`${i+1}. ${file.filename} (${file.bucket_name || 'unknown bucket'}) - ${file.file_size} bytes - User: ${file.user_id || 'storage-file'}`);
        });
        
        // Sort by uploaded_at descending
        return allMediaFiles.sort((a, b) => 
          new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime()
        );
      } catch (error) {
        console.error("Error in storage-only media query:", error);
        throw error;
      }
    },
    // Always enabled - this will preload the media files
    enabled: true,
    // Use staleTime to prevent frequent refetches
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    mediaFiles,
    isLoading,
    isError,
    error,
    refetch
  };
}
