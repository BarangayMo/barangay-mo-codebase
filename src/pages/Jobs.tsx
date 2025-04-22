
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Clock, ChevronDown, Plus, Filter, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
  DrawerClose
} from "@/components/ui/drawer";

const sortOptions = [
  { label: "Most Recent", value: "recent" },
  { label: "Highest Paid", value: "salary-high" },
  { label: "Lowest Paid", value: "salary-low" },
];

const jobs = [
  {
    id: 1,
    title: "Administrative Assistant",
    company: "XYZ Corporation",
    location: "Barangay 2, Makati City",
    salary: "₱18,000 - ₱22,000 per month",
    type: "Full-time",
    posted: "Posted 2 days ago",
    description: "We are looking for an Administrative Assistant to join our team. The ideal candidate will be responsible for handling office tasks, filing documents, answering phones, and providing support to the management team.",
    requirements: [
      "At least high school graduate, college degree preferred",
      "Proficient in MS Office applications",
      "Excellent organizational skills"
    ],
    image: "/lovable-uploads/3dcb24b2-de0f-453d-b088-ff9643f1ebbc.png"
  },
  {
    id: 2,
    title: "Customer Service Representative",
    company: "ABC Company",
    location: "Barangay 5, Quezon City",
    salary: "₱15,000 - ₱20,000 per month",
    type: "Full-time",
    posted: "Posted 5 days ago",
    description: "We are hiring a Customer Service Representative to provide excellent customer service and support. Responsibilities include answering inquiries, resolving complaints, and processing orders.",
    requirements: [
      "High school diploma or equivalent",
      "Excellent communication skills",
      "Ability to multitask and prioritize"
    ],
    image: "/lovable-uploads/7a5fdb55-e1bf-49fb-956a-2ac513bdbcd5.png"
  },
  {
    id: 3,
    title: "Data Entry Clerk",
    company: "123 Data Solutions",
    location: "Barangay 10, Pasig City",
    salary: "₱16,000 - ₱19,000 per month",
    type: "Part-time",
    posted: "Posted 1 week ago",
    description: "We need a Data Entry Clerk to accurately input and maintain data in our systems. The ideal candidate will have strong attention to detail and proficiency in data entry software.",
    requirements: [
      "High school diploma or equivalent",
      "Proficient in data entry",
      "Strong attention to detail"
    ],
    image: "/lovable-uploads/bf986c64-ee34-427c-90ad-0512f2e7f353.png"
  },
  {
    id: 4,
    title: "Delivery Driver",
    company: "Fast Delivery Services",
    location: "Barangay 15, Mandaluyong City",
    salary: "₱17,000 - ₱21,000 per month",
    type: "Full-time",
    posted: "Posted 2 weeks ago",
    description: "We are seeking a Delivery Driver to safely and efficiently deliver packages to our customers. The ideal candidate will have a valid driver's license and a clean driving record.",
    requirements: [
      "Valid driver's license",
      "Clean driving record",
      "Ability to lift heavy packages"
    ],
    image: "/lovable-uploads/3dcb24b2-de0f-453d-b088-ff9643f1ebbc.png"
  },
  {
    id: 5,
    title: "Sales Associate",
    company: "Retail Emporium",
    location: "Barangay 3, Taguig City",
    salary: "₱15,000 - ₱18,000 per month",
    type: "Part-time",
    posted: "Posted 3 weeks ago",
    description: "We are looking for a Sales Associate to assist customers and promote our products. The ideal candidate will have excellent customer service skills and a passion for sales.",
    requirements: [
      "High school diploma or equivalent",
      "Excellent customer service skills",
      "Ability to work in a fast-paced environment"
    ],
    image: "/lovable-uploads/7a5fdb55-e1bf-49fb-956a-2ac513bdbcd5.png"
  },
];

// Filter component for mobile drawer
const JobFilters = ({ onApplyFilters }) => {
  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("");
  const [location, setLocation] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  
  const handleApply = () => {
    onApplyFilters({
      search,
      jobType,
      location,
      salaryMin,
      salaryMax
    });
  };
  
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Search</label>
        <Input
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Job Type</label>
        <Select value={jobType} onValueChange={setJobType}>
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="full-time">Full-time</SelectItem>
            <SelectItem value="part-time">Part-time</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Location</label>
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger>
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="makati">Makati</SelectItem>
            <SelectItem value="quezon">Quezon City</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Salary Range</label>
        <div className="grid grid-cols-2 gap-2">
          <Input placeholder="Min" type="number" value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} />
          <Input placeholder="Max" type="number" value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} />
        </div>
      </div>

      <Button onClick={handleApply} className="w-full">
        Apply Filters
      </Button>
    </div>
  );
};

export default function Jobs() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleApplyFilters = (filters) => {
    setSearch(filters.search);
    // Apply other filters here
    setIsFiltersOpen(false);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Job Board</h1>
            <p className="text-muted-foreground">
              Find employment opportunities in your community
            </p>
          </div>
          <Button className="bg-official hover:bg-official-dark hidden sm:flex">
            <Plus className="w-4 h-4 mr-2" />
            Post a Job
          </Button>
        </div>

        {/* Mobile post job button */}
        <div className="flex sm:hidden mb-4">
          <Button className="bg-official hover:bg-official-dark w-full">
            <Plus className="w-4 h-4 mr-2" />
            Post a Job
          </Button>
        </div>

        <div className="grid md:grid-cols-[300px,1fr] gap-6">
          {/* Filters Section - Desktop */}
          <div className="hidden md:block space-y-6">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              <JobFilters onApplyFilters={handleApplyFilters} />
            </div>
          </div>

          {/* Filters Drawer - Mobile */}
          <div className="md:hidden mb-4">
            <Drawer open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <DrawerTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Job Filters</DrawerTitle>
                </DrawerHeader>
                <div className="p-4">
                  <JobFilters onApplyFilters={handleApplyFilters} />
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>

          {/* Jobs List Section */}
          <div className="space-y-4 md:space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground text-sm">
                Showing {jobs.length} jobs
              </p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-lg border p-4 md:p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:gap-4">
                    <img
                      src={job.image}
                      alt={job.company}
                      className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover mb-4 md:mb-0"
                    />
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                        <div>
                          <h3 className="text-xl font-semibold mb-1">{job.title}</h3>
                          <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm text-muted-foreground mb-2">
                            <span className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              {job.company}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {job.posted}
                            </span>
                          </div>
                        </div>
                        <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mt-2 md:mt-0 w-fit">
                          {job.type}
                        </span>
                      </div>

                      <p className="mt-4 text-muted-foreground line-clamp-2 md:line-clamp-none">{job.description}</p>
                      
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Requirements:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          {job.requirements.slice(0, 2).map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                          {job.requirements.length > 2 && (
                            <li className="md:hidden">+ {job.requirements.length - 2} more</li>
                          )}
                          {job.requirements.slice(2).map((req, index) => (
                            <li key={index} className="hidden md:list-item">{req}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <span className="font-semibold text-lg">{job.salary}</span>
                        <div className="flex flex-wrap gap-3 w-full md:w-auto">
                          <Button variant="outline" className="flex-1 md:flex-none">Save Job</Button>
                          <Button className="flex-1 md:flex-none bg-resident hover:bg-resident-dark text-white">
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
