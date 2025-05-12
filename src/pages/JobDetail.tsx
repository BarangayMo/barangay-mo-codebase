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
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setJob(data);

        if (isAuthenticated && user) {
          const { data: savedJob, error: savedJobError } = await supabase
            .from('saved_jobs')
            .select('id')
            .eq('job_id', id)
            .eq('user_id', user.id)
            .maybeSingle();

          if (!savedJobError) setIsSaved(!!savedJob);
        }
      } catch (error) {
        console.error('Error fetching job details:', error);
        toast({ title: "Error", description: "Failed to fetch job details", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchJobDetails();
  }, [id, isAuthenticated, user, toast]);

  const handleSaveJob = async () => {
    if (!isAuthenticated) {
      toast({ title: "Authentication required", description: "Please login to save this job", variant: "destructive" });
      return;
    }

    setSavingStatus(true);
    try {
      if (isSaved) {
        await supabase.from('saved_jobs').delete().eq('user_id', user.id).eq('job_id', id);
        setIsSaved(false);
        toast({ title: "Job removed", description: "Job removed from your saved list" });
      } else {
        await supabase.from('saved_jobs').insert({ user_id: user.id, job_id: id });
        setIsSaved(true);
        toast({ title: "Job saved", description: "Job added to your saved list" });
      }
    } catch (error) {
      console.error('Error saving job:', error);
      toast({ title: "Error", description: "Failed to save job", variant: "destructive" });
    } finally {
      setSavingStatus(false);
    }
  };

  const handleShareJob = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link copied", description: "Job link copied to clipboard" });
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate('/jobs')} className="hover:bg-gray-100 text-blue-600">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleSaveJob} disabled={savingStatus} className={`${isSaved ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-gray-200'}`}>
              <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? 'fill-blue-600' : ''}`} /> {isSaved ? 'Saved' : 'Save'}
            </Button>
            <Button variant="outline" onClick={handleShareJob} className="border-gray-200">
              <Share2 className="h-4 w-4 mr-2" /> Share
            </Button>
          </div>
        </div>

        {loading ? (
          <Skeleton className="h-96 w-full" />
        ) : job ? (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md border p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">{job.title}</h1>
                  <p className="text-gray-600 flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-1 text-gray-400" /> {job.location}
                  </p>
                </div>
                {job.logo_url ? (
                  <img src={job.logo_url} alt="Company Logo" className="h-12 w-12 rounded-md object-contain" />
                ) : (
                  <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center">
                    <Building className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-gray-700">
                <div className="flex items-center"><Briefcase className="mr-2 h-4 w-4" /> {job.availability}</div>
                <div className="flex items-center"><Banknote className="mr-2 h-4 w-4" /> {job.salary}</div>
                <div className="flex items-center"><Clock className="mr-2 h-4 w-4" /> {job.experience}</div>
              </div>

              <div className="text-gray-800 whitespace-pre-line text-sm pt-4 border-t mt-4">
                {job.description}
              </div>

              {job.responsibilities?.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Key Responsibilities</h3>
                  <ul className="space-y-1 list-disc pl-5 text-gray-700 text-sm">
                    {job.responsibilities.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {job.qualifications?.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Preferred Qualifications</h3>
                  <ul className="space-y-1 list-disc pl-5 text-gray-700 text-sm">
                    {job.qualifications.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {job.education && (
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Education</h3>
                  <p className="text-gray-700 text-sm">{job.education}</p>
                </div>
              )}

              {job.skills?.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <Badge key={index} className="bg-gray-100 text-gray-800 border-none">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-center pt-4">
              <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">Apply Now</Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
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
