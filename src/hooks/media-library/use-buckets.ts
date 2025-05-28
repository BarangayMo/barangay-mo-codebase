
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
        toast.error(`Failed to fetch storage buckets: ${error.message}`);
        return [];
      }
      
      if (buckets && buckets.length > 0) {
        console.log(`Successfully found ${buckets.length} storage buckets:`, buckets.map(b => `${b.name} (${b.public ? 'public' : 'private'})`).join(', '));
        setBuckets(buckets);
        return buckets;
      } else {
        console.warn("No storage buckets found in the project");
        toast.warning("No storage buckets found. Storage buckets may need to be configured.");
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
