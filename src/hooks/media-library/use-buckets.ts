
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MediaBucket } from "./types";
import { toast } from "sonner";

export function useBuckets() {
  const [buckets, setBuckets] = useState<MediaBucket[]>([]);
  const [loadingBuckets, setLoadingBuckets] = useState(true);

  // Fetch all available storage buckets
  const fetchBuckets = useCallback(async () => {
    try {
      console.log("Fetching storage buckets...");
      setLoadingBuckets(true);
      
      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.error("Error fetching storage buckets:", error);
        toast.error("Failed to fetch storage buckets");
        return [];
      }
      
      if (buckets && buckets.length > 0) {
        console.log(`Found ${buckets.length} storage buckets:`, buckets.map(b => b.name).join(', '));
        setBuckets(buckets);
        return buckets;
      } else {
        console.warn("No storage buckets found!");
        // Create a default bucket if none exist
        try {
          console.log("Attempting to create default user_uploads bucket...");
          const { error: createError } = await supabase.storage.createBucket('user_uploads', { public: true });
          
          if (createError) {
            console.error("Error creating default bucket:", createError);
            toast.warning("No storage buckets found. Please create at least one bucket in the Supabase dashboard.");
          } else {
            console.log("Created default user_uploads bucket");
            // Retry fetching buckets
            const { data: refreshedBuckets } = await supabase.storage.listBuckets();
            if (refreshedBuckets && refreshedBuckets.length > 0) {
              console.log("Successfully created and retrieved buckets");
              setBuckets(refreshedBuckets);
              return refreshedBuckets;
            }
          }
        } catch (createErr) {
          console.error("Exception creating bucket:", createErr);
          toast.warning("No storage buckets found. Please create at least one bucket in the Supabase dashboard.");
        }
        
        return [];
      }
    } catch (error) {
      console.error("Exception fetching buckets:", error);
      toast.error("Failed to fetch storage buckets");
      return [];
    } finally {
      setLoadingBuckets(false);
    }
  }, []);
  
  // Initial load
  useEffect(() => {
    fetchBuckets();
  }, [fetchBuckets]);

  return {
    buckets,
    loadingBuckets,
    fetchBuckets,
  };
}
