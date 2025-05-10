
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Download, Trash2, Copy, X } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { bytesToSize } from "@/lib/utils";

// Define types for our media files and profiles
interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
}

interface MediaFile {
  id: string;
  user_id: string;
  file_url: string;
  filename: string;
  category: string;
  uploaded_at: string;
  file_size: number;
  content_type: string;
}

interface MediaFileWithProfile extends MediaFile {
  profile: Profile | null;
}

interface MediaLibraryFilters {
  user: string | null;
  category: string | null;
  startDate: Date | null;
  endDate: Date | null;
}

interface MediaLibraryGridProps {
  filters: MediaLibraryFilters;
  searchQuery?: string;
}

export function MediaLibraryGrid({ filters, searchQuery = "" }: MediaLibraryGridProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaFileWithProfile | null>(null);

  const { data: mediaFiles, isLoading, refetch } = useQuery({
    queryKey: ['admin-media-files', filters, searchQuery],
    queryFn: async () => {
      let query = supabase.from('media_files').select(`
        id, 
        user_id, 
        file_url, 
        filename, 
        category, 
        uploaded_at, 
        file_size, 
        content_type
      `);

      if (filters.user) query = query.eq('user_id', filters.user);
      if (filters.category) query = query.eq('category', filters.category);
      if (filters.startDate) query = query.gte('uploaded_at', filters.startDate);
      if (filters.endDate) query = query.lte('uploaded_at', filters.endDate);
      
      if (searchQuery) {
        query = query.ilike('filename', `%${searchQuery}%`);
      }

      const { data: mediaData, error } = await query.order('uploaded_at', { ascending: false });
      
      if (error) throw error;
      
      // Fetch user profile information separately
      if (mediaData && mediaData.length > 0) {
        const userIds = [...new Set(mediaData.map(file => file.user_id))];
        
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .in('id', userIds);
          
        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
          return mediaData as MediaFile[]; // Return media data even if profiles fetch fails
        }
        
        // Create a lookup map for profiles
        const profileMap: Record<string, Profile> = {};
        profilesData?.forEach(profile => {
          profileMap[profile.id] = profile;
        });
        
        // Attach profile data to media files
        return mediaData.map(file => ({
          ...file,
          profile: profileMap[file.user_id] || null
        })) as MediaFileWithProfile[];
      }
      
      return (mediaData || []) as MediaFile[];
    }
  });

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('user_uploads')
        .download(fileUrl);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('File downloaded successfully');
    } catch (error) {
      toast.error('Failed to download file');
      console.error('Download error:', error);
    }
  };

  const handleDelete = async (fileId: string, fileUrl: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('user_uploads')
        .remove([fileUrl]);

      if (storageError) throw storageError;

      // Delete from metadata table
      const { error: databaseError } = await supabase
        .from('media_files')
        .delete()
        .eq('id', fileId);

      if (databaseError) throw databaseError;

      toast.success('File deleted successfully');
      setSelectedMedia(null);
      refetch(); // Refresh the media list
    } catch (error) {
      toast.error('Failed to delete file');
      console.error('Delete error:', error);
    }
  };

  const handleCopyUrl = (fileUrl: string) => {
    const url = supabase.storage.from('user_uploads').getPublicUrl(fileUrl).data.publicUrl;
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith('image/')) {
      return null; // Will render the actual image
    } else if (contentType.startsWith('video/')) {
      return <div className="flex items-center justify-center h-16 w-16">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-blue-500"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
      </div>;
    } else if (contentType.startsWith('audio/')) {
      return <div className="flex items-center justify-center h-16 w-16">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-green-500"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
      </div>;
    } else {
      return <div className="flex items-center justify-center h-16 w-16">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-gray-500"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
      </div>;
    }
  };

  if (isLoading) return <div className="flex items-center justify-center h-64">
    <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  </div>;

  if (!mediaFiles?.length) return <div className="text-center py-16 border rounded-lg bg-gray-50">
    <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gray-100">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-gray-400"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>
    </div>
    <h3 className="mt-4 text-lg font-medium text-gray-900">No media found</h3>
    <p className="mt-1 text-sm text-gray-500">Upload some files or adjust your filters to see media here.</p>
  </div>;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {mediaFiles.map((file) => {
          const fileUrl = supabase.storage.from('user_uploads').getPublicUrl(file.file_url).data.publicUrl;
          const fileIcon = getFileIcon(file.content_type);
          
          return (
            <div 
              key={file.id} 
              className="group relative border rounded-md overflow-hidden bg-white hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedMedia(file as MediaFileWithProfile)}
            >
              <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                {file.content_type.startsWith('image/') ? (
                  <img 
                    src={fileUrl}
                    alt={file.filename} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : fileIcon}
              </div>
              
              <div className="p-2">
                <p className="text-xs font-medium truncate">{file.filename}</p>
                <p className="text-xs text-gray-500 truncate">
                  {formatDistanceToNow(new Date(file.uploaded_at), { addSuffix: true })}
                </p>
              </div>
              
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMedia(file as MediaFileWithProfile);
                  }}
                >
                  View Details
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Media details dialog */}
      {selectedMedia && (
        <Dialog open={!!selectedMedia} onOpenChange={(open) => !open && setSelectedMedia(null)}>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold truncate">{selectedMedia.filename}</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="bg-gray-50 rounded-md flex items-center justify-center p-2 overflow-hidden">
                {selectedMedia.content_type.startsWith('image/') ? (
                  <img 
                    src={supabase.storage.from('user_uploads').getPublicUrl(selectedMedia.file_url).data.publicUrl} 
                    alt={selectedMedia.filename}
                    className="max-w-full max-h-[300px] object-contain rounded"
                  />
                ) : (
                  <div className="h-40 w-40 flex items-center justify-center">
                    {getFileIcon(selectedMedia.content_type)}
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">File details</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Uploaded</span>
                      <span className="text-sm font-medium">
                        {formatDistanceToNow(new Date(selectedMedia.uploaded_at), { addSuffix: true })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">File size</span>
                      <span className="text-sm font-medium">
                        {bytesToSize(selectedMedia.file_size)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Type</span>
                      <span className="text-sm font-medium">
                        {selectedMedia.content_type}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Category</span>
                      <span className="text-sm font-medium">
                        {selectedMedia.category || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Uploaded by</span>
                      <span className="text-sm font-medium">
                        {selectedMedia.profile ? 
                          `${selectedMedia.profile.first_name || ''} ${selectedMedia.profile.last_name || ''}`.trim() || 'Unknown User' 
                          : 'Unknown User'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleCopyUrl(selectedMedia.file_url)}
                  >
                    <Copy className="mr-2 h-4 w-4" /> Copy URL
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleDownload(selectedMedia.file_url, selectedMedia.filename)}
                  >
                    <Download className="mr-2 h-4 w-4" /> Download
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(selectedMedia.id, selectedMedia.file_url)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
