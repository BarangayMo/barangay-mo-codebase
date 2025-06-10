
import { useState } from 'react';
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, Calendar, Users, Clock, ChevronLeft, Edit, Search, Star, ChevronDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Mock data
const jobData = {
  id: "RTR-082",
  title: "Housekeeping Attendant",
  company: "Royal Thai Retreats",
  location: "Phuket",
  category: "Housekeeping",
  rateAmount: "THB 200 - 600/hour",
  deadline: "10 April 2021",
  status: "Hiring",
  createdAt: "1 April 2021",
  numberOfOpening: 15,
  jobPeriod: "14 April 2021 - 14 May 2021",
  employmentType: "Part-time",
  requiredExperience: "1-2 years in housekeeping",
  description: "Royal Thai Retreats is seeking reliable and hardworking Housekeeping Attendants to join our team. Responsibilities include cleaning guest rooms, public areas, and ensuring a high level of cleanliness and guest satisfaction.",
  skills: [
    "Attention to detail",
    "Time management skills", 
    "Physical stamina"
  ],
  additionalNotes: [
    "Uniforms provided",
    "Employee discounts on hotel services"
  ],
  workingShifts: {
    morning: [true, false, true, false, false, true, true]
  }
};

const candidates = [
  {
    id: 1,
    name: "Suriyan Pimwan",
    gender: "Male",
    age: "23 Years Old",
    expectedSalary: "THB 300",
    experience: "4 Years",
    rating: 4.0,
    status: "Applied",
    avatar: "/lovable-uploads/bf986c64-ee34-427c-90ad-0512f2e7f353.png"
  },
  {
    id: 2,
    name: "Phuvanaí Suwannawong",
    gender: "Male",
    age: "20 Years Old",
    expectedSalary: "THB 200",
    experience: "2 Years",
    rating: 4.4,
    status: "Applied",
    avatar: "/lovable-uploads/c18ab531-de58-47d3-a486-6d9882bc2559.png"
  },
  {
    id: 3,
    name: "Waradet Chinawat",
    gender: "Male",
    age: "20 Years Old",
    expectedSalary: "THB 450",
    experience: "2 Years",
    rating: 4.7,
    status: "Shortlisted",
    isSuper: true,
    avatar: "/lovable-uploads/d6bf0909-f59b-42dc-8d79-b45a400a1081.png"
  },
  {
    id: 4,
    name: "Suwannee Wongsuwan",
    gender: "Female",
    age: "28 Years Old",
    expectedSalary: "THB 600",
    experience: "11 Years",
    rating: 3.9,
    status: "Applied",
    avatar: "/lovable-uploads/ed25f4d6-4f46-45de-a775-62db112f1277.png"
  },
  {
    id: 5,
    name: "Alex Somchai",
    gender: "Male", 
    age: "25 Years Old",
    expectedSalary: "THB 550",
    experience: "4 Years",
    rating: 4.8,
    status: "Applied",
    isTopTalent: true,
    avatar: "/lovable-uploads/f39411e2-71c1-4c46-8b45-5fc0f2d8eca5.png"
  },
  {
    id: 6,
    name: "Chompoonuch Chinawat",
    gender: "Female",
    age: "24 Years Old", 
    expectedSalary: "THB 300",
    experience: "3 Years",
    rating: 4.6,
    status: "Interviewed",
    avatar: "/lovable-uploads/fde1e978-0d35-49ec-9f4b-1f03b096b981.png"
  },
  {
    id: 7,
    name: "Attawut Sombun",
    gender: "Male",
    age: "21 Years Old",
    expectedSalary: "THB 350", 
    experience: "3 Years",
    rating: 3.4,
    status: "Applied",
    avatar: "/lovable-uploads/99aa953e-adc7-47d1-884a-8228b0ca6527.png"
  },
  {
    id: 8,
    name: "Sombat Jansawang",
    gender: "Female",
    age: "32 Years Old",
    expectedSalary: "THB 450",
    experience: "14 Years", 
    rating: 4.2,
    status: "Hired",
    avatar: "/lovable-uploads/85c8261a-25d6-40a1-ae7a-86c6a423f41f.png"
  }
];

const tabs = [
  { key: "all", label: "All", count: 118 },
  { key: "applied", label: "Applied", count: 78 },
  { key: "shortlisted", label: "Shortlisted", count: 23 },
  { key: "invited", label: "Invited to Interview", count: 7 },
  { key: "interviewed", label: "Interviewed", count: 8 },
  { key: "hired", label: "Hired", count: 2 }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Applied": return "bg-blue-100 text-blue-700";
    case "Shortlisted": return "bg-orange-100 text-orange-700"; 
    case "Interviewed": return "bg-purple-100 text-purple-700";
    case "Hired": return "bg-green-100 text-green-700";
    default: return "bg-gray-100 text-gray-700";
  }
};

