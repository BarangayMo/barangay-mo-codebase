
import { AdminLayout } from "@/components/layout/AdminLayout";
import { MediaLibraryTable } from "@/components/media/MediaLibraryTable";
import { MediaLibraryGrid } from "@/components/media/MediaLibraryGrid";
import { Button } from "@/components/ui/button";
import { Upload, List, Grid, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MediaLibraryFilters } from "@/components/media/MediaLibraryFilters";
import { MediaUploadDialog } from "@/components/media/MediaUploadDialog";

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

  return (
    <AdminLayout title="Media Library">
      <div className="py-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <h1 className="text-2xl font-semibold">Media Library</h1>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search media..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full sm:w-64"
              />
            </div>
            
            <div className="flex gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent>
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
                className={viewType === 'grid' ? "bg-blue-500 hover:bg-blue-600 text-white" : ""}
              >
                <Grid className="h-4 w-4" />
              </Button>
              
              <Button 
                variant={viewType === 'table' ? "default" : "outline"} 
                size="sm" 
                onClick={() => setViewType('table')}
                className={viewType === 'table' ? "bg-blue-500 hover:bg-blue-600 text-white" : ""}
              >
                <List className="h-4 w-4" />
              </Button>
              
              <Button 
                className="bg-blue-500 hover:bg-blue-600 text-white"
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
            filters={filters}
            searchQuery={searchQuery} 
          />
        ) : (
          <MediaLibraryGrid 
            filters={filters}
            searchQuery={searchQuery} 
          />
        )}

        <MediaUploadDialog 
          open={uploadDialogOpen}
          onClose={() => setUploadDialogOpen(false)}
          onUploadComplete={() => {
            // Refresh the media list after upload completes
            // Both components handle this internally with react-query
          }}
        />
      </div>
    </AdminLayout>
  );
}
