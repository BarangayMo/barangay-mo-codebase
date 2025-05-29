
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, X, Bold, Italic, Underline, Link, List, AlignLeft, Upload, ChevronDown, Search } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";

interface FormData {
  name: string;
  slug: string;
  description: string;
  price: string;
  original_price: string;
  stock_quantity: string;
  sku: string;
  brand: string;
  category_id: string;
  vendor_id: string;
  is_active: boolean;
  main_image_url: string;
  gallery_image_urls: string[];
  tags: string[];
  shipping_info: string;
  return_policy: string;
  specifications: Record<string, any>;
  weight_kg?: string;
}

const ProductEditPage = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    slug: "",
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
    gallery_image_urls: [],
    tags: [],
    shipping_info: "",
    return_policy: "",
    specifications: {},
    weight_kg: ""
  });

  const [collections, setCollections] = useState<string[]>([]);
  const [selectedCollection, setSelectedCollection] = useState("");

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  const { data: vendors } = useQuery({
    queryKey: ["vendors"],
    queryFn: async () => {
      const { data, error } = await supabase.from("vendors").select("*");
      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        slug: product.name?.toLowerCase().replace(/\s+/g, '-') || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        original_price: product.original_price?.toString() || "",
        stock_quantity: product.stock_quantity?.toString() || "",
        sku: product.sku || "",
        brand: product.brand || "",
        category_id: product.category_id || "",
        vendor_id: product.vendor_id || "",
        is_active: product.is_active ?? true,
        main_image_url: product.main_image_url || "",
        gallery_image_urls: product.gallery_image_urls || [],
        tags: product.tags || [],
        shipping_info: product.shipping_info || "",
        return_policy: product.return_policy || "",
        specifications: (typeof product.specifications === 'object' && product.specifications !== null) ? 
          product.specifications as Record<string, any> : {},
        weight_kg: product.weight_kg?.toString() || ""
      });
    }
  }, [product]);

  const updateProduct = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from("products").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      toast.success("Product updated.");
    },
    onError: (err: any) => toast.error("Error: " + err.message)
  });

  const handleChange = (key: keyof FormData, value: any) => setFormData(prev => ({ ...prev, [key]: value }));

  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  const handleSave = () => {
    updateProduct.mutate({
      ...formData,
      price: parseFloat(formData.price) || 0,
      original_price: formData.original_price ? parseFloat(formData.original_price) : null,
      stock_quantity: parseInt(formData.stock_quantity) || 0,
      weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null
    });
  };

  if (isLoading) {
    return (
      <AdminLayout title="Loading...">
        <div className="p-6">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Product" hidePageHeader>
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                📊 Catalog / Products / Edit product
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline">Save as Draft</Button>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                Save Product
              </Button>
            </div>
          </div>
          <h1 className="text-2xl font-semibold mt-4">Edit product</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Left Column - Product Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-500 uppercase">PRODUCT</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Title</Label>
                  <Input 
                    value={formData.name} 
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <div className="mt-1 border rounded-md">
                    <div className="flex items-center space-x-2 px-3 py-2 border-b bg-gray-50">
                      <Button size="sm" variant="ghost"><Bold className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost"><Italic className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost"><Underline className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost"><Link className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost"><List className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost"><AlignLeft className="h-4 w-4" /></Button>
                    </div>
                    <Textarea 
                      value={formData.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      className="border-0 resize-none min-h-[120px]"
                      placeholder="Product description..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Inventory Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-500 uppercase">INVENTORY</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Quantity</Label>
                    <div className="flex items-center mt-1">
                      <Button variant="outline" size="sm" className="px-2">-</Button>
                      <Input 
                        value={formData.stock_quantity}
                        onChange={(e) => handleChange("stock_quantity", e.target.value)}
                        className="text-center mx-1"
                      />
                      <Button variant="outline" size="sm" className="px-2">+</Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">SKU</Label>
                    <Input 
                      value={formData.sku}
                      onChange={(e) => handleChange("sku", e.target.value)}
                      placeholder="####-###-###"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center space-x-2">
                    <Switch checked={true} />
                    <span className="text-sm">Continue selling when out of stock</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Media Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-500 uppercase">MEDIA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Drag drop some files here, or click to select files</p>
                  <p className="text-xs text-gray-400 mt-1">1080 x 1080 (1:1) recommended, up to 2MB each</p>
                </div>
              </CardContent>
            </Card>

            {/* Variation Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-500 uppercase">VARIATION</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">This product is variable: has different colors, size, weight, etc.</p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Organization & Settings */}
          <div className="space-y-6">
            {/* Organization */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-500 uppercase">ORGANIZATION</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                      </Badge>
                    ))}
                  </div>
                  <Input 
                    placeholder="T-shirt, Black, Classic"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addTag((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = "";
                      }
                    }}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Collections</Label>
                  <Select value={selectedCollection} onValueChange={setSelectedCollection}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="My Collections" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="my-collections">My Collections</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="branded">Branded</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="mt-2 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search" className="pl-10" />
                  </div>

                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <span className="text-sm">My Collections</span>
                      <div className="h-2 w-2 bg-orange-400 rounded-full"></div>
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <span className="text-sm">Technology</span>
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <span className="text-sm">Branded</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-500 uppercase">SHIPPING</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label className="text-sm font-medium">Weight</Label>
                  <div className="flex items-center mt-1">
                    <Input 
                      value={formData.weight_kg}
                      onChange={(e) => handleChange("weight_kg", e.target.value)}
                      placeholder="0"
                      className="flex-1"
                    />
                    <Select defaultValue="g">
                      <SelectTrigger className="w-16 ml-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="g">g</SelectItem>
                        <SelectItem value="kg">kg</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Used to calculate shipping rates at checkout and label prices during fulfillment.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-500 uppercase">PRICING</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Price</Label>
                    <div className="flex items-center mt-1">
                      <Input 
                        value={formData.price}
                        onChange={(e) => handleChange("price", e.target.value)}
                        placeholder="0.00"
                      />
                      <span className="ml-2 text-sm text-gray-500">USD</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Sale price</Label>
                    <div className="flex items-center mt-1">
                      <Input 
                        value={formData.original_price}
                        onChange={(e) => handleChange("original_price", e.target.value)}
                        placeholder="0.00"
                      />
                      <span className="ml-2 text-sm text-gray-500">USD</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-500 uppercase">PRODUCT STATUS</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Select value={formData.is_active ? "active" : "draft"} onValueChange={(v) => handleChange("is_active", v === "active")}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductEditPage;
