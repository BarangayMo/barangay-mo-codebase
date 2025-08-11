import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useSavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  const fetchSavedJobs = async () => {
    if (!isAuthenticated || !user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('saved_jobs')
        .select(`
          id,
          job_id,
          jobs (
            id,
            title,
            company,
            location,
            salary,
            category,
            work_approach,
            logo_url,
            availability
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedJobs(data || []);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch saved jobs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const removeSavedJob = async (jobId: string) => {
    if (!isAuthenticated || !user) return;

    try {
      const { error } = await supabase
        .from('saved_jobs')
        .delete()
        .eq('user_id', user.id)
        .eq('job_id', jobId);

      if (error) throw error;

      setSavedJobs(prev => prev.filter(item => item.job_id !== jobId));
      toast({
        title: "Job removed",
        description: "Job has been removed from your saved list"
      });
    } catch (error) {
      console.error('Error removing saved job:', error);
      toast({
        title: "Error",
        description: "Failed to remove job",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, [isAuthenticated, user]);

  return {
    savedJobs,
    loading,
    refreshSavedJobs: fetchSavedJobs,
    removeSavedJob
  };
};