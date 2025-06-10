
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
import { MapPin, Building, Calendar, Clock, Users, Search, Star, Edit, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { LocationMap } from "@/components/ui/location-map";

interface JobApplication {
  id: string;
  applicant_name: string;
  applicant_email: string;
  age: number;
  gender: string;
  experience_years: number;
  expected_salary: string;
  rating: number;
  status: string;
  job_id: string;
  application_date: string;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  category: string;
  description: string;
  salary?: string;
  work_approach?: string;
  experience: string;
  responsibilities?: string[];
  qualifications?: string[];
  is_open: boolean;
  created_at: string;
  updated_at: string;
  job_code?: string;
  logo_url?: string;
}

export default function JobsAllPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [salaryFilter, setSalaryFilter] = useState("all");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch jobs and applications from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch jobs
        const { data: jobsData, error: jobsError } = await supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (jobsError) throw jobsError;
        
        // Fetch applications
        const { data: applicationsData, error: applicationsError } = await supabase
          .from('job_applications')
          .select('*')
          .order('application_date', { ascending: false });
          
        if (applicationsError) throw applicationsError;
        
        setJobs(jobsData || []);
        setApplications(applicationsData || []);
        
        if (jobsData && jobsData.length > 0) {
          setSelectedJob(jobsData[0]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Failed to fetch data",
          description: "Please try refreshing the page",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied": return "bg-blue-100 text-blue-800 border-blue-200";
      case "shortlisted": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "interviewed": return "bg-purple-100 text-purple-800 border-purple-200";
      case "hired": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "SUPER CANDIDATE": return "bg-orange-100 text-orange-800 border-orange-200";
      case "TOP TALENT": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
  };

  const handleEditJob = (jobId: string) => {
    navigate(`/admin/jobs/edit/${jobId}`);
  };

  const getFilteredApplications = () => {
    return applications.filter(app => {
      const matchesTab = activeTab === "all" || app.status === activeTab;
      const matchesSearch = searchQuery === "" || 
        app.applicant_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesExperience = experienceFilter === "all" || 
        (experienceFilter === "0-2" && app.experience_years <= 2) ||
        (experienceFilter === "3-5" && app.experience_years >= 3 && app.experience_years <= 5) ||
        (experienceFilter === "5+" && app.experience_years > 5);
      
      return matchesTab && matchesSearch && matchesExperience;
    });
  };

  const getTabCounts = () => {
    return {
      all: applications.length,
      applied: applications.filter(app => app.status === "applied").length,
      shortlisted: applications.filter(app => app.status === "shortlisted").length,
      interviewed: applications.filter(app => app.status === "interviewed").length,
      hired: applications.filter(app => app.status === "hired").length,
    };
  };

  const tabCounts = getTabCounts();
  const filteredApplications = getFilteredApplications();

  if (loading) {
    return (
      <AdminLayout title="Jobs Management">
        <div className="p-6">
          <DashboardPageHeader
            title="Jobs Management"
            description="Manage job postings and applications"
            breadcrumbItems={[
              { label: "Jobs", href: "/admin/jobs" },
              { label: "All Jobs" }
            ]}
          />
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Jobs Management">
      <div className="p-6">
        <DashboardPageHeader
          title="Job List"
          description={selectedJob?.job_code || "Select a job to view details"}
          breadcrumbItems={[
            { label: "Jobs", href: "/admin/jobs" },
            { label: "All Jobs" }
          ]}
        />

        <div className="flex gap-6 h-[calc(100vh-200px)]">
          {/* Left Panel - Talent List */}
          <div className="w-1/2 bg-white rounded-xl border-2 overflow-hidden shadow-sm">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Talent Applications
              </h3>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
                <TabsList className="grid w-full grid-cols-5 mb-4 h-12">
                  <TabsTrigger value="all" className="text-xs">
                    All <Badge variant="secondary" className="ml-1 text-xs">{tabCounts.all}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="applied" className="text-xs">
                    Applied <Badge variant="secondary" className="ml-1 text-xs">{tabCounts.applied}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="shortlisted" className="text-xs">
                    Shortlisted <Badge variant="secondary" className="ml-1 text-xs">{tabCounts.shortlisted}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="interviewed" className="text-xs">
                    Interviewed <Badge variant="secondary" className="ml-1 text-xs">{tabCounts.interviewed}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="hired" className="text-xs">
                    Hired <Badge variant="secondary" className="ml-1 text-xs">{tabCounts.hired}</Badge>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab}>
                  {/* Search and Filters */}
                  <div className="flex gap-3 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input 
                        placeholder="Search applicants..."
                        className="pl-10 h-12"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                      <SelectTrigger className="w-36 h-12">
                        <SelectValue placeholder="Experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Experience</SelectItem>
                        <SelectItem value="0-2">0-2 years</SelectItem>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="5+">5+ years</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={salaryFilter} onValueChange={setSalaryFilter}>
                      <SelectTrigger className="w-40 h-12">
                        <SelectValue placeholder="Expected Salary" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Salaries</SelectItem>
                        <SelectItem value="0-300">THB 0-300</SelectItem>
                        <SelectItem value="300-500">THB 300-500</SelectItem>
                        <SelectItem value="500+">THB 500+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Applications Table */}
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead className="font-semibold">Applicant</TableHead>
                          <TableHead className="font-semibold">Expected Salary</TableHead>
                          <TableHead className="font-semibold">Experience</TableHead>
                          <TableHead className="font-semibold">Rating</TableHead>
                          <TableHead className="font-semibold">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredApplications.map((application) => (
                          <TableRow key={application.id} className="cursor-pointer hover:bg-gray-50">
                            <TableCell className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={`https://ui-avatars.com/api/?name=${application.applicant_name}&background=random`} />
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                  {application.applicant_name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-sm">
                                  {application.applicant_name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {application.gender} • {application.age} Years Old
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm font-medium">{application.expected_salary}</TableCell>
                            <TableCell className="text-sm">{application.experience_years} years</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">{application.rating.toFixed(1)}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={`text-xs ${getStatusColor(application.status)}`}>
                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredApplications.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                              No applications found matching your criteria
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right Panel - Job Details */}
          <div className="w-1/2 bg-white rounded-xl border-2 overflow-hidden shadow-sm">
            {selectedJob ? (
              <div className="p-6">
                {/* Job Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    {selectedJob.logo_url ? (
                      <img src={selectedJob.logo_url} alt="Company logo" className="w-full h-full rounded-xl object-cover" />
                    ) : (
                      <Building className="h-8 w-8 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <span className="font-medium">{selectedJob.company}</span>
                      <span>•</span>
                      <Badge variant="secondary" className="font-mono">
                        {selectedJob.job_code}
                      </Badge>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedJob.title}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{selectedJob.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        <span>{selectedJob.category}</span>
                      </div>
                      <Badge className={selectedJob.is_open ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {selectedJob.is_open ? "Open" : "Closed"}
                      </Badge>
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleEditJob(selectedJob.id)}
                    className="shrink-0"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Job
                  </Button>
                </div>

                {/* Enhanced Map */}
                <div className="mb-6">
                  <LocationMap location={selectedJob.location} className="h-48" />
                </div>

                {/* Job Details Grid */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Salary Range</h4>
                    <p className="text-lg font-semibold">{selectedJob.salary || "Not specified"}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Work Type</h4>
                    <p className="text-lg font-semibold">{selectedJob.work_approach || "Not specified"}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Experience Required</h4>
                    <p className="text-sm">{selectedJob.experience}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Applications</h4>
                    <p className="text-lg font-semibold">
                      {applications.filter(app => app.job_id === selectedJob.id).length}
                    </p>
                  </div>
                </div>

                {/* Job Description */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Job Description</h4>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {selectedJob.description}
                    </p>
                  </div>
                </div>

                {/* Requirements and Responsibilities */}
                <div className="grid grid-cols-1 gap-6">
                  {selectedJob.qualifications && selectedJob.qualifications.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-3">Requirements</h4>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <ul className="text-sm text-gray-700 space-y-2">
                          {selectedJob.qualifications.map((qual, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                              <span>{qual}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {selectedJob.responsibilities && selectedJob.responsibilities.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-3">Key Responsibilities</h4>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <ul className="text-sm text-gray-700 space-y-2">
                          {selectedJob.responsibilities.map((resp, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 shrink-0"></div>
                              <span>{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500 h-full flex items-center justify-center">
                <div>
                  <Eye className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-lg font-medium">Select a job to view details</p>
                  <p className="text-sm">Choose a job from the list below to see full information</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Jobs List for Selection */}
        <div className="mt-6 bg-white rounded-xl border-2 p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Building className="h-5 w-5 text-blue-600" />
            Available Jobs ({jobs.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {jobs.map((job) => (
              <div 
                key={job.id}
                onClick={() => handleJobSelect(job)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedJob?.id === job.id 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
                    {job.logo_url ? (
                      <img src={job.logo_url} alt="Logo" className="w-full h-full rounded-lg object-cover" />
                    ) : (
                      <Building className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{job.title}</h4>
                    <p className="text-xs text-gray-500 truncate">{job.company}</p>
                    <p className="text-xs text-gray-400 truncate">{job.location}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant={job.is_open ? "default" : "secondary"} className="text-xs">
                    {job.is_open ? "Open" : "Closed"}
                  </Badge>
                  <span className="text-xs text-gray-500 font-mono">
                    {job.job_code}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
