
import { Users } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";

export const VendorStats = () => {
  return (
    <StatsCard 
      title="Active Vendors"
      value="58"
      change={{ value: 3, isPositive: true }}
      icon={<Users className="h-5 w-5 text-purple-500" />}
      iconColor="bg-purple-50"
    />
  );
};
