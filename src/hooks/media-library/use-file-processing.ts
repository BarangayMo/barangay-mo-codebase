
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
    console.log(`Determining bucket and path for: ${fileUrl}`);
    
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
      console.log(`UUID detected in path: ${fileUrl}`);
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
    console.log(`Using default bucket for: ${fileUrl}`);
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
            console.warn(`Could not create signed URL for ${file.filename} (${bucketName}/${filePath}):`, signedUrlError.message);
            
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

  // Enhanced recursive function to scan ALL directories and files in a bucket
  const scanBucketCompletely = useCallback(async (bucketName: string): Promise<any[]> => {
    console.log(`[COMPLETE SCAN] Starting comprehensive scan of bucket: ${bucketName}`);
    
    try {
      // Use direct SQL query to get ALL files from this bucket at once
      // This bypasses the JS SDK limitations and gets the complete directory structure
      const { data: allFiles, error } = await supabase
        .from('storage.objects')
        .select('*')
        .eq('bucket_id', bucketName)
        .order('name');

      if (error) {
        console.error(`[COMPLETE SCAN] Error querying storage.objects for bucket ${bucketName}:`, error);
        return [];
      }

      if (!allFiles || allFiles.length === 0) {
        console.log(`[COMPLETE SCAN] No files found in bucket ${bucketName}`);
        return [];
      }

      console.log(`[COMPLETE SCAN] Found ${allFiles.length} files in bucket ${bucketName}:`);
      allFiles.forEach((file, i) => {
        console.log(`  ${i + 1}. ${file.name} (${file.metadata?.size || 'unknown size'})`);
      });

      // Filter out any folder entries (files without proper metadata)
      const actualFiles = allFiles.filter(file => {
        // A file should have size metadata or be a recognizable file type
        return file.metadata?.size !== undefined || file.name.includes('.');
      });

      console.log(`[COMPLETE SCAN] Filtered to ${actualFiles.length} actual files`);

      return actualFiles.map(file => ({
        ...file,
        fullPath: file.name, // Use the complete path from storage
        id: file.id,
        created_at: file.created_at,
        metadata: file.metadata
      }));

    } catch (error) {
      console.error(`[COMPLETE SCAN] Exception scanning bucket ${bucketName}:`, error);
      return [];
    }
  }, []);

  // Enhanced function to load ALL files from ALL storage buckets using direct SQL approach
  const loadFilesFromStorage = useCallback(async (buckets: string[]) => {
    if (!buckets.length) {
      console.log('[STORAGE SCAN] No buckets provided to loadFilesFromStorage');
      return [];
    }
    
    console.log(`[STORAGE SCAN] Starting comprehensive scan of ${buckets.length} storage buckets using direct SQL approach`);
    const allFiles: MediaFile[] = [];
    
    // Process each bucket using the complete scanning approach
    for (const bucketName of buckets) {
      try {
        console.log(`[STORAGE SCAN] === Processing bucket: ${bucketName} ===`);
        
        // Get ALL files from this bucket at once using SQL
        const files = await scanBucketCompletely(bucketName);
        
        if (!files || files.length === 0) {
          console.log(`[STORAGE SCAN] No files found in bucket ${bucketName}`);
          continue;
        }
        
        console.log(`[STORAGE SCAN] Found ${files.length} files in bucket ${bucketName}`);
        
        // Process files in smaller batches for better stability
        const batchSize = 5;
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
                console.warn(`[STORAGE SCAN] Could not create signed URL for ${fullPath}:`, signedUrlError.message);
                // Still include the file even without signed URL
              }
              
              // Extract filename from path
              const filename = fullPath.split('/').pop() || fullPath;
              
              // Extract user information from path if possible
              const pathParts = fullPath.split('/');
              let extractedUserId = 'storage-file';
              
              if (pathParts.length > 1) {
                const firstPart = pathParts[0];
                // Check if it looks like a UUID or email
                const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                
                if (uuidRegex.test(firstPart) || emailRegex.test(firstPart)) {
                  extractedUserId = firstPart;
                }
              }
              
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
                user_id: extractedUserId,
                category: 'uncategorized'
              };
              
              console.log(`[STORAGE SCAN] Successfully processed: ${filename} (${mediaFile.file_size} bytes) - User: ${extractedUserId}`);
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
    
    if (allFiles.length > 0) {
      console.log(`[STORAGE SCAN] Files by bucket:`);
      const filesByBucket = allFiles.reduce((acc, file) => {
        acc[file.bucket_name] = (acc[file.bucket_name] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      Object.entries(filesByBucket).forEach(([bucket, count]) => {
        console.log(`  ${bucket}: ${count} files`);
      });
    }
    
    return allFiles;
  }, [scanBucketCompletely]);

  return {
    processMedia,
    loadFilesFromStorage,
    getBucketAndPath,
  };
}
