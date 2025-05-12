
import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  ArrowLeft, Building, MapPin, Banknote, Clock, GraduationCap,
  Briefcase, Bookmark, Share2, Award, CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        // Fetch job details
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        setJob(data);
        
        // Check if job is saved by user
        if (isAuthenticated && user) {
          const { data: savedJob, error: savedJobError } = await supabase
            .from('saved_jobs')
            .select('id')
            .eq('job_id', id)
            .eq('user_id', user.id)
            .maybeSingle();
            
          if (!savedJobError) {
            setIsSaved(!!savedJob);
          }
        }
      } catch (error) {
        console.error('Error fetching job details:', error);
        toast({
          title: "Error",
          description: "Failed to fetch job details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchJobDetails();
    }
  }, [id, isAuthenticated, user, toast]);

  const handleSaveJob = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to save this job",
        variant: "destructive"
      });
      return;
    }
    
    setSavingStatus(true);
    try {
      if (isSaved) {
        // Remove job from saved list
        await supabase
          .from('saved_jobs')
          .delete()
          .eq('user_id', user.id)
          .eq('job_id', id);
        
        setIsSaved(false);
        toast({
          title: "Job removed",
          description: "Job removed from your saved list"
        });
      } else {
        // Add job to saved list
        await supabase
          .from('saved_jobs')
          .insert({
            user_id: user.id,
            job_id: id
          });
        
        setIsSaved(true);
        toast({
          title: "Job saved",
          description: "Job added to your saved list"
        });
      }
    } catch (error) {
      console.error('Error saving job:', error);
      toast({
        title: "Error",
        description: "Failed to save job",
        variant: "destructive"
      });
    } finally {
      setSavingStatus(false);
    }
  };

  const handleShareJob = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Job link copied to clipboard"
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/jobs')} 
          className="mb-6 hover:bg-blue-50 text-blue-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
        </Button>
        
        {loading ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-6 w-48" />
              </div>
              <Skeleton className="h-16 w-16 rounded-md" />
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-6 w-36" />
            </div>
            
            <Skeleton className="h-40 w-full" />
            
            <div>
              <Skeleton className="h-7 w-48 mb-3" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-2/3" />
            </div>
          </div>
        ) : job ? (
          <div className="space-y-8">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                <div className="flex items-center text-gray-700 mb-4">
                  <Building className="h-5 w-5 mr-2 text-gray-500" />
                  <span className="font-medium">{job.company}</span>
                </div>
                
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin size={18} className="mr-1.5 text-gray-400" />
                    <span>{job.location}</span>
                  </div>
                  
                  {job.salary && (
                    <div className="flex items-center text-gray-600">
                      <Banknote size={18} className="mr-1.5 text-gray-400" />
                      <span>{job.salary}</span>
                    </div>
                  )}
                  
                  {job.availability && (
                    <div className="flex items-center text-gray-600">
                      <Clock size={18} className="mr-1.5 text-gray-400" />
                      <span>{job.availability}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {job.logo_url ? (
                <img 
                  src={job.logo_url} 
                  alt={`${job.company} logo`} 
                  className="w-20 h-20 object-contain rounded-md mt-4 md:mt-0"
                />
              ) : (
                <div className="w-20 h-20 bg-blue-100 rounded-md flex items-center justify-center mt-4 md:mt-0">
                  <Building className="h-10 w-10 text-blue-600" />
                </div>
              )}
            </div>
            
            {/* Job Description */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Job Description</h2>
              <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
            </div>
            
            {/* Job Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Responsibilities */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Briefcase className="mr-2 h-5 w-5 text-blue-600" />
                  Responsibilities
                </h2>
                <ul className="space-y-2">
                  {job.responsibilities?.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 mt-0.5 text-blue-600" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Qualifications */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Award className="mr-2 h-5 w-5 text-blue-600" />
                  Qualifications
                </h2>
                <ul className="space-y-2">
                  {job.qualifications?.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 mt-0.5 text-blue-600" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Requirements */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Requirements</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {job.experience && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-1">Experience</h3>
                    <p className="text-gray-600">{job.experience}</p>
                  </div>
                )}
                
                {job.education && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-1 flex items-center">
                      <GraduationCap className="mr-1 h-4 w-4" /> Education
                    </h3>
                    <p className="text-gray-600">{job.education}</p>
                  </div>
                )}
              </div>
              
              {job.skills && job.skills.length > 0 && (
                <div className="pt-4">
                  <h3 className="font-medium text-gray-800 mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <Badge key={index} className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-none">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Application buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 border-t">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Apply Now
              </Button>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleSaveJob}
                  disabled={savingStatus}
                  className={`${isSaved ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-gray-200'}`}
                >
                  <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? 'fill-blue-600' : ''}`} />
                  {isSaved ? 'Saved' : 'Save Job'}
                </Button>
                
                <Button variant="outline" onClick={handleShareJob} className="border-gray-200">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Job Not Found</h2>
            <p className="text-gray-600 mb-6">The job you are looking for does not exist or has been removed.</p>
            <Button onClick={() => navigate('/jobs')} className="bg-blue-600 hover:bg-blue-700">
              Browse All Jobs
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