export default function AdminJobsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && candidate.status.toLowerCase().replace(/\s+/g, '') === activeTab.replace('invited', 'invitedtointerview');
  });

  return (
    <AdminLayout title="Job Management">
      <div className="flex gap-6 h-[calc(100vh-8rem)]">
        {/* Left Panel - Job Details */}
        <div className="w-1/3 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <span className="text-sm text-gray-500">Job List / {jobData.id}</span>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-gray-500">Last update at 3 April 2021, 13:10</span>
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </div>
          </div>

          {/* Job Card with Map */}
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center">
                  <div className="text-white text-xl">✷</div>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">{jobData.company} • {jobData.id}</div>
                  <h2 className="text-xl font-semibold mb-2">{jobData.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {jobData.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {jobData.category}
                    </div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="mt-4 h-32 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-200/30 to-emerald-200/30"></div>
                <div className="absolute top-4 left-4 w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
                <div className="absolute bottom-2 right-2 text-xs text-gray-600 bg-white/80 px-2 py-1 rounded">
                  Phuket Aquarium
                </div>
              </div>

              {/* Job Details */}
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Rate Amount</div>
                    <div className="font-semibold">{jobData.rateAmount}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Deadline</div>
                    <div className="font-semibold">{jobData.deadline}</div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-700">Created at</div>
                    <div>{jobData.createdAt}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700">Status</div>
                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">{jobData.status}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-700">Job Period</div>
                    <div>{jobData.jobPeriod}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700">Number of Opening</div>
                    <div>{jobData.numberOfOpening}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-700">Employment Type</div>
                    <div>{jobData.employmentType}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700">Required Experience</div>
                    <div>{jobData.requiredExperience}</div>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="font-medium text-gray-700 mb-2">Job Description</div>
                  <p className="text-sm text-gray-600">{jobData.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="font-medium text-gray-700 mb-2">Skills / Qualifications</div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {jobData.skills.map((skill, index) => (
                        <li key={index}>• {skill}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700 mb-2">Additional Notes</div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {jobData.additionalNotes.map((note, index) => (
                        <li key={index}>• {note}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="font-medium text-gray-700 mb-3">Working Shift</div>
                  <div className="space-y-2">
                    <div className="grid grid-cols-8 gap-2 text-xs font-medium text-gray-600">
                      <div>Shift</div>
                      <div>Mon</div>
                      <div>Tue</div>
                      <div>Wed</div>
                      <div>Thu</div>
                      <div>Fri</div>
                      <div>Sat</div>
                      <div>Sun</div>
                    </div>
                    <div className="grid grid-cols-8 gap-2 items-center">
                      <div className="text-sm">Morning</div>
                      {jobData.workingShifts.morning.map((active, index) => (
                        <div key={index} className={cn(
                          "w-6 h-6 rounded-full",
                          active ? "bg-orange-500" : "bg-gray-300"
                        )} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Talent List */}
        <div className="flex-1">
          <Card className="h-full">
            <CardContent className="p-6 h-full flex flex-col">
              <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-4">Talent List</h3>
                
                {/* Tabs */}
                <div className="flex border-b mb-4">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={cn(
                        "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                        activeTab === tab.key
                          ? "border-orange-500 text-orange-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      )}
                    >
                      {tab.label} <span className="ml-1 text-xs">{tab.count}</span>
                    </button>
                  ))}
                </div>

                {/* Search and Filters */}
                <div className="flex gap-3 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="1-2">1-2 Years</SelectItem>
                      <SelectItem value="3-5">3-5 Years</SelectItem>
                      <SelectItem value="5+">5+ Years</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Expected Salary" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="200-300">THB 200-300</SelectItem>
                      <SelectItem value="300-500">THB 300-500</SelectItem>
                      <SelectItem value="500+">THB 500+</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 py-3 px-4 bg-gray-50 rounded-t-lg text-sm font-medium text-gray-600">
                  <div className="col-span-3">Name</div>
                  <div className="col-span-2">Expected salary</div>
                  <div className="col-span-2">Experience</div>
                  <div className="col-span-2">Rating</div>
                  <div className="col-span-3">Status</div>
                </div>
              </div>

              {/* Candidates List */}
              <div className="flex-1 overflow-y-auto">
                <div className="space-y-0">
                  {filteredCandidates.map((candidate) => (
                    <div key={candidate.id} className="grid grid-cols-12 gap-4 py-4 px-4 border-b hover:bg-gray-50 transition-colors">
                      <div className="col-span-3 flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={candidate.avatar} />
                          <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {candidate.name}
                            {candidate.isSuper && (
                              <Badge className="bg-green-100 text-green-700 text-xs">SUPER CANDIDATE</Badge>
                            )}
                            {candidate.isTopTalent && (
                              <Badge className="bg-green-100 text-green-700 text-xs">TOP TALENT</Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{candidate.gender} • {candidate.age}</div>
                        </div>
                      </div>
                      <div className="col-span-2 flex items-center">
                        <span className="font-medium">{candidate.expectedSalary}</span>
                      </div>
                      <div className="col-span-2 flex items-center">
                        <span>{candidate.experience}</span>
                      </div>
                      <div className="col-span-2 flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{candidate.rating}</span>
                      </div>
                      <div className="col-span-3 flex items-center">
                        <Badge className={cn("text-xs", getStatusColor(candidate.status))}>
                          {candidate.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-gray-600">
                  Showing 21 to 30 of 544 results
                </div>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm">‹</Button>
                  <Button variant="outline" size="sm">1</Button>
                  <Button variant="outline" size="sm">2</Button>
                  <Button variant="outline" size="sm">...</Button>
                  <Button variant="outline" size="sm">12</Button>
                  <Button variant="outline" size="sm">›</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
