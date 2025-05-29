
import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UploadCloud, Search, Grid, List, Filter } from "lucide-react";
import { MediaLibraryGrid } from "@/components/media/MediaLibraryGrid";
import { MediaLibraryTable } from "@/components/media/MediaLibraryTable";
import { MediaLibraryFilters } from "@/components/media/MediaLibraryFilters";
import { MediaUploadDialog } from "@/components/media/MediaUploadDialog";
import { useMediaLibrary } from "@/hooks";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading';
}

export default function MediaLibraryPage() {
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    user: null,
    category: null,
    startDate: null,
    endDate: null
  });
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);

  const { refetch } = useMediaLibrary(filters, searchQuery);

  const handleFiltersChange = useCallback((newFilters: any) => {
    setFilters(newFilters);
  }, []);

  const handleUploadStart = useCallback((files: UploadingFile[]) => {
    setUploadingFiles(prev => [...prev, ...files]);
  }, []);

  const handleUploadProgress = useCallback((fileId: string, progress: number) => {
    setUploadingFiles(prev => 
      prev.map(file => 
        file.id === fileId ? { ...file, progress } : file
      )
    );
  }, []);

  const handleUploadComplete = useCallback((fileId?: string) => {
    if (fileId) {
      // Remove specific file from uploading list
      setUploadingFiles(prev => prev.filter(file => file.id !== fileId));
    } else {
      // Clear all uploading files and refresh
      setUploadingFiles([]);
    }
    refetch();
  }, [refetch]);

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-600 mt-1">Manage your uploaded files and media</p>
        </div>
        
        <Button 
          onClick={() => setUploadOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <UploadCloud className="h-4 w-4 mr-2" />
          Upload Media
        </Button>
      </div>

      {/* Search and Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search media..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Filters */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="relative">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge className="ml-2 bg-blue-600 text-white min-w-[20px] h-5 text-xs flex items-center justify-center">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[400px] sm:w-[540px] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filter Media</SheetTitle>
                    <SheetDescription>
                      Apply filters to narrow down your media search
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6">
                    <MediaLibraryFilters
                      filters={filters}
                      onFiltersChange={handleFiltersChange}
                    />
                  </div>
                </SheetContent>
              </Sheet>

              {/* View Toggle */}
              <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                <Button
                  variant={view === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('grid')}
                  className={view === 'grid' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={view === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('table')}
                  className={view === 'table' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media Content */}
      <Card>
        <CardContent className="p-6">
          {view === 'grid' ? (
            <MediaLibraryGrid 
              filters={filters} 
              searchQuery={searchQuery}
              uploadingFiles={uploadingFiles}
              onUploadProgress={handleUploadProgress}
              onUploadComplete={handleUploadComplete}
            />
          ) : (
            <MediaLibraryTable 
              filters={filters} 
              searchQuery={searchQuery}
              uploadingFiles={uploadingFiles}
              onUploadProgress={handleUploadProgress}
              onUploadComplete={handleUploadComplete}
            />
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <MediaUploadDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploadComplete={handleUploadComplete}
        onUploadStart={handleUploadStart}
        onUploadProgress={handleUploadProgress}
      />
    </div>
  );
}
