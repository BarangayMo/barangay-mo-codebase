
import { Skeleton } from "@/components/ui/skeleton";

export const HomePageSkeleton = () => {
  return (
    <div className="p-4 pt-16 min-h-screen bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="rounded-full w-14 h-14" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
        <Skeleton className="rounded-full w-10 h-10" />
      </div>

      <Skeleton className="h-32 w-full rounded-xl mb-6" />
      
      <div className="space-y-2 mb-6">
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
      </div>

      <div className="space-y-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    </div>
  );
};

export const MarketplaceSkeleton = () => {
  return (
    <div className="p-4 pt-16 min-h-screen bg-gray-50">
      <Skeleton className="h-12 mb-4 rounded-full" />
      
      <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="w-24 h-10 flex-shrink-0 rounded-full" />
        ))}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-40 w-full rounded-md" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const MessagesSkeleton = () => {
  return (
    <div className="p-4 pt-16 min-h-screen bg-gray-50">
      <Skeleton className="h-10 w-full mb-6 rounded-md" />
      
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="rounded-full w-12 h-12" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="h-4 w-10" />
          </div>
        ))}
      </div>
    </div>
  );
};
