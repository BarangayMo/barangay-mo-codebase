import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Briefcase, Search, MapPin, Building, Clock, Banknote, Bookmark, BookmarkCheck, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { SavedJobsTab } from "@/components/jobs/SavedJobsTab";
import { ShareButton } from "@/components/ui/share-button";

export default function ResidentJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [savedJobs, setSavedJobs] = useState({});
  const [activeTab, setActiveTab] = useState("all"); // "all" or "saved"
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch jobs posted by the current user only
  useEffect(() => {
    const fetchJobs = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('assigned_to', user.id) // Only jobs posted by this user
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

  const viewJobDetails = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleAddJob = () => {
    navigate('/admin/jobs/edit/new');
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Jobs</h1>
            <p className="text-gray-600">Manage your job postings</p>
          </div>
          
          <div className="w-full md:w-auto flex items-center gap-2 mt-4 md:mt-0">
            <Button 
              onClick={handleAddJob}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Job
            </Button>
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
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex items-center gap-4 mb-6 border-b">
          <Button
            variant="ghost"
            className={`pb-3 ${activeTab === "all" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
            onClick={() => setActiveTab("all")}
          >
            <Briefcase className="mr-2 h-4 w-4" />
            My Jobs
          </Button>
          <Button
            variant="ghost"
            className={`pb-3 ${activeTab === "saved" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
            onClick={() => setActiveTab("saved")}
          >
            <BookmarkCheck className="mr-2 h-4 w-4" />
            Saved Jobs
          </Button>
        </div>
        
        {/* Tab Content */}
        {activeTab === "all" ? (
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
                <h3 className="mt-4 text-lg font-medium text-gray-900">No jobs posted yet</h3>
                <p className="mt-2 text-gray-500 mb-4">Start by posting your first job</p>
                <Button onClick={handleAddJob} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Post a Job
                </Button>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div key={job.id} className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
                  <div className="p-4 sm:p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1 mr-3">
                        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">{job.title}</h3>
                        <p className="text-gray-600 font-medium">{job.company}</p>
                      </div>
                      {job.logo_url ? (
                        <img 
                          src={job.logo_url} 
                          alt={`${job.company} logo`} 
                          className="w-12 h-12 object-contain rounded-md flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-blue-100 rounded-md flex items-center justify-center flex-shrink-0">
                          <Building className="h-6 w-6 text-blue-600" />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600 text-sm">
                        <MapPin size={14} className="mr-2 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{job.location}</span>
                      </div>
                      
                      {job.salary && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <Banknote size={14} className="mr-2 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{job.salary}</span>
                        </div>
                      )}
                      
                      {job.availability && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <Clock size={14} className="mr-2 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{job.availability}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-4 pt-2 border-t">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                          {job.category}
                        </Badge>
                        {job.work_approach && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                            {job.work_approach}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => viewJobDetails(job.id)} 
                          className="bg-blue-600 hover:bg-blue-700 text-sm flex-1"
                        >
                          View Details
                        </Button>
                        <Button
                          onClick={() => navigate(`/admin/jobs/edit/${job.id}`)}
                          variant="outline"
                          className="text-sm px-3"
                        >
                          Edit
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-2 justify-end">
                        <ShareButton
                          title={job.title}
                          description={`Check out this job opportunity: ${job.title} at ${job.company}`}
                          itemId={job.id}
                          itemType="job"
                          variant="ghost"
                          size="icon"
                          showLabel={false}
                          className="text-gray-400 hover:text-gray-600 h-9 w-9 flex-shrink-0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <SavedJobsTab />
        )}
      </div>
    </Layout>
  );
}