
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Trash2, EyeOff, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

export function MediaLibraryGrid({ filters }: { filters: MediaLibraryFilters }) {
  const [selectedImage, setSelectedImage] = useState<MediaFileWithProfile | null>(null);

  const { data: mediaFiles, isLoading } = useQuery({
    queryKey: ['admin-media-files', filters],
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
    } catch (error) {
      toast.error('Failed to download file');
    }
  };

  const handleDelete = async (fileId: string, fileUrl: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('user_uploads')
        .remove([fileUrl]);

      // Delete from metadata table
      const { error: databaseError } = await supabase
        .from('media_files')
        .delete()
        .eq('id', fileId);

      if (storageError || databaseError) throw storageError || databaseError;

      toast.success('File deleted successfully');
    } catch (error) {
      toast.error('Failed to delete file');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {mediaFiles?.map((file) => (
        <Card key={file.id} className="hover:border-primary transition-all">
          <CardContent className="p-4 relative">
            <div 
              className="aspect-square bg-gray-100 flex items-center justify-center cursor-pointer"
              onClick={() => setSelectedImage(file as MediaFileWithProfile)}
            >
              {file.content_type.startsWith('image/') ? (
                <img 
                  src={supabase.storage.from('user_uploads').getPublicUrl(file.file_url).data.publicUrl} 
                  alt={file.filename} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="h-12 w-12 text-gray-400" />
              )}
            </div>
            <div className="mt-2">
              <p className="text-sm font-medium truncate">{file.filename}</p>
              <p className="text-xs text-gray-500">{file.category}</p>
              <p className="text-xs text-gray-500">
                {(file as MediaFileWithProfile).profile?.first_name || 'Unknown'} {(file as MediaFileWithProfile).profile?.last_name || 'User'}
              </p>
            </div>
            <div className="absolute top-2 right-2 flex gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleDownload(file.file_url, file.filename)}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleDelete(file.id, file.file_url)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedImage.filename}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-4">
              <img 
                src={supabase.storage.from('user_uploads').getPublicUrl(selectedImage.file_url).data.publicUrl}
                alt={selectedImage.filename} 
                className="max-h-[500px] object-contain"
              />
              <div className="grid grid-cols-2 w-full gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => handleDownload(selectedImage.file_url, selectedImage.filename)}
                >
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => handleDelete(selectedImage.id, selectedImage.file_url)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
