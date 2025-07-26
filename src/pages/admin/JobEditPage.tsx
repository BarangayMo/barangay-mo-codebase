
import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { DraggableArrayInput } from "@/components/ui/draggable-array-input";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { MediaUpload } from "@/components/ui/media-upload";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  category: string;
  salary: string;
  experience: string;
  work_approach: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  skills: string[];
  is_open: boolean;
  created_at: string;
  updated_at: string;
  job_code: string;
  logo_url?: string;
}

interface FormData {
  title: string;
  company: string;
  location: string;
  category: string;
  salary: string;
  experience: string;
  work_approach: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  skills: string[];
  is_open: boolean;
  job_code: string;
  logo_url?: string;
  education: string;
  license: string;
  availability: string;
}

export default function JobEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, userRole } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    title: '',
    company: '',
    location: '',
    category: '',
    salary: '',
    experience: '',
    work_approach: '',
    description: '',
    responsibilities: [],
    qualifications: [],
    skills: [],
    is_open: true,
    job_code: '',
    logo_url: '',
    education: '',
    license: '',
    availability: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isEditing = id !== 'new';

  const fetchJob = async (jobId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setFormData({
          title: data.title,
          company: data.company,
          location: data.location,
          category: data.category,
          salary: data.salary,
          experience: data.experience,
          work_approach: data.work_approach,
          description: data.description,
          responsibilities: data.responsibilities || [],
          qualifications: data.qualifications || [],
          skills: data.skills || [],
          is_open: data.is_open,
          job_code: data.job_code,
          logo_url: data.logo_url || '',
          education: data.education || '',
          license: data.license || '',
          availability: data.availability || '',
        });
      }
    } catch (error: any) {
      console.error('Error fetching job:', error);
      toast({
        title: "Failed to fetch job",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEditing && id) {
      fetchJob(id);
    }
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        responsibilities: formData.responsibilities || [],
        qualifications: formData.qualifications || [],
        skills: formData.skills || [],
        created_by: user?.id,
      };

      if (isEditing) {
        const { data, error } = await supabase
          .from('jobs')
          .update(payload)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          throw error;
        }
      } else {
        const { data, error } = await supabase
          .from('jobs')
          .insert([payload])
          .select()
          .single();

        if (error) {
          throw error;
        }
      }

      toast({
        title: isEditing ? "Job updated successfully!" : "Job created successfully!",
      });

      if (userRole === 'resident') {
        navigate('/resident/jobs');
      } 
      else if (userRole === 'official') {
        navigate('/official/jobs');
         else {
        navigate('/admin/jobs');
      }
    } catch (error: any) {
      console.error('Error saving job:', error);
      toast({
        title: "Failed to save job",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackNavigation = () => {
    if (userRole === 'resident') {
      navigate('/resident/jobs');
    } 
    else if (userRole === 'official') {
      navigate('/official/jobs');
    }
    else {
      navigate('/admin/jobs');
    }
  };

  const getPageTitle = () => {
    if (userRole === 'resident') {
      return isEditing ? 'Edit Job Posting' : 'Create Job Posting';
    }
    return isEditing ? 'Edit Job' : 'Create Job';
  };

  const getBackButtonText = () => {
    if (userRole === 'resident') {
      return 'Back to Job Management';
    }
    return 'Back to Jobs';
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Simple back button */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={handleBackNavigation}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {getBackButtonText()}
          </Button>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold">{getPageTitle()}</h1>
          <p className="text-gray-500 mt-2">
            {isEditing ? 'Update job details and requirements' : 'Fill in the details to create a new job posting'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title and Company */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="e.g., Software Developer"
              />
            </div>
            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
                placeholder="Company name"
              />
            </div>
          </div>

          {/* Location and Category */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                placeholder="e.g., Manila, Philippines"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Customer Service">Customer Service</SelectItem>
                  <SelectItem value="Creative">Creative</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Salary and Experience */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="salary">Salary Range (Optional)</Label>
              <Input
                id="salary"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                placeholder="e.g., ₱25,000 - ₱35,000"
              />
            </div>
            <div>
              <Label htmlFor="experience">Experience Level</Label>
              <Select
                value={formData.experience}
                onValueChange={(value) => setFormData({ ...formData, experience: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Entry Level">Entry Level</SelectItem>
                  <SelectItem value="Mid Level">Mid Level</SelectItem>
                  <SelectItem value="Senior Level">Senior Level</SelectItem>
                  <SelectItem value="Executive">Executive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Work Approach */}
          <div>
            <Label htmlFor="work_approach">Work Approach (Optional)</Label>
            <Select
              value={formData.work_approach}
              onValueChange={(value) => setFormData({ ...formData, work_approach: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select work approach" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Remote">Remote</SelectItem>
                <SelectItem value="On-site">On-site</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Job Description */}
          <div>
            <Label htmlFor="description">Job Description</Label>
            <RichTextEditor
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              placeholder="Describe the job role, requirements, and what makes this position unique..."
            />
          </div>

          {/* Responsibilities */}
          <div>
            <Label>Key Responsibilities</Label>
            <DraggableArrayInput
              values={formData.responsibilities}
              onChange={(value) => setFormData({ ...formData, responsibilities: value })}
              placeholder="Add a key responsibility..."
            />
          </div>

          {/* Skills */}
          <div>
            <Label>Required Skills (Optional)</Label>
            <DraggableArrayInput
              values={formData.skills}
              onChange={(value) => setFormData({ ...formData, skills: value })}
              placeholder="Add a required skill..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button 
              type="submit" 
              disabled={submitting} 
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 px-8 py-3"
            >
              {submitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  {isEditing ? 'Update Job' : 'Create Job'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
