
import { RevenueStats } from "./stats/RevenueStats";
import { OrderStats } from "./stats/OrderStats";
import { VendorStats } from "./stats/VendorStats";
import { ListingStats } from "./stats/ListingStats";

interface MarketplaceStatsProps {
  salesData: Array<{
    name: string;
    sales: number;
    orders: number;
  }>;
}

export const MarketplaceStats = ({ salesData }: MarketplaceStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <RevenueStats salesData={salesData} />
      <OrderStats />
      <VendorStats />
      <ListingStats />
    </div>
  );
};
