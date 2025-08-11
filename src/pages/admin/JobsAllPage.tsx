import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DashboardPageHeader } from "@/components/dashboard/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Building, Search, Star, Edit, Briefcase, Calendar, DollarSign, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { JobMap } from "@/components/ui/job-map";

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

export default function JobsAllPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch jobs from Supabase
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const {
          data,
          error
        } = await supabase.from('jobs').select('*').order('created_at', {
          ascending: false
        });
        if (error) throw error;
        setJobs(data || []);
        if (data && data.length > 0) {
          setSelectedJob(data[0]);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        toast({
          title: "Failed to fetch jobs",
          description: "Please try refreshing the page",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [toast]);
  
  const getStatusColor = (isOpen: boolean) => {
    return isOpen ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Technology': 'bg-blue-100 text-blue-800 border-blue-200',
      'Healthcare': 'bg-red-100 text-red-800 border-red-200',
      'Education': 'bg-purple-100 text-purple-800 border-purple-200',
      'Finance': 'bg-green-100 text-green-800 border-green-200',
      'Marketing': 'bg-orange-100 text-orange-800 border-orange-200',
      'Customer Service': 'bg-pink-100 text-pink-800 border-pink-200',
      'Creative': 'bg-indigo-100 text-indigo-800 border-indigo-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getWorkApproachColor = (workApproach: string) => {
    const colors = {
      'Remote': 'bg-blue-100 text-blue-800 border-blue-200',
      'On-site': 'bg-orange-100 text-orange-800 border-orange-200',
      'Hybrid': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[workApproach] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
  };
  const handleEditJob = (jobId: string) => {
    navigate(`/admin/jobs/edit/${jobId}`);
  };
  const filteredJobs = jobs.filter(job => job.title.toLowerCase().includes(searchQuery.toLowerCase()) || job.company.toLowerCase().includes(searchQuery.toLowerCase()) || job.location.toLowerCase().includes(searchQuery.toLowerCase()));
  const openJobs = filteredJobs.filter(job => job.is_open);
  const closedJobs = filteredJobs.filter(job => !job.is_open);
  const getTabJobs = () => {
    switch (activeTab) {
      case 'open':
        return openJobs;
      case 'closed':
        return closedJobs;
      default:
        return filteredJobs;
    }
  };
  if (loading) {
    return <AdminLayout title="Jobs Management">
        <div className="p-6">
          <DashboardPageHeader title="Jobs Management" description="Manage job postings and applications" breadcrumbItems={[{
          label: "Jobs",
          href: "/admin/jobs"
        }, {
          label: "All Jobs"
        }]} />
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </AdminLayout>;
  }
  return <AdminLayout title="Jobs Management">
      <div className="p-6">
        <DashboardPageHeader 
          title="Job Management" 
          description={`${jobs.length} total jobs • ${openJobs.length} active • ${closedJobs.length} closed`} 
          breadcrumbItems={[{ label: "Jobs", href: "/admin/jobs" }, { label: "All Jobs" }]} 
          actionButton={{
            label: "Add Job",
            onClick: () => navigate('/admin/jobs/edit/new'),
            variant: "default"
          }}
        />

        <div className="flex gap-6 h-[calc(100vh-200px)]">
          {/* Left Panel - Jobs List */}
          <div className="w-1/2 bg-white rounded-lg border overflow-hidden shadow-sm">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Job Listings</h3>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="all" className="text-sm">
                    All <span className="ml-1 text-xs bg-gray-200 px-1 rounded">{filteredJobs.length}</span>
                  </TabsTrigger>
                  <TabsTrigger value="open" className="text-sm">
                    Open <span className="ml-1 text-xs bg-gray-200 px-1 rounded">{openJobs.length}</span>
                  </TabsTrigger>
                  <TabsTrigger value="closed" className="text-sm">
                    Closed <span className="ml-1 text-xs bg-gray-200 px-1 rounded">{closedJobs.length}</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab}>
                  {/* Search and Filters */}
                  <div className="flex gap-4 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input placeholder="Search jobs..." className="pl-10" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                    </div>
                    <Select>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="entry">Entry Level</SelectItem>
                        <SelectItem value="mid">Mid Level</SelectItem>
                        <SelectItem value="senior">Senior Level</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Table */}
                  <div className="overflow-auto max-h-[500px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Job Details</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getTabJobs().map(job => <TableRow key={job.id} className={`cursor-pointer hover:bg-gray-50 ${selectedJob?.id === job.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`} onClick={() => handleJobSelect(job)}>
                            <TableCell className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                {job.logo_url ? <img src={job.logo_url} alt="Company logo" className="w-full h-full object-cover rounded-lg" /> : <Building className="h-5 w-5 text-white" />}
                              </div>
                              <div>
                                <div className="font-medium text-sm">{job.title}</div>
                                <div className="text-xs text-gray-500">{job.company}</div>
                                <div className="text-xs text-gray-400">{job.job_code}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={`text-xs border ${getCategoryColor(job.category)}`}>
                                {job.category}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">{job.location}</TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <Badge className={`text-xs border ${getStatusColor(job.is_open)}`}>
                                  {job.is_open ? 'Open' : 'Closed'}
                                </Badge>
                                {job.work_approach && (
                                  <Badge className={`text-xs border ${getWorkApproachColor(job.work_approach)}`}>
                                    {job.work_approach}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-gray-500">
                              {new Date(job.created_at).toLocaleDateString()}
                            </TableCell>
                          </TableRow>)}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right Panel - Job Details */}
          <div className="w-1/2 bg-white rounded-lg border overflow-hidden shadow-sm">
            {selectedJob ? <div className="p-6 h-full overflow-y-auto">
                {/* Job Header with Edit Button */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                      {selectedJob.logo_url ? <img src={selectedJob.logo_url} alt="Company logo" className="w-full h-full object-cover rounded-lg" /> : <Building className="h-8 w-8 text-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <span>{selectedJob.company}</span>
                        <span>•</span>
                        <span>{selectedJob.job_code}</span>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {selectedJob.title}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{selectedJob.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          <span>{selectedJob.category}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`border ${getStatusColor(selectedJob.is_open)}`}>
                          {selectedJob.is_open ? "Open" : "Closed"}
                        </Badge>
                        {selectedJob.work_approach && <Badge className={`border ${getWorkApproachColor(selectedJob.work_approach)}`}>{selectedJob.work_approach}</Badge>}
                      </div>
                    </div>
                  </div>
                  
                  {/* Edit Button - Blue styling */}
                  <Button 
                    onClick={() => handleEditJob(selectedJob.id)} 
                    className="flex items-center gap-2 ml-4 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                </div>

                

                {/* Job Details Grid */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Salary Range</h4>
                      <p className="text-lg font-semibold">{selectedJob.salary || "Not specified"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Experience</h4>
                      <p className="text-lg font-semibold">{selectedJob.experience}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Created</h4>
                      <p className="text-sm">{new Date(selectedJob.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-orange-600" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Updated</h4>
                      <p className="text-sm">{new Date(selectedJob.updated_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Job Description */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Job Description</h4>
                  <div className="text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{
                __html: selectedJob.description
              }} />
                </div>

                {/* Skills and Qualifications */}
                <div className="grid grid-cols-1 gap-6">
                  {selectedJob.qualifications && selectedJob.qualifications.length > 0 && <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Qualifications</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {selectedJob.qualifications.map((qual, index) => <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>{qual}</span>
                          </li>)}
                      </ul>
                    </div>}
                  
                  {selectedJob.responsibilities && selectedJob.responsibilities.length > 0 && <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Key Responsibilities</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {selectedJob.responsibilities.map((resp, index) => <li key={index} className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            <span>{resp}</span>
                          </li>)}
                      </ul>
                    </div>}

                  {selectedJob.skills && selectedJob.skills.length > 0 && <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Required Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.skills.map((skill, index) => <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>)}
                      </div>
                    </div>}
                </div>
              </div> : <div className="p-6 text-center text-gray-500">
                <Building className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p>Select a job to view details</p>
              </div>}
          </div>
        </div>
      </div>
    </AdminLayout>;
}
