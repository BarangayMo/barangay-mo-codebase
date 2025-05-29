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

  // FIXED DELETE - Verify database deletion before UI update
  const handleDelete = useCallback(async (fileId: string, bucketName: string, fileUrl: string): Promise<FileOperation> => {
    try {
      console.log(`=== VERIFIED DELETE OPERATION START ===`);
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

      // STEP 1: Verify record exists and get user_id
      console.log(`STEP 1: Checking if record exists and verifying ownership...`);
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
          refetch(); // Safe to refetch since record doesn't exist
          return { success: true };
        }
        throw new Error(`Failed to fetch record: ${fetchError.message}`);
      }

      if (!existingRecord) {
        console.log('No record found with this ID');
        toast.success('File deleted successfully');
        refetch(); // Safe to refetch since record doesn't exist
        return { success: true };
      }

      console.log(`Found record:`, existingRecord);
      console.log(`Record user_id: ${existingRecord.user_id}`);
      console.log(`Current user_id: ${user.id}`);
      console.log(`User IDs match: ${existingRecord.user_id === user.id}`);

      // Check ownership
      if (existingRecord.user_id !== user.id) {
        console.error('User does not own this record');
        throw new Error("You do not have permission to delete this file");
      }

      // STEP 2: Attempt deletion with user_id constraint
      console.log(`STEP 2: Attempting database deletion with user constraint...`);
      const { data: deleteData, error: deleteError } = await supabase
        .from('media_files')
        .delete()
        .eq('id', fileId)
        .eq('user_id', user.id)
        .select(); // Add select to see what was deleted

      if (deleteError) {
        console.error('Database deletion error:', deleteError);
        throw new Error(`Database deletion failed: ${deleteError.message}`);
      }

      console.log('Database deletion result:', deleteData);
      console.log(`Records deleted: ${deleteData?.length || 0}`);

      if (!deleteData || deleteData.length === 0) {
        console.error('Delete operation returned no affected rows');
        throw new Error('Delete operation failed - no records were affected');
      }

      // STEP 3: VERIFY the record is actually gone from database
      console.log(`STEP 3: Verifying record was actually deleted...`);
      const { data: verifyRecord, error: verifyError } = await supabase
        .from('media_files')
        .select('id')
        .eq('id', fileId)
        .single();

      if (verifyError && verifyError.code === 'PGRST116') {
        // Record not found - this is what we want!
        console.log('✅ VERIFICATION SUCCESS: Record confirmed deleted from database');
      } else if (verifyRecord) {
        // Record still exists - deletion failed!
        console.error('❌ VERIFICATION FAILED: Record still exists in database:', verifyRecord);
        throw new Error('Database deletion verification failed - record still exists');
      } else {
        console.error('Unexpected error during verification:', verifyError);
        throw new Error(`Verification error: ${verifyError?.message}`);
      }

      console.log(`=== VERIFIED DELETE OPERATION SUCCESS ===`);
      
      toast.success('File deleted successfully');
      
      // Only refresh UI after confirming database deletion
      setTimeout(() => {
        refetch();
      }, 100);
      
      return { success: true };
    } catch (error: any) {
      console.error('=== VERIFIED DELETE OPERATION FAILED ===', error);
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
      } else if (error.message?.includes('permission')) {
        errorMessage = 'You do not have permission to delete this file.';
      } else if (error.message?.includes('not found')) {
        errorMessage = 'File not found. It may have already been deleted.';
      } else if (error.message?.includes('verification failed')) {
        errorMessage = 'Delete failed - file still exists in database.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      
      // DO NOT call refetch() on error - keep UI showing the file since deletion failed
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
