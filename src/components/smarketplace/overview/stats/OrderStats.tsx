
import { Package } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";

export const OrderStats = () => {
  return (
    <StatsCard 
      title="Total Orders"
      value="324"
      change={{ value: 8, isPositive: true }}
      icon={<Package className="h-5 w-5 text-green-500" />}
      iconColor="bg-green-50"
    />
  );
};
