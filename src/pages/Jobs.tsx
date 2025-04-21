
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Briefcase, MapPin, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import JobDrawer from "@/components/jobs/JobDrawer";
import { useIsMobile } from "@/hooks/use-mobile";

const jobFilters = [
  "All",
  "Remote",
  "Part-time",
  "Full-time",
  "Contract",
];

const extraFilters = [
  { label: "Experience", values: ["Entry", "Mid", "Senior"] },
  { label: "Location", values: ["Quezon City", "Olongapo", "Caloocan", "San Fernando"] },
  { label: "Category", values: ["Health", "Safety", "Maintenance", "Education"] }
];

const jobs = [
  {
    id: 1,
    title: "Community Health Worker",
    company: "Barangay Health Center",
    location: "Quezon City",
    type: "Part-time",
    posted: "2d ago",
    logo: "/lovable-uploads/bf986c64-ee34-427c-90ad-0512f2e7f353.png",
    status: "Open",
    salary: "₱9,000/mo",
    experience: "Entry",
    category: "Health",
    excerpt: "Support health programs in your community. Flexible hours.",
  },
  {
    id: 2,
    title: "Barangay Tanod",
    company: "Barangay Hall",
    location: "Quezon City",
    type: "Full-time",
    posted: "5d ago",
    logo: "/lovable-uploads/7a5fdb55-e1bf-49fb-956a-2ac513bdbcd5.png",
    status: "Open",
    salary: "₱12,000/mo",
    experience: "Mid",
    category: "Safety",
    excerpt: "Help keep the barangay safe. Day/night shifts available.",
  },
  {
    id: 3,
    title: "Clean & Green Worker",
    company: "Barangay Maintenance",
    location: "Quezon City",
    type: "Contract",
    posted: "1w ago",
    logo: "",
    status: "Closed",
    salary: "₱7,500/mo",
    experience: "Entry",
    category: "Maintenance",
    excerpt: "Maintain cleanliness and green spaces in the community.",
  },
];

