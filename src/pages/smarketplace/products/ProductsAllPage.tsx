
import { useState } from "react";
import { 
  ShoppingBag, 
  Package, 
  Tag, 
  Settings, 
  Search, 
  Filter, 
  PlusCircle,
  Eye,
  Edit,
  Trash2 
} from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/PageHeader";
import { ModernTabs } from "@/components/dashboard/ModernTabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProductsAllPage = () => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const tabItems = [
    { icon: <ShoppingBag className="h-4 w-4" />, label: "All", value: "all" },
    { icon: <Package className="h-4 w-4" />, label: "Active", value: "active" },
    { icon: <Tag className="h-4 w-4" />, label: "Out of Stock", value: "out-of-stock" },
    { icon: <Settings className="h-4 w-4" />, label: "Archived", value: "archived" }
  ];

  const productData = [
    { id: 1, name: "Organic Rice (5kg)", sku: "ORG-RICE-5KG", price: "₱350.00", inventory: 128, status: "active", vendor: "Green Farms Co-op" },
    { id: 2, name: "Hand-woven Basket", sku: "HND-BSKT-01", price: "₱750.00", inventory: 32, status: "active", vendor: "Local Crafts Association" },
    { id: 3, name: "Coconut Soap", sku: "COC-SOP-100G", price: "₱85.00", inventory: 210, status: "active", vendor: "Eco Friends Philippines" },
    { id: 4, name: "Dried Mango", sku: "DRD-MNG-250G", price: "₱220.00", inventory: 0, status: "out-of-stock", vendor: "Tropical Treats Foods" },
    { id: 5, name: "Handmade Coffee Mug", sku: "HND-MUG-001", price: "₱450.00", inventory: 18, status: "active", vendor: "Local Crafts Association" },
    { id: 6, name: "Bamboo Toothbrush", sku: "BMB-BRUSH-01", price: "₱75.00", inventory: 0, status: "out-of-stock", vendor: "Eco Friends Philippines" },
    { id: 7, name: "Banana Chips", sku: "BNN-CHPS-100G", price: "₱110.00", inventory: 57, status: "active", vendor: "Tropical Treats Foods" },
    { id: 8, name: "Abaca Placemat", sku: "ABC-PLCMT-01", price: "₱320.00", inventory: 0, status: "archived", vendor: "Local Crafts Association" }
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'out-of-stock':
        return <Badge className="bg-red-500">Out of Stock</Badge>;
      case 'archived':
        return <Badge variant="outline" className="text-gray-500">Archived</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const breadcrumbItems = [
    { label: "Smarketplace", href: "/admin/smarketplace" },
    { label: "Products" }
  ];

  return (
    <AdminLayout title="All Products">
      <DashboardPageHeader
        title="Product Management"
        description="View and manage your marketplace products"
        breadcrumbItems={breadcrumbItems}
        actionButton={{
          label: "Add Product",
          onClick: () => console.log("Add product clicked"),
          icon: <PlusCircle className="h-4 w-4" />
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatsCard 
          title="Total Products"
          value="437"
          icon={<ShoppingBag className="h-5 w-5 text-blue-500" />}
        />
        <StatsCard 
          title="Active Products"
          value="387"
          change={{ value: 5, isPositive: true }}
          icon={<Package className="h-5 w-5 text-green-500" />}
          iconColor="bg-green-50"
        />
        <StatsCard 
          title="Out of Stock"
          value="28"
          change={{ value: 12, isPositive: false }}
          icon={<Tag className="h-5 w-5 text-red-500" />}
          iconColor="bg-red-50"
        />
        <StatsCard 
          title="Archived"
          value="22"
          icon={<Settings className="h-5 w-5 text-gray-500" />}
          iconColor="bg-gray-50"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search products..." className="pl-9" />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <Select defaultValue="all">
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="food">Food & Beverages</SelectItem>
              <SelectItem value="crafts">Handmade Crafts</SelectItem>
              <SelectItem value="eco">Eco-Friendly</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all-vendors">
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="Vendor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-vendors">All Vendors</SelectItem>
              <SelectItem value="green-farms">Green Farms Co-op</SelectItem>
              <SelectItem value="local-crafts">Local Crafts Association</SelectItem>
              <SelectItem value="eco-friends">Eco Friends Philippines</SelectItem>
              <SelectItem value="tropical-treats">Tropical Treats Foods</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <ModernTabs defaultValue="all" items={tabItems}>
        <Card className="animate-fade-in">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px] cursor-pointer" onClick={() => handleSort('name')}>
                    Product Name {sortColumn === 'name' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('sku')}>
                    SKU {sortColumn === 'sku' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('price')}>
                    Price {sortColumn === 'price' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('inventory')}>
                    Inventory {sortColumn === 'inventory' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('vendor')}>
                    Vendor {sortColumn === 'vendor' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productData.map((product) => (
                  <TableRow key={product.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>
                      {product.inventory === 0 ? (
                        <span className="text-red-500">Out of stock</span>
                      ) : product.inventory < 20 ? (
                        <span className="text-amber-500">{product.inventory} (Low)</span>
                      ) : (
                        product.inventory
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(product.status)}</TableCell>
                    <TableCell>{product.vendor}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </ModernTabs>
    </AdminLayout>
  );
};

export default ProductsAllPage;
