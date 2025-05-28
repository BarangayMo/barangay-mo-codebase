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

  // Handle file download - FIXED: Force download instead of opening in browser
  const handleDownload = useCallback(async (bucketName: string, fileUrl: string, fileName: string, signedUrl?: string): Promise<FileOperation> => {
    try {
      await ensureValidSession();
      
      console.log(`=== DOWNLOAD OPERATION START ===`);
      console.log(`File: ${fileName}`);
      console.log(`Bucket: ${bucketName}`);
      console.log(`File URL: ${fileUrl}`);
      console.log(`Signed URL available: ${!!signedUrl}`);
      
      let downloadUrl = signedUrl;
      
      // If we don't have a signed URL, generate one
      if (!downloadUrl) {
        const { filePath } = getBucketAndPath(fileUrl);
        console.log(`Generating signed URL for download: bucket=${bucketName}, path=${filePath}`);

        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
          .from(bucketName)
          .createSignedUrl(filePath, 3600); // 1 hour for download

        if (signedUrlError) throw signedUrlError;
        downloadUrl = signedUrlData.signedUrl;
      }

      if (!downloadUrl) {
        throw new Error("Could not generate download URL");
      }

      // Force download using fetch and blob
      console.log(`Fetching file for download: ${downloadUrl}`);
      const response = await fetch(downloadUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      // Create download link with proper headers to force download
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName; // This forces download instead of opening
      link.style.display = 'none';
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the object URL
      URL.revokeObjectURL(url);
      
      console.log(`=== DOWNLOAD OPERATION SUCCESS ===`);
      toast.success('File downloaded successfully');
      return { success: true };
      
    } catch (error) {
      console.error('=== DOWNLOAD OPERATION FAILED ===', error);
      toast.error('Failed to download file');
      return { success: false, message: 'Failed to download file' };
    }
  }, [getBucketAndPath, ensureValidSession]);

  // Handle file deletion - ENHANCED: Better error handling and logging
  const handleDelete = useCallback(async (fileId: string, bucketName: string, fileUrl: string): Promise<FileOperation> => {
    try {
      console.log(`=== DELETE OPERATION START ===`);
      console.log(`File ID: ${fileId}`);
      console.log(`Bucket: ${bucketName}`);
      console.log(`File URL: ${fileUrl}`);

      await ensureValidSession();

      // Get current user to verify ownership
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("User authentication failed");
      }
      console.log(`Authenticated user: ${user.id}`);

      // Extract the file path - always use user_uploads bucket
      const { filePath } = getBucketAndPath(fileUrl);
      console.log(`Deleting file: id=${fileId}, bucket=user_uploads, path=${filePath}`);

      // Delete from storage first
      console.log(`Attempting to delete from storage...`);
      const { error: storageError } = await supabase.storage
        .from('user_uploads') // Always use user_uploads bucket
        .remove([filePath]);

      if (storageError) {
        console.error('Storage deletion error:', storageError);
        // Continue with database deletion even if storage fails
        console.log('Continuing with database deletion despite storage error...');
      } else {
        console.log('File successfully deleted from storage');
      }

      // Delete from metadata table
      console.log(`Attempting to delete from database...`);
      const { error: databaseError } = await supabase
        .from('media_files')
        .delete()
        .eq('id', fileId)
        .eq('user_id', user.id); // Add user_id check for extra security

      if (databaseError) {
        console.error('Database deletion error:', databaseError);
        throw new Error(`Database deletion failed: ${databaseError.message}`);
      }

      console.log('File successfully deleted from database');
      console.log(`=== DELETE OPERATION SUCCESS ===`);
      
      toast.success('File deleted successfully');
      
      // Force immediate refresh
      setTimeout(() => {
        refetch();
      }, 100);
      
      return { success: true };
    } catch (error: any) {
      console.error('=== DELETE OPERATION FAILED ===', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      
      // Provide more specific error messages
      let errorMessage = 'Failed to delete file';
      if (error.message?.includes('JWT') || error.message?.includes('auth')) {
        errorMessage = 'Authentication expired. Please refresh and try again.';
      } else if (error.message?.includes('permission') || error.message?.includes('policy')) {
        errorMessage = 'You do not have permission to delete this file.';
      } else if (error.message?.includes('not found')) {
        errorMessage = 'File not found. It may have already been deleted.';
      }
      
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  }, [getBucketAndPath, refetch, ensureValidSession]);

  // Handle URL copying - FIXED: Updated text to just "URL copied"
  const handleCopyUrl = useCallback(async (signedUrl?: string, bucketName?: string, fileUrl?: string): Promise<FileOperation> => {
    try {
      await ensureValidSession();
      
      // If we already have a signed URL, use that
      if (signedUrl) {
        await navigator.clipboard.writeText(signedUrl);
        toast.success('URL copied');
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
      toast.success('URL copied');
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
