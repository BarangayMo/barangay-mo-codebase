
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MediaFile, FileOperation } from "./types";
import { toast } from "sonner";
import { useBuckets } from "./use-buckets";

export function useFileOperations(refetch: () => void) {
  const { buckets } = useBuckets();
  const bucketNames = buckets.map(b => b.name);

  // Helper function to ensure valid session
  const ensureValidSession = useCallback(async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      const { error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) {
        throw new Error("Authentication required. Please log in again.");
      }
    }
  }, []);

  // Extract bucket name and path from file_url
  const getBucketAndPath = useCallback((fileUrl: string) => {
    console.log(`Getting bucket and path for: ${fileUrl}`);
    
    // Check if the URL is already absolute (starts with http)
    if (fileUrl.startsWith('http')) {
      const urlParts = fileUrl.split('/');
      // Try to extract bucket name from URL path
      for (const bucketName of bucketNames) {
        const bucketIndex = urlParts.findIndex(part => part === bucketName);
        if (bucketIndex >= 0 && bucketIndex + 1 < urlParts.length) {
          const path = urlParts.slice(bucketIndex + 1).join('/');
          console.log(`Found bucket in URL: ${bucketName}, path: ${path}`);
          return {
            bucketName,
            filePath: path
          };
        }
      }
      
      // Default to user_uploads if we can't determine the bucket
      const defaultPath = fileUrl.split('/').pop() || fileUrl;
      console.log(`Using default bucket for URL: user_uploads, path: ${defaultPath}`);
      return { 
        bucketName: "user_uploads",
        filePath: defaultPath // Just use the filename
      };
    }
    
    // Check if fileUrl contains user ID format (which indicates full path with bucket)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\//i;
    
    // If the path starts with a UUID, it's likely the format "userId/filename.ext"
    if (uuidRegex.test(fileUrl)) {
      console.log(`UUID detected in path: ${fileUrl}, using default bucket`);
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
      if (bucketNames.length > 0 && bucketNames.includes(possibleBucket)) {
        const path = fileUrl.substring(fileUrl.indexOf("/") + 1);
        console.log(`Found matching bucket "${possibleBucket}" for: ${fileUrl}, path: ${path}`);
        return {
          bucketName: possibleBucket,
          filePath: path
        };
      }
    }
    
    // Default fallback
    console.log(`Using default fallback for: ${fileUrl}`);
    return { 
      bucketName: "user_uploads",
      filePath: fileUrl
    };
  }, [bucketNames]);

  // Handle file download
  const handleDownload = useCallback(async (bucketName: string, fileUrl: string, fileName: string, signedUrl?: string): Promise<FileOperation> => {
    try {
      await ensureValidSession();
      
      // If we have a signed URL, use that directly
      if (signedUrl) {
        console.log(`Downloading file using signed URL: ${fileName}`);
        // Create an anchor element and trigger download
        const link = document.createElement('a');
        link.href = signedUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('File downloaded successfully');
        return { success: true };
      }
      
      // Otherwise, extract the file path and do a direct download
      const { filePath } = getBucketAndPath(fileUrl);
      console.log(`Downloading file from: bucket=${bucketName}, path=${filePath}`);

      const { data, error } = await supabase.storage
        .from(bucketName)
        .download(filePath);

      if (error) throw error;

      // Create a temporary URL from the blob and trigger download
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Clean up
      toast.success('File downloaded successfully');
      return { success: true };
    } catch (error) {
      toast.error('Failed to download file');
      console.error('Download error:', error);
      return { success: false, message: 'Failed to download file' };
    }
  }, [getBucketAndPath, ensureValidSession]);

  // Handle file deletion
  const handleDelete = useCallback(async (fileId: string, bucketName: string, fileUrl: string): Promise<FileOperation> => {
    try {
      console.log(`=== DELETE OPERATION START ===`);
      console.log(`File ID: ${fileId}`);
      console.log(`Bucket: ${bucketName}`);
      console.log(`File URL: ${fileUrl}`);

      await ensureValidSession();

      // Extract the file path - always use user_uploads bucket
      const { filePath } = getBucketAndPath(fileUrl);
      console.log(`Deleting file: id=${fileId}, bucket=user_uploads, path=${filePath}`);

      // Delete from storage first
      const { error: storageError } = await supabase.storage
        .from('user_uploads') // Always use user_uploads bucket
        .remove([filePath]);

      if (storageError) {
        console.error('Storage deletion error:', storageError);
        // Continue with database deletion even if storage fails
      } else {
        console.log('File successfully deleted from storage');
      }

      // Delete from metadata table
      const { error: databaseError } = await supabase
        .from('media_files')
        .delete()
        .eq('id', fileId);

      if (databaseError) {
        console.error('Database deletion error:', databaseError);
        throw databaseError;
      }

      console.log('File successfully deleted from database');
      console.log(`=== DELETE OPERATION SUCCESS ===`);
      
      toast.success('File deleted successfully');
      
      // Force immediate refresh
      refetch();
      
      return { success: true };
    } catch (error) {
      console.error('Delete operation failed:', error);
      toast.error('Failed to delete file');
      return { success: false, message: 'Failed to delete file' };
    }
  }, [getBucketAndPath, refetch, ensureValidSession]);

  // Handle URL copying
  const handleCopyUrl = useCallback(async (signedUrl?: string, bucketName?: string, fileUrl?: string): Promise<FileOperation> => {
    try {
      await ensureValidSession();
      
      // If we already have a signed URL, use that
      if (signedUrl) {
        await navigator.clipboard.writeText(signedUrl);
        toast.success('URL copied to clipboard (expires in 7 days)');
        return { success: true };
      }
      
      // Otherwise generate one
      if (!bucketName || !fileUrl) {
        toast.error('Missing file information');
        return { success: false, message: 'Missing file information' };
      }
      
      // Extract the file path
      const { filePath } = getBucketAndPath(fileUrl);
      console.log(`Generating signed URL for: bucket=${bucketName}, path=${filePath}`);

      // Generate a signed URL with 7-day expiration for sharing
      const { data, error } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(filePath, 604800); // 604800 seconds = 7 days
      
      if (error) throw error;
      
      await navigator.clipboard.writeText(data.signedUrl);
      toast.success('URL copied to clipboard (expires in 7 days)');
      return { success: true };
    } catch (error) {
      toast.error('Failed to generate URL');
      console.error('URL generation error:', error);
      return { success: false, message: 'Failed to generate URL' };
    }
  }, [getBucketAndPath, ensureValidSession]);

  return {
    handleDownload,
    handleDelete,
    handleCopyUrl,
    getBucketAndPath,
  };
}
