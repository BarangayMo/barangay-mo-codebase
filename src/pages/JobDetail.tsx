// JobDetail.tsx

import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowLeft, ArrowRight, ArrowLeftRight, Building, MapPin, Banknote, Clock,
  GraduationCap, Briefcase, Bookmark, Share2, Users, Star, MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [otherJobs, setOtherJobs] = useState([]);
  const [reviewForm, setReviewForm] = useState({ name: "", rating: "", comment: "" });
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const { data, error } = await supabase.from('jobs').select('*').eq('id', id).single();
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

        const { data: others } = await supabase
          .from('jobs')
          .select('id, title, company, location')
          .neq('id', id)
          .limit(3);
        setOtherJobs(others || []);
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

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    toast({ title: "Review submitted", description: "Thanks for your feedback!" });
    setReviewForm({ name: "", rating: "", comment: "" });
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
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-md border border-gray-100 space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">{job.title} <Badge className="bg-indigo-100 text-indigo-600">Open</Badge></h1>
                <p className="text-gray-500 flex items-center mt-1"><MapPin size={14} className="mr-1" /> {job.location || '—'}</p>
              </div>
              <div className="flex items-center flex-wrap gap-2">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Apply Now</Button>
                <Button size="sm" variant="outline" onClick={handleSaveJob} disabled={savingStatus}>
                  <Bookmark size={14} className="mr-2" /> {isSaved ? 'Saved' : 'Save Job'}
                </Button>
                <Button size="sm" variant="outline" onClick={handleShareJob}>
                  <Share2 size={14} className="mr-2" /> Share
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-gray-700 p-4 bg-white rounded-lg border">
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

            <div className="border-b text-sm font-medium text-gray-500 flex gap-6 mt-4 overflow-x-auto">
              {['description', 'review', 'other'].map((tab) => (
                <div
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`cursor-pointer pb-2 transition-all whitespace-nowrap ${activeTab === tab ? 'text-indigo-600 border-b-2 border-indigo-600' : ''}`}
                >
                  {tab === 'description' ? 'Job Description' : tab === 'review' ? 'Reviews' : 'Other Jobs'}
                </div>
              ))}
            </div>

            {activeTab === 'review' && (
              <div className="pt-4 space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-4">Leave a Review</h3>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <Input
                      placeholder="Your Name"
                      value={reviewForm.name}
                      onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                    />
                    <Input
                      placeholder="Rating (1–5)"
                      type="number"
                      max={5}
                      min={1}
                      value={reviewForm.rating}
                      onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                    />
                    <Textarea
                      placeholder="Write your feedback..."
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    />
                    <Button type="submit" className="w-full bg-indigo-600 text-white">Submit Review</Button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'other' && (
              <div className="pt-4 space-y-3 text-sm text-gray-700">
                {otherJobs.length > 0 ? otherJobs.map((ojob) => (
                  <div key={ojob.id} className="p-4 rounded-lg border hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/jobs/${ojob.id}`)}>
                    <h4 className="font-medium text-gray-800">{ojob.title}</h4>
                    <p className="text-gray-500 text-sm">{ojob.company} — {ojob.location}</p>
                  </div>
                )) : <p>No other jobs available.</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
