import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
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
import { Save, ArrowLeft, Calendar, Building2, MapPin, DollarSign, Clock, Tag, Briefcase, Target, Users, Sparkles, Search, Eye, ChevronDown } from "lucide-react";

import { MediaUpload } from "@/components/ui/media-upload";
import { DraggableArrayInput } from "@/components/ui/draggable-array-input";
import { CharacterLimitedInput } from "@/components/ui/character-limited-input";
import { JobMap } from "@/components/ui/job-map";
import { AssigneeDialog } from "@/components/ui/assignee-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAuth } from "@/contexts/AuthContext";

export default function OfficialJobEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, userRole } = useAuth();
  const getRoleButtonClass = () => {
    if (userRole && typeof userRole === 'string') {
      if (userRole.toLowerCase() === 'resident') return 'bg-[#3d62f5] hover:bg-[#2746b3] text-white';
      if (userRole.toLowerCase() === 'official') return 'bg-[#e53935] hover:bg-[#b71c1c] text-white';
      if (userRole.toLowerCase() === 'superadmin') return 'bg-black hover:bg-gray-800 text-white';
    }
    return '';
  };

  const isEditing = !!id && id !== 'new';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [assignedUser, setAssignedUser] = useState<any>(null);
  const [seoOpen, setSeoOpen] = useState(false);
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
    logo_url: "",
    slug: "",
    seo_title: "",
    seo_description: "",
    assigned_to: ""
  });

  useEffect(() => {
    const fetchJob = async () => {
      if (!isEditing || !id) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;

        if (data) {
          setJob({
            ...job,
            ...data,
            responsibilities: data.responsibilities || [],
            qualifications: data.qualifications || [],
            skills: data.skills || [],
            slug: data.slug || '',
            seo_title: data.seo_title || '',
            seo_description: data.seo_description || '',
            assigned_to: data.assigned_to || ''
          });

          if (data.assigned_to) {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.assigned_to)
              .maybeSingle();

            if (profileData) {
              setAssignedUser({
                id: profileData.id,
                first_name: (profileData as any).first_name,
                last_name: (profileData as any).last_name,
                email: (profileData as any).email || 'user@example.com',
                avatar_url: (profileData as any).avatar_url || `https://ui-avatars.com/api/?name=${(profileData as any).first_name} ${(profileData as any).last_name}&background=random`,
                role: (profileData as any).role
              });
            }
          }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditing]);

  useEffect(() => {
    if (!isEditing) return;
    const autoSaveInterval = setInterval(async () => {
      if (autoSaveStatus === 'unsaved') {
        setAutoSaveStatus('saving');
        try {
          await handleSaveDraft();
          setAutoSaveStatus('saved');
          setLastSavedAt(new Date());
        } catch (error) {
          setAutoSaveStatus('unsaved');
        }
      }
    }, 30000);
    return () => clearInterval(autoSaveInterval);
  }, [autoSaveStatus, isEditing]);

  const handleSaveDraft = async () => {
    if (!isEditing || !id) return;
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
          logo_url: job.logo_url,
          slug: job.slug,
          seo_title: job.seo_title,
          seo_description: job.seo_description,
           assigned_to: job.assigned_to || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error('Error saving draft:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isEditing && id) {
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
            slug: job.slug,
            seo_title: job.seo_title,
            seo_description: job.seo_description,
            assigned_to: job.assigned_to || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);
        if (error) throw error;
      } else {
        const payload = {
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
          slug: job.slug,
          seo_title: job.seo_title,
          seo_description: job.seo_description,
          assigned_to: job.assigned_to || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          created_by: user?.id || null,
        };
        const { error } = await supabase
          .from('jobs')
          .insert([payload]);
        if (error) throw error;
      }

      toast({
        title: isEditing ? "Job updated successfully" : "Job created successfully",
        description: isEditing ? "The job posting has been saved and published" : "The job posting has been created",
      });

      navigate('/official/jobs');
    } catch (error) {
      console.error('Error saving job:', error);
      toast({
        title: "Failed to save job",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setJob(prev => ({ ...prev, [field]: value }));
    setAutoSaveStatus('unsaved');
  };

  const handleAssigneeChange = (userId: string, user: any) => {
    setAssignedUser(user);
    handleInputChange('assigned_to', userId);
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    handleInputChange('title', title);
    if (!job.slug) {
      handleInputChange('slug', generateSlug(title));
    }
    if (!job.seo_title) {
      handleInputChange('seo_title', title);
    }
  };

  if (loading) {
    return (
      <Layout>
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
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <DashboardPageHeader
          title={isEditing ? "Edit Job" : "Create Job"}
          description={isEditing ? `${job.job_code} • ${job.title}` : "Fill in job details"}
          breadcrumbItems={[
            { label: "Jobs", href: "/official/jobs" },
            { label: isEditing ? "Edit Job" : "Create Job" }
          ]}
          actionButton={{
            label: saving ? (isEditing ? "Publishing..." : "Creating...") : (isEditing ? "Save & Publish" : "Create"),
            onClick: () => handleSave(),
            icon: <Save className="h-4 w-4" />,
            variant: "default",
            disabled: saving,
            className: getRoleButtonClass()
          }}
          secondaryActions={[
            {
              label: "Back to List",
              onClick: () => navigate('/official/jobs'),
              icon: <ArrowLeft className="h-4 w-4" />,
              variant: "ghost",
              className: getRoleButtonClass()
            }
          ]}
        />

        {isEditing && (
          <div className="mb-4 flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              {autoSaveStatus === 'saved' && lastSavedAt && `Draft saved at ${lastSavedAt.toLocaleTimeString()}`}
              {autoSaveStatus === 'saving' && "Saving draft..."}
              {autoSaveStatus === 'unsaved' && "Unsaved changes"}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveDraft}
              disabled={autoSaveStatus === 'saving'}
              className={getRoleButtonClass()}
            >
              Save Draft
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Building2 className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">Job Title</Label>
                  <CharacterLimitedInput
                    id="title"
                    value={job.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter job title"
                    maxLength={100}
                    className="text-lg font-medium"
                  />
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <Tag className="h-5 w-5" />
                  Job Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium">Category</Label>
                    <Select value={job.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Retail">Retail</SelectItem>
                        <SelectItem value="Hospitality">Hospitality</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-sm font-medium">Required Experience</Label>
                    <Select value={job.experience} onValueChange={(value) => handleInputChange('experience', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1 years">0-1 years</SelectItem>
                        <SelectItem value="1-3 years">1-3 years</SelectItem>
                        <SelectItem value="3-5 years">3-5 years</SelectItem>
                        <SelectItem value="5+ years">5+ years</SelectItem>
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
                      placeholder="e.g., ₱30,000 - ₱50,000"
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
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <Target className="h-5 w-5" />
                  Key Responsibilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DraggableArrayInput
                  values={job.responsibilities}
                  onChange={(values) => handleInputChange('responsibilities', values)}
                  placeholder="Enter a key responsibility"
                  addButtonText="Add Responsibility"
                />
              </CardContent>
            </Card>

            {/* Qualifications */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-700">
                  <Briefcase className="h-5 w-5" />
                  Required Qualifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DraggableArrayInput
                  values={job.qualifications}
                  onChange={(values) => handleInputChange('qualifications', values)}
                  placeholder="Enter a required qualification"
                  addButtonText="Add Qualification"
                />
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-pink-700">
                  <Sparkles className="h-5 w-5" />
                  Required Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DraggableArrayInput
                  values={job.skills}
                  onChange={(values) => handleInputChange('skills', values)}
                  placeholder="Enter a required skill"
                  addButtonText="Add Skill"
                />
              </CardContent>
            </Card>

            {/* SEO Settings - Collapsible */}
            <Card className="shadow-sm">
              <Collapsible open={seoOpen} onOpenChange={setSeoOpen}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardTitle className="flex items-center justify-between text-purple-700">
                      <div className="flex items-center gap-2">
                        <Search className="h-5 w-5" />
                        SEO Settings
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform ${seoOpen ? 'rotate-180' : ''}`} />
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="slug" className="text-sm font-medium">URL Slug</Label>
                      <Input
                        id="slug"
                        value={job.slug}
                        onChange={(e) => handleInputChange('slug', e.target.value)}
                        placeholder="job-title-slug"
                      />
                      <p className="text-xs text-muted-foreground">
                        URL: /jobs/{job.slug || 'job-title-slug'}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="seo_title" className="text-sm font-medium">SEO Title</Label>
                      <CharacterLimitedInput
                        id="seo_title"
                        value={job.seo_title}
                        onChange={(e) => handleInputChange('seo_title', e.target.value)}
                        placeholder="SEO optimized title"
                        maxLength={60}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="seo_description" className="text-sm font-medium">SEO Description</Label>
                      <Textarea
                        id="seo_description"
                        value={job.seo_description}
                        onChange={(e) => handleInputChange('seo_description', e.target.value)}
                        placeholder="Brief description for search engines"
                        rows={3}
                        maxLength={160}
                      />
                      <p className="text-xs text-muted-foreground">
                        {job.seo_description.length}/160 characters
                      </p>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          </div>

          {/* Right Column - Settings & Meta */}
          <div className="space-y-6">
            {/* Publish Status */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-700">
                  <Calendar className="h-5 w-5" />
                  Status & Publication
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
                  <span className="text-sm text-muted-foreground">Job Code</span>
                  <Badge variant="secondary">{job.job_code}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Visibility</span>
                  <Badge variant="secondary">Public</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="text-sm">{new Date(job.created_at).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Updated</span>
                  <span className="text-sm">{new Date(job.updated_at).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Company Logo */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cyan-700">
                  <Building2 className="h-5 w-5" />
                  Company Logo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MediaUpload
                  value={job.logo_url}
                  onChange={(url) => handleInputChange('logo_url', url)}
                  onRemove={() => handleInputChange('logo_url', '')}
                  accept="image/*"
                />
              </CardContent>
            </Card>

            {/* Assigned To */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-violet-700">
                  <Users className="h-5 w-5" />
                  Assigned To
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {assignedUser && (
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={assignedUser.avatar_url} />
                      <AvatarFallback>{assignedUser.first_name?.[0]}{assignedUser.last_name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{assignedUser.first_name} {assignedUser.last_name}</p>
                      <p className="text-xs text-muted-foreground">{assignedUser.email}</p>
                    </div>
                  </div>
                )}
                <AssigneeDialog
                  currentAssigneeId={job.assigned_to}
                  onAssigneeChange={handleAssigneeChange}
                >
                  <Button variant="outline" className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    Change Assignee
                  </Button>
                </AssigneeDialog>
              </CardContent>
            </Card>

            {/* Location Map */}
            {job.location && (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <MapPin className="h-5 w-5" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <JobMap location={job.location} />
                </CardContent>
              </Card>
            )}

            {/* Summary */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-700">
                  <Eye className="h-5 w-5" />
                  Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>{job.company || "Not specified"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{job.location || "Not specified"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>{job.salary || "Not specified"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{job.work_approach || "Not specified"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
