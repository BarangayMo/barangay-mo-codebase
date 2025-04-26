
import { AdminLayout } from "@/components/layout/AdminLayout";
import { MediaLibraryTable } from "@/components/media/MediaLibraryTable";
import { Button } from "@/components/ui/button";
import { Upload, List } from "lucide-react";
import { useState } from "react";

export default function MediaLibraryPage() {
  const [viewType, setViewType] = useState<'grid' | 'table'>('table');

  return (
    <AdminLayout title="Media Library">
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Files</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setViewType('grid')}>
              <List className="h-4 w-4" />
            </Button>
            <Button variant="default">
              Upload files
              <Upload className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
        <MediaLibraryTable />
      </div>
    </AdminLayout>
  );
}
