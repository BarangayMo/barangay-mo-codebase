
import { ShoppingBag } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";

export const ListingStats = () => {
  return (
    <StatsCard 
      title="Active Listings"
      value="1,246"
      change={{ value: 15, isPositive: true }}
      icon={<ShoppingBag className="h-5 w-5 text-amber-500" />}
      iconColor="bg-amber-50"
    />
  );
};
