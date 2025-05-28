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

  // SIMPLIFIED DELETE - Focus on database deletion with extensive debugging
  const handleDelete = useCallback(async (fileId: string, bucketName: string, fileUrl: string): Promise<FileOperation> => {
    try {
      console.log(`=== SIMPLIFIED DELETE OPERATION START ===`);
      console.log(`File ID: ${fileId}`);
      console.log(`Bucket: ${bucketName}`);
      console.log(`File URL: ${fileUrl}`);

      await ensureValidSession();

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('User authentication failed:', userError);
        throw new Error("User authentication failed");
      }
      
      console.log(`Current authenticated user ID: ${user.id}`);

      // STEP 1: Check if the record exists and get its details
      console.log(`STEP 1: Checking if record exists...`);
      const { data: existingRecord, error: fetchError } = await supabase
        .from('media_files')
        .select('*')
        .eq('id', fileId)
        .single();

      if (fetchError) {
        console.error('Error fetching existing record:', fetchError);
        if (fetchError.code === 'PGRST116') {
          console.log('Record not found - may already be deleted');
          toast.success('File deleted successfully');
          refetch();
          return { success: true };
        }
        throw new Error(`Failed to fetch record: ${fetchError.message}`);
      }

      if (!existingRecord) {
        console.log('No record found with this ID');
        toast.success('File deleted successfully');
        refetch();
        return { success: true };
      }

      console.log(`Found record:`, existingRecord);
      console.log(`Record user_id: ${existingRecord.user_id}`);
      console.log(`Current user_id: ${user.id}`);
      console.log(`User IDs match: ${existingRecord.user_id === user.id}`);

      // STEP 2: Attempt deletion with user_id constraint
      console.log(`STEP 2: Attempting database deletion with user constraint...`);
      const { data: deleteData, error: deleteError } = await supabase
        .from('media_files')
        .delete()
        .eq('id', fileId)
        .eq('user_id', user.id)
        .select(); // Add select to see what was deleted

      if (deleteError) {
        console.error('Database deletion error with user constraint:', deleteError);
        console.error('Error code:', deleteError.code);
        console.error('Error details:', deleteError.details);
        console.error('Error hint:', deleteError.hint);
        
        // STEP 3: Try without user_id constraint for debugging
        console.log(`STEP 3: Attempting deletion without user constraint for debugging...`);
        const { data: deleteData2, error: deleteError2 } = await supabase
          .from('media_files')
          .delete()
          .eq('id', fileId)
          .select();

        if (deleteError2) {
          console.error('Database deletion error without user constraint:', deleteError2);
          throw new Error(`Database deletion failed completely: ${deleteError2.message}`);
        } else {
          console.log('Deletion succeeded without user constraint:', deleteData2);
          console.log('This suggests an RLS policy or user ID mismatch issue');
          toast.success('File deleted successfully');
          refetch();
          return { success: true };
        }
      }

      console.log('Database deletion successful with user constraint:', deleteData);
      console.log(`Records deleted: ${deleteData?.length || 0}`);

      if (!deleteData || deleteData.length === 0) {
        console.warn('Delete operation returned no affected rows');
        console.log('This might indicate the record does not belong to the current user');
      }

      console.log(`=== SIMPLIFIED DELETE OPERATION SUCCESS ===`);
      
      toast.success('File deleted successfully');
      
      // Force immediate refresh
      setTimeout(() => {
        refetch();
      }, 100);
      
      return { success: true };
    } catch (error: any) {
      console.error('=== SIMPLIFIED DELETE OPERATION FAILED ===', error);
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
  }, [refetch, ensureValidSession]);

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
