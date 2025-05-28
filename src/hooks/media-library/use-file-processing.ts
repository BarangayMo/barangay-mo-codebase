
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Custom hook for file processing operations in the media library - Database Only Version
 * @returns Basic file processing utility functions
 */
export function useFileProcessing() {
  
  // Helper function to determine bucket name and file path from file_url
  const getBucketAndPath = useCallback((fileUrl: string) => {
    console.log(`Determining bucket and path for: ${fileUrl}`);
    
    // Check if fileUrl contains bucket/path format
    if (fileUrl.includes("/")) {
      const parts = fileUrl.split("/");
      const bucketName = parts[0];
      const filePath = fileUrl.substring(fileUrl.indexOf("/") + 1);
      
      console.log(`Extracted bucket: ${bucketName}, path: ${filePath}`);
      return { bucketName, filePath };
    }
    
    // Default fallback
    console.log(`Using default bucket for: ${fileUrl}`);
    return { 
      bucketName: "user_uploads",
      filePath: fileUrl
    };
  }, []);

  // Function to get signed URL for a file
  const getSignedUrl = useCallback(async (fileUrl: string, expiresIn: number = 604800) => {
    try {
      const { bucketName, filePath } = getBucketAndPath(fileUrl);
      
      console.log(`Getting signed URL for ${filePath} in bucket ${bucketName}`);
      
      const { data, error } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(filePath, expiresIn);
      
      if (error) {
        console.error(`Error creating signed URL for ${filePath}:`, error);
        return null;
      }
      
      console.log(`Successfully created signed URL for ${filePath}`);
      return data.signedUrl;
    } catch (err) {
      console.error(`Exception getting signed URL for ${fileUrl}:`, err);
      return null;
    }
  }, [getBucketAndPath]);

  return {
    getBucketAndPath,
    getSignedUrl
  };
}
