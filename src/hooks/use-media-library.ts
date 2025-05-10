
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface MediaBucket {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  public: boolean;
}

export interface MediaFile {
  id: string;
  user_id?: string;
  filename: string;
  alt_text?: string;
  uploaded_at: string;
  file_size: number;
  content_type: string;
  bucket_name: string;
  file_url: string;
  references?: number;
  signedUrl?: string;
  category?: string; // Make category optional since it might not be present in all media files
}

interface MediaLibraryFilters {
  user: string | null;
  category: string | null;
  startDate: Date | null;
  endDate: Date | null;
}

/**
 * Custom hook to manage media library functionality
 * @param filters Optional filters to apply to the media query
 * @param searchQuery Optional search query to filter media by filename
 * @returns Media library state and functions
 */
export function useMediaLibrary(
  filters: MediaLibraryFilters = { 
    user: null, 
    category: null, 
    startDate: null, 
    endDate: null 
  },
  searchQuery: string = ""
) {
  const { userRole } = useAuth();
  const [buckets, setBuckets] = useState<MediaBucket[]>([]);
  const [loadingBuckets, setLoadingBuckets] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const isAdmin = userRole === 'superadmin';

  // 1. Fetch all available storage buckets
  useEffect(() => {
    const fetchBuckets = async () => {
      try {
        console.log("Fetching storage buckets...");
        setLoadingBuckets(true);
        
        const { data: buckets, error } = await supabase.storage.listBuckets();
        
        if (error) {
          console.error("Error fetching storage buckets:", error);
          toast.error("Failed to fetch storage buckets");
          return;
        }
        
        if (buckets && buckets.length > 0) {
          console.log(`Found ${buckets.length} storage buckets:`, buckets.map(b => b.name).join(', '));
          setBuckets(buckets);
        } else {
          console.warn("No storage buckets found!");
          toast.warning("No storage buckets found. Please create at least one bucket.");
        }
      } catch (error) {
        console.error("Exception fetching buckets:", error);
        toast.error("Failed to fetch storage buckets");
      } finally {
        setLoadingBuckets(false);
      }
    };
    
    if (isAdmin) {
      fetchBuckets();
    }
  }, [isAdmin]);

  // 2. Helper function to determine bucket name and file path from file_url
  const getBucketAndPath = (fileUrl: string) => {
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
      if (buckets.length > 0 && buckets.some(b => b.name === possibleBucket)) {
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
  };

  // 3. Query to fetch media files from database and storage
  const { 
    data: mediaFiles, 
    isLoading: loadingFiles, 
    isError, 
    error,
    refetch
  } = useQuery({
    queryKey: ['media-files', filters, searchQuery, buckets.length],
    queryFn: async () => {
      console.log("Fetching media files with filters:", filters);
      console.log("Search query:", searchQuery);
      console.log("Available buckets count:", buckets.length);
      
      try {
        // First fetch media file records from the database
        let query = supabase
          .from('media_files')
          .select('*')
          .order('uploaded_at', { ascending: false });

        if (filters.user) query = query.eq('user_id', filters.user);
        if (filters.category) query = query.eq('category', filters.category);
        if (filters.startDate) query = query.gte('uploaded_at', filters.startDate);
        if (filters.endDate) query = query.lte('uploaded_at', filters.endDate);
        
        if (searchQuery) {
          query = query.ilike('filename', `%${searchQuery}%`);
        }

        const { data: dbFiles, error: dbError } = await query;

        if (dbError) {
          console.error("Error fetching media files from database:", dbError);
          throw dbError;
        }

        console.log(`Found ${dbFiles?.length || 0} media files in database`);
        
        // Then process the files to get signed URLs from storage
        if (dbFiles && dbFiles.length > 0) {
          const processedFiles: MediaFile[] = [];

          for (const file of dbFiles) {
            try {
              // Determine bucket name and file path
              const { bucketName, filePath } = getBucketAndPath(file.file_url);
              console.log(`Processing file ${file.filename} with bucket: ${bucketName}, path: ${filePath}`);
              
              // Try to get a signed URL with 7-day expiration for the file
              const { data: signedUrlData, error: signedUrlError } = await supabase.storage
                .from(bucketName)
                .createSignedUrl(filePath, 604800); // 604800 seconds = 7 days

              if (signedUrlError) {
                console.error(`Error creating signed URL for ${file.filename}:`, signedUrlError);
                
                // Check if file exists in the bucket
                const { data: fileExists, error: fileCheckError } = await supabase.storage
                  .from(bucketName)
                  .list(filePath.split('/').slice(0, -1).join('/'), {
                    limit: 100,
                  });

                if (fileCheckError) {
                  console.error(`Error checking if file exists: ${file.filename}`, fileCheckError);
                } else {
                  const fileName = filePath.split('/').pop() || '';
                  const fileInStorage = fileExists?.find(f => f.name === fileName);
                  console.log(`File ${fileName} exists in storage: ${!!fileInStorage}`);
                }
                
                // Add the file anyway with a null signed URL
                processedFiles.push({
                  ...file,
                  signedUrl: null,
                  bucket_name: bucketName
                } as MediaFile); // Cast to MediaFile to ensure type compliance
                continue;
              }

              console.log(`Got signed URL for ${file.filename}: ${signedUrlData?.signedUrl ? 'success' : 'failed'}`);
              
              // Make sure all required properties exist
              processedFiles.push({
                ...file,
                signedUrl: signedUrlData?.signedUrl || null,
                bucket_name: bucketName
              } as MediaFile); // Cast to MediaFile to ensure type compliance
            } catch (error) {
              console.error(`Error processing file ${file.filename}:`, error);
              // Still add the file even if we couldn't get a signed URL
              processedFiles.push({
                ...file,
                bucket_name: "user_uploads" // Default fallback
              } as MediaFile); // Cast to MediaFile to ensure type compliance
            }
          }
          
          return processedFiles;
        }
        
        return (dbFiles || []) as MediaFile[]; // Cast to MediaFile[] to ensure type compliance
      } catch (error) {
        console.error("Error in queryFn:", error);
        throw error;
      }
    },
    // Run query regardless of buckets available to show data even if bucket detection fails
    enabled: isAdmin
  });

  // 4. Handle file selection
  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const toggleAllFiles = () => {
    if (mediaFiles) {
      setSelectedFiles(
        selectedFiles.length === mediaFiles.length 
          ? [] 
          : mediaFiles.map(file => file.id)
      );
    }
  };

  // 5. File operations: download, delete, get URL
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

      if (storageError) throw storageError;

      // Delete from metadata table
      const { error: databaseError } = await supabase
        .from('media_files')
        .delete()
        .eq('id', fileId);

      if (databaseError) throw databaseError;

      toast.success('File deleted successfully');
      refetch(); // Refresh the media list
    } catch (error) {
      toast.error('Failed to delete file');
      console.error('Delete error:', error);
    }
  };

  const handleCopyUrl = async (signedUrl?: string, bucketName?: string, fileUrl?: string) => {
    try {
      // If we already have a signed URL, use that
      if (signedUrl) {
        await navigator.clipboard.writeText(signedUrl);
        toast.success('URL copied to clipboard (expires in 7 days)');
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
      toast.success('URL copied to clipboard (expires in 7 days)');
    } catch (error) {
      toast.error('Failed to generate URL');
      console.error('URL generation error:', error);
    }
  };

  return {
    // State
    mediaFiles,
    buckets,
    selectedFiles,
    
    // Loading/error states
    loadingBuckets,
    loadingFiles,
    isError,
    error,
    
    // File selection
    toggleFileSelection,
    toggleAllFiles,
    
    // File operations
    handleDownload,
    handleDelete,
    handleCopyUrl,
    getBucketAndPath,
    
    // Refresh
    refetch
  };
}
