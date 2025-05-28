
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
  
  // Query to fetch ALL media files from storage and enhance with database metadata
  const { 
    data: mediaFiles, 
    isLoading, 
    isError, 
    error,
    refetch
  } = useQuery({
    queryKey: ['media-files', filters, searchQuery, buckets.length, isAdmin],
    queryFn: async () => {
      console.log("=== MEDIA QUERY START ===");
      console.log("Fetching ALL media files with filters:", filters);
      console.log("Search query:", searchQuery);
      console.log("Is Admin:", isAdmin);
      console.log("Available buckets count:", buckets.length);
      console.log("Available buckets:", buckets);
      
      try {
        let allMediaFiles: MediaFile[] = [];
        
        // PRIORITY 1: Load ALL files from storage buckets (this is the source of truth)
        console.log("STEP 1: Loading ALL files from storage buckets");
        
        if (buckets.length === 0) {
          console.warn("No buckets available - storage buckets may not be configured properly");
        } else {
          console.log(`Loading files from buckets: ${buckets.join(', ')}`);
          
          const storageFiles = await loadFilesFromStorage(buckets);
          
          if (storageFiles.length > 0) {
            console.log(`SUCCESS: Found ${storageFiles.length} files directly from storage buckets`);
            
            // Apply search filter if needed
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
        }
        
        // STEP 2: Fetch database records to enhance storage files with metadata
        console.log("STEP 2: Fetching database records for metadata enhancement");
        let query = supabase
          .from('media_files')
          .select('*')
          .order('uploaded_at', { ascending: false });

        // FOR ADMINS: Remove user-based filtering to get ALL database records
        // FOR REGULAR USERS: Apply user filtering (if needed)
        if (!isAdmin) {
          // Only apply user filtering for non-admin users
          if (filters.user) query = query.eq('user_id', filters.user);
        }
        
        // Apply other filters regardless of admin status
        if (filters.category) query = query.eq('category', filters.category);
        if (filters.startDate) query = query.gte('uploaded_at', filters.startDate);
        if (filters.endDate) query = query.lte('uploaded_at', filters.endDate);
        
        if (searchQuery) {
          query = query.ilike('filename', `%${searchQuery}%`);
        }

        console.log(`Database query for ${isAdmin ? 'ADMIN' : 'USER'}: fetching ${isAdmin ? 'ALL' : 'filtered'} records`);

        const { data: dbFiles, error: dbError } = await query;

        if (dbError) {
          console.error("Error fetching media files from database:", dbError);
          // Don't throw - we can still show storage files
        } else {
          console.log(`Found ${dbFiles?.length || 0} media file records in database`);
          
          // STEP 3: Enhance storage files with database metadata where available
          if (dbFiles && dbFiles.length > 0) {
            console.log("STEP 3: Enhancing storage files with database metadata");
            
            // Create a map of database files by file_url for quick lookup
            const dbFileMap = new Map();
            dbFiles.forEach(dbFile => {
              dbFileMap.set(dbFile.file_url, dbFile);
            });
            
            // Enhance storage files with database metadata
            allMediaFiles = allMediaFiles.map(storageFile => {
              const dbFile = dbFileMap.get(storageFile.file_url);
              if (dbFile) {
                console.log(`Enhanced storage file ${storageFile.filename} with database metadata`);
                return {
                  ...storageFile,
                  ...dbFile, // Database metadata takes precedence
                  signedUrl: storageFile.signedUrl, // Keep the storage signed URL
                  bucket_name: storageFile.bucket_name // Keep the storage bucket name
                };
              }
              return storageFile;
            });
            
            // FOR ADMINS ONLY: Add any database files that don't exist in storage (orphaned records)
            if (isAdmin) {
              const storageUrls = new Set(allMediaFiles.map(f => f.file_url));
              const orphanedDbFiles = dbFiles.filter(dbFile => !storageUrls.has(dbFile.file_url));
              
              if (orphanedDbFiles.length > 0) {
                console.log(`Found ${orphanedDbFiles.length} orphaned database records (files deleted from storage)`);
                // Process orphaned files to try to get signed URLs
                const processedOrphans = await processMedia(orphanedDbFiles, buckets);
                allMediaFiles.push(...processedOrphans);
              }
            }
          }
        }
        
        console.log(`=== FINAL RESULT: ${allMediaFiles.length} total media files ===`);
        allMediaFiles.forEach((file, i) => {
          console.log(`${i+1}. ${file.filename} (${file.bucket_name || 'unknown bucket'}) - ${file.file_size} bytes - User: ${file.user_id || 'storage-file'}`);
        });
        
        // Sort by uploaded_at descending
        return allMediaFiles.sort((a, b) => 
          new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime()
        );
      } catch (error) {
        console.error("Error in media query:", error);
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
