
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
      console.log("Fetching ALL media files with filters:", filters);
      console.log("Search query:", searchQuery);
      console.log("Available buckets count:", buckets.length);
      console.log("Available buckets:", buckets);
      
      try {
        // Combined approach: Get files from both database AND storage
        let allMediaFiles: MediaFile[] = [];
        
        // 1. First fetch ALL media file records from the database (no user filtering for admins)
        let query = supabase
          .from('media_files')
          .select('*')
          .order('uploaded_at', { ascending: false });

        // Apply filters only if they are explicitly set by user
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
          const processedDbFiles = await processMedia(dbFiles, buckets);
          allMediaFiles = [...allMediaFiles, ...processedDbFiles];
        }
        
        // 2. Always load files directly from storage to ensure complete coverage
        // This ensures we show ALL files regardless of DB records for admins
        console.log("Loading all files from storage buckets for complete coverage");
        
        if (buckets.length === 0) {
          console.warn("No buckets available - this may indicate storage is not properly configured");
        } else {
          console.log(`Loading files from buckets: ${buckets.join(', ')}`);
        }
        
        const storageFiles = await loadFilesFromStorage(buckets);
        
        if (storageFiles.length > 0) {
          console.log(`Found ${storageFiles.length} files directly from storage buckets`);
          
          // Filter by search query if needed
          const filteredStorageFiles = searchQuery 
            ? storageFiles.filter(f => f.filename.toLowerCase().includes(searchQuery.toLowerCase()))
            : storageFiles;
          
          if (filteredStorageFiles.length !== storageFiles.length) {
            console.log(`Filtered storage files to ${filteredStorageFiles.length} based on search "${searchQuery}"`);
          }
          
          // Remove duplicates by file_url (prefer DB records when there's overlap)
          const dbFileUrls = new Set(allMediaFiles.map(f => f.file_url));
          const uniqueStorageFiles = filteredStorageFiles.filter(f => !dbFileUrls.has(f.file_url));
          
          console.log(`Adding ${uniqueStorageFiles.length} unique storage files to results`);
          allMediaFiles = [...allMediaFiles, ...uniqueStorageFiles];
        } else {
          console.log("No files found in storage buckets");
        }
        
        console.log(`Total media files to display: ${allMediaFiles.length}`);
        
        // Sort by uploaded_at descending
        return allMediaFiles.sort((a, b) => 
          new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime()
        );
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
