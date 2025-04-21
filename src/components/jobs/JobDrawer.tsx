
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { MapPin, Briefcase } from "lucide-react";

export default function JobDrawer({ open, onOpenChange, job, jobs }: any) {
  // sample similar jobs -- could be extended
  const similarJobs = jobs?.filter(j => j.id !== job?.id).slice(0, 3);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-w-3xl mx-auto rounded-t-2xl shadow-xl">
        <DrawerHeader>
          <div className="flex flex-row items-center justify-between gap-6">
            <div>
              <DrawerTitle className="text-2xl font-bold">{job?.title}</DrawerTitle>
              <div className="text-sm flex items-center gap-2 my-1">
                <span className="text-primary font-semibold">{job?.company}</span>
                <span className="text-gray-400 flex items-center text-xs gap-1"><MapPin className="w-4 h-4" /> {job?.location}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="bg-muted text-xs px-3 py-1 rounded font-medium">{job?.type}</span>
                <span className="bg-muted text-xs px-3 py-1 rounded font-medium">{job?.experience} Level</span>
                <span className="bg-muted text-xs px-3 py-1 rounded font-medium">{job?.salary}</span>
                <span className="bg-muted text-xs px-3 py-1 rounded font-medium">{job?.category}</span>
              </div>
            </div>
            {job?.logo ? (
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
          </div>
        </DrawerHeader>
        <div className="flex flex-col md:flex-row gap-8 px-4 pb-4">
          <div className="flex-1">
            <div className="mb-3">
              <h4 className="font-semibold text-lg mb-1">About this role</h4>
              <div className="text-gray-700">{job?.excerpt ?? "N/A"}</div>
              <p className="text-gray-700 mt-2 text-sm">As a {job?.title}, you'll help serve the local community in the {job?.category?.toLowerCase()} sector. Details and qualifications go here.</p>
            </div>
            <div className="mb-3">
              <h4 className="font-semibold text-lg mb-1">Qualification</h4>
              <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                <li>At least 2 years of relevant experience in related roles</li>
                <li>Familiarity with local government or community guidelines</li>
                <li>Good communication skills; team player</li>
                <li>Resident of Quezon City or nearby areas</li>
              </ul>
            </div>
            <div className="mb-3">
              <h4 className="font-semibold text-lg mb-1">Responsibility</h4>
              <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                <li>Serve community needs as required in the role</li>
                <li>Follow barangay protocols and coordinate with officials</li>
                <li>Assist in organizing local events or initiatives</li>
              </ul>
            </div>
          </div>
          {/* Similar Jobs Sidebar */}
          <div className="w-full md:w-72 flex-shrink-0">
            <div className="font-semibold text-base mb-2">Similar Jobs</div>
            <div className="flex flex-col gap-3">
              {similarJobs?.map((simJob) => (
                <div key={simJob.id} className="flex items-center gap-3 rounded-lg bg-white/70 border shadow p-2">
                  {simJob.logo ? (
                    <img
                      src={simJob.logo}
                      alt={simJob.company}
                      className="rounded-full w-9 h-9 object-cover border"
                    />
                  ) : (
                    <div className="rounded-full w-9 h-9 bg-gray-100 flex items-center justify-center text-gray-400">
                      <Briefcase className="w-6 h-6" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate">{simJob.title}</div>
                    <div className="text-xs text-gray-500 truncate">{simJob.company}</div>
                    <div className="text-xs text-muted-foreground">{simJob.type}, {simJob.experience} | {simJob.location}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* You could add more: e.g. "Other Jobs from [Company]" */}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
