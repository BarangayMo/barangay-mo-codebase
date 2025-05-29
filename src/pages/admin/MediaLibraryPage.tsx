
import { AdminLayout } from "@/components/layout/AdminLayout";
import { MediaLibraryTable } from "@/components/media/MediaLibraryTable";
import { MediaLibraryGrid } from "@/components/media/MediaLibraryGrid";
import { Button } from "@/components/ui/button";
import { Upload, List, Grid, Search } from "lucide-react";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MediaLibraryFilters } from "@/components/media/MediaLibraryFilters";
import { MediaUploadDialog } from "@/components/media/MediaUploadDialog";
import { useMediaLibrary } from "@/hooks";

export default function MediaLibraryPage() {
  const [viewType, setViewType] = useState<'grid' | 'table'>('grid');
  const [filters, setFilters] = useState({
    user: null,
    category: null,
    startDate: null,
    endDate: null
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Get media files count
  const { mediaFiles, loadingFiles, refetch } = useMediaLibrary(filters, searchQuery);
  const mediaCount = mediaFiles?.length || 0;

  const handleUploadComplete = () => {
    // Force refresh of the media components by incrementing the key and calling refetch
    setRefreshKey(prev => prev + 1);
    refetch();
    console.log("Gallery refreshed after upload completion");
  };

  return (
    <AdminLayout title="Media Library">
      <div className="py-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Media Library</h1>
            <p className="text-sm text-gray-600 mt-1">
              {loadingFiles ? (
                "Loading..."
              ) : (
                `${mediaCount} file${mediaCount !== 1 ? 's' : ''} in gallery`
              )}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search media..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full sm:w-80 h-12 text-base"
              />
            </div>
            
            <div className="flex gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="h-12 px-4">
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filter Media</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <MediaLibraryFilters 
                      filters={filters} 
                      onFilterChange={setFilters} 
                    />
                  </div>
                </SheetContent>
              </Sheet>
              
              <Button 
                variant={viewType === 'grid' ? "default" : "outline"} 
                size="sm" 
                onClick={() => setViewType('grid')}
                className={`h-12 px-4 ${viewType === 'grid' ? "bg-blue-500 hover:bg-blue-600 text-white" : ""}`}
              >
                <Grid className="h-4 w-4" />
              </Button>
              
              <Button 
                variant={viewType === 'table' ? "default" : "outline"} 
                size="sm" 
                onClick={() => setViewType('table')}
                className={`h-12 px-4 ${viewType === 'table' ? "bg-blue-500 hover:bg-blue-600 text-white" : ""}`}
              >
                <List className="h-4 w-4" />
              </Button>
              
              <Button 
                className="bg-blue-500 hover:bg-blue-600 text-white h-12 px-6"
                onClick={() => setUploadDialogOpen(true)}
              >
                Upload files
                <Upload className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {viewType === 'table' ? (
          <MediaLibraryTable 
            key={`table-${refreshKey}`}
            filters={filters}
            searchQuery={searchQuery} 
          />
        ) : (
          <MediaLibraryGrid 
            key={`grid-${refreshKey}`}
            filters={filters}
            searchQuery={searchQuery} 
          />
        )}

        <MediaUploadDialog 
          open={uploadDialogOpen}
          onClose={() => setUploadDialogOpen(false)}
          onUploadComplete={handleUploadComplete}
        />
      </div>
    </AdminLayout>
  );
}
