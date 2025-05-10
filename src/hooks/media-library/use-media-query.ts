
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MediaFile, MediaLibraryFilters } from "./types";
import { useFileProcessing } from "./use-file-processing";

/**
 * Custom hook to manage media file queries
 * @param filters Optional filters to apply to the media query
 * @param searchQuery Optional search query to filter media by filename
 * @param isAdmin Whether the current user is an admin
 * @param buckets Available storage buckets
 * @returns Query state and data for media files
 */
export function useMediaQuery(
  filters: MediaLibraryFilters,
  searchQuery: string,
  isAdmin: boolean,
  buckets: string[]
) {
  const { processMedia, loadFilesFromStorage } = useFileProcessing();
  
  // Query to fetch media files from database and enhance with storage data
  const { 
    data: mediaFiles, 
    isLoading, 
    isError, 
    error,
    refetch
  } = useQuery({
    queryKey: ['media-files', filters, searchQuery, buckets.length],
    queryFn: async () => {
      console.log("Fetching media files with filters:", filters);
      console.log("Search query:", searchQuery);
      console.log("Available buckets count:", buckets.length);
      
      try {
        // First fetch media file records from the database
        let query = supabase
          .from('media_files')
          .select('*')
          .order('uploaded_at', { ascending: false });

        if (filters.user) query = query.eq('user_id', filters.user);
        if (filters.category) query = query.eq('category', filters.category);
        if (filters.startDate) query = query.gte('uploaded_at', filters.startDate);
        if (filters.endDate) query = query.lte('uploaded_at', filters.endDate);
        
        if (searchQuery) {
          query = query.ilike('filename', `%${searchQuery}%`);
        }

        const { data: dbFiles, error: dbError } = await query;

        if (dbError) {
          console.error("Error fetching media files from database:", dbError);
          throw dbError;
        }

        console.log(`Found ${dbFiles?.length || 0} media files in database`);
        
        // Process the database files to get signed URLs
        if (dbFiles && dbFiles.length > 0) {
          return await processMedia(dbFiles, buckets);
        }
        
        // If no files in database, try to load directly from storage
        if (isAdmin) {
          const storageFiles = await loadFilesFromStorage(buckets);
          if (storageFiles.length > 0) {
            console.log(`Found ${storageFiles.length} files directly from storage buckets`);
            return storageFiles;
          }
        }
        
        // Return empty array if no files found
        return [];
      } catch (error) {
        console.error("Error in queryFn:", error);
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
