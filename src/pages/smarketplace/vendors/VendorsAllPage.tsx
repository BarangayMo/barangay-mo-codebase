
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DashboardPageHeader } from "@/components/dashboard/PageHeader";
import { VendorStats } from "@/components/smarketplace/vendors/VendorStats";
import { VendorPerformanceChart } from "@/components/smarketplace/vendors/VendorPerformanceChart";
import { VendorFilters } from "@/components/smarketplace/vendors/VendorFilters";
import { VendorList } from "@/components/smarketplace/vendors/VendorList";

const VendorsAllPage = () => {
  const [search, setSearch] = useState("");

  const vendorPerformanceData = [
    { name: 'Jan', "Green Farms": 12500, "Local Crafts": 8200, "Tropical Treats": 5400 },
    { name: 'Feb', "Green Farms": 15200, "Local Crafts": 9100, "Tropical Treats": 7300 },
    { name: 'Mar', "Green Farms": 18900, "Local Crafts": 10500, "Tropical Treats": 8200 },
    { name: 'Apr', "Green Farms": 23400, "Local Crafts": 12700, "Tropical Treats": 11800 }
  ];

  const vendorData = [
    { id: 1, name: "Green Farms Co-op", status: "active", productCount: 32, revenue: "₱325,650", joinDate: "Jan 2023" },
    { id: 2, name: "Local Crafts Association", status: "active", productCount: 56, revenue: "₱215,470", joinDate: "Mar 2023" },
    { id: 3, name: "Tropical Treats Foods", status: "active", productCount: 24, revenue: "₱189,320", joinDate: "Apr 2023" },
    { id: 4, name: "Eco Friends Philippines", status: "active", productCount: 12, revenue: "₱97,850", joinDate: "Jul 2023" },
    { id: 5, name: "Mountain Coffee Roasters", status: "pending", productCount: 0, revenue: "₱0", joinDate: "Apr 2025" },
    { id: 6, name: "Island Spice Co.", status: "suspended", productCount: 8, revenue: "₱45,320", joinDate: "Dec 2023" }
  ];

  const breadcrumbItems = [
    { label: "Smarketplace", href: "/admin/smarketplace" },
    { label: "Vendors" }
  ];

  return (
    <AdminLayout title="All Vendors">
      <DashboardPageHeader
        title="Vendor Management"
        description="View and manage marketplace vendors"
        breadcrumbItems={breadcrumbItems}
        actionButton={{
          label: "Add Vendor",
          onClick: () => console.log("Add vendor clicked"),
          icon: <PlusCircle className="h-4 w-4" />
        }}
      />

      <VendorStats />
      <VendorPerformanceChart data={vendorPerformanceData} />
      <VendorFilters onSearchChange={setSearch} />
      <VendorList vendors={vendorData} />
    </AdminLayout>
  );
};

export default VendorsAllPage;
