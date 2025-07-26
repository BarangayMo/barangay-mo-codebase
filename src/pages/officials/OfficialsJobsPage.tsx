import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MapPin, Building, Search, Edit, Briefcase, Calendar, DollarSign, Users, Plus, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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

export default function OfficialJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch jobs posted by the current user only
  useEffect(() => {
    const fetchJobs = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('created_by', user.id) // Only jobs posted by this user
          .order('created_at', { ascending: false });
          
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
  }, [user, toast]);

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

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    job.company.toLowerCase().includes(searchQuery.toLowerCase()) || 
    job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/official-dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Job Management</h1>
            <p className="text-gray-500 mt-2">Manage job postings and applications</p>
          </div>
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/official-dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Dashboard</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Job Management</h1>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              {jobs.length} total jobs • {openJobs.length} active • {closedJobs.length} closed
            </p>
          </div>
          <Button
            onClick={() => navigate('/admin/jobs/edit/new')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            <span className="sm:hidden">Add New Job</span>
            <span className="hidden sm:inline">Add Job</span>
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 min-h-[600px]">
          {/* Left Panel - Jobs List */}
          <div className="w-full lg:w-1/2 bg-white rounded-lg border overflow-hidden shadow-sm">
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold mb-4">Job Listings</h3>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="all" className="text-xs sm:text-sm">
                    All <span className="ml-1 text-xs bg-gray-200 px-1 rounded">{filteredJobs.length}</span>
                  </TabsTrigger>
                  <TabsTrigger value="open" className="text-xs sm:text-sm">
                    Open <span className="ml-1 text-xs bg-gray-200 px-1 rounded">{openJobs.length}</span>
                  </TabsTrigger>
                  <TabsTrigger value="closed" className="text-xs sm:text-sm">
                    Closed <span className="ml-1 text-xs bg-gray-200 px-1 rounded">{closedJobs.length}</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab}>
                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input 
                        placeholder="Search jobs..." 
                        className="pl-10 text-sm" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2 sm:gap-4">
                      <Select>
                        <SelectTrigger className="w-full sm:w-32">
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
                        <SelectTrigger className="w-full sm:w-40">
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
                  </div>

                  {/* Table/List */}
                  <div className="overflow-auto max-h-[400px] lg:max-h-[500px]">
                    {getTabJobs().length === 0 ? (
                      <div className="text-center py-8 sm:py-12">
                        <Briefcase className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                        <h3 className="mt-4 text-base sm:text-lg font-medium text-gray-900">No jobs posted yet</h3>
                        <p className="mt-2 text-sm sm:text-base text-gray-500 mb-4">Start by posting your first job</p>
                        <Button onClick={() => navigate('/admin/jobs/edit/new')} className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="mr-2 h-4 w-4" />
                          Post a Job
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="block sm:hidden space-y-3">
                          {/* Mobile Card View */}
                          {getTabJobs().map(job => (
                            <div 
                              key={job.id} 
                              className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${selectedJob?.id === job.id ? 'bg-blue-50 border-blue-500' : ''}`}
                              onClick={() => handleJobSelect(job)}
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                  {job.logo_url ? (
                                    <img src={job.logo_url} alt="Company logo" className="w-full h-full object-cover rounded-lg" />
                                  ) : (
                                    <Building className="h-6 w-6 text-white" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm truncate">{job.title}</div>
                                  <div className="text-xs text-gray-500 truncate">{job.company}</div>
                                  <div className="text-xs text-gray-400">{job.job_code}</div>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    <Badge className={`text-xs border ${getStatusColor(job.is_open)}`}>
                                      {job.is_open ? 'Open' : 'Closed'}
                                    </Badge>
                                    <Badge className={`text-xs border ${getCategoryColor(job.category)}`}>
                                      {job.category}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="hidden sm:block">
                          {/* Desktop Table View */}
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Job Details</TableHead>
                                <TableHead className="hidden lg:table-cell">Category</TableHead>
                                <TableHead className="hidden md:table-cell">Location</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="hidden lg:table-cell">Created</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {getTabJobs().map(job => (
                                <TableRow 
                                  key={job.id} 
                                  className={`cursor-pointer hover:bg-gray-50 ${selectedJob?.id === job.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                                  onClick={() => handleJobSelect(job)}
                                >
                                  <TableCell className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                      {job.logo_url ? (
                                        <img src={job.logo_url} alt="Company logo" className="w-full h-full object-cover rounded-lg" />
                                      ) : (
                                        <Building className="h-5 w-5 text-white" />
                                      )}
                                    </div>
                                    <div className="min-w-0">
                                      <div className="font-medium text-sm truncate">{job.title}</div>
                                      <div className="text-xs text-gray-500 truncate">{job.company}</div>
                                      <div className="text-xs text-gray-400">{job.job_code}</div>
                                    </div>
                                  </TableCell>
                                  <TableCell className="hidden lg:table-cell">
                                    <Badge className={`text-xs border ${getCategoryColor(job.category)}`}>
                                      {job.category}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="hidden md:table-cell text-sm">{job.location}</TableCell>
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
                                  <TableCell className="hidden lg:table-cell text-sm text-gray-500">
                                    {new Date(job.created_at).toLocaleDateString()}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right Panel - Job Details */}
          <div className="w-full lg:w-1/2 bg-white rounded-lg border overflow-hidden shadow-sm">
            {selectedJob ? (
              <div className="p-4 sm:p-6 h-full overflow-y-auto">
                {/* Job Header with Edit Button */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                      {selectedJob.logo_url ? (
                        <img src={selectedJob.logo_url} alt="Company logo" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Building className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-1">
                        <span className="truncate">{selectedJob.company}</span>
                        <span>•</span>
                        <span>{selectedJob.job_code}</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 break-words">
                        {selectedJob.title}
                      </h2>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{selectedJob.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Building className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{selectedJob.category}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className={`border text-xs ${getStatusColor(selectedJob.is_open)}`}>
                          {selectedJob.is_open ? "Open" : "Closed"}
                        </Badge>
                        {selectedJob.work_approach && (
                          <Badge className={`border text-xs ${getWorkApproachColor(selectedJob.work_approach)}`}>
                            {selectedJob.work_approach}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Edit Button */}
                  <Button 
                    onClick={() => handleEditJob(selectedJob.id)} 
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                </div>

                {/* Map */}
                {selectedJob.location && (
                  <div className="mb-6">
                    <div className="h-48 sm:h-64">
                      <JobMap location={selectedJob.location} />
                    </div>
                  </div>
                )}

                {/* Job Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <DollarSign className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium text-gray-500">Salary Range</h4>
                      <p className="text-base sm:text-lg font-semibold truncate">{selectedJob.salary || "Not specified"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium text-gray-500">Experience</h4>
                      <p className="text-base sm:text-lg font-semibold truncate">{selectedJob.experience}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-purple-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium text-gray-500">Created</h4>
                      <p className="text-base sm:text-lg font-semibold">{new Date(selectedJob.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Briefcase className="h-5 w-5 text-orange-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium text-gray-500">Type</h4>
                      <p className="text-base sm:text-lg font-semibold truncate">{selectedJob.work_approach || "Not specified"}</p>
                    </div>
                  </div>
                </div>

                {/* Job Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Job Description</h3>
                  <div className="prose prose-sm max-w-none text-gray-700 break-words">
                    <div dangerouslySetInnerHTML={{ __html: selectedJob.description }} />
                  </div>
                </div>

                {/* Responsibilities */}
                {selectedJob.responsibilities && selectedJob.responsibilities.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Key Responsibilities</h3>
                    <ul className="space-y-2">
                      {selectedJob.responsibilities.map((responsibility, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span className="break-words">{responsibility}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Qualifications */}
                {selectedJob.qualifications && selectedJob.qualifications.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Required Qualifications</h3>
                    <ul className="space-y-2">
                      {selectedJob.qualifications.map((qualification, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span className="break-words">{qualification}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Skills */}
                {selectedJob.skills && selectedJob.skills.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-8">
                <div className="text-center">
                  <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a job to view details</h3>
                  <p className="text-gray-500">Choose a job from the list to see its full details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
