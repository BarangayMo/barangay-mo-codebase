import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export const BarangayLogoTab = ({ onLogoUpdate }: { onLogoUpdate?: () => void }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const [fetchingLogo, setFetchingLogo] = useState(true);

  // Fetch current logo from Barangays table
  useEffect(() => {
    const fetchBarangayLogo = async () => {
      if (!user?.barangay) return;
      
      try {
        setFetchingLogo(true);
        const { data, error } = await supabase
          .from('Barangays')
          .select('Logo')
          .eq('BARANGAY', user.barangay)
          .single();

        if (error) {
          console.error('Error fetching barangay logo:', error);
          return;
        }

        if (data?.Logo) {
          setLogoUrl(data.Logo);
        }
      } catch (error) {
        console.error('Error fetching barangay logo:', error);
      } finally {
        setFetchingLogo(false);
      }
    };

    fetchBarangayLogo();
  }, [user?.barangay]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.barangay) return;

    try {
      setIsLoading(true);

      // Use correct bucket name
      const bucket = 'barangay-logos'; // <-- change this if your bucket name is different
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.barangay.toLowerCase().replace(/\s+/g, '-')}-logo.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      // Update Barangays table with new logo URL
      const { error: updateError } = await supabase
        .from('Barangays')
        .update({ Logo: publicUrl })
        .eq('BARANGAY', user.barangay);

      if (updateError) throw updateError;

      setLogoUrl(publicUrl);
      onLogoUpdate?.(); // Refresh barangay data in parent component
      toast.success('Logo updated successfully');
    } catch (error) {
      console.error('Error updating logo:', error);
      toast.error('Failed to update logo');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || fetchingLogo) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  return (
    <div className="space-y-6 p-2 sm:p-4 max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-3 sm:p-4 border-b">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Barangay Logo</h3>
        </div>
        <div className="p-3 sm:p-4 space-y-4">
          <div className="flex flex-col items-center gap-4">
            {/* Logo Preview */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-red-200 relative">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt="Barangay Logo" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-red-50 flex items-center justify-center text-red-600 text-xs sm:text-sm">
                  No Logo
                </div>
              )}
            </div>

            {/* Upload Button */}
            <div className="flex flex-col items-center gap-2 w-full">
              <input
                type="file"
                id="logo-upload"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="logo-upload"
                className="cursor-pointer inline-flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 w-full max-w-xs"
              >
                Upload New Logo
              </label>
              <p className="text-xs sm:text-sm text-gray-500 text-center px-2">
                Recommended: Square image, at least 200x200 pixels
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
