import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MediaFile, FileOperation } from "./types";
import { toast } from "sonner";
import { useBuckets } from "./use-buckets";

export function useFileOperations(refetch: () => void) {
  const { buckets } = useBuckets();
  const bucketNames = buckets.map(b => b.name);

  // Extract bucket and path from file URL
  const getBucketAndPath = useCallback((fileUrl: string) => {
    // Check if fileUrl contains user ID format (which indicates full path with bucket)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\//i;
    
    // If the path starts with a UUID, it's likely the format "userId/filename.ext"
    if (uuidRegex.test(fileUrl)) {
      console.log(`UUID detected in path, using default bucket for: ${fileUrl}`);
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
        console.log(`Found matching bucket "${possibleBucket}" for: ${fileUrl}`);
        return {
          bucketName: possibleBucket,
          filePath: fileUrl.substring(fileUrl.indexOf("/") + 1)
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
      // If we have a signed URL, use that directly
      if (signedUrl) {
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
  }, [getBucketAndPath]);

  // Handle file deletion
  const handleDelete = useCallback(async (fileId: string, bucketName: string, fileUrl: string): Promise<FileOperation> => {
    try {
      // Extract the file path
      const { filePath } = getBucketAndPath(fileUrl);

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from metadata table
      const { error: databaseError } = await supabase
        .from('media_files')
        .delete()
        .eq('id', fileId);

      if (databaseError) throw databaseError;

      toast.success('File deleted successfully');
      refetch(); // Refresh the media list
      return { success: true };
    } catch (error) {
      toast.error('Failed to delete file');
      console.error('Delete error:', error);
      return { success: false, message: 'Failed to delete file' };
    }
  }, [getBucketAndPath, refetch]);

  // Handle URL copying
  const handleCopyUrl = useCallback(async (signedUrl?: string, bucketName?: string, fileUrl?: string): Promise<FileOperation> => {
    try {
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
  }, [getBucketAndPath]);

  return {
    handleDownload,
    handleDelete,
    handleCopyUrl,
    getBucketAndPath,
  };
}
