
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
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Plus, X } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";

const ProductEditPage = () => {
  const { id } = useParams();
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
    gallery_image_urls: [],
    tags: [],
    shipping_info: "",
    return_policy: "",
    specifications: {}
  });

  const [metafields, setMetafields] = useState([
    { key: "Color", value: "Gold" },
    { key: "Jewelry material", value: "Gold" },
    { key: "Age group", value: "Adults" },
    { key: "Bracelet design", value: "Bangle" },
    { key: "Jewelry type", value: "Imitation jewelry" },
    { key: "Target gender", value: "Unisex" }
  ]);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*, vendors(id,shop_name), product_categories(id,name)").eq("id", id).single();
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
        ...formData,
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
        specifications: typeof product.specifications === "object" ? product.specifications : {}
      });
    }
  }, [product]);

  const updateProduct = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from("products").update(data).eq("id", id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      toast.success("Product updated.");
    },
    onError: (err: any) => toast.error("Error: " + err.message)
  });

  const handleSave = () => {
    const updateData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      original_price: formData.original_price ? parseFloat(formData.original_price) : null,
      stock_quantity: parseInt(formData.stock_quantity) || 0
    };
    updateProduct.mutate(updateData);
  };

  const handleChange = (key: string, value: any) => setFormData(prev => ({ ...prev, [key]: value }));
  const addTag = (tag: string) => setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
  const removeTag = (tag: string) => setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));

  if (isLoading) {
    return <AdminLayout title="Loading..."><Skeleton className="h-10 w-full" /></AdminLayout>;
  }

  return (
    <AdminLayout title="Edit Product">
      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-8 px-6 py-10 max-w-screen-2xl mx-auto">
        <div className="space-y-8">
          {/* Product Info */}
          <Card className="shadow border rounded-xl">
            <CardHeader><CardTitle>Product Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input value={formData.name} onChange={(e) => handleChange("name", (e.target as HTMLInputElement).value)} />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={formData.description} onChange={(e) => handleChange("description", (e.target as HTMLTextAreaElement).value)} rows={4} />
              </div>
            </CardContent>
          </Card>

          {/* Media */}
          <Card className="shadow border rounded-xl">
            <CardHeader><CardTitle>Media</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.main_image_url && (
                <img src={formData.main_image_url} alt="" className="w-full aspect-square object-cover rounded-md" />
              )}
              <div className="flex items-center justify-center border border-dashed border-gray-300 rounded-md h-36 cursor-pointer">
                <Plus />
              </div>
            </CardContent>
          </Card>

          {/* SEO Preview */}
          <Card className="shadow border rounded-xl">
            <CardHeader><CardTitle>Search engine listing preview</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-700">
              <p className="text-blue-600">https://yourstore.com/products/{formData.name.toLowerCase().replace(/\s+/g, '-') || "product"}</p>
              <p className="font-medium text-black">{formData.name || "Product name"}</p>
              <p>{formData.description || "Your product description will show up here."}</p>
              <p className="font-semibold text-black">₦{parseFloat(formData.price || "0").toLocaleString()}</p>
            </CardContent>
          </Card>

          {/* Metafields */}
          <Card className="shadow border rounded-xl">
            <CardHeader><CardTitle>Category Metafields</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {metafields.map((field, index) => (
                <div key={index}>
                  <Label>{field.key}</Label>
                  <Input value={field.value} readOnly className="bg-gray-100" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="shadow border rounded-xl">
            <CardHeader><CardTitle>Status</CardTitle></CardHeader>
            <CardContent>
              <Select value={formData.is_active ? "active" : "draft"} onValueChange={(val) => handleChange("is_active", val === "active")}> 
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="shadow border rounded-xl">
            <CardHeader><CardTitle>Vendor</CardTitle></CardHeader>
            <CardContent>
              <Select value={formData.vendor_id} onValueChange={(val) => handleChange("vendor_id", val)}>
                <SelectTrigger><SelectValue placeholder="Select vendor" /></SelectTrigger>
                <SelectContent>
                  {vendors?.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id}>{vendor.shop_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="shadow border rounded-xl">
            <CardHeader><CardTitle>Tags</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center gap-2">
                    {tag}<X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                  </Badge>
                ))}
              </div>
              <Input placeholder="Add tag..." onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const target = e.target as HTMLInputElement;
                  addTag(target.value);
                  target.value = "";
                }
              }} className="mt-2" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sticky Save Button */}
      <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end z-50">
        <Button className="bg-black text-white px-6 py-2 rounded-md" onClick={handleSave}>Save</Button>
      </div>
    </AdminLayout>
  );
};

export default ProductEditPage;
