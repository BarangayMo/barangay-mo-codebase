import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Briefcase, MapPin, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerTrigger } from "@/components/ui/drawer";
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

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === "All" ? true : job.type === activeFilter;
    const matchesExtras = Object.entries(selectedExtras).every(([key, value]) => !value || job[key.toLowerCase()] === value);
    return matchesSearch && matchesFilter && matchesExtras;
  });

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto py-4 px-4 min-h-[calc(100vh-80px)] gap-6">
        <div className="lg:w-1/4">
          <div className="sticky top-20">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h2 className="font-semibold mb-4">Filters</h2>
              <div className="space-y-4">
                <div>
                  <div className="font-medium text-sm mb-2">Type</div>
                  <div className="flex flex-wrap gap-2">
                    {jobFilters.map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
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
                    <div className="font-bold text-sm mb-2">{filterObj.label}</div>
                    <div className="flex flex-wrap gap-2">
                      {filterObj.values.map(val => (
                        <button
                          key={val}
                          onClick={() =>
                            setSelectedExtras((prev) => ({
                              ...prev,
                              [filterObj.label]: prev[filterObj.label] === val ? null : val
                            }))
                          }
                          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
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
        </div>

        <div className="lg:w-3/4">
          <div className="flex items-center gap-4 mb-6">
            <Input
              className="max-w-xs"
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

        <JobDrawer open={drawerOpen} onOpenChange={handleCloseDrawer} job={selectedJob} jobs={jobs} />
      </div>
    </Layout>
  );
}
