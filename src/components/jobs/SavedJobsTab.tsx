import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useSavedJobs } from "@/hooks/useSavedJobs";
import { Building, MapPin, Banknote, Clock, Trash2, Briefcase } from "lucide-react";

export function SavedJobsTab() {
  const { savedJobs, loading, removeSavedJob } = useSavedJobs();
  const navigate = useNavigate();

  const viewJobDetails = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, index) => (
          <div key={index} className="border rounded-xl overflow-hidden shadow-sm p-6 bg-white">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-5 w-1/2 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
            <div className="mt-4 pt-4 border-t">
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
            <div className="mt-4 flex justify-between">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (savedJobs.length === 0) {
    return (
      <div className="text-center py-12">
        <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">No saved jobs</h3>
        <p className="mt-2 text-gray-500">Start saving jobs that interest you</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {savedJobs.map((savedJob) => {
        const job = savedJob.jobs;
        return (
          <div key={savedJob.id} className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{job.title}</h3>
                  <p className="text-gray-600 font-medium">{job.company}</p>
                </div>
                {job.logo_url ? (
                  <img 
                    src={job.logo_url} 
                    alt={`${job.company} logo`} 
                    className="w-12 h-12 object-contain rounded-md"
                  />
                ) : (
                  <div className="w-12 h-12 bg-blue-100 rounded-md flex items-center justify-center">
                    <Building className="h-6 w-6 text-blue-600" />
                  </div>
                )}
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-gray-600">
                  <MapPin size={16} className="mr-2 text-gray-400" />
                  <span>{job.location}</span>
                </div>
                
                {job.salary && (
                  <div className="flex items-center text-gray-600">
                    <Banknote size={16} className="mr-2 text-gray-400" />
                    <span>{job.salary}</span>
                  </div>
                )}
                
                {job.availability && (
                  <div className="flex items-center text-gray-600">
                    <Clock size={16} className="mr-2 text-gray-400" />
                    <span>{job.availability}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {job.category}
                  </Badge>
                  {job.work_approach && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {job.work_approach}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="mt-4 flex justify-between">
                <Button 
                  onClick={() => viewJobDetails(job.id)} 
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  View Details
                </Button>
                
                <Button
                  variant="ghost" 
                  size="icon"
                  onClick={() => removeSavedJob(job.id)}
                  className="rounded-full text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}