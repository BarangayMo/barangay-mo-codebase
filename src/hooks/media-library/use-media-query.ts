
import { useQuery } from "@tanstack/react-query";
import { MediaFile, MediaLibraryFilters } from "./types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Custom hook to manage media file queries - Database Only Version
 * @param filters Optional filters to apply to the media query
 * @param searchQuery Optional search query to filter media by filename
 * @param isAdmin Whether the current user is an admin
 * @returns Query state and data for media files from database only
 */
export function useMediaQuery(
  filters: MediaLibraryFilters,
  searchQuery: string,
  isAdmin: boolean,
  buckets: string[] // Keep for compatibility but unused
) {
  
  // Query to fetch media files from database only
  const { 
    data: mediaFiles, 
    isLoading, 
    isError, 
    error,
    refetch
  } = useQuery({
    queryKey: ['media-files-database-only', searchQuery, filters, isAdmin],
    queryFn: async () => {
      console.log("=== DATABASE-ONLY MEDIA QUERY START ===");
      console.log("Search query:", searchQuery);
      console.log("Is Admin:", isAdmin);
      console.log("Filters:", filters);
      
      try {
        // Build the query for media_files table
        let query = supabase
          .from('media_files')
          .select('*')
          .is('deleted_at', null) // Only get non-deleted files
          .order('uploaded_at', { ascending: false });

        // Apply admin/user filtering
        if (!isAdmin) {
          // Regular users only see their own files
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            console.warn("No authenticated user found");
            return [];
          }
          query = query.eq('user_id', user.id);
          console.log(`Filtering for user: ${user.id}`);
        } else {
          console.log("Admin user - showing all files");
        }

        // Apply search filter
        if (searchQuery.trim()) {
          query = query.ilike('filename', `%${searchQuery}%`);
          console.log(`Applied search filter: ${searchQuery}`);
        }

        // Apply additional filters
        if (filters.user) {
          query = query.eq('user_id', filters.user);
          console.log(`Applied user filter: ${filters.user}`);
        }
        
        if (filters.category) {
          query = query.eq('category', filters.category);
          console.log(`Applied category filter: ${filters.category}`);
        }
        
        if (filters.startDate) {
          query = query.gte('uploaded_at', filters.startDate.toISOString());
          console.log(`Applied start date filter: ${filters.startDate}`);
        }
        
        if (filters.endDate) {
          query = query.lte('uploaded_at', filters.endDate.toISOString());
          console.log(`Applied end date filter: ${filters.endDate}`);
        }

        // Execute the query
        const { data: dbFiles, error: dbError } = await query;

        if (dbError) {
          console.error("Error fetching media files from database:", dbError);
          throw dbError;
        }

        console.log(`Found ${dbFiles?.length || 0} media files in database`);
        
        if (!dbFiles || dbFiles.length === 0) {
          console.log("No media files found");
          return [];
        }

        // Process the files to add signed URLs for display
        const processedFiles: MediaFile[] = [];
        
        for (const file of dbFiles) {
          try {
            // Determine bucket name from file_url or use default
            const bucketName = file.file_url.includes('/') ? 
              file.file_url.split('/')[0] : 'user_uploads';
            
            // Get the actual file path
            const filePath = file.file_url.includes('/') ?
              file.file_url.substring(file.file_url.indexOf('/') + 1) : file.file_url;

            // Try to get a signed URL for the file
            const { data: signedUrlData, error: signedUrlError } = await supabase.storage
              .from(bucketName)
              .createSignedUrl(filePath, 604800); // 7 days

            const processedFile: MediaFile = {
              id: file.id,
              filename: file.filename,
              file_url: file.file_url,
              bucket_name: bucketName,
              content_type: file.content_type,
              file_size: file.file_size,
              uploaded_at: file.uploaded_at,
              user_id: file.user_id,
              category: file.category,
              signedUrl: signedUrlError ? null : signedUrlData?.signedUrl
            };

            if (signedUrlError) {
              console.warn(`Could not create signed URL for ${file.filename}:`, signedUrlError.message);
            }

            processedFiles.push(processedFile);
          } catch (err) {
            console.error(`Error processing file ${file.filename}:`, err);
            // Still add the file even if URL generation failed
            processedFiles.push({
              id: file.id,
              filename: file.filename,
              file_url: file.file_url,
              bucket_name: 'user_uploads',
              content_type: file.content_type,
              file_size: file.file_size,
              uploaded_at: file.uploaded_at,
              user_id: file.user_id,
              category: file.category,
              signedUrl: null
            });
          }
        }
        
        console.log(`=== DATABASE QUERY COMPLETE ===`);
        console.log(`Total files processed: ${processedFiles.length}`);
        
        return processedFiles;
      } catch (error) {
        console.error("Error in database-only media query:", error);
        throw error;
      }
    },
    // Always enabled
    enabled: true,
    // Use staleTime to prevent frequent refetches
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  return {
    mediaFiles,
    isLoading,
    isError,
    error,
    refetch
  };
}
