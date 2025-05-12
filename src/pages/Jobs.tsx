
import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Briefcase, Search, Filter, MapPin, Building, Clock, Banknote, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [savedJobs, setSavedJobs] = useState({});
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setJobs(data || []);
        
        // If authenticated, fetch saved jobs
        if (isAuthenticated && user) {
          const { data: savedJobsData, error: savedJobsError } = await supabase
            .from('saved_jobs')
            .select('job_id')
            .eq('user_id', user.id);
            
          if (!savedJobsError && savedJobsData) {
            const savedJobsMap = {};
            savedJobsData.forEach(item => {
              savedJobsMap[item.job_id] = true;
            });
            setSavedJobs(savedJobsMap);
          }
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        toast({
          title: "Failed to fetch jobs",
          description: "Please try refreshing the page",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, [isAuthenticated, user, toast]);

  // Filter jobs by search query
  const filteredJobs = jobs.filter(job => {
    const query = searchQuery.toLowerCase();
    return (
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query) ||
      job.category.toLowerCase().includes(query)
    );
  });

  // Save/unsave job
  const handleSaveJob = async (jobId) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to save jobs",
        variant: "destructive"
      });
      return;
    }
    
    try {
      if (savedJobs[jobId]) {
        // Unsave job
        await supabase
          .from('saved_jobs')
          .delete()
          .eq('user_id', user.id)
          .eq('job_id', jobId);
          
        setSavedJobs(prev => {
          const newState = { ...prev };
          delete newState[jobId];
          return newState;
        });
        
        toast({
          title: "Job removed from saved",
          description: "Job has been removed from your saved list"
        });
      } else {
        // Save job
        await supabase
          .from('saved_jobs')
          .insert({
            user_id: user.id,
            job_id: jobId
          });
          
        setSavedJobs(prev => ({
          ...prev,
          [jobId]: true
        }));
        
        toast({
          title: "Job saved",
          description: "Job has been added to your saved list"
        });
      }
    } catch (error) {
      console.error('Error saving job:', error);
      toast({
        title: "Action failed",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const viewJobDetails = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Next Job</h1>
            <p className="text-gray-600">Browse job opportunities in your barangay and beyond</p>
          </div>
          
          <div className="w-full md:w-auto flex items-center gap-2 mt-4 md:mt-0">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                type="search"
                placeholder="Search jobs..."
                className="pl-10 border-blue-200 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="border-blue-200">
              <Filter size={18} className="mr-2" /> Filter
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading skeletons
            Array(6).fill(0).map((_, index) => (
              <div key={index} className="border rounded-xl overflow-hidden shadow-sm p-6 bg-white">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-5 w-1/2 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
                <div className="mt-4 pt-4 border-t">
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
                <div className="mt-4 flex justify-between">
                  <Skeleton className="h-10 w-28" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
              </div>
            ))
          ) : filteredJobs.length === 0 ? (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
              <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No jobs found</h3>
              <p className="mt-2 text-gray-500">Try adjusting your search criteria</p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job.id} className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{job.title}</h3>
                      <p className="text-gray-600 font-medium">{job.company}</p>
                    </div>
                    {job.logo_url ? (
                      <img 
                        src={job.logo_url} 
                        alt={`${job.company} logo`} 
                        className="w-12 h-12 object-contain rounded-md"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-blue-100 rounded-md flex items-center justify-center">
                        <Building className="h-6 w-6 text-blue-600" />
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-gray-600">
                      <MapPin size={16} className="mr-2 text-gray-400" />
                      <span>{job.location}</span>
                    </div>
                    
                    {job.salary && (
                      <div className="flex items-center text-gray-600">
                        <Banknote size={16} className="mr-2 text-gray-400" />
                        <span>{job.salary}</span>
                      </div>
                    )}
                    
                    {job.availability && (
                      <div className="flex items-center text-gray-600">
                        <Clock size={16} className="mr-2 text-gray-400" />
                        <span>{job.availability}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {job.category}
                      </Badge>
                      {job.work_approach && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {job.work_approach}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between">
                    <Button 
                      onClick={() => viewJobDetails(job.id)} 
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      View Details
                    </Button>
                    
                    <Button
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleSaveJob(job.id)}
                      className={`rounded-full ${savedJobs[job.id] ? 'text-blue-600' : 'text-gray-400'}`}
                    >
                      <Bookmark className={`h-5 w-5 ${savedJobs[job.id] ? 'fill-blue-600' : ''}`} />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
