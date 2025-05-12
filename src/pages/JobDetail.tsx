
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowLeft, ArrowRight, ArrowLeftRight, Building, MapPin, Banknote, Clock,
  GraduationCap, Briefcase, Bookmark, Share2, Users, Star, MessageCircle
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

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
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
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
    if (navigator.share) {
      navigator.share({
        title: job?.title || "Job Post",
        text: `Check out this job: ${job?.title}`,
        url: window.location.href,
      }).catch(() => {
        toast({ title: "Share cancelled", description: "Sharing was cancelled or unsupported." });
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied", description: "Job link copied to clipboard" });
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    toast({ title: "Review submitted", description: "Thanks for your feedback!" });
    setReviewForm({ name: "", rating: "", comment: "" });
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      toast({ 
        title: "Authentication required", 
        description: "Please login to apply for this job", 
        variant: "destructive" 
      });
      return;
    }
    
    setApplyDialogOpen(true);
  };
  
  const handleApplyConfirm = () => {
    toast({ 
      title: "Application submitted", 
      description: "Your application has been submitted successfully!" 
    });
    setApplyDialogOpen(false);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {loading ? <Skeleton className="h-96 w-full" /> : job && (
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-md border border-gray-100 space-y-6 sm:space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">{job.title} <Badge className="bg-indigo-100 text-indigo-600">Open</Badge></h1>
                  <p className="text-gray-500 flex items-center mt-1"><MapPin size={14} className="mr-1" /> {job.location || '—'}</p>
                </div>
                <div className="flex items-center flex-wrap gap-2">
                  <Button 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={handleApplyClick}
                  >
                    Apply Now
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleSaveJob} disabled={savingStatus}>
                    <Bookmark size={14} className="mr-2" fill={isSaved ? "currentColor" : "none"} /> {isSaved ? 'Saved' : 'Save Job'}
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

        <aside className="space-y-6 sticky top-24 self-start">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-sm">
                {job?.poster_name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{job?.poster_name || 'Job Poster'}</p>
                <p className="text-sm text-gray-500">Joined Jan 2023</p>
              </div>
            </div>
            <div className="text-sm text-gray-700 space-y-2">
              <div className="flex items-center gap-2">
                <Star size={14} className="text-yellow-400" />
                <span>4.8 rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase size={14} />
                <span>18 Jobs Posted</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={14} />
                <span>32 Reviews</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="mt-4 w-full flex items-center justify-center gap-2" onClick={() => navigate(`/messages/new?recipient=${job?.poster_id || ''}`)}>
              <MessageCircle size={14} /> Message
            </Button>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-900 mb-4">More from other employers</h3>
            <div className="space-y-3 text-sm text-gray-700">
              {otherJobs.length > 0 ? otherJobs.map((ojob) => (
                <div key={ojob.id} className="p-4 rounded-lg border hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/jobs/${ojob.id}`)}>
                  <h4 className="font-medium text-gray-800">{ojob.title}</h4>
                  <p className="text-gray-500 text-sm">{ojob.company} — {ojob.location}</p>
                </div>
              )) : <p>No other jobs found.</p>}
            </div>
          </div>
        </aside>
      </div>
      
      {/* Apply Dialog */}
      <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for this Job</DialogTitle>
            <DialogDescription>
              Confirm your application for {job?.title} at {job?.company}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Application Fee</h4>
                <span className="font-semibold text-indigo-600">₱50.00</span>
              </div>
              <p className="text-sm text-gray-500">
                This fee helps ensure serious applications and supports our platform operations.
              </p>
            </div>
            
            {user && (
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Name</p>
                  <p className="font-medium">{user.firstName} {user.lastName || ''}</p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setApplyDialogOpen(false)}
              className="sm:flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleApplyConfirm} 
              className="bg-indigo-600 hover:bg-indigo-700 sm:flex-1"
            >
              Confirm & Pay ₱50
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
