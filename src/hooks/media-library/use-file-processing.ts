
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MediaFile } from "./types";
import { toast } from "sonner";

/**
 * Custom hook for file processing operations in the media library
 * @returns File processing utility functions
 */
export function useFileProcessing() {
  // Helper function to determine bucket name and file path from file_url
  const getBucketAndPath = useCallback((buckets: string[], fileUrl: string) => {
    // Check if fileUrl contains user ID format (which indicates full path with bucket)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\//i;
    
    // If the path starts with a UUID, it's likely the format "userId/filename.ext"
    if (uuidRegex.test(fileUrl)) {
      return { 
        bucketName: "user_uploads", // Default bucket
        filePath: fileUrl // Use full path
      };
    }
    
    // Check if path contains a slash indicating "bucketName/filePath" format
    if (fileUrl.includes("/")) {
      const parts = fileUrl.split("/");
      const possibleBucket = parts[0];
      
      // Check if this matches a known bucket
      if (buckets.length > 0 && buckets.includes(possibleBucket)) {
        return {
          bucketName: possibleBucket,
          filePath: fileUrl.substring(fileUrl.indexOf("/") + 1)
        };
      }
    }
    
    // Default fallback
    return { 
      bucketName: "user_uploads",
      filePath: fileUrl
    };
  }, []);

  // Preload and process media files
  const processMedia = useCallback(async (dbFiles: any[], bucketNames: string[]) => {
    if (!dbFiles || dbFiles.length === 0) return [];
    
    console.log(`Processing ${dbFiles.length} media files from database`);
    const processedFiles: MediaFile[] = [];
    
    // Process files in batches to improve performance
    const batchSize = 10;
    for (let i = 0; i < dbFiles.length; i += batchSize) {
      const batch = dbFiles.slice(i, i + batchSize);
      const batchPromises = batch.map(async (file) => {
        try {
          // Determine bucket name and file path
          const { bucketName, filePath } = getBucketAndPath(bucketNames, file.file_url);
          
          // Try to get a signed URL with 7-day expiration for the file
          const { data: signedUrlData, error: signedUrlError } = await supabase.storage
            .from(bucketName)
            .createSignedUrl(filePath, 604800); // 604800 seconds = 7 days

          if (signedUrlError) {
            console.error(`Error creating signed URL for ${file.filename}:`, signedUrlError);
            
            // Still add the file even if we couldn't get a signed URL
            return {
              ...file,
              signedUrl: null,
              bucket_name: bucketName
            } as MediaFile;
          }

          // Add the file with signed URL
          return {
            ...file,
            signedUrl: signedUrlData?.signedUrl || null,
            bucket_name: bucketName
          } as MediaFile;
        } catch (error) {
          console.error(`Error processing file ${file.filename}:`, error);
          // Still add the file even if there was an error
          return {
            ...file,
            bucket_name: "user_uploads" // Default fallback
          } as MediaFile;
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      processedFiles.push(...batchResults);
    }
    
    return processedFiles;
  }, [getBucketAndPath]);

  // Recursively list all files in a directory
  const listFilesRecursively = useCallback(async (bucketName: string, path: string = ''): Promise<any[]> => {
    try {
      // List all items in the current directory
      const { data: items, error } = await supabase.storage
        .from(bucketName)
        .list(path);
        
      if (error) {
        console.error(`Error listing path ${path} in bucket ${bucketName}:`, error);
        return [];
      }
      
      if (!items || items.length === 0) return [];
      
      // Split items into files and folders
      const files = items.filter(item => !item.id.endsWith('/')); // Files have IDs
      const folders = items.filter(item => !item.id); // Folders have no IDs
      
      // Process files in current directory
      const currentDirFiles = files;
      
      // Recursively process each subfolder
      const subfolderPromises = folders.map(async folder => {
        const subPath = path ? `${path}/${folder.name}` : folder.name;
        return await listFilesRecursively(bucketName, subPath);
      });
      
      // Wait for all subfolder processing to complete
      const subfolderResults = await Promise.all(subfolderPromises);
      
      // Combine all results
      return [...currentDirFiles, ...subfolderResults.flat()];
    } catch (error) {
      console.error(`Error in recursive listing for ${path} in ${bucketName}:`, error);
      return [];
    }
  }, []);

  // Load files directly from storage buckets with recursive traversal
  const loadFilesFromStorage = useCallback(async (buckets: string[]) => {
    if (!buckets.length) return [];
    
    console.log(`Loading files from ${buckets.length} storage buckets with recursive traversal`);
    const allFiles: MediaFile[] = [];
    
    // Process each bucket
    for (const bucketName of buckets) {
      try {
        // Get all files recursively
        const files = await listFilesRecursively(bucketName);
        
        if (!files || files.length === 0) {
          console.log(`No files found in bucket ${bucketName}`);
          continue;
        }
        
        console.log(`Found ${files.length} files in bucket ${bucketName}`);
        
        // Process files in batches for better performance
        const batchSize = 10;
        for (let i = 0; i < files.length; i += batchSize) {
          const batch = files.slice(i, i + batchSize);
          
          const batchPromises = batch.map(async (file) => {
            try {
              // Get full path including any parent directories
              let fullPath = file.name;
              if (file.metadata?.fullPath) {
                fullPath = file.metadata.fullPath;
              }
              
              // Get signed URL
              const { data: signedUrlData } = await supabase.storage
                .from(bucketName)
                .createSignedUrl(fullPath, 604800);
              
              // Extract filename from path
              const filename = fullPath.split('/').pop() || fullPath;
              
              // Use file.id as id or generate one if not available
              const fileId = file.id || `${bucketName}-${fullPath.replace(/[\/\.]/g, '-')}`;
              
              // Construct file object
              return {
                id: fileId,
                filename: filename,
                file_url: fullPath,
                bucket_name: bucketName,
                content_type: file.metadata?.mimetype || 'application/octet-stream',
                file_size: file.metadata?.size || 0,
                uploaded_at: file.created_at || new Date().toISOString(),
                signedUrl: signedUrlData?.signedUrl || null
              } as MediaFile;
            } catch (err) {
              console.error(`Error processing file ${file.name}:`, err);
              return null;
            }
          });
          
          const batchResults = await Promise.all(batchPromises);
          allFiles.push(...batchResults.filter(Boolean) as MediaFile[]);
        }
      } catch (err) {
        console.error(`Error processing bucket ${bucketName}:`, err);
      }
    }
    
    return allFiles;
  }, [listFilesRecursively]);

  return {
    processMedia,
    loadFilesFromStorage,
    getBucketAndPath,
  };
}
