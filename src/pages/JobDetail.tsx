import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { 
  MapPin, 
  Building, 
  Clock, 
  Banknote, 
  ChevronLeft, 
  Bookmark, 
  BookmarkCheck,
  Calendar,
  Users,
  Globe,
  MessageCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { ShareButton } from "@/components/ui/share-button";
import { useStartConversation } from "@/hooks/useStartConversation";

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, userRole } = useAuth();
  const { toast } = useToast();
  const { startConversation } = useStartConversation();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [messagingLoading, setMessagingLoading] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        setJob(data);
        
        // Check if job is bookmarked
        if (isAuthenticated && user) {
          const { data: bookmarkData } = await supabase
            .from('saved_jobs')
            .select('id')
            .eq('user_id', user.id)
            .eq('job_id', id)
            .single();
            
          setIsBookmarked(!!bookmarkData);
        }
      } catch (error) {
        console.error('Error fetching job:', error);
        toast({
          title: "Failed to fetch job",
          description: "Please try refreshing the page",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchJob();
  }, [id, isAuthenticated, user, toast]);

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to bookmark jobs",
        variant: "destructive"
      });
      return;
    }
    
    setBookmarkLoading(true);
    
    try {
      if (isBookmarked) {
        // Remove bookmark
        await supabase
          .from('saved_jobs')
          .delete()
          .eq('user_id', user.id)
          .eq('job_id', id);
          
        setIsBookmarked(false);
        toast({
          title: "Job removed from saved",
          description: "Job has been removed from your saved list"
        });
      } else {
        // Add bookmark
        await supabase
          .from('saved_jobs')
          .insert({
            user_id: user.id,
            job_id: id
          });
          
        setIsBookmarked(true);
        toast({
          title: "Job saved",
          description: "Job has been added to your saved list"
        });
      }
    } catch (error) {
      console.error('Error bookmarking job:', error);
      toast({
        title: "Action failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleApply = () => {
    if (job.application_url) {
      window.open(job.application_url, '_blank');
    } else {
      // Navigate to payment page for job application
      navigate(`/jobs/${id}/payment`);
    }
  };

  const handleMessagePoster = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to message job posters",
        variant: "destructive"
      });
      return;
    }

    // Use the same fallback logic as in Jobs.tsx
    let posterUserId = job?.assigned_to;
    
    if (!posterUserId) {
      console.log('Job does not have assigned_to, attempting fallback for:', job?.company);
      
      // Try to find user by company name or use a default system user
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .ilike('first_name', `%${job?.company}%`)
        .limit(1)
        .maybeSingle();

      if (userData) {
        posterUserId = userData.id;
      } else {
        // Use the first available user as fallback
        const { data: fallbackUser, error: fallbackError } = await supabase
          .from('profiles')
          .select('id')
          .neq('id', user.id)
          .limit(1)
          .maybeSingle();

        if (fallbackUser) {
          posterUserId = fallbackUser.id;
        }
      }
    }

    if (!posterUserId) {
      toast({
        title: "Unable to message poster",
        description: "This job doesn't have a contact person assigned",
        variant: "destructive"
      });
      return;
    }

    if (posterUserId === user.id) {
      toast({
        title: "Cannot message yourself",
        description: "You cannot start a conversation with yourself",
        variant: "destructive"
      });
      return;
    }

    setMessagingLoading(true);
    
    try {
      await startConversation(posterUserId);
      toast({
        title: "Starting conversation",
        description: `Opening chat with ${job.company}`,
      });
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: "Failed to start conversation",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setMessagingLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!job) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h1>
            <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/jobs')}>
              Back to Jobs
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/jobs')}
          className="mb-6 -ml-3"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Jobs
        </Button>

        {/* Job Header */}
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              {job.logo_url ? (
                <img 
                  src={job.logo_url} 
                  alt={`${job.company} logo`} 
                  className="w-16 h-16 object-contain rounded-lg flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building className="h-8 w-8 text-blue-600" />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 break-words">{job.title}</h1>
                <p className="text-base sm:text-lg text-gray-600 font-medium mb-2 break-words">{job.company}</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin size={14} className="flex-shrink-0" />
                    <span className="truncate">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} className="flex-shrink-0" />
                    <span>Posted {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <ShareButton
                title={job.title}
                description={`Check out this job opportunity: ${job.title} at ${job.company}`}
                itemId={job.id}
                itemType="job"
                variant="outline"
                size="sm"
                className="text-gray-600 flex-shrink-0"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleBookmark}
                disabled={bookmarkLoading}
                className={`flex-shrink-0 ${isBookmarked ? 'text-blue-600 border-blue-200 bg-blue-50' : 'text-gray-600'}`}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="h-4 w-4 mr-1" />
                ) : (
                  <Bookmark className="h-4 w-4 mr-1" />
                )}
                {isBookmarked ? 'Saved' : 'Save'}
              </Button>
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Description */}
            <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {job.description || 'No description available.'}
                </p>
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {job.requirements}
                  </p>
                </div>
              </div>
            )}

            {/* Responsibilities */}
            {job.responsibilities && (
              <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Responsibilities</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {job.responsibilities}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Information */}
            <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Job Information</h3>
              <div className="space-y-3">
                {job.salary && (
                  <div className="flex items-center gap-3">
                    <Banknote className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-500">Salary</p>
                      <p className="font-medium text-gray-900 break-words">{job.salary}</p>
                    </div>
                  </div>
                )}
                
                {job.work_approach && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-500">Work Type</p>
                      <p className="font-medium text-gray-900 break-words">{job.work_approach}</p>
                    </div>
                  </div>
                )}
                
                {job.availability && (
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-500">Availability</p>
                      <p className="font-medium text-gray-900 break-words">{job.availability}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-500">Category</p>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 mt-1">
                      {job.category}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 space-y-3">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
                onClick={handleApply}
              >
                Apply Now
              </Button>
              
              {userRole !== 'resident' && (
                <Button 
                  variant="outline"
                  className="w-full"
                  size="lg"
                  onClick={handleMessagePoster}
                  disabled={messagingLoading}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {messagingLoading ? 'Starting...' : 'Message Poster'}
                </Button>
              )}
              
              <p className="text-xs text-gray-500 text-center">
                {job?.application_url ? 'You will be redirected to the application page' : 'Complete payment to submit your application'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
