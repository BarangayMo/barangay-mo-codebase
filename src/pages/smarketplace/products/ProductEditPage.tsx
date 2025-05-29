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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MediaUploadDialog } from "@/components/media/MediaUploadDialog";
import { useMediaLibrary } from "@/hooks/media-library/use-media-library";
import { 
  Plus, 
  X, 
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
  Save,
  Palette,
  Globe,
  Users,
  Settings,
  ImageIcon,
  VideoIcon,
  Minus
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
  seo_title: string;
  seo_description: string;
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
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [newCollection, setNewCollection] = useState({ name: "", description: "", color: "#3b82f6" });

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
    weight_kg: "",
    seo_title: "",
    seo_description: ""
  });

  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [variations, setVariations] = useState<any[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  // Media library hook
  const { mediaFiles, refetch: refetchMedia } = useMediaLibrary();

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

  // Create collection mutation
  const createCollection = useMutation({
    mutationFn: async (collection: any) => {
      const { data, error } = await supabase
        .from("collections")
        .insert([collection])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      toast.success("Collection created successfully!");
      setShowCreateCollection(false);
      setNewCollection({ name: "", description: "", color: "#3b82f6" });
    }
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
        weight_kg: product.weight_kg?.toString() || "",
        seo_title: product.seo_title || "",
        seo_description: product.seo_description || ""
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

  const handleQuantityChange = (delta: number) => {
    const currentQty = parseInt(formData.stock_quantity) || 0;
    const newQty = Math.max(0, currentQty + delta);
    handleChange("stock_quantity", newQty.toString());
  };

  const addVariation = () => {
    setVariations(prev => [...prev, { 
      type: "color", 
      name: "", 
      values: [],
      newValue: ""
    }]);
  };

  const updateVariation = (index: number, field: string, value: any) => {
    setVariations(prev => prev.map((v, i) => i === index ? { ...v, [field]: value } : v));
  };

  const addVariationValue = (index: number) => {
    const variation = variations[index];
    if (variation.newValue) {
      setVariations(prev => prev.map((v, i) => 
        i === index 
          ? { 
              ...v, 
              values: [...v.values, {
                value: v.newValue,
                color: v.type === "color" ? generateRandomColor() : null
              }],
              newValue: ""
            }
          : v
      ));
    }
  };

  const generateRandomColor = () => {
    const colors = ["#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e", "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", "#f43f5e"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleImageSelect = (imageUrl: string) => {
    if (!selectedImages.includes(imageUrl)) {
      const newImages = [...selectedImages, imageUrl];
      setSelectedImages(newImages);
      
      // Set first image as main image
      if (newImages.length === 1) {
        handleChange("main_image_url", imageUrl);
      }
      
      // Update gallery
      handleChange("gallery_image_urls", newImages);
    }
  };

  const removeImage = (imageUrl: string) => {
    const newImages = selectedImages.filter(img => img !== imageUrl);
    setSelectedImages(newImages);
    
    // Update main image if removed
    if (formData.main_image_url === imageUrl && newImages.length > 0) {
      handleChange("main_image_url", newImages[0]);
    } else if (newImages.length === 0) {
      handleChange("main_image_url", "");
    }
    
    handleChange("gallery_image_urls", newImages);
  };

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
            icon: <Save className="h-4 w-4" />,
            className: "bg-blue-600 hover:bg-blue-700"
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
                      className="min-h-[200px] resize-y"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SEO Section */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-medium text-gray-500 uppercase flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  SEO
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">SEO Title</Label>
                  <Input 
                    value={formData.seo_title} 
                    onChange={(e) => handleChange("seo_title", e.target.value)}
                    placeholder="SEO optimized title"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">SEO Description</Label>
                  <Textarea 
                    value={formData.seo_description} 
                    onChange={(e) => handleChange("seo_description", e.target.value)}
                    placeholder="SEO meta description"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Product Slug</Label>
                  <Input 
                    value={formData.slug} 
                    onChange={(e) => handleChange("slug", e.target.value)}
                    placeholder="product-url-slug"
                    className="mt-1"
                  />
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
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="px-3 h-10 rounded-r-none border-r-0"
                        onClick={() => handleQuantityChange(-1)}
                        type="button"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input 
                        value={formData.stock_quantity}
                        onChange={(e) => handleChange("stock_quantity", e.target.value)}
                        className="text-center rounded-none border-x-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        type="number"
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="px-3 h-10 rounded-l-none border-l-0"
                        onClick={() => handleQuantityChange(1)}
                        type="button"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
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
                  <ImageIcon className="h-4 w-4" />
                  MEDIA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    onClick={() => setShowMediaUpload(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Media
                  </Button>
                  
                  {/* Selected Images */}
                  {selectedImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-4">
                      {selectedImages.map((imageUrl, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={imageUrl} 
                            alt={`Product ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          {index === 0 && (
                            <Badge className="absolute top-1 left-1 text-xs bg-blue-600">Main</Badge>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                            onClick={() => removeImage(imageUrl)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Media Library */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Choose from Library</Label>
                    <ScrollArea className="h-48 border rounded-md p-3">
                      <div className="grid grid-cols-4 gap-2">
                        {mediaFiles?.filter(file => file.content_type.startsWith('image/')).map((file) => (
                          <div 
                            key={file.id} 
                            className="relative cursor-pointer hover:opacity-80"
                            onClick={() => handleImageSelect(file.file_url)}
                          >
                            <img 
                              src={file.file_url} 
                              alt={file.filename}
                              className="w-full h-16 object-cover rounded border"
                            />
                            {selectedImages.includes(file.file_url) && (
                              <div className="absolute inset-0 bg-blue-600 bg-opacity-50 flex items-center justify-center rounded">
                                <Checkbox checked className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Variation Section */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-medium text-gray-500 uppercase flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  VARIATIONS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {variations.map((variation, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center gap-4 mb-4">
                        <Select value={variation.type} onValueChange={(value) => updateVariation(index, "type", value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="color">Color</SelectItem>
                            <SelectItem value="size">Size</SelectItem>
                            <SelectItem value="material">Material</SelectItem>
                            <SelectItem value="style">Style</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input 
                          placeholder="Variation name"
                          value={variation.name}
                          onChange={(e) => updateVariation(index, "name", e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setVariations(prev => prev.filter((_, i) => i !== index))}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex gap-2 mb-2">
                        <Input 
                          placeholder="Add value"
                          value={variation.newValue}
                          onChange={(e) => updateVariation(index, "newValue", e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && addVariationValue(index)}
                        />
                        <Button onClick={() => addVariationValue(index)} size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {variation.values.map((value: any, valueIndex: number) => (
                          <Badge key={valueIndex} variant="secondary" className="flex items-center gap-1">
                            {variation.type === "color" && (
                              <div 
                                className="w-3 h-3 rounded-full border"
                                style={{ backgroundColor: value.color }}
                              />
                            )}
                            {value.value}
                            <X 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => updateVariation(index, "values", variation.values.filter((_: any, i: number) => i !== valueIndex))}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  <Button onClick={addVariation} variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Variation
                  </Button>
                </div>
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

            {/* Vendor Assignment */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-medium text-gray-500 uppercase flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  VENDOR
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label className="text-sm font-medium">Assign to Vendor</Label>
                  <Select value={formData.vendor_id} onValueChange={(value) => handleChange("vendor_id", value)}>
                    <SelectTrigger className="mt-1">
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
                {/* ... keep existing tags section */}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium">Collections</Label>
                    <Dialog open={showCreateCollection} onOpenChange={setShowCreateCollection}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="h-7 px-2">
                          <Plus className="h-3 w-3 mr-1" />
                          New
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create New Collection</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Collection Name</Label>
                            <Input 
                              value={newCollection.name}
                              onChange={(e) => setNewCollection(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="Enter collection name"
                            />
                          </div>
                          <div>
                            <Label>Description</Label>
                            <Textarea 
                              value={newCollection.description}
                              onChange={(e) => setNewCollection(prev => ({ ...prev, description: e.target.value }))}
                              placeholder="Collection description"
                            />
                          </div>
                          <div>
                            <Label>Color</Label>
                            <div className="flex gap-2 mt-1">
                              <input 
                                type="color" 
                                value={newCollection.color}
                                onChange={(e) => setNewCollection(prev => ({ ...prev, color: e.target.value }))}
                                className="w-12 h-10 border rounded"
                              />
                              <Input 
                                value={newCollection.color}
                                onChange={(e) => setNewCollection(prev => ({ ...prev, color: e.target.value }))}
                                placeholder="#3b82f6"
                              />
                            </div>
                          </div>
                          <Button 
                            onClick={() => createCollection.mutate(newCollection)}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                          >
                            Create Collection
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  <div className="relative">
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

        {/* Media Upload Dialog */}
        <MediaUploadDialog 
          open={showMediaUpload}
          onOpenChange={setShowMediaUpload}
          onUploadComplete={() => {
            refetchMedia();
            setShowMediaUpload(false);
          }}
        />
      </div>
    </AdminLayout>
  );
};

export default ProductEditPage;
