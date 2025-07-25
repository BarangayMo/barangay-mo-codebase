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
import { Layout } from "@/components/layout/Layout";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const ResidentProductsPage = () => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Fetch products created by the current user only
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['resident-products', user?.id, searchTerm, selectedCategory, sortColumn, sortDirection],
    queryFn: async () => {
      if (!user?.id) return [];
      
      let query = supabase
        .from('products')
        .select(`
          id,
          name,
          sku,
          price,
          stock_quantity,
          is_active,
          created_at,
          vendor_id,
          vendors!inner (shop_name, user_id),
          product_categories (name)
        `)
        .eq('vendors.user_id', user.id); // Only products from vendors owned by this user

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,sku.ilike.%${searchTerm}%`);
      }

      if (selectedCategory !== "all") {
        query = query.eq('product_categories.name', selectedCategory);
      }

      if (sortColumn) {
        query = query.order(sortColumn, { ascending: sortDirection === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch categories for filter
  const { data: categories } = useQuery({
    queryKey: ['product-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_categories')
        .select('name')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resident-products'] });
      toast.success('Product deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete product: ' + error.message);
    },
  });

  const handleViewProduct = (productId: string) => {
    window.open(`/marketplace/product/${productId}`, '_blank');
  };

  const handleEditProduct = (productId: string) => {
    navigate(`/admin/smarketplace/products/edit/${productId}`);
  };

  const handleDeleteProduct = (productId: string, productName: string) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      deleteProductMutation.mutate(productId);
    }
  };

  const handleAddProduct = () => {
    navigate('/admin/smarketplace/products/edit/new');
  };

  const tabItems = [
    { icon: <ShoppingBag className="h-4 w-4" />, label: "All", value: "all" },
    { icon: <Package className="h-4 w-4" />, label: "Active", value: "active" },
    { icon: <Tag className="h-4 w-4" />, label: "Out of Stock", value: "out-of-stock" },
    { icon: <Settings className="h-4 w-4" />, label: "Archived", value: "archived" }
  ];

  const getStatusBadge = (product: any) => {
    if (!product.is_active) {
      return <Badge variant="outline" className="text-gray-500">Archived</Badge>;
    }
    if (product.stock_quantity === 0) {
      return <Badge className="bg-red-500">Out of Stock</Badge>;
    }
    return <Badge className="bg-green-500">Active</Badge>;
  };

  const activeProducts = products?.filter(p => p.is_active && p.stock_quantity > 0).length || 0;
  const outOfStockProducts = products?.filter(p => p.is_active && p.stock_quantity === 0).length || 0;
  const archivedProducts = products?.filter(p => !p.is_active).length || 0;

  const breadcrumbItems = [
    { label: "Products" }
  ];

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500">Error loading products: {error.message}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <DashboardPageHeader
          title="Product Management"
          description="View and manage your marketplace products"
          breadcrumbItems={breadcrumbItems}
          actionButton={{
            label: "Add Product",
            onClick: handleAddProduct,
            icon: <PlusCircle className="h-4 w-4" />,
            variant: "dashboard"
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatsCard 
            title="Total Products"
            value={products?.length.toString() || "0"}
            icon={<ShoppingBag className="h-5 w-5 text-blue-500" />}
          />
          <StatsCard 
            title="Active Products"
            value={activeProducts.toString()}
            change={{ value: 5, isPositive: true }}
            icon={<Package className="h-5 w-5 text-green-500" />}
            iconColor="bg-green-50"
          />
          <StatsCard 
            title="Out of Stock"
            value={outOfStockProducts.toString()}
            change={{ value: 12, isPositive: false }}
            icon={<Tag className="h-5 w-5 text-red-500" />}
            iconColor="bg-red-50"
          />
          <StatsCard 
            title="Archived"
            value={archivedProducts.toString()}
            icon={<Settings className="h-5 w-5 text-gray-500" />}
            iconColor="bg-gray-50"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search products..." 
              className="pl-9" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="dashboard">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <ModernTabs defaultValue="all" items={tabItems}>
          <Card className="animate-fade-in">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="space-y-4 p-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : products?.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
                  <p className="text-gray-500 mb-4">Start by adding your first product</p>
                  <Button onClick={handleAddProduct} className="bg-blue-600 hover:bg-blue-700">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </div>
              ) : (
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
                      <TableHead className="cursor-pointer" onClick={() => handleSort('stock_quantity')}>
                        Inventory {sortColumn === 'stock_quantity' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products?.map((product) => (
                      <TableRow key={product.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.sku || 'N/A'}</TableCell>
                        <TableCell>₱{product.price?.toLocaleString() || '0'}</TableCell>
                        <TableCell>
                          {product.stock_quantity === 0 ? (
                            <span className="text-red-500">Out of stock</span>
                          ) : product.stock_quantity < 20 ? (
                            <span className="text-amber-500">{product.stock_quantity} (Low)</span>
                          ) : (
                            product.stock_quantity
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(product)}</TableCell>
                        <TableCell>{product.product_categories?.name || 'Uncategorized'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleViewProduct(product.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleEditProduct(product.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => handleDeleteProduct(product.id, product.name)}
                              disabled={deleteProductMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </ModernTabs>
      </div>
    </Layout>
  );
};

export default ResidentProductsPage;
