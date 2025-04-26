
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Users, Star, ShoppingBag } from "lucide-react";

export const VendorStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatsCard 
        title="Total Vendors"
        value="58"
        change={{ value: 3, isPositive: true }}
        icon={<Users className="h-5 w-5 text-blue-500" />}
      />
      <StatsCard 
        title="Active Vendors"
        value="52"
        icon={<Star className="h-5 w-5 text-green-500" />}
        iconColor="bg-green-50"
      />
      <StatsCard 
        title="Pending Applications"
        value="6"
        change={{ value: 2, isPositive: true }}
        icon={<ShoppingBag className="h-5 w-5 text-amber-500" />}
        iconColor="bg-amber-50"
      />
    </div>
  );
};
