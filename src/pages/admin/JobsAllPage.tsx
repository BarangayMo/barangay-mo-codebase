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
import { MapPin, Building, Search, Star, Edit, Briefcase } from "lucide-react";
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

  // Mock talent data for demonstration - this would come from a job_applications table in real implementation
  const mockTalents = [
    {
      id: 1,
      name: "Suriyan Pinwan",
      age: 23,
      gender: "Male",
      expectedSalary: "THB 300/hour",
      experience: "4 Years",
      rating: 4.0,
      status: "Applied",
      job_id: null
    },
    {
      id: 2,
      name: "Phuvanat Suwannawong",
      age: 20,
      gender: "Male", 
      expectedSalary: "THB 200/hour",
      experience: "2 Years",
      rating: 4.4,
      status: "Applied",
      job_id: null
    },
    {
      id: 3,
      name: "Waradet Chinawat",
      age: 20,
      gender: "Male",
      expectedSalary: "THB 450/hour", 
      experience: "2 Years",
      rating: 4.7,
      status: "Shortlisted",
      badge: "SUPER CANDIDATE",
      job_id: null
    },
    {
      id: 4,
      name: "Suwannee Wongsuwan",
      age: 28,
      gender: "Female",
      expectedSalary: "THB 600/hour",
      experience: "11 Years", 
      rating: 3.9,
      status: "Applied",
      job_id: null
    },
    {
      id: 5,
      name: "Alex Somchai",
      age: 25,
      gender: "Male",
      expectedSalary: "THB 550/hour",
      experience: "4 Years",
      rating: 4.8,
      status: "Applied",
      badge: "TOP TALENT",
      job_id: null
    }
  ];

  // Fetch jobs from Supabase
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
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
  }, [toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Applied": return "bg-blue-100 text-blue-800";
      case "Shortlisted": return "bg-yellow-100 text-yellow-800";
      case "Interviewed": return "bg-purple-100 text-purple-800";
      case "Hired": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "SUPER CANDIDATE": return "bg-orange-100 text-orange-800";
      case "TOP TALENT": return "bg-green-100 text-green-800";
      default: return "bg-blue-100 text-blue-800";
    }
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
          title="Job Management"
          description={`${jobs.length} total jobs • ${jobs.filter(j => j.is_open).length} active`}
          breadcrumbItems={[
            { label: "Jobs", href: "/admin/jobs" },
            { label: "All Jobs" }
          ]}
        />

        <div className="flex gap-6 h-[calc(100vh-200px)]">
          {/* Left Panel - Talent List */}
          <div className="w-1/2 bg-white rounded-lg border overflow-hidden shadow-sm">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Talent Applications</h3>

              {/* Tabs */}
              <Tabs defaultValue="all" className="mb-4">
                <TabsList className="grid w-full grid-cols-6 mb-4">
                  <TabsTrigger value="all" className="text-xs">All <span className="ml-1 text-xs bg-gray-200 px-1 rounded">118</span></TabsTrigger>
                  <TabsTrigger value="applied" className="text-xs">Applied <span className="ml-1 text-xs bg-gray-200 px-1 rounded">78</span></TabsTrigger>
                  <TabsTrigger value="shortlisted" className="text-xs">Shortlisted <span className="ml-1 text-xs bg-gray-200 px-1 rounded">23</span></TabsTrigger>
                  <TabsTrigger value="interview" className="text-xs">Interview <span className="ml-1 text-xs bg-gray-200 px-1 rounded">7</span></TabsTrigger>
                  <TabsTrigger value="interviewed" className="text-xs">Interviewed <span className="ml-1 text-xs bg-gray-200 px-1 rounded">8</span></TabsTrigger>
                  <TabsTrigger value="hired" className="text-xs">Hired <span className="ml-1 text-xs bg-gray-200 px-1 rounded">2</span></TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  {/* Search and Filters */}
                  <div className="flex gap-4 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input 
                        placeholder="Search applications..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="0-2">0-2 years</SelectItem>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="5+">5+ years</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Expected Salary" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="0-300">THB 0-300</SelectItem>
                        <SelectItem value="300-500">THB 300-500</SelectItem>
                        <SelectItem value="500+">THB 500+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Table */}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Applicant</TableHead>
                        <TableHead>Expected Salary</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockTalents.map((talent) => (
                        <TableRow key={talent.id} className="cursor-pointer hover:bg-gray-50">
                          <TableCell className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`https://ui-avatars.com/api/?name=${talent.name}&background=random`} />
                              <AvatarFallback>{talent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm flex items-center gap-2">
                                {talent.name}
                                {talent.badge && (
                                  <Badge className={`text-xs ${getBadgeColor(talent.badge)}`}>
                                    {talent.badge}
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                {talent.gender} • {talent.age} Years Old
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{talent.expectedSalary}</TableCell>
                          <TableCell className="text-sm">{talent.experience}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">{talent.rating}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`text-xs ${getStatusColor(talent.status)}`}>
                              {talent.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
                
                {/* Other tab contents would show filtered results */}
                {["applied", "shortlisted", "interview", "interviewed", "hired"].map((tab) => (
                  <TabsContent key={tab} value={tab}>
                    <div className="text-center py-8 text-gray-500">
                      {tab.charAt(0).toUpperCase() + tab.slice(1)} candidates will be shown here
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>

          {/* Right Panel - Job Details */}
          <div className="w-1/2 bg-white rounded-lg border overflow-hidden shadow-sm">
            {selectedJob ? (
              <div className="p-6 h-full overflow-y-auto">
                {/* Job Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                    {selectedJob.logo_url ? (
                      <img src={selectedJob.logo_url} alt="Company logo" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Briefcase className="h-8 w-8 text-white" />
                    )}
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
                      <Badge variant={selectedJob.is_open ? "default" : "secondary"}>
                        {selectedJob.is_open ? "Open" : "Closed"}
                      </Badge>
                      {selectedJob.work_approach && (
                        <Badge variant="outline">{selectedJob.work_approach}</Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Edit Button */}
                <div className="mb-6">
                  <Button 
                    onClick={() => handleEditJob(selectedJob.id)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Job
                  </Button>
                </div>

                {/* Map */}
                {selectedJob.location && (
                  <div className="mb-6">
                    <JobMap location={selectedJob.location} />
                  </div>
                )}

                {/* Job Details Grid */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Salary Range</h4>
                    <p className="text-lg font-semibold">{selectedJob.salary || "Not specified"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Experience</h4>
                    <p className="text-lg font-semibold">{selectedJob.experience}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Created</h4>
                    <p className="text-sm">{new Date(selectedJob.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Updated</h4>
                    <p className="text-sm">{new Date(selectedJob.updated_at).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Job Description */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Job Description</h4>
                  <div 
                    className="text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: selectedJob.description }}
                  />
                </div>

                {/* Skills and Qualifications */}
                <div className="grid grid-cols-1 gap-6">
                  {selectedJob.qualifications && selectedJob.qualifications.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Qualifications</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {selectedJob.qualifications.map((qual, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>{qual}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {selectedJob.responsibilities && selectedJob.responsibilities.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Key Responsibilities</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {selectedJob.responsibilities.map((resp, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedJob.skills && selectedJob.skills.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Required Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p>Select a job to view details</p>
              </div>
            )}
          </div>
        </div>

        {/* Jobs Selection List */}
        <div className="mt-6 bg-white rounded-lg border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">All Jobs</h3>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search jobs..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredJobs.map((job) => (
              <div 
                key={job.id}
                onClick={() => handleJobSelect(job)}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedJob?.id === job.id ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    {job.logo_url ? (
                      <img src={job.logo_url} alt="Company logo" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Briefcase className="h-5 w-5 text-white" />
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
                  <span className="text-xs text-gray-500">{job.job_code}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
