
import { useLatestProducts } from "@/hooks/use-dashboard-data";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyStateWithIcon } from "@/components/dashboard/EmptyStateWithIcon";
import { Package } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

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
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Listed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell className="text-gray-600">
                {product.vendor?.shop_name || 'Unknown Vendor'}
              </TableCell>
              <TableCell className="text-gray-600">
                ₱{product.price.toLocaleString()}
              </TableCell>
              <TableCell>
                <Badge className={getStatusBadgeColor(product.is_active)}>
                  {product.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-600">
                {formatDistanceToNow(new Date(product.created_at), { addSuffix: true })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
