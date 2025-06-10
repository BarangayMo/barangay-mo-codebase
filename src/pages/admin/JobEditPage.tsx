
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DashboardPageHeader } from "@/components/dashboard/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Save, ArrowLeft, Upload, Calendar, User, Building2, MapPin, DollarSign, Clock, Tag } from "lucide-react";

export default function JobEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [job, setJob] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    category: "",
    salary: "",
    experience: "",
    work_approach: "",
    responsibilities: [],
    qualifications: [],
    skills: [],
    is_open: true
  });

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
        
        if (data) {
          setJob(data);
        }
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
    setSaving(true);
    try {
      const { error } = await supabase
        .from('jobs')
        .update({
          title: job.title,
          description: job.description,
          company: job.company,
          location: job.location,
          category: job.category,
          salary: job.salary,
          experience: job.experience,
          work_approach: job.work_approach,
          responsibilities: job.responsibilities,
          qualifications: job.qualifications,
          skills: job.skills,
          is_open: job.is_open,
          updated_at: new Date().toISOString()
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

  const handleInputChange = (field, value) => {
    setJob(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    setJob(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setJob(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), ""]
    }));
  };

  const removeArrayItem = (field, index) => {
    setJob(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Job">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-4">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-48 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="h-24 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Job">
      <div className="p-6 max-w-7xl mx-auto">
        <DashboardPageHeader
          title="Edit Job"
          description={`Editing: ${job.title}`}
          breadcrumbItems={[
            { label: "Jobs", href: "/admin/jobs" },
            { label: "All Jobs", href: "/admin/jobs/all" },
            { label: "Edit Job" }
          ]}
          actionButton={{
            label: "Back to List",
            onClick: () => navigate('/admin/jobs/all'),
            icon: <ArrowLeft className="h-4 w-4" />,
            variant: "outline"
          }}
          secondaryActions={[
            {
              label: saving ? "Saving..." : "Save Changes",
              onClick: handleSave,
              icon: <Save className="h-4 w-4" />,
              variant: "default"
            }
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">Job Title</Label>
                  <Input
                    id="title"
                    value={job.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter job title"
                    className="text-lg font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">Job Description</Label>
                  <Textarea
                    id="description"
                    value={job.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the job role, requirements, and expectations..."
                    rows={8}
                    className="resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-sm font-medium">Company</Label>
                    <Input
                      id="company"
                      value={job.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="Company name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                    <Input
                      id="location"
                      value={job.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Job location"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Job Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium">Category</Label>
                    <Input
                      id="category"
                      value={job.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      placeholder="Job category"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-sm font-medium">Required Experience</Label>
                    <Input
                      id="experience"
                      value={job.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      placeholder="e.g., 2-3 years"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salary" className="text-sm font-medium">Salary Range</Label>
                    <Input
                      id="salary"
                      value={job.salary}
                      onChange={(e) => handleInputChange('salary', e.target.value)}
                      placeholder="e.g., THB 30,000 - 50,000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="work_approach" className="text-sm font-medium">Work Approach</Label>
                    <Select value={job.work_approach} onValueChange={(value) => handleInputChange('work_approach', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select work approach" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="freelance">Freelance</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Responsibilities */}
            <Card>
              <CardHeader>
                <CardTitle>Responsibilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {job.responsibilities?.map((responsibility, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={responsibility}
                      onChange={(e) => handleArrayChange('responsibilities', index, e.target.value)}
                      placeholder="Enter responsibility"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('responsibilities', index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => addArrayItem('responsibilities')}
                  className="w-full"
                >
                  Add Responsibility
                </Button>
              </CardContent>
            </Card>

            {/* Qualifications */}
            <Card>
              <CardHeader>
                <CardTitle>Qualifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {job.qualifications?.map((qualification, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={qualification}
                      onChange={(e) => handleArrayChange('qualifications', index, e.target.value)}
                      placeholder="Enter qualification"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('qualifications', index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => addArrayItem('qualifications')}
                  className="w-full"
                >
                  Add Qualification
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Settings & Meta */}
          <div className="space-y-6">
            {/* Publish Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Publish
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                  <Select value={job.is_open ? "open" : "closed"} onValueChange={(value) => handleInputChange('is_open', value === "open")}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Visibility</span>
                  <Badge variant="secondary">Public</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Created</span>
                  <span className="text-sm">{new Date(job.created_at).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Updated</span>
                  <span className="text-sm">{new Date(job.updated_at).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Job Thumbnail */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Job Thumbnail
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Upload thumbnail</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Choose Image
                </Button>
              </CardContent>
            </Card>

            {/* Assigned To */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Assigned To
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="https://ui-avatars.com/api/?name=Admin&background=random" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Admin User</p>
                    <p className="text-xs text-gray-500">admin@company.com</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Change Assignee
                </Button>
              </CardContent>
            </Card>

            {/* Company Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Company Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <span>{job.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span>{job.salary || "Not specified"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{job.work_approach || "Not specified"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
