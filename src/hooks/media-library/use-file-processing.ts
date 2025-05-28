
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MediaFile } from "./types";

/**
 * Custom hook for file processing operations in the media library - Storage Only Version
 * @returns Storage-only file processing utility functions
 */
export function useFileProcessing() {
  // Recursive function to list all files in a bucket, including subdirectories
  const listFilesRecursively = useCallback(async (bucketName: string, path: string = ''): Promise<any[]> => {
    console.log(`[RECURSIVE SCAN] Scanning bucket: ${bucketName}, path: "${path}"`);
    
    try {
      const { data: items, error } = await supabase.storage
        .from(bucketName)
        .list(path, {
          limit: 1000,
          offset: 0,
        });

      if (error) {
        console.error(`[RECURSIVE SCAN] Error listing path "${path}" in bucket ${bucketName}:`, error);
        return [];
      }

      if (!items || items.length === 0) {
        console.log(`[RECURSIVE SCAN] No items found in path "${path}"`);
        return [];
      }

      const allFiles: any[] = [];

      for (const item of items) {
        const fullPath = path ? `${path}/${item.name}` : item.name;
        
        if (item.id === null) {
          // This is a folder, recursively scan it
          console.log(`[RECURSIVE SCAN] Found folder: ${fullPath}, scanning recursively...`);
          const subFiles = await listFilesRecursively(bucketName, fullPath);
          allFiles.push(...subFiles);
        } else {
          // This is a file
          console.log(`[RECURSIVE SCAN] Found file: ${fullPath}`);
          allFiles.push({
            ...item,
            fullPath: fullPath,
            bucketName: bucketName
          });
        }
      }

      return allFiles;
    } catch (error) {
      console.error(`[RECURSIVE SCAN] Exception scanning path "${path}" in bucket ${bucketName}:`, error);
      return [];
    }
  }, []);

  // Enhanced function to load ALL files from ALL storage buckets using recursive scanning
  const loadFilesFromStorage = useCallback(async (buckets: string[]) => {
    if (!buckets.length) {
      console.log('[STORAGE SCAN] No buckets provided to loadFilesFromStorage');
      return [];
    }
    
    console.log(`[STORAGE SCAN] Starting comprehensive scan of ${buckets.length} storage buckets using recursive approach (STORAGE-ONLY MODE)`);
    const allFiles: MediaFile[] = [];
    
    // Process each bucket using the recursive scanning approach
    for (const bucketName of buckets) {
      try {
        console.log(`[STORAGE SCAN] === Processing bucket: ${bucketName} ===`);
        
        // Get ALL files from this bucket recursively
        const files = await listFilesRecursively(bucketName);
        
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
    
    console.log(`[STORAGE SCAN] === SCAN COMPLETE (STORAGE-ONLY MODE) ===`);
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
  }, [listFilesRecursively]);

  return {
    loadFilesFromStorage,
    listFilesRecursively,
  };
}
