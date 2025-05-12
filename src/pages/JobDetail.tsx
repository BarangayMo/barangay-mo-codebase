import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowLeft, ArrowRight, ArrowLeftRight, Building, MapPin, Banknote, Clock,
  GraduationCap, Briefcase, Bookmark, Share2, Users
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
  const [activeTab, setActiveTab] = useState("description");
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-sm text-gray-500 flex justify-between mb-4">
          <div className="flex items-center space-x-1">
            <ArrowLeft size={14} /> <span className="cursor-pointer" onClick={() => navigate(-1)}>Previous</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="cursor-pointer" onClick={() => navigate(+1)}>Next</span> <ArrowRight size={14} />
          </div>
        </div>

        {loading ? <Skeleton className="h-96 w-full" /> : job && (
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 space-y-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">{job.title} <Badge className="bg-indigo-100 text-indigo-600">Open</Badge></h1>
                <p className="text-gray-500 flex items-center mt-1"><MapPin size={14} className="mr-1" /> {job.location || '—'}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={handleSaveJob} disabled={savingStatus}>
                  <Bookmark size={14} className="mr-2" /> {isSaved ? 'Saved' : 'Save Job'}
                </Button>
                <Button size="sm" variant="outline" onClick={handleShareJob}>
                  <Share2 size={14} className="mr-2" /> Share
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-gray-700">
              <div><p className="text-gray-500">Category</p><p className="font-medium">{job.category || 'Product'}</p></div>
              <div><p className="text-gray-500">Availability</p><p className="font-medium">{job.availability || '—'}</p></div>
              <div><p className="text-gray-500">Work Approach</p><p className="font-medium">{job.approach || 'Onsite'}</p></div>
              <div><p className="text-gray-500">Experience</p><p className="font-medium">{job.experience || '—'}</p></div>
              <div><p className="text-gray-500">Salary</p><p className="font-medium">{job.salary || '—'}</p></div>
              <div><p className="text-gray-500">License</p><p className="font-medium">{job.license || 'Required'}</p></div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1"><Users size={16} /> <span>{job.applicants || '154'} Applicants</span></div>
              <div className="flex items-center gap-1"><ArrowLeftRight size={16} /> <span>{job.matched || '40'} Matched</span></div>
            </div>

            <div className="border-b text-sm font-medium text-gray-500 flex gap-6 mt-4">
              {['description', 'review', 'other'].map((tab) => (
                <div
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`cursor-pointer pb-2 transition-all ${activeTab === tab ? 'text-indigo-600 border-b-2 border-indigo-600' : ''}`}
                >
                  {tab === 'description' ? 'Job Description' : tab === 'review' ? 'Review' : 'Other Jobs'}
                </div>
              ))}
            </div>

            {activeTab === 'description' && (
              <div className="space-y-6 pt-4">
                <div>
                  <h2 className="font-semibold text-gray-800 mb-2">About</h2>
                  <p className="text-gray-600 text-sm whitespace-pre-line">{job.description}</p>
                </div>
                <div>
                  <h2 className="font-semibold text-gray-800 mb-2">Key Responsibilities</h2>
                  <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
                    {job.responsibilities?.map((item, idx) => (<li key={idx}>{item}</li>))}
                  </ul>
                </div>
                <div>
                  <h2 className="font-semibold text-gray-800 mb-2">Education</h2>
                  <p className="text-gray-600 text-sm">{job.education}</p>
                </div>
                <div>
                  <h2 className="font-semibold text-gray-800 mb-2">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills?.map((skill, idx) => (
                      <Badge key={idx} className="bg-gray-100 text-gray-800 border-none">{skill}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className="font-semibold text-gray-800 mb-2">Preferred Qualifications</h2>
                  <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
                    {job.qualifications?.map((item, idx) => (<li key={idx}>{item}</li>))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'review' && (
              <div className="pt-4 text-sm text-gray-600">No reviews yet. Check back later.</div>
            )}

            {activeTab === 'other' && (
              <div className="pt-4 text-sm text-gray-600">Other job listings will be displayed here soon.</div>
            )}

            <div className="pt-6">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 text-sm rounded-lg">Apply Now</Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
