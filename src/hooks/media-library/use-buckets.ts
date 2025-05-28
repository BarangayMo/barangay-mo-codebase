
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
      
      // Check if session is valid, refresh if needed
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        // Try to refresh the session
        const { error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          console.error("Failed to refresh session:", refreshError);
          toast.error("Authentication expired. Please log in again.");
          return [];
        }
      }
      
      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.error("Error fetching storage buckets:", error);
        
        // If JWT expired, try to refresh session and retry
        if (error.message?.includes('jwt') || error.message?.includes('expired')) {
          console.log("JWT expired, attempting to refresh session...");
          const { error: refreshError } = await supabase.auth.refreshSession();
          
          if (!refreshError) {
            // Retry the bucket fetch after refresh
            const { data: retryBuckets, error: retryError } = await supabase.storage.listBuckets();
            if (!retryError && retryBuckets) {
              console.log(`Successfully found ${retryBuckets.length} storage buckets after refresh:`, retryBuckets.map(b => `${b.name} (${b.public ? 'public' : 'private'})`).join(', '));
              setBuckets(retryBuckets);
              return retryBuckets;
            }
          }
          
          toast.error("Session expired. Please refresh the page and log in again.");
          return [];
        }
        
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
