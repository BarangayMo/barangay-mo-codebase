
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardPageHeader } from "@/components/dashboard/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Save, ArrowLeft, Plus, X } from "lucide-react";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  category: string;
  description: string;
  salary?: string;
  experience: string;
  work_approach?: string;
  qualifications?: string[];
  skills?: string[];
  responsibilities?: string[];
  created_at: string;
}

export default function JobEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [job, setJob] = useState<Job | null>(null);
  const [newQualification, setNewQualification] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [newResponsibility, setNewResponsibility] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        setJob(data);
      } catch (error) {
        console.error('Error fetching job:', error);
        toast({
          title: "Failed to fetch job",
          description: "Please try again",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchJob();
  }, [id, toast]);

  const handleSave = async () => {
    if (!job || !id) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('jobs')
        .update({
          title: job.title,
          company: job.company,
          location: job.location,
          category: job.category,
          description: job.description,
          salary: job.salary,
          experience: job.experience,
          work_approach: job.work_approach,
          qualifications: job.qualifications,
          skills: job.skills,
          responsibilities: job.responsibilities,
        })
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Job updated successfully",
        description: "The job posting has been saved",
      });
      
      navigate('/admin/jobs/all');
    } catch (error) {
      console.error('Error updating job:', error);
      toast({
        title: "Failed to update job",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const addQualification = () => {
    if (newQualification.trim() && job) {
      setJob({
        ...job,
        qualifications: [...(job.qualifications || []), newQualification.trim()]
      });
      setNewQualification("");
    }
  };

  const removeQualification = (index: number) => {
    if (job) {
      setJob({
        ...job,
        qualifications: job.qualifications?.filter((_, i) => i !== index)
      });
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && job) {
      setJob({
        ...job,
        skills: [...(job.skills || []), newSkill.trim()]
      });
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    if (job) {
      setJob({
        ...job,
        skills: job.skills?.filter((_, i) => i !== index)
      });
    }
  };

  const addResponsibility = () => {
    if (newResponsibility.trim() && job) {
      setJob({
        ...job,
        responsibilities: [...(job.responsibilities || []), newResponsibility.trim()]
      });
      setNewResponsibility("");
    }
  };

  const removeResponsibility = (index: number) => {
    if (job) {
      setJob({
        ...job,
        responsibilities: job.responsibilities?.filter((_, i) => i !== index)
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Job not found</p>
          <Button 
            onClick={() => navigate('/admin/jobs/all')}
            className="mt-4"
          >
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <DashboardPageHeader
        title="Edit Job"
        description="Update job posting details"
        breadcrumbItems={[
          { label: "Jobs", href: "/admin/jobs" },
          { label: "All Jobs", href: "/admin/jobs/all" },
          { label: "Edit Job" }
        ]}
        actionButton={{
          label: "Save Changes",
          onClick: handleSave,
          icon: <Save className="h-4 w-4" />
        }}
        secondaryActions={[
          {
            label: "Back",
            onClick: () => navigate('/admin/jobs/all'),
            icon: <ArrowLeft className="h-4 w-4" />,
            variant: "outline"
          }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Update the basic job details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                value={job.title}
                onChange={(e) => setJob({ ...job, title: e.target.value })}
                placeholder="Enter job title"
              />
            </div>
            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={job.company}
                onChange={(e) => setJob({ ...job, company: e.target.value })}
                placeholder="Enter company name"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={job.location}
                onChange={(e) => setJob({ ...job, location: e.target.value })}
                placeholder="Enter job location"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={job.category} onValueChange={(value) => setJob({ ...job, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="hospitality">Hospitality</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="construction">Construction</SelectItem>
                  <SelectItem value="food-service">Food Service</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="salary">Salary Range</Label>
              <Input
                id="salary"
                value={job.salary || ""}
                onChange={(e) => setJob({ ...job, salary: e.target.value })}
                placeholder="e.g., THB 200 - 600/hour"
              />
            </div>
            <div>
              <Label htmlFor="experience">Required Experience</Label>
              <Input
                id="experience"
                value={job.experience}
                onChange={(e) => setJob({ ...job, experience: e.target.value })}
                placeholder="e.g., 2-3 years"
              />
            </div>
            <div>
              <Label htmlFor="work_approach">Work Approach</Label>
              <Select value={job.work_approach || ""} onValueChange={(value) => setJob({ ...job, work_approach: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select work approach" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Job Description */}
        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
            <CardDescription>Provide detailed job description</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={job.description}
              onChange={(e) => setJob({ ...job, description: e.target.value })}
              placeholder="Enter detailed job description..."
              className="min-h-[200px]"
            />
          </CardContent>
        </Card>

        {/* Qualifications */}
        <Card>
          <CardHeader>
            <CardTitle>Qualifications</CardTitle>
            <CardDescription>Add required qualifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newQualification}
                onChange={(e) => setNewQualification(e.target.value)}
                placeholder="Add a qualification..."
                onKeyPress={(e) => e.key === 'Enter' && addQualification()}
              />
              <Button onClick={addQualification} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {job.qualifications?.map((qual, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {qual}
                  <button onClick={() => removeQualification(index)} className="ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
            <CardDescription>Add required skills</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill..."
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              />
              <Button onClick={addSkill} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {job.skills?.map((skill, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <button onClick={() => removeSkill(index)} className="ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Responsibilities */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Responsibilities</CardTitle>
            <CardDescription>Add job responsibilities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newResponsibility}
                onChange={(e) => setNewResponsibility(e.target.value)}
                placeholder="Add a responsibility..."
                onKeyPress={(e) => e.key === 'Enter' && addResponsibility()}
              />
              <Button onClick={addResponsibility} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {job.responsibilities?.map((resp, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm">{resp}</span>
                  <Button 
                    onClick={() => removeResponsibility(index)} 
                    variant="ghost" 
                    size="sm"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button at Bottom */}
      <div className="flex justify-end gap-4 mt-8">
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/jobs/all')}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="min-w-[120px]"
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
