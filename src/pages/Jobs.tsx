
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Briefcase, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const jobFilters = [
  "All",
  "Remote",
  "Part-time",
  "Full-time",
  "Contract",
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
    excerpt: "Maintain cleanliness and green spaces in the community.",
  },
];

export default function Jobs() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === "All" ? true : job.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <Layout>
      <div className="max-w-lg mx-auto py-2 px-2 min-h-[calc(100vh-80px)]">
        <h1 className="text-2xl font-bold mb-2 mt-2">Jobs</h1>
        {/* Search Bar */}
        <div className="mb-2">
          <Input
            className="w-full rounded-xl"
            placeholder="Search job title, company, etc."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {/* Filters */}
        <div className="flex space-x-2 overflow-x-auto mb-3 pb-1">
          {jobFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1 rounded-full border text-xs font-medium transition-colors ${
                activeFilter === filter
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted text-muted-foreground border-muted"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Job List */}
        <div className="space-y-3">
          {filteredJobs.map((job) => (
            <Link to={`/jobs/${job.id}`} key={job.id} className="block">
              <div className={`rounded-2xl p-4 border bg-white shadow-sm flex items-center hover-scale transition group`}>
                <div className="mr-3 flex-shrink-0 relative">
                  {job.logo ? (
                    <img
                      src={job.logo}
                      alt={job.company}
                      className="rounded-full w-12 h-12 object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="rounded-full w-12 h-12 bg-gray-100 flex items-center justify-center text-gray-400">
                      <Briefcase className="w-6 h-6" />
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
                    <span className="text-lg font-semibold truncate">{job.title}</span>
                    <span className="text-xs text-gray-400">{job.posted}</span>
                  </div>
                  <div className="text-sm text-gray-500 truncate">{job.company}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center text-xs bg-muted rounded px-2 py-0.5 text-gray-700"><MapPin className="w-3 h-3 mr-1" />{job.location}</span>
                    <span className="flex items-center text-xs bg-muted rounded px-2 py-0.5 text-gray-700">{job.type}</span>
                    <span className="flex items-center text-xs bg-muted rounded px-2 py-0.5 text-gray-700">{job.salary}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-1">{job.excerpt}</div>
                </div>
              </div>
            </Link>
          ))}
          {filteredJobs.length === 0 && (
            <div className="py-12 text-center text-muted-foreground animate-fade-in">
              No jobs found.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