export default function Jobs() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedJob, setSelectedJob] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useIsMobile();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedExtras, setSelectedExtras] = useState({
    Experience: null,
    Location: null,
    Category: null,
  });

  const handleOpenDrawer = (job: any) => {
    setSelectedJob(job);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedJob(null);
  };

  // Filtering logic (including new filtering options)
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === "All" ? true : job.type === activeFilter;
    const matchesExtras = Object.entries(selectedExtras).every(([key, value]) => !value || job[key.toLowerCase()] === value);
    return matchesSearch && matchesFilter && matchesExtras;
  });

  // Responsive grid, sidebar, etc
  return (
    <Layout>
      <div className="flex flex-col md:flex-row max-w-6xl mx-auto py-4 px-2 min-h-[calc(100vh-80px)]">
        {/* Sidebar with Filters - Show on desktop */}
        <div className={`md:block ${sidebarOpen ? "" : "hidden"} md:!block w-full md:w-60 md:pr-4 mb-2 md:mb-0`}>
          <div className="bg-white/50 rounded-xl shadow border p-4 mb-4">
            <div className="flex items-center mb-2 gap-2">
              <Filter className="w-5 h-5" />
              <span className="font-semibold">Filter Jobs</span>
              <button onClick={() => setSidebarOpen(false)} className="block md:hidden ml-auto text-xs text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            <div className="space-y-2">
              <div>
                <div className="font-bold text-xs mb-1">Type</div>
                <div className="flex flex-wrap gap-1">
                  {jobFilters.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                        activeFilter === filter
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted text-muted-foreground border-muted"
                      }`}
                    >{filter}</button>
                  ))}
                </div>
              </div>
              {extraFilters.map(filterObj => (
                <div key={filterObj.label}>
                  <div className="font-bold text-xs mb-1">{filterObj.label}</div>
                  <div className="flex flex-wrap gap-1">
                    {filterObj.values.map(val => (
                      <button
                        key={val}
                        onClick={() =>
                          setSelectedExtras((prev) => ({
                            ...prev,
                            [filterObj.label]: prev[filterObj.label] === val ? null : val
                          }))
                        }
                        className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                          selectedExtras[filterObj.label] === val
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted text-muted-foreground border-muted"
                        }`}
                      >{val}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Filter button for mobile */}
        <div className="md:hidden flex justify-end mb-2">
          <button onClick={() => setSidebarOpen(true)} className="flex items-center gap-2 bg-white/80 px-3 py-2 rounded-lg shadow text-gray-900 font-medium">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
        {/* Job List */}
        <div className="flex-1">
          {/* Search Bar */}
          <div className="mb-3">
            <Input
              className="w-full rounded-xl"
              placeholder="Search job title, company, etc."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="cursor-pointer"
                onClick={() => handleOpenDrawer(job)}
              >
                <div className="rounded-2xl p-6 border bg-white/70 shadow-lg flex items-center hover:scale-[1.01] transition group"
                  style={{ minHeight: "120px" }}
                >
                  <div className="mr-5 flex-shrink-0 relative">
                    {job.logo ? (
                      <img
                        src={job.logo}
                        alt={job.company}
                        className="rounded-full w-16 h-16 object-cover border-2 border-gray-100"
                      />
                    ) : (
                      <div className="rounded-full w-16 h-16 bg-gray-100 flex items-center justify-center text-gray-400">
                        <Briefcase className="w-8 h-8" />
                      </div>
                    )}
                    {/* Status dot */}
                    <span className={`absolute bottom-0 right-0 block w-3 h-3 rounded-full border-2 border-white ${
                      job.status === "Open"
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-semibold truncate">{job.title}</span>
                      <span className="text-xs text-gray-400">{job.posted}</span>
                    </div>
                    <div className="text-base text-gray-700 truncate">{job.company}</div>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="flex items-center text-xs bg-muted rounded px-2 py-0.5 text-gray-700"><MapPin className="w-3 h-3 mr-1" />{job.location}</span>
                      <span className="flex items-center text-xs bg-muted rounded px-2 py-0.5 text-gray-700">{job.type}</span>
                      <span className="flex items-center text-xs bg-muted rounded px-2 py-0.5 text-gray-700">{job.salary}</span>
                      <span className="flex items-center text-xs bg-muted rounded px-2 py-0.5 text-gray-700">{job.experience} Level</span>
                      <span className="flex items-center text-xs bg-muted rounded px-2 py-0.5 text-gray-700">{job.category}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{job.excerpt}</div>
                  </div>
                </div>
              </div>
            ))}
            {filteredJobs.length === 0 && (
              <div className="py-12 text-center text-muted-foreground animate-fade-in">
                No jobs found.
              </div>
            )}
          </div>
        </div>
        {/* Filter Drawer (mobile only) */}
        <Drawer open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <DrawerContent className="max-w-sm mx-auto pb-10">
            <DrawerHeader>
              <DrawerTitle>Filter Jobs</DrawerTitle>
              <DrawerDescription>
                Use the filters below to narrow your search.
              </DrawerDescription>
            </DrawerHeader>
            <div className="space-y-3 px-4 pb-4">
              <div>
                <div className="font-bold text-xs mb-1">Type</div>
                <div className="flex flex-wrap gap-1">
                  {jobFilters.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                        activeFilter === filter
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted text-muted-foreground border-muted"
                      }`}
                    >{filter}</button>
                  ))}
                </div>
              </div>
              {extraFilters.map(filterObj => (
                <div key={filterObj.label}>
                  <div className="font-bold text-xs mb-1">{filterObj.label}</div>
                  <div className="flex flex-wrap gap-1">
                    {filterObj.values.map(val => (
                      <button
                        key={val}
                        onClick={() =>
                          setSelectedExtras((prev) => ({
                            ...prev,
                            [filterObj.label]: prev[filterObj.label] === val ? null : val
                          }))
                        }
                        className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                          selectedExtras[filterObj.label] === val
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted text-muted-foreground border-muted"
                        }`}
                      >{val}</button>
                    ))}
                  </div>
                </div>
              ))}
              <div className="pt-2">
                <button
                  className="text-primary font-semibold w-full text-center"
                  onClick={() => setSidebarOpen(false)}
                >Apply Filters</button>
              </div>
            </div>
          </DrawerContent>
        </Drawer>

        {/* Job Drawer */}
        <JobDrawer open={drawerOpen} onOpenChange={handleCloseDrawer} job={selectedJob} jobs={jobs} />
      </div>
    </Layout>
  );
}
