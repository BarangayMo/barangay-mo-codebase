
import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DashboardPageHeader } from "@/components/dashboard/PageHeader";
import { MediaLibraryGrid } from "@/components/media/MediaLibraryGrid";
import { MediaLibraryFilters } from "@/components/media/MediaLibraryFilters";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function MediaLibraryPage() {
  const [filters, setFilters] = useState({
    user: null,
    category: null,
    startDate: null,
    endDate: null,
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleDownloadAll = () => {
    // TODO: Implement bulk download functionality
  };

  return (
    <AdminLayout title="Media Library">
      <div className="space-y-6">
        <DashboardPageHeader
          title="Media Library"
          description="Manage and view all media uploaded by users"
          breadcrumbItems={[
            { label: "Dashboard", href: "/admin" },
            { label: "Media Library" }
          ]}
          actionButton={{
            label: "Download All",
            onClick: handleDownloadAll,
            variant: "outline",
            icon: <Download className="mr-2 h-4 w-4" />
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <MediaLibraryFilters 
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
          <div className="lg:col-span-3">
            <MediaLibraryGrid filters={filters} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
