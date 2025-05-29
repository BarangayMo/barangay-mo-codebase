
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/enhanced-sonner";

export function useFileOperations(refetch: () => void) {
  // Helper function to determine bucket name and file path from file_url
  const getBucketAndPath = (fileUrl: string) => {
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
      const knownBuckets = ["user_uploads", "profile_images"]; // Add any other known buckets
      if (knownBuckets.includes(possibleBucket)) {
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
  };

  const handleDownload = async (bucketName: string, fileUrl: string, fileName: string, signedUrl?: string) => {
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
        return;
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
    } catch (error) {
      toast.error('Failed to download file');
      console.error('Download error:', error);
    }
  };

  const handleDelete = async (fileId: string, bucketName: string, fileUrl: string) => {
    try {
      // Extract the file path
      const { filePath } = getBucketAndPath(fileUrl);

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);

      if (storageError) {
        console.warn(`Storage remove error (continuing anyway): ${storageError.message}`);
      }

      // Delete from metadata table
      const { error: databaseError } = await supabase
        .from('media_files')
        .delete()
        .eq('id', fileId);

      if (databaseError) throw databaseError;

      toast.success('File deleted successfully');
      refetch(); // Always refetch after delete
      return true;
    } catch (error: any) {
      toast.error('Failed to delete file: ' + error.message || 'Unknown error');
      console.error('Delete error:', error);
      return false;
    }
  };

  const handleCopyUrl = async (signedUrl?: string, bucketName?: string, fileUrl?: string) => {
    try {
      // If we already have a signed URL, use that
      if (signedUrl) {
        await navigator.clipboard.writeText(signedUrl);
        toast.success('URL copied to clipboard');
        return;
      }
      
      // Otherwise generate one
      if (!bucketName || !fileUrl) {
        toast.error('Missing file information');
        return;
      }
      
      // Extract the file path
      const { filePath } = getBucketAndPath(fileUrl);

      // Generate a signed URL with 7-day expiration for sharing
      const { data, error } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(filePath, 604800); // 604800 seconds = 7 days
      
      if (error) throw error;
      
      await navigator.clipboard.writeText(data.signedUrl);
      toast.success('URL copied to clipboard');
    } catch (error) {
      toast.error('Failed to generate URL');
      console.error('URL generation error:', error);
    }
  };

  const handleUpdateFile = async (fileId: string, updates: { filename?: string; alt_text?: string }) => {
    try {
      const { error } = await supabase
        .from('media_files')
        .update(updates)
        .eq('id', fileId);

      if (error) throw error;

      toast.success('File updated successfully');
      refetch(); // Refresh the media list
      return true;
    } catch (error) {
      console.error('Error updating file:', error);
      toast.error('Failed to update file');
      return false;
    }
  };

  return {
    getBucketAndPath,
    handleDownload,
    handleDelete,
    handleCopyUrl,
    handleUpdateFile
  };
}
