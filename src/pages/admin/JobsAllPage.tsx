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
import { MapPin, Building, Calendar, Clock, Users, Search, MoreHorizontal, Star, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function JobsAllPage() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
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
      expectedSalary: "THB 300",
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
      expectedSalary: "THB 200",
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
      expectedSalary: "THB 450", 
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
      expectedSalary: "THB 600",
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
      expectedSalary: "THB 550",
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

  const getStatusColor = (status) => {
    switch (status) {
      case "Applied": return "bg-blue-100 text-blue-800";
      case "Shortlisted": return "bg-yellow-100 text-yellow-800";
      case "Interviewed": return "bg-purple-100 text-purple-800";
      case "Hired": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case "SUPER CANDIDATE": return "bg-orange-100 text-orange-800";
      case "TOP TALENT": return "bg-green-100 text-green-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  const handleJobSelect = (job) => {
    setSelectedJob(job);
  };

  const handleEditJob = (jobId) => {
    navigate(`/admin/jobs/edit/${jobId}`);
  };

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
          description="RTR-082"
          breadcrumbItems={[
            { label: "Jobs", href: "/admin/jobs" },
            { label: "All Jobs" }
          ]}
          actionButton={{
            label: "Edit",
            onClick: () => selectedJob && handleEditJob(selectedJob.id),
            icon: <Edit className="h-4 w-4" />
          }}
        />

        <div className="flex gap-6 h-[calc(100vh-200px)]">
          {/* Left Panel - Talent List */}
          <div className="w-1/2 bg-white rounded-lg border overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Talent List</h3>

              {/* Tabs */}
              <Tabs defaultValue="all" className="mb-4">
                <TabsList className="grid w-full grid-cols-6 mb-4">
                  <TabsTrigger value="all" className="text-xs">All <span className="ml-1 text-xs bg-gray-200 px-1 rounded">118</span></TabsTrigger>
                  <TabsTrigger value="applied" className="text-xs">Applied <span className="ml-1 text-xs bg-gray-200 px-1 rounded">78</span></TabsTrigger>
                  <TabsTrigger value="shortlisted" className="text-xs">Shortlisted <span className="ml-1 text-xs bg-gray-200 px-1 rounded">23</span></TabsTrigger>
                  <TabsTrigger value="interview" className="text-xs">Invited to Interview <span className="ml-1 text-xs bg-gray-200 px-1 rounded">7</span></TabsTrigger>
                  <TabsTrigger value="interviewed" className="text-xs">Interviewed <span className="ml-1 text-xs bg-gray-200 px-1 rounded">8</span></TabsTrigger>
                  <TabsTrigger value="hired" className="text-xs">Hired</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  {/* Search and Filters */}
                  <div className="flex gap-4 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input 
                        placeholder="Search"
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
                    <Button variant="outline" size="sm">
                      More Filters
                    </Button>
                  </div>

                  {/* Table */}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
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
                
                {/* Other tab contents */}
                <TabsContent value="applied">
                  <div className="text-center py-8 text-gray-500">Applied candidates will be shown here</div>
                </TabsContent>
                <TabsContent value="shortlisted">
                  <div className="text-center py-8 text-gray-500">Shortlisted candidates will be shown here</div>
                </TabsContent>
                <TabsContent value="interview">
                  <div className="text-center py-8 text-gray-500">Interview invites will be shown here</div>
                </TabsContent>
                <TabsContent value="interviewed">
                  <div className="text-center py-8 text-gray-500">Interviewed candidates will be shown here</div>
                </TabsContent>
                <TabsContent value="hired">
                  <div className="text-center py-8 text-gray-500">Hired candidates will be shown here</div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right Panel - Job Details */}
          <div className="w-1/2 bg-white rounded-lg border overflow-hidden">
            {selectedJob ? (
              <div className="p-6">
                {/* Job Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center">
                    <Building className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <span>{selectedJob.company}</span>
                      <span>•</span>
                      <span>RTR-082</span>
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
                    </div>
                  </div>
                </div>

                {/* Map Area with simple map effect */}
                <div className="mb-6 h-48 bg-gradient-to-br from-blue-100 via-blue-50 to-green-50 rounded-lg relative overflow-hidden border">
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-4 left-4 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <div className="absolute top-8 right-8 w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="absolute bottom-6 left-12 w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="absolute bottom-4 right-6 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <MapPin className="h-4 w-4 text-red-500" />
                        <span>{selectedJob.location}</span>
                      </div>
                    </div>
                  </div>
                  {/* Grid lines for map effect */}
                  <div className="absolute inset-0 opacity-10">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="absolute inset-0" style={{
                        borderLeft: i % 2 === 0 ? '1px solid #ccc' : 'none',
                        borderTop: i % 3 === 0 ? '1px solid #ccc' : 'none',
                        left: `${i * 10}%`,
                        top: `${i * 8}%`
                      }}></div>
                    ))}
                  </div>
                </div>

                {/* Job Details Grid */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Rate Amount</h4>
                    <p className="text-lg font-semibold">{selectedJob.salary || "THB 200 - 600/hour"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Deadline</h4>
                    <p className="text-lg font-semibold">10 April 2021</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Created at</h4>
                    <p className="text-sm">{new Date(selectedJob.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
                    <Badge className="bg-orange-100 text-orange-800">Hiring</Badge>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Employment Type</h4>
                    <p className="text-sm">{selectedJob.work_approach || "Part-time"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Required Experience</h4>
                    <p className="text-sm">{selectedJob.experience}</p>
                  </div>
                </div>

                {/* Job Description */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Job Description</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {selectedJob.description}
                  </p>
                </div>

                {/* Skills and Additional Notes */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Skills / Qualifications</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {selectedJob.qualifications?.map((qual, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-orange-500 mt-1">•</span>
                          <span>{qual}</span>
                        </li>
                      )) || (
                        <>
                          <li className="flex items-start gap-2">
                            <span className="text-orange-500 mt-1">•</span>
                            <span>Attention to detail</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-orange-500 mt-1">•</span>
                            <span>Time management skills</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-orange-500 mt-1">•</span>
                            <span>Physical stamina</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Additional Notes</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-1">•</span>
                        <span>Uniforms provided</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-1">•</span>
                        <span>Employee discounts on hotel services</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="mt-6 flex gap-3">
                  <Button 
                    onClick={() => handleEditJob(selectedJob.id)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Job
                  </Button>
                  <Button variant="outline">
                    View Applications
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                Select a talent to view job details
              </div>
            )}
          </div>
        </div>

        {/* Jobs List for Selection */}
        <div className="mt-6 bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Available Jobs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <div 
                key={job.id}
                onClick={() => handleJobSelect(job)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedJob?.id === job.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h4 className="font-medium text-sm">{job.title}</h4>
                <p className="text-xs text-gray-500">{job.company}</p>
                <p className="text-xs text-gray-400">{job.location}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
