
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function useProfileImage() {
  const [uploading, setUploading] = useState(false);
  const { user, session } = useAuth();
  
  const uploadProfileImage = async (file: File): Promise<string | null> => {
    if (!session?.user) {
      toast.error("You must be logged in to upload an image");
      return null;
    }

    try {
      setUploading(true);
      
      // Create a unique file path including the user ID to enforce ownership
      const userId = session.user.id;
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('profile_images')
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type
        });
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL of the uploaded file
      const { data } = supabase.storage
        .from('profile_images')
        .getPublicUrl(filePath);
        
      // Update the user's avatar URL in the settings table
      if (data?.publicUrl) {
        const { error: updateError } = await supabase
          .from('user_settings')
          .upsert({
            user_id: userId,
            avatar_url: data.publicUrl
          });
          
        if (updateError) {
          console.error('Error updating avatar URL:', updateError);
          toast.error("Failed to update profile");
        } else {
          toast.success("Profile image updated successfully");
        }
        
        return data.publicUrl;
      }
      
      return null;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Failed to upload image");
      return null;
    } finally {
      setUploading(false);
    }
  };
  
  return {
    uploadProfileImage,
    uploading
  };
}
