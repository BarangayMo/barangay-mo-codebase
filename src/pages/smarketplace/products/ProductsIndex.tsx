
import PageTemplate from "../PageTemplate";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

const ProductsIndex = () => {
  const demoProducts = [
    { id: 1, name: "Organic Farm Fresh Eggs", category: "Food", price: "₱120.00", stock: 23, status: "Active" },
    { id: 2, name: "Handmade Bamboo Basket", category: "Home Goods", price: "₱450.00", stock: 15, status: "Active" },
    { id: 3, name: "Local Honey 500ml", category: "Food", price: "₱350.00", stock: 8, status: "Out of Stock" },
    { id: 4, name: "Hand-woven Abaca Bag", category: "Fashion", price: "₱750.00", stock: 12, status: "Active" },
    { id: 5, name: "Coconut Oil Soap", category: "Health", price: "₱85.00", stock: 42, status: "Active" },
  ];

  return (
    <PageTemplate 
      title="Product Management" 
      description="Manage all products in your marketplace"
    >
      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <TabsList>
            <TabsTrigger value="all">All Products</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="outOfStock">Out of Stock</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
          </TabsList>
          
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search products..." className="pl-10 w-full md:w-64" />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Select>
              <SelectTrigger className="w-full md:w-36">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="price-asc">Price (Low-High)</SelectItem>
                <SelectItem value="price-desc">Price (High-Low)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 border-b">Product</th>
                  <th className="text-left p-3 border-b">Category</th>
                  <th className="text-right p-3 border-b">Price</th>
                  <th className="text-right p-3 border-b">Stock</th>
                  <th className="text-left p-3 border-b">Status</th>
                  <th className="text-right p-3 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {demoProducts.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="font-medium">{product.name}</div>
                    </td>
                    <td className="p-3">{product.category}</td>
                    <td className="p-3 text-right">{product.price}</td>
                    <td className="p-3 text-right">{product.stock}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="active" className="mt-0">
          <div className="text-center py-8 text-gray-500">
            Showing only active products
          </div>
        </TabsContent>
        
        <TabsContent value="outOfStock" className="mt-0">
          <div className="text-center py-8 text-gray-500">
            Showing only out of stock products
          </div>
        </TabsContent>
        
        <TabsContent value="draft" className="mt-0">
          <div className="text-center py-8 text-gray-500">
            Showing only draft products
          </div>
        </TabsContent>
      </Tabs>
    </PageTemplate>
  );
};

export default ProductsIndex;
