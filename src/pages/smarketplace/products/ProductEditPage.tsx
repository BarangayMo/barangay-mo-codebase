import { useState, useEffect, useMemo } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { 
  Plus, 
  X, 
  Bold, 
  Italic, 
  Underline, 
  Link, 
  List, 
  AlignLeft, 
  Upload, 
  Search, 
  Package,
  Barcode,
  Weight,
  DollarSign,
  Eye,
  EyeOff,
  Tag,
  Truck,
  Save
} from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { formatPHP } from "@/utils/currency";
import { DashboardPageHeader } from "@/components/dashboard/PageHeader";

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

interface Collection {
  id: string;
  name: string;
  description: string;
  color: string;
  is_default: boolean;
}

const ProductEditPage = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

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

  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);

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

  const { data: collections } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const { data, error } = await supabase.from("collections").select("*").order("name");
      if (error) throw error;
      return data;
    }
  });

  const { data: productCollections } = useQuery({
    queryKey: ["product-collections", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_collections")
        .select("collection_id")
        .eq("product_id", id);
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  // Filter collections based on search term
  const filteredCollections = useMemo(() => {
    if (!collections) return [];
    if (!searchTerm) return collections;
    return collections.filter(collection => 
      collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (collection.description && collection.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [collections, searchTerm]);

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

  useEffect(() => {
    if (productCollections) {
      setSelectedCollections(productCollections.map(pc => pc.collection_id));
    }
  }, [productCollections]);

  const updateProduct = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from("products").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      toast.success("Product updated successfully!");
    },
    onError: (err: any) => toast.error("Error: " + err.message)
  });

  const updateProductCollections = useMutation({
    mutationFn: async (collectionIds: string[]) => {
      // First, delete existing relationships
      await supabase.from("product_collections").delete().eq("product_id", id);
      
      // Then, insert new relationships
      if (collectionIds.length > 0) {
        const relationships = collectionIds.map(collectionId => ({
          product_id: id,
          collection_id: collectionId
        }));
        const { error } = await supabase.from("product_collections").insert(relationships);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-collections", id] });
    }
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

  const toggleCollection = (collectionId: string) => {
    setSelectedCollections(prev => {
      const newSelection = prev.includes(collectionId)
        ? prev.filter(id => id !== collectionId)
        : [...prev, collectionId];
      
      updateProductCollections.mutate(newSelection);
      return newSelection;
    });
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
    <AdminLayout title="Edit Product">
      <div className="w-full max-w-none">
        <DashboardPageHeader
          title="Edit product"
          breadcrumbItems={[
            { label: "Catalog", href: "/admin/smarketplace" },
            { label: "Products", href: "/admin/smarketplace/products" },
            { label: "Edit product" }
          ]}
          secondaryActions={[
            {
              label: "Save as Draft",
              onClick: () => handleSave(),
              variant: "outline" as const,
              icon: <Save className="h-4 w-4" />
            }
          ]}
          actionButton={{
            label: "Save Product",
            onClick: handleSave,
            variant: "default" as const,
            icon: <Save className="h-4 w-4" />
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8">
          {/* Left Column - Product Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Section */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-medium text-gray-500 uppercase flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  PRODUCT
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-medium">Title</Label>
                  <Input 
                    value={formData.name} 
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="mt-1"
                    placeholder="Enter product title"
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <div className="mt-1">
                    <RichTextEditor
                      value={formData.description}
                      onChange={(value) => handleChange("description", value)}
                      placeholder="Product description..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Inventory Section */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-medium text-gray-500 uppercase flex items-center gap-2">
                  <Barcode className="h-4 w-4" />
                  INVENTORY
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium">Quantity</Label>
                    <div className="flex items-center mt-1">
                      <Button variant="outline" size="sm" className="px-3 h-10 rounded-r-none border-r-0">-</Button>
                      <Input 
                        value={formData.stock_quantity}
                        onChange={(e) => handleChange("stock_quantity", e.target.value)}
                        className="text-center rounded-none border-x-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        type="number"
                      />
                      <Button variant="outline" size="sm" className="px-3 h-10 rounded-l-none border-l-0">+</Button>
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
                <div className="mt-6">
                  <div className="flex items-center space-x-2">
                    <Switch checked={true} />
                    <span className="text-sm text-gray-600">Continue selling when out of stock</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Media Section */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-medium text-gray-500 uppercase flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  MEDIA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 mb-1">Drag drop some files here, or click to select files</p>
                  <p className="text-xs text-gray-400">1080 x 1080 (1:1) recommended, up to 2MB each</p>
                </div>
              </CardContent>
            </Card>

            {/* Variation Section */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-medium text-gray-500 uppercase">VARIATION</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">This product is variable: has different colors, size, weight, etc.</p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Organization & Settings */}
          <div className="space-y-6">
            {/* Product Status */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-medium text-gray-500 uppercase">PRODUCT STATUS</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label className="text-sm font-medium flex items-center gap-2">
                    {formData.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    Status
                  </Label>
                  <Select 
                    value={formData.is_active ? "active" : "draft"} 
                    onValueChange={(v) => handleChange("is_active", v === "active")}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-2">
                    {formData.is_active 
                      ? "This product will be visible to customers" 
                      : "This product will be hidden from customers"
                    }
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-medium text-gray-500 uppercase flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  PRICING
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Price</Label>
                    <div className="flex items-center mt-1">
                      <div className="flex items-center bg-gray-50 border border-r-0 rounded-l-md px-3 py-2 text-sm text-gray-500">
                        ₱
                      </div>
                      <Input 
                        value={formData.price}
                        onChange={(e) => handleChange("price", e.target.value)}
                        placeholder="0.00"
                        className="rounded-l-none"
                        type="number"
                        step="0.01"
                      />
                    </div>
                    {formData.price && (
                      <p className="text-xs text-gray-500 mt-1">
                        {formatPHP(parseFloat(formData.price) || 0)}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Compare at price</Label>
                    <div className="flex items-center mt-1">
                      <div className="flex items-center bg-gray-50 border border-r-0 rounded-l-md px-3 py-2 text-sm text-gray-500">
                        ₱
                      </div>
                      <Input 
                        value={formData.original_price}
                        onChange={(e) => handleChange("original_price", e.target.value)}
                        placeholder="0.00"
                        className="rounded-l-none"
                        type="number"
                        step="0.01"
                      />
                    </div>
                    {formData.original_price && (
                      <p className="text-xs text-gray-500 mt-1">
                        {formatPHP(parseFloat(formData.original_price) || 0)}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Organization */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-medium text-gray-500 uppercase flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  ORGANIZATION
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-medium">Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="flex items-center gap-1 px-2 py-1">
                        {tag}
                        <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => removeTag(tag)} />
                      </Badge>
                    ))}
                  </div>
                  <Input 
                    placeholder="T-shirt, Black, Classic"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = "";
                      }
                    }}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Collections</Label>
                  
                  <div className="mt-2 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search collections..." 
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <ScrollArea className="h-48 mt-3 border rounded-md">
                    <div className="p-3 space-y-2">
                      {filteredCollections?.map((collection) => (
                        <div key={collection.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md">
                          <Checkbox
                            checked={selectedCollections.includes(collection.id)}
                            onCheckedChange={() => toggleCollection(collection.id)}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div 
                                className="h-3 w-3 rounded-full" 
                                style={{ backgroundColor: collection.color }}
                              ></div>
                              <span className="text-sm font-medium truncate">{collection.name}</span>
                            </div>
                            {collection.description && (
                              <p className="text-xs text-gray-500 truncate">{collection.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                      {filteredCollections?.length === 0 && (
                        <div className="text-center py-4 text-gray-500 text-sm">
                          {searchTerm ? 'No collections found' : 'No collections available'}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>

            {/* Shipping */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-medium text-gray-500 uppercase flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  SHIPPING
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Weight className="h-4 w-4" />
                    Weight
                  </Label>
                  <div className="flex items-center mt-1">
                    <Input 
                      value={formData.weight_kg}
                      onChange={(e) => handleChange("weight_kg", e.target.value)}
                      placeholder="0"
                      className="flex-1"
                      type="number"
                      step="0.01"
                    />
                    <Select defaultValue="kg">
                      <SelectTrigger className="w-20 ml-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="g">g</SelectItem>
                        <SelectItem value="kg">kg</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Used to calculate shipping rates at checkout and label prices during fulfillment.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Save Button */}
        <div className="sticky bottom-0 bg-white border-t p-4 mt-8">
          <div className="flex justify-end space-x-3">
            <Button 
              variant="outline" 
              onClick={() => handleSave()}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save as Draft
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Product
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductEditPage;
