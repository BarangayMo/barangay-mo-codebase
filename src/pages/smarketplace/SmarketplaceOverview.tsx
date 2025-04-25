import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DashboardPageHeader } from "@/components/dashboard/PageHeader";
import { MarketplaceStats } from "@/components/smarketplace/overview/MarketplaceStats";
import { SalesPerformanceChart } from "@/components/smarketplace/overview/SalesPerformanceChart";
import { CategoryDistributionChart } from "@/components/smarketplace/overview/CategoryDistributionChart";
import { TopVendors } from "@/components/smarketplace/overview/TopVendors";
import { TopProducts } from "@/components/smarketplace/overview/TopProducts";
import { VendorActivity } from "@/components/smarketplace/overview/VendorActivity";

const SmarketplaceOverview = () => {
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'quarter'>('week');
  
  const salesData = [
    { name: 'Apr 18', sales: 18500, orders: 12 },
    { name: 'Apr 19', sales: 12500, orders: 8 },
    { name: 'Apr 20', sales: 15000, orders: 10 },
    { name: 'Apr 21', sales: 22000, orders: 15 },
    { name: 'Apr 22', sales: 19500, orders: 13 },
    { name: 'Apr 23', sales: 24000, orders: 18 },
    { name: 'Apr 24', sales: 25000, orders: 20 },
  ];
  
  const categoryData = [
    { name: 'Electronics', value: 35, color: '#3b82f6' },
    { name: 'Clothing', value: 25, color: '#10b981' },
    { name: 'Home Goods', value: 20, color: '#8b5cf6' },
    { name: 'Food', value: 15, color: '#f59e0b' },
    { name: 'Other', value: 5, color: '#6b7280' },
  ];
  
  const vendorData = [
    { name: 'Green Farms Co-op', value: 45, change: 5 },
    { name: 'Local Crafts', value: 28, change: 2 },
    { name: 'Eco Friends PH', value: 15, change: -2 },
    { name: 'Tropical Treats', value: 12, change: 1 },
  ];

  const topProducts = [
    { id: 1, name: "Organic Rice (5kg)", sales: 245, price: "₱425.00", stock: 58 },
    { id: 2, name: "Bamboo Toothbrush", sales: 189, price: "₱120.00", stock: 176 },
    { id: 3, name: "Handwoven Basket", sales: 153, price: "₱350.00", stock: 42 },
    { id: 4, name: "Coconut Bowl Set", sales: 142, price: "₱480.00", stock: 23 },
  ];

  const recentVendorActivity = [
    { 
      id: 1, 
      vendor: "Green Farms Co-op", 
      action: "added new product", 
      product: "Organic Black Rice (1kg)",
      time: "20 minutes ago",
      avatar: ""
    },
    { 
      id: 2, 
      vendor: "Local Crafts", 
      action: "updated inventory", 
      product: "Handwoven Placemat",
      time: "45 minutes ago",
      avatar: ""
    },
    { 
      id: 3, 
      vendor: "Eco Friends PH", 
      action: "changed price for", 
      product: "Reusable Produce Bags",
      time: "1 hour ago",
      avatar: ""
    },
    { 
      id: 4, 
      vendor: "Tropical Treats", 
      action: "added promotion for", 
      product: "Dried Mango Pack",
      time: "2 hours ago",
      avatar: ""
    },
  ];

  return (
    <AdminLayout title="Smarketplace Overview">
      <DashboardPageHeader
        title="Marketplace Overview"
        description="Analytics and insights for your marketplace"
        breadcrumbItems={[
          { label: "Dashboard", href: "/admin" },
          { label: "Smarketplace", href: "/admin/smarketplace" },
          { label: "Overview" }
        ]}
      />

      <MarketplaceStats salesData={salesData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <SalesPerformanceChart 
          salesData={salesData}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
        <CategoryDistributionChart categoryData={categoryData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <TopVendors vendorData={vendorData} />
        <TopProducts products={topProducts} />
        <VendorActivity activities={recentVendorActivity} />
      </div>
    </AdminLayout>
  );
};

export default SmarketplaceOverview;
