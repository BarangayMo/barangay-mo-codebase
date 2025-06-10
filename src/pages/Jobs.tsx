
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Calendar, Clock, Search, Filter } from "lucide-react";
import { Layout } from "@/components/layout/Layout";

// Mock job data
const jobs = [
  {
    id: "1",
    title: "Community Health Worker",
    company: "Barangay Health Center",
    location: "Barangay San Antonio",
    type: "Full-time",
    salary: "₱15,000 - ₱20,000",
    posted: "2 days ago",
    deadline: "Dec 31, 2024",
    description: "Seeking a dedicated Community Health Worker to provide basic health services and health education to residents.",
    requirements: ["High school diploma", "Basic health training", "Good communication skills"],
    category: "Healthcare"
  },
  {
    id: "2",
    title: "Waste Management Coordinator",
    company: "Barangay Environmental Office",
    location: "Barangay Central",
    type: "Part-time",
    salary: "₱12,000 - ₱15,000",
    posted: "1 week ago",
    deadline: "Jan 15, 2025",
    description: "Coordinate waste collection schedules and implement recycling programs in the community.",
    requirements: ["Environmental awareness", "Organizational skills", "Vehicle license preferred"],
    category: "Environment"
  },
  {
    id: "3",
    title: "Youth Program Facilitator",
    company: "Barangay Youth Development",
    location: "Barangay Nueva Vista",
    type: "Contract",
    salary: "₱18,000 - ₱25,000",
    posted: "3 days ago",
    deadline: "Dec 20, 2024",
    description: "Lead youth development programs, sports activities, and educational workshops.",
    requirements: ["Bachelor's degree", "Youth work experience", "Leadership skills"],
    category: "Education"
  },
  {
    id: "4",
    title: "Security Guard",
    company: "Barangay Security Office",
    location: "Barangay Riverside",
    type: "Full-time",
    salary: "₱13,000 - ₱16,000",
    posted: "5 days ago",
    deadline: "Jan 10, 2025",
    description: "Provide security services for barangay facilities and events.",
    requirements: ["Security license", "Physical fitness", "Clean police clearance"],
    category: "Security"
  }
];

const categories = ["All", "Healthcare", "Environment", "Education", "Security", "Administration"];
const jobTypes = ["All", "Full-time", "Part-time", "Contract"];

export default function Jobs() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || job.category === selectedCategory;
    const matchesType = selectedType === "All" || job.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const handleJobClick = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Opportunities</h1>
          <p className="text-gray-600">Find employment opportunities in your barangay</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4 md:space-y-0 md:flex md:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Job Type" />
            </SelectTrigger>
            <SelectContent>
              {jobTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {filteredJobs.length} of {jobs.length} jobs
          </p>
        </div>

        {/* Job listings */}
        <div className="grid gap-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleJobClick(job.id)}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <CardDescription className="text-lg font-medium text-gray-700">
                      {job.company}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="ml-4">
                    {job.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600 line-clamp-2">{job.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {job.type}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Posted {job.posted}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div>
                      <p className="font-semibold text-green-600">{job.salary}</p>
                      <p className="text-sm text-gray-500">Deadline: {job.deadline}</p>
                    </div>
                    <Button onClick={(e) => {
                      e.stopPropagation();
                      handleJobClick(job.id);
                    }}>
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No jobs found matching your criteria.</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
                setSelectedType("All");
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
