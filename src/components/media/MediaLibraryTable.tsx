
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDistanceToNow } from "date-fns";
import { bytesToSize } from "@/lib/utils";
import { toast } from "sonner";

interface MediaFile {
  id: string;
  filename: string;
  alt_text?: string;
  uploaded_at: string;
  file_size: number;
  references?: number;
  file_url: string;
  content_type: string;
  bucket_name?: string;
  signedUrl?: string;
}

interface MediaLibraryFilters {
  user: string | null;
  category: string | null;
  startDate: Date | null;
  endDate: Date | null;
}

interface MediaLibraryTableProps {
  filters?: MediaLibraryFilters;
  searchQuery?: string;
}

export function MediaLibraryTable({ 
  filters = { user: null, category: null, startDate: null, endDate: null }, 
  searchQuery = "" 
}: MediaLibraryTableProps) {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [availableBuckets, setAvailableBuckets] = useState<any[]>([]);

  // Helper function to determine bucket name and file path from file_url
  const getBucketAndPath = (fileUrl: string) => {
    console.log("Processing file URL:", fileUrl);
    
    // Check if fileUrl contains user ID format (which indicates full path with bucket)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\//i;
    
    // If the path starts with a UUID, it's likely the format "userId/filename.ext"
    if (uuidRegex.test(fileUrl)) {
      console.log(`UUID detected in path, using default bucket for: ${fileUrl}`);
      // In this case, there's no explicit bucket in the path
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
      if (availableBuckets.length > 0 && availableBuckets.some(b => b.name === possibleBucket)) {
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

  // Fetch all available storage buckets
  useEffect(() => {
    const fetchBuckets = async () => {
      try {
        console.log("Fetching storage buckets...");
        const { data: buckets, error } = await supabase.storage.listBuckets();
        if (error) {
          console.error("Error fetching buckets:", error);
          toast.error("Failed to fetch storage buckets");
          return;
        }
        
        if (buckets && buckets.length > 0) {
          console.log("Available buckets:", buckets);
          setAvailableBuckets(buckets);
        } else {
          console.warn("No storage buckets found!");
        }
      } catch (error) {
        console.error("Exception fetching buckets:", error);
        toast.error("Failed to fetch storage buckets");
      }
    };
    
    fetchBuckets();
  }, []);

  const { data: files, isLoading, isError, error } = useQuery({
    queryKey: ['media-files', filters, searchQuery, availableBuckets.length],
    queryFn: async () => {
      console.log("Fetching media files with filters:", filters);
      console.log("Search query:", searchQuery);
      console.log("Available buckets count:", availableBuckets.length);
      
      try {
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

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching media files:", error);
          throw error;
        }

        console.log("Media files fetched:", data?.length || 0);
        
        // Process files to add signed URLs
        if (data && data.length > 0) {
          const processedFiles = [];

          for (const file of data) {
            try {
              console.log("Processing file:", file.filename);
              
              // Determine bucket name and file path
              const { bucketName, filePath } = getBucketAndPath(file.file_url);
              console.log(`Using bucket: ${bucketName}, path: ${filePath}`);
              
              // Try to get a signed URL with 7-day expiration for the file
              const { data: signedUrlData, error: signedUrlError } = await supabase.storage
                .from(bucketName)
                .createSignedUrl(filePath, 604800); // 604800 seconds = 7 days

              if (signedUrlError) {
                console.error(`Error creating signed URL for ${file.filename}:`, signedUrlError);
                processedFiles.push({
                  ...file,
                  signedUrl: null,
                  bucket_name: bucketName
                });
                continue;
              }

              console.log(`Got signed URL for ${file.filename}: ${signedUrlData?.signedUrl ? 'success' : 'failed'}`);
              
              processedFiles.push({
                ...file,
                signedUrl: signedUrlData?.signedUrl || null,
                bucket_name: bucketName
              });
            } catch (error) {
              console.error(`Error processing file ${file.filename}:`, error);
              // Still add the file even if we couldn't get a signed URL
              processedFiles.push({
                ...file,
                bucket_name: "user_uploads" // Default fallback
              });
            }
          }
          
          return processedFiles as MediaFile[];
        }
        
        return (data || []) as MediaFile[];
      } catch (error) {
        console.error("Error in queryFn:", error);
        throw error;
      }
    },
    enabled: true // Run query regardless of buckets available to diagnose issues
  });

  useEffect(() => {
    // Log when files update
    console.log("Files data updated:", files?.length || 0);
  }, [files]);

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const toggleAllFiles = () => {
    if (files) {
      setSelectedFiles(
        selectedFiles.length === files.length 
          ? [] 
          : files.map(file => file.id)
      );
    }
  };

  if (isError) {
    console.error("Query error:", error);
    return <div className="p-8 text-center border rounded-lg bg-red-50 text-red-700">
      <p className="font-medium">Error loading media</p>
      <p className="text-sm mt-1">Please check the console for details.</p>
    </div>;
  }

  if (isLoading) return <div className="flex items-center justify-center h-64">
    <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  </div>;

  if (!files || files.length === 0) return <div className="text-center py-16 border rounded-lg bg-gray-50">
    <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gray-100">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-gray-400"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>
    </div>
    <h3 className="mt-4 text-lg font-medium text-gray-900">No media found</h3>
    <p className="mt-1 text-sm text-gray-500">Upload some files or adjust your filters to see media here.</p>
  </div>;

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox 
                checked={files && files.length > 0 && selectedFiles.length === files.length}
                onCheckedChange={toggleAllFiles}
              />
            </TableHead>
            <TableHead>File name</TableHead>
            <TableHead>Alt text</TableHead>
            <TableHead>Date added</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>References</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.id}>
              <TableCell>
                <Checkbox 
                  checked={selectedFiles.includes(file.id)}
                  onCheckedChange={() => toggleFileSelection(file.id)}
                />
              </TableCell>
              <TableCell className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                  <img 
                    src={file.signedUrl || ''} 
                    alt={file.alt_text || file.filename}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      console.error('Image load error:', file.signedUrl);
                      e.currentTarget.style.display = 'none';
                      const icon = document.createElement('div');
                      icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="w-6 h-6 text-gray-400"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>';
                      e.currentTarget.parentElement?.appendChild(icon);
                    }}
                  />
                </div>
                <div>
                  <p className="font-medium">{file.filename}</p>
                  <p className="text-sm text-gray-500">{file.filename.split('.').pop()?.toUpperCase()}</p>
                </div>
              </TableCell>
              <TableCell>{file.alt_text || '—'}</TableCell>
              <TableCell>{formatDistanceToNow(new Date(file.uploaded_at), { addSuffix: true })}</TableCell>
              <TableCell>{bytesToSize(file.file_size)}</TableCell>
              <TableCell>{file.references || '—'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
