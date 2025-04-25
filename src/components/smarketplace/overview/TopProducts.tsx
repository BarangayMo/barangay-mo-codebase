
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface TopProductsProps {
  products: Array<{
    id: number;
    name: string;
    sales: number;
    price: string;
    stock: number;
  }>;
}

export const TopProducts = ({ products }: TopProductsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
        <CardDescription>Best selling items</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Sales</TableHead>
              <TableHead className="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="hover:bg-gray-50 transition-colors">
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="text-right">{product.sales}</TableCell>
                <TableCell className="text-right">{product.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="p-4 border-t text-center">
          <Button variant="outline">View All Products</Button>
        </div>
      </CardContent>
    </Card>
  );
};
