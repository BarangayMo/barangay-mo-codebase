
import { Skeleton } from "@/components/ui/skeleton";

export const HomePageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header skeleton */}
      <div className="bg-white border-b p-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <Skeleton className="h-8 w-32 bg-blue-200" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20 bg-blue-200" />
            <Skeleton className="h-8 w-20 bg-blue-200" />
          </div>
        </div>
      </div>

      {/* Hero section skeleton */}
      <div className="relative min-h-[80vh] bg-gradient-to-br from-blue-100 to-blue-200">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <Skeleton className="h-4 w-24 bg-blue-300" />
              <div className="space-y-4">
                <Skeleton className="h-12 w-full bg-blue-300" />
                <Skeleton className="h-12 w-3/4 bg-blue-300" />
              </div>
              <Skeleton className="h-6 w-full bg-blue-300" />
              <Skeleton className="h-6 w-2/3 bg-blue-300" />
              <div className="flex gap-4">
                <Skeleton className="h-12 w-32 bg-blue-300" />
                <Skeleton className="h-12 w-28 bg-blue-300" />
              </div>
            </div>
            <div className="flex justify-center">
              <Skeleton className="h-80 w-80 rounded-3xl bg-blue-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Features section skeleton */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-64 mx-auto mb-4 bg-blue-200" />
            <Skeleton className="h-6 w-96 mx-auto bg-blue-200" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center space-y-4">
                <Skeleton className="h-16 w-16 mx-auto rounded-full bg-blue-200" />
                <Skeleton className="h-6 w-32 mx-auto bg-blue-200" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full bg-blue-200" />
                  <Skeleton className="h-4 w-3/4 mx-auto bg-blue-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const MarketplaceSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2 bg-blue-200" />
          <Skeleton className="h-6 w-64 bg-blue-200" />
        </div>

        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Skeleton className="h-10 flex-1 bg-blue-200" />
          <Skeleton className="h-10 w-32 bg-blue-200" />
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-lg p-4 space-y-4">
              <Skeleton className="h-48 w-full rounded bg-blue-200" />
              <Skeleton className="h-4 w-3/4 bg-blue-200" />
              <Skeleton className="h-4 w-1/2 bg-blue-200" />
              <Skeleton className="h-6 w-1/3 bg-blue-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const MessagesSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
          {/* Messages list */}
          <div className="bg-white rounded-lg p-4 space-y-4">
            <Skeleton className="h-6 w-32 bg-blue-200" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-3 p-3">
                <Skeleton className="h-10 w-10 rounded-full bg-blue-200" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/3 bg-blue-200" />
                  <Skeleton className="h-3 w-full bg-blue-200" />
                </div>
              </div>
            ))}
          </div>

          {/* Chat area */}
          <div className="md:col-span-2 bg-white rounded-lg p-4 space-y-4">
            <Skeleton className="h-6 w-48 bg-blue-200" />
            <div className="space-y-4 flex-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                  <Skeleton className={`h-12 ${i % 2 === 0 ? 'w-1/2' : 'w-2/3'} bg-blue-200`} />
                </div>
              ))}
            </div>
            <Skeleton className="h-10 w-full bg-blue-200" />
          </div>
        </div>
      </div>
    </div>
  );
};
