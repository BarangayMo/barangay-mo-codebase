

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { formatCurrency } from "@/lib/utils";

interface TopProductsProps {
  products: Array<{
    id: number;
    name: string;
    sales: number;
    price: string; // Keep as string, parsing will be handled
    stock: number;
  }>;
}

export const TopProducts = ({ products }: TopProductsProps) => {
  const columns = [
    {
      id: 'name',
      header: 'Product',
      cell: (product) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
            <img 
              src={`/placeholder.svg`} 
              alt={product.name}
              className="w-8 h-8 object-cover"
            />
          </div>
          <span className="font-medium truncate">{product.name}</span>
        </div>
      ),
      align: 'left' as const,
    },
    {
      id: 'sales',
      header: 'Sales',
      cell: (product) => product.sales.toLocaleString(),
      align: 'right' as const,
    },
    {
      id: 'price',
      header: 'Price',
      // Ensure parseFloat is used correctly and provide a currency
      cell: (product) => formatCurrency(parseFloat(product.price.replace(/[^\d.-]/g, '')), 'PHP'),
      align: 'right' as const,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
        <CardDescription>Best selling items</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <DataTable 
          data={products}
          columns={columns}
          showControls={false}
        />
      </CardContent>
    </Card>
  );
};

