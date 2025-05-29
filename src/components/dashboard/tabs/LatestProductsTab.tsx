
import { useLatestProducts } from "@/hooks/use-dashboard-data";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyStateWithIcon } from "@/components/dashboard/EmptyStateWithIcon";
import { Package } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const LatestProductsTab = () => {
  const { data: products, isLoading, error } = useLatestProducts();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <EmptyStateWithIcon
        icon={<Package className="h-8 w-8 text-gray-400" />}
        title="Unable to Load Products"
        description="There was an error loading the latest products. Please try again later."
      />
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyStateWithIcon
        icon={<Package className="h-8 w-8 text-gray-400" />}
        title="No Products Yet"
        description="No products have been listed yet. Products will appear here once vendors start adding them."
      />
    );
  }

  const getStatusBadgeColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-700">Product</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Vendor</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Price</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Listed</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-900">{product.name}</div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {product.vendor?.shop_name || 'Unknown Vendor'}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  ₱{product.price.toLocaleString()}
                </td>
                <td className="py-3 px-4">
                  <Badge className={getStatusBadgeColor(product.is_active)}>
                    {product.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {formatDistanceToNow(new Date(product.created_at), { addSuffix: true })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
