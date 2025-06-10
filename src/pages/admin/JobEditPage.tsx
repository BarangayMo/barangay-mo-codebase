import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DashboardPageHeader } from "@/components/dashboard/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Save, ArrowLeft, Calendar, User, Building2, MapPin, DollarSign, Clock, Tag, CheckCircle, AlertCircle } from "lucide-react";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { MediaUpload } from "@/components/ui/media-upload";
import { CharacterCounterInput } from "@/components/ui/character-counter-input";
import { EnhancedArrayInput } from "@/components/ui/enhanced-array-input";

export default function JobEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [job, setJob] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    category: "",
    salary: "",
    experience: "",
    work_approach: "",
    responsibilities: [] as string[],
    qualifications: [] as string[],
    skills: [] as string[],
    is_open: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    job_code: "",
    logo_url: ""
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

  // Auto-save functionality
  useEffect(() => {
    if (!job.title || loading) return;

    const autoSaveTimer = setTimeout(async () => {
      setAutoSaving(true);
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
            logo_url: job.logo_url,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);
          
        if (!error) {
          setLastSaved(new Date());
        }
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        setAutoSaving(false);
      }
    }, 2000);

    return () => clearTimeout(autoSaveTimer);
  }, [job, id, loading]);

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
          logo_url: job.logo_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Job updated successfully",
        description: "The job posting has been saved",
      });
      
      setLastSaved(new Date());
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

  const handleInputChange = (field: string, value: string | string[] | boolean) => {
    setJob(prev => ({ ...prev, [field]: value }));
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
          description={
            <div className="flex items-center gap-4">
              <span>{job.job_code} • {job.title}</span>
              {autoSaving && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="animate-spin h-3 w-3 border border-gray-300 border-t-blue-500 rounded-full"></div>
                  <span>Auto-saving...</span>
                </div>
              )}
              {lastSaved && !autoSaving && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-3 w-3" />
                  <span>Saved {lastSaved.toLocaleTimeString()}</span>
                </div>
              )}
            </div>
          }
          breadcrumbItems={[
            { label: "Jobs", href: "/admin/jobs" },
            { label: "All Jobs", href: "/admin/jobs/all" },
            { label: "Edit Job" }
          ]}
          actionButton={{
            label: "Back to List",
            onClick: () => navigate('/admin/jobs/all'),
            icon: <ArrowLeft className="h-4 w-4" />,
            variant: "ghost"
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
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <Card className="border-2">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <CharacterCounterInput
                  id="title"
                  label="Job Title"
                  value={job.title}
                  onChange={(value) => handleInputChange('title', value)}
                  maxLength={100}
                  placeholder="Enter an engaging job title"
                  required
                />

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Job Description</Label>
                  <RichTextEditor
                    value={job.description}
                    onChange={(value) => handleInputChange('description', value)}
                    placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                    className="min-h-[300px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-sm font-medium">Company Name</Label>
                    <Input
                      id="company"
                      value={job.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="Enter company name"
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                    <Input
                      id="location"
                      value={job.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="City, Country or Remote"
                      className="h-12"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Details */}
            <Card className="border-2">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Tag className="h-5 w-5 text-green-600" />
                  Job Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium">Category</Label>
                    <Select value={job.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select job category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="hospitality">Hospitality</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-sm font-medium">Required Experience</Label>
                    <Select value={job.experience} onValueChange={(value) => handleInputChange('experience', value)}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entry">Entry Level (0-1 years)</SelectItem>
                        <SelectItem value="junior">Junior (1-3 years)</SelectItem>
                        <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                        <SelectItem value="senior">Senior (5-8 years)</SelectItem>
                        <SelectItem value="lead">Lead (8+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="salary" className="text-sm font-medium">Salary Range</Label>
                    <Input
                      id="salary"
                      value={job.salary}
                      onChange={(e) => handleInputChange('salary', e.target.value)}
                      placeholder="e.g., THB 30,000 - 50,000/month"
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="work_approach" className="text-sm font-medium">Work Type</Label>
                    <Select value={job.work_approach} onValueChange={(value) => handleInputChange('work_approach', value)}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select work type" />
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

            {/* Job Arrays */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-2">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Responsibilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <EnhancedArrayInput
                    label=""
                    items={job.responsibilities}
                    onChange={(items) => handleInputChange('responsibilities', items)}
                    placeholder="Enter job responsibility"
                    addButtonText="Add Responsibility"
                  />
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Qualifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <EnhancedArrayInput
                    label=""
                    items={job.qualifications}
                    onChange={(items) => handleInputChange('qualifications', items)}
                    placeholder="Enter qualification requirement"
                    addButtonText="Add Qualification"
                  />
                </CardContent>
              </Card>
            </div>

            <Card className="border-2">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Required Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <EnhancedArrayInput
                  label=""
                  items={job.skills}
                  onChange={(items) => handleInputChange('skills', items)}
                  placeholder="Enter required skill"
                  addButtonText="Add Skill"
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Settings & Meta */}
          <div className="space-y-6">
            {/* Publish Status */}
            <Card className="border-2">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  Publication Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Job Status</Label>
                  <Select value={job.is_open ? "open" : "closed"} onValueChange={(value) => handleInputChange('is_open', value === "open")}>
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Open
                        </div>
                      </SelectItem>
                      <SelectItem value="closed">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          Closed
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Job ID</span>
                    <Badge variant="secondary" className="font-mono">
                      {job.job_code}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Visibility</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Public
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Created</span>
                    <span>{new Date(job.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Updated</span>
                    <span>{new Date(job.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Thumbnail */}
            <Card className="border-2">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-orange-600" />
                  Job Thumbnail
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MediaUpload
                  value={job.logo_url}
                  onChange={(url) => handleInputChange('logo_url', url || "")}
                  accept="image/*"
                  maxSize={5 * 1024 * 1024}
                />
              </CardContent>
            </Card>

            {/* Assigned To */}
            <Card className="border-2">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-indigo-600" />
                  Job Manager
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff" />
                    <AvatarFallback className="bg-indigo-600 text-white">AD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Admin User</p>
                    <p className="text-xs text-gray-500">admin@company.com</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Change Manager
                </Button>
              </CardContent>
            </Card>

            {/* Company Summary */}
            <Card className="border-2">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-cyan-600" />
                  Company Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Building2 className="h-4 w-4 text-gray-400 shrink-0" />
                    <span className="truncate">{job.company || "Not specified"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                    <span className="truncate">{job.location || "Not specified"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <DollarSign className="h-4 w-4 text-gray-400 shrink-0" />
                    <span className="truncate">{job.salary || "Not specified"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="h-4 w-4 text-gray-400 shrink-0" />
                    <span className="truncate">{job.work_approach || "Not specified"}</span>
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
