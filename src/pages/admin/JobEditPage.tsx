
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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Save, ArrowLeft, Plus, X, Upload, Building, MapPin } from "lucide-react";

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
  const [isPublished, setIsPublished] = useState(true);

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
    <div className="p-6">
      <DashboardPageHeader
        title="Edit Job"
        description="Update job posting details"
        breadcrumbItems={[
          { label: "Jobs", href: "/admin/jobs" },
          { label: "All Jobs", href: "/admin/jobs/all" },
          { label: "Edit Job" }
        ]}
        actionButton={{
          label: saving ? "Saving..." : "Save Changes",
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Title and Description */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-base font-medium">Job Title</Label>
                  <Input
                    id="title"
                    value={job.title}
                    onChange={(e) => setJob({ ...job, title: e.target.value })}
                    placeholder="Enter job title..."
                    className="mt-2 text-lg font-medium"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-base font-medium">Job Description</Label>
                  <Textarea
                    id="description"
                    value={job.description}
                    onChange={(e) => setJob({ ...job, description: e.target.value })}
                    placeholder="Write a detailed job description..."
                    className="mt-2 min-h-[200px] resize-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Qualifications */}
          <Card>
            <CardHeader>
              <CardTitle>Qualifications & Requirements</CardTitle>
              <CardDescription>Add the required qualifications for this position</CardDescription>
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
                  <Badge key={index} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                    {qual}
                    <button onClick={() => removeQualification(index)}>
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
              <CardTitle>Required Skills</CardTitle>
              <CardDescription>List the skills needed for this role</CardDescription>
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
                  <Badge key={index} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                    {skill}
                    <button onClick={() => removeSkill(index)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Responsibilities */}
          <Card>
            <CardHeader>
              <CardTitle>Job Responsibilities</CardTitle>
              <CardDescription>Define the main responsibilities for this position</CardDescription>
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
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <span className="text-sm flex-1">{resp}</span>
                    <Button 
                      onClick={() => removeResponsibility(index)} 
                      variant="ghost" 
                      size="sm"
                      className="ml-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Settings Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Publish
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="published">Published</Label>
                <Switch
                  id="published"
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-gray-600">Status</Label>
                <Select value={isPublished ? "published" : "draft"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-gray-600">Visibility</Label>
                <Select defaultValue="public">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="password">Password Protected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-4 border-t space-y-2">
                <Button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="w-full"
                >
                  {saving ? "Saving..." : "Update Job"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/admin/jobs/all')}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Company Image */}
          <Card>
            <CardHeader>
              <CardTitle>Company Logo</CardTitle>
              <CardDescription>Upload or update company logo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Building className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 mb-2">Upload company logo</p>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Company Details */}
          <Card>
            <CardHeader>
              <CardTitle>Company Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  value={job.company}
                  onChange={(e) => setJob({ ...job, company: e.target.value })}
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="location"
                    value={job.location}
                    onChange={(e) => setJob({ ...job, location: e.target.value })}
                    placeholder="Enter job location"
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Job Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                <Label htmlFor="work_approach">Work Type</Label>
                <Select value={job.work_approach || ""} onValueChange={(value) => setJob({ ...job, work_approach: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select work type" />
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
            </CardContent>
          </Card>

          {/* Job Meta */}
          <Card>
            <CardHeader>
              <CardTitle>Job Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Created:</span>
                <span className="font-medium">{new Date(job.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Status:</span>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Applications:</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Views:</span>
                <span className="font-medium">156</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
