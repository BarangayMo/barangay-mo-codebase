
import { ModernTabs } from "@/components/dashboard/ModernTabs";
import { VendorCard } from "@/components/dashboard/VendorCard";
import { Users, Star, ShoppingBag } from "lucide-react";

interface VendorData {
  id: number;
  name: string;
  status: string;
  productCount: number;
  revenue: string;
  joinDate: string;
}

interface VendorListProps {
  vendors: VendorData[];
}

export const VendorList = ({ vendors }: VendorListProps) => {
  const tabItems = [
    { icon: <Users className="h-4 w-4" />, label: "All Vendors", value: "all" },
    { icon: <Star className="h-4 w-4" />, label: "Top Performers", value: "top" },
    { icon: <ShoppingBag className="h-4 w-4" />, label: "New Applications", value: "new" }
  ];

  return (
    <ModernTabs defaultValue="all" items={tabItems}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
        {vendors.map((vendor) => (
          <VendorCard
            key={vendor.id}
            name={vendor.name}
            status={vendor.status as any}
            productCount={vendor.productCount}
            revenue={vendor.revenue}
            joinDate={vendor.joinDate}
          />
        ))}
      </div>
    </ModernTabs>
  );
};
