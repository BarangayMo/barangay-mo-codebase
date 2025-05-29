
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DashboardPageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Plus, Upload, X, Save, Eye, Copy, MoreHorizontal } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const ProductEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    original_price: "",
    stock_quantity: "",
    sku: "",
    brand: "",
    category_id: "",
    vendor_id: "",
    is_active: true,
    main_image_url: "",
    gallery_image_urls: [] as string[],
    tags: [] as string[],
    shipping_info: "",
    return_policy: "",
    specifications: {} as Record<string, any>,
  });

  const [variants, setVariants] = useState([
    { id: 1, name: "Gold", price: "7000.00", quantity: "2" }
  ]);

  const [metafields, setMetafields] = useState([
    { key: "Color", value: "Gold" },
    { key: "Jewelry material", value: "Gold" },
    { key: "Age group", value: "Adults" },
    { key: "Bracelet design", value: "Bangle" },
    { key: "Jewelry type", value: "Imitation jewelry" },
    { key: "Target gender", value: "Unisex" },
  ]);

  // Fetch product data
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) throw new Error('No product ID provided');
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          vendors (id, shop_name),
          product_categories (id, name)
        `)
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  // Fetch vendors
  const { data: vendors } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('shop_name');
      if (error) throw error;
      return data;
    },
  });

  // Update form data when product loads
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        original_price: product.original_price?.toString() || "",
        stock_quantity: product.stock_quantity?.toString() || "",
        sku: product.sku || "",
        brand: product.brand || "",
        category_id: product.category_id || "",
        vendor_id: product.vendor_id || "",
        is_active: product.is_active,
        main_image_url: product.main_image_url || "",
        gallery_image_urls: product.gallery_image_urls || [],
        tags: product.tags || [],
        shipping_info: product.shipping_info || "",
        return_policy: product.return_policy || "",
        specifications: (typeof product.specifications === 'object' && product.specifications !== null) 
          ? product.specifications as Record<string, any> 
          : {},
      });
    }
  }, [product]);

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async (updatedData: any) => {
      const { error } = await supabase
        .from('products')
        .update(updatedData)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update product: ' + error.message);
    },
  });

  const handleSave = () => {
    const updatedData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      original_price: formData.original_price ? parseFloat(formData.original_price) : null,
      stock_quantity: parseInt(formData.stock_quantity) || 0,
    };
    updateProductMutation.mutate(updatedData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ 
      ...prev, 
      tags: prev.tags.filter(tag => tag !== tagToRemove) 
    }));
  };

  const breadcrumbItems = [
    { label: "Smarketplace", href: "/admin/smarketplace" },
    { label: "Products", href: "/admin/smarketplace/products/all" },
    { label: product?.name || "Edit Product" }
  ];

  if (isLoading) {
    return (
      <AdminLayout title="Edit Product">
        <div className="space-y-6">
          <Skeleton className="h-16 w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-96 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Product">
      <DashboardPageHeader
        title={product?.name || "Edit Product"}
        breadcrumbItems={breadcrumbItems}
        actionButton={{
          label: "Save",
          onClick: handleSave,
          icon: <Save className="h-4 w-4" />,
          variant: "dashboard"
        }}
        secondaryActions={[
          {
            label: "View",
            onClick: () => window.open(`/marketplace/product/${id}`, '_blank'),
            icon: <Eye className="h-4 w-4" />,
            variant: "outline"
          },
          {
            label: "Duplicate",
            onClick: () => toast.info("Duplicate functionality coming soon"),
            icon: <Copy className="h-4 w-4" />,
            variant: "outline"
          },
          {
            label: "More actions",
            onClick: () => {},
            icon: <MoreHorizontal className="h-4 w-4" />,
            variant: "outline"
          }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title and Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">Title</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div>
                <Input className="border-gray-300 rounded-sm text-sm"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Product title"
                  className="text-lg font-medium"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Description</Label>
                <div className="border border-gray-300 rounded-md p-4 min-h-[200px] bg-white">
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Five coils of unapologetic elegance. But hey, why wear something that makes your entire wrist look intentional when you could just not?"
                    className="border-0 p-0 resize-none min-h-[180px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Media */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">Media</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {formData.main_image_url && (
                  <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
                    <img 
                      src={formData.main_image_url} 
                      alt="Product" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="aspect-square bg-white border border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:shadow-sm transition">
                  <Plus className="h-8 w-8 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Price</Label>
                  <Input className="border-gray-300 rounded-sm text-sm"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Compare at price</Label>
                  <Input className="border-gray-300 rounded-sm text-sm"
                    type="number"
                    value={formData.original_price}
                    onChange={(e) => handleInputChange('original_price', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">SKU</Label>
                  <Input className="border-gray-300 rounded-sm text-sm"
                    value={formData.sku}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                    placeholder="Product SKU"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Quantity</Label>
                  <Input className="border-gray-300 rounded-sm text-sm"
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => handleInputChange('stock_quantity', e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Variants */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-800">Variants</CardTitle>
              <Button className="rounded-md px-3 py-2 text-sm" variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add variant
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">Color</div>
                <div className="flex gap-2">
                  <Badge variant="secondary">Gold</Badge>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 text-sm font-medium">
                    <div>Variant</div>
                    <div>Price</div>
                    <div>Available</div>
                    <div></div>
                  </div>
                  {variants.map((variant) => (
                    <div key={variant.id} className="grid grid-cols-4 gap-4 p-4 border-b hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-yellow-400 rounded"></div>
                        <span>{variant.name}</span>
                      </div>
                      <div>₱ {variant.price}</div>
                      <div>{variant.quantity}</div>
                      <div></div>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total inventory at Shop location: 2 available
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category metafields */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">Category metafields</CardTitle>
              <div className="text-sm text-muted-foreground">Bracelets in Jewelry</div>
            </CardHeader>
            <CardContent className="space-y-4">
              {metafields.map((field, index) => (
                <div key={index} className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">{field.key}</Label>
                    <Input className="border-gray-300 rounded-sm text-sm" value={field.value} readOnly className="bg-gray-50" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Select 
                value={formData.is_active ? "active" : "draft"} 
                onValueChange={(value) => handleInputChange('is_active', value === "active")}
              >
                <SelectTrigger className="h-10 bg-white border border-gray-300 rounded-sm text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Publishing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">Publishing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Online Store</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product organization */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">Product organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Type</Label>
                <Input className="border-gray-300 rounded-sm text-sm"
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  placeholder="Product type"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Vendor</Label>
                <Select 
                  value={formData.vendor_id} 
                  onValueChange={(value) => handleInputChange('vendor_id', value)}
                >
                  <SelectTrigger className="h-10 bg-white border border-gray-300 rounded-sm text-sm">
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors?.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        {vendor.shop_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Collections</Label>
                <div className="flex gap-2 flex-wrap mt-2">
                  <Badge variant="secondary">All Products</Badge>
                  <Badge variant="secondary">Bracelets</Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Tags</Label>
                <div className="flex gap-2 flex-wrap mt-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} className="bg-gray-100 rounded-full text-sm px-3 py-1 flex items-center gap-1">
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
                <Input className="border-gray-300 rounded-sm text-sm"
                  placeholder="Add tags..."
                  className="mt-2"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addTag(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductEditPage;
