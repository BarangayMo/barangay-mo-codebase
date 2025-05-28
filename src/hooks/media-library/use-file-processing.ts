
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
    // Check if the URL is already absolute (starts with http)
    if (fileUrl.startsWith('http')) {
      const urlParts = fileUrl.split('/');
      // Try to extract bucket name from URL path
      for (const bucketName of buckets) {
        const bucketIndex = urlParts.findIndex(part => part === bucketName);
        if (bucketIndex >= 0 && bucketIndex + 1 < urlParts.length) {
          return {
            bucketName,
            filePath: urlParts.slice(bucketIndex + 1).join('/')
          };
        }
      }
      
      // Default to user_uploads if we can't determine the bucket
      return { 
        bucketName: "user_uploads",
        filePath: fileUrl.split('/').pop() || fileUrl // Just use the filename
      };
    }
    
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

  // Enhanced recursive function to list all files in a directory with better permissions handling
  const listFilesRecursively = useCallback(async (bucketName: string, path: string = ''): Promise<any[]> => {
    try {
      console.log(`[STORAGE SCAN] Listing files in bucket: ${bucketName}, path: "${path}"`);
      
      // List all items in the current directory with increased limit and sorted
      const { data: items, error } = await supabase.storage
        .from(bucketName)
        .list(path, { 
          sortBy: { column: 'name', order: 'asc' },
          limit: 1000 // Ensure we get all files
        });
        
      if (error) {
        console.error(`[STORAGE SCAN] Error listing path "${path}" in bucket ${bucketName}:`, error);
        // If we get a permission error, try to continue with other paths
        if (error.message?.includes('permission') || error.message?.includes('access')) {
          console.warn(`[STORAGE SCAN] Permission denied for path "${path}" in bucket ${bucketName}, skipping...`);
          return [];
        }
        return [];
      }
      
      if (!items || items.length === 0) {
        console.log(`[STORAGE SCAN] No items found in bucket ${bucketName} at path "${path}"`);
        return [];
      }
      
      console.log(`[STORAGE SCAN] Found ${items.length} items in bucket ${bucketName} at path "${path}":`, items.map(i => `${i.name} (${i.id ? 'file' : 'folder'})`));
      
      const allFiles: any[] = [];
      
      // Process each item - could be file or folder
      for (const item of items) {
        const itemPath = path ? `${path}/${item.name}` : item.name;
        
        // Check if item is a folder (has no id or metadata indicates it's a folder)
        if (!item.id || item.metadata?.size === undefined) {
          console.log(`[STORAGE SCAN] Found folder: "${itemPath}" in bucket ${bucketName}`);
          // Recursively process the folder
          try {
            const subFiles = await listFilesRecursively(bucketName, itemPath);
            allFiles.push(...subFiles);
          } catch (subError) {
            console.error(`[STORAGE SCAN] Error processing subfolder "${itemPath}":`, subError);
            // Continue with other items even if one subfolder fails
          }
        } else {
          // This is a file
          console.log(`[STORAGE SCAN] Found file: "${itemPath}" in bucket ${bucketName}, size: ${item.metadata?.size || 'unknown'}`);
          allFiles.push({
            ...item,
            fullPath: itemPath
          });
        }
      }
      
      return allFiles;
    } catch (error) {
      console.error(`[STORAGE SCAN] Error in recursive listing for "${path}" in ${bucketName}:`, error);
      return [];
    }
  }, []);

  // Enhanced function to load ALL files from ALL storage buckets with better error handling
  const loadFilesFromStorage = useCallback(async (buckets: string[]) => {
    if (!buckets.length) {
      console.log('[STORAGE SCAN] No buckets provided to loadFilesFromStorage');
      return [];
    }
    
    console.log(`[STORAGE SCAN] Starting comprehensive scan of ${buckets.length} storage buckets for ALL files (ADMIN MODE)`);
    const allFiles: MediaFile[] = [];
    
    // Process each bucket
    for (const bucketName of buckets) {
      try {
        console.log(`[STORAGE SCAN] === Processing bucket: ${bucketName} ===`);
        
        // Get all files recursively, starting from the root
        const files = await listFilesRecursively(bucketName);
        
        if (!files || files.length === 0) {
          console.log(`[STORAGE SCAN] No files found in bucket ${bucketName}`);
          continue;
        }
        
        console.log(`[STORAGE SCAN] Found ${files.length} total files in bucket ${bucketName}:`);
        files.forEach((f, i) => console.log(`  ${i+1}. ${f.fullPath || f.name} (${f.metadata?.size || 'unknown size'})`));
        
        // Process files in smaller batches for better stability
        const batchSize = 3; // Smaller batches to avoid rate limits
        for (let i = 0; i < files.length; i += batchSize) {
          const batch = files.slice(i, i + batchSize);
          console.log(`[STORAGE SCAN] Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(files.length/batchSize)} for bucket ${bucketName}`);
          
          const batchPromises = batch.map(async (file) => {
            try {
              // Get full path including any parent directories
              const fullPath = file.fullPath || file.name;
              
              console.log(`[STORAGE SCAN] Processing file: ${fullPath} in bucket ${bucketName}`);
              
              // Get signed URL with extended expiration
              const { data: signedUrlData, error: signedUrlError } = await supabase.storage
                .from(bucketName)
                .createSignedUrl(fullPath, 604800); // 604800 seconds = 7 days
              
              if (signedUrlError) {
                console.error(`[STORAGE SCAN] Error creating signed URL for ${fullPath}:`, signedUrlError);
                // Still include the file even without signed URL
              }
              
              // Extract filename from path
              const filename = fullPath.split('/').pop() || fullPath;
              
              // Generate a unique ID for the file
              const fileId = file.id || `storage-${bucketName}-${fullPath.replace(/[\/\.]/g, '-')}-${Date.now()}`;
              
              // Determine content type from file extension if not available
              const getContentType = (filename: string) => {
                const ext = filename.split('.').pop()?.toLowerCase();
                const typeMap: { [key: string]: string } = {
                  'jpg': 'image/jpeg',
                  'jpeg': 'image/jpeg',
                  'png': 'image/png',
                  'gif': 'image/gif',
                  'webp': 'image/webp',
                  'svg': 'image/svg+xml',
                  'pdf': 'application/pdf',
                  'doc': 'application/msword',
                  'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                  'mp4': 'video/mp4',
                  'mov': 'video/quicktime',
                  'avi': 'video/x-msvideo'
                };
                return typeMap[ext || ''] || 'application/octet-stream';
              };
              
              // Construct file object
              const mediaFile: MediaFile = {
                id: fileId,
                filename: filename,
                file_url: fullPath,
                bucket_name: bucketName,
                content_type: file.metadata?.mimetype || getContentType(filename),
                file_size: file.metadata?.size || 0,
                uploaded_at: file.created_at || new Date().toISOString(),
                signedUrl: signedUrlData?.signedUrl || null,
                user_id: 'storage-file', // Placeholder for storage-only files
                category: 'uncategorized'
              };
              
              console.log(`[STORAGE SCAN] Successfully processed: ${filename} (${mediaFile.file_size} bytes) by user: ${mediaFile.user_id}`);
              return mediaFile;
            } catch (err) {
              console.error(`[STORAGE SCAN] Error processing file ${file.name}:`, err);
              return null;
            }
          });
          
          const batchResults = await Promise.all(batchPromises);
          const validFiles = batchResults.filter(Boolean) as MediaFile[];
          allFiles.push(...validFiles);
          
          console.log(`[STORAGE SCAN] Batch completed: ${validFiles.length}/${batch.length} files processed successfully`);
          
          // Small delay between batches to avoid overwhelming the API
          if (i + batchSize < files.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
      } catch (err) {
        console.error(`[STORAGE SCAN] Error processing bucket ${bucketName}:`, err);
      }
    }
    
    console.log(`[STORAGE SCAN] === SCAN COMPLETE ===`);
    console.log(`[STORAGE SCAN] Total files loaded from ALL storage buckets: ${allFiles.length}`);
    allFiles.forEach((f, i) => console.log(`  ${i+1}. ${f.filename} from ${f.bucket_name} (${f.file_size} bytes) - User: ${f.user_id}`));
    
    return allFiles;
  }, [listFilesRecursively]);

  return {
    processMedia,
    loadFilesFromStorage,
    getBucketAndPath,
  };
}
