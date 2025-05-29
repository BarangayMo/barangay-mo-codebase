import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Input,
  Textarea,
  Button,
  Label,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Badge,
  Skeleton
} from "@/components/ui";
import { Plus, X } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";

const ProductEditPage = () => {
  const { id } = useParams();
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
      const { data, error } = await supabase
        .from("products")
        .select(`*, vendors (id, shop_name), product_categories (id, name)`) 
        .eq("id", id)
        .single();
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

  const updateProductMutation = useMutation({
    mutationFn: async (updatedData) => {
      const { error } = await supabase
        .from("products")
        .update(updatedData)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["product", id]);
      toast.success("Product updated successfully");
    },
    onError: (error) => toast.error("Failed to update: " + error.message)
  });

  const handleSave = () => {
    const updated = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      original_price: formData.original_price ? parseFloat(formData.original_price) : null,
      stock_quantity: parseInt(formData.stock_quantity) || 0
    };
    updateProductMutation.mutate(updated);
  };

  const handleChange = (key, val) => setFormData((prev) => ({ ...prev, [key]: val }));

  const handleTagAdd = (tag) => {
    if (tag && !formData.tags.includes(tag))
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
  };

  const handleTagRemove = (tag) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  if (isLoading) {
    return (
      <AdminLayout title="Edit Product">
        <Skeleton className="h-10 w-full" />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Product">
      <div className="max-w-screen-xl mx-auto px-6 py-10 space-y-8">
        {/* TITLE + DESCRIPTION */}
        <Card className="shadow-sm rounded-xl border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Title</Label>
              <Input value={formData.name} onChange={(e) => handleChange("name", e.target.value)} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={formData.description} onChange={(e) => handleChange("description", e.target.value)} rows={4} />
            </div>
          </CardContent>
        </Card>

        {/* MEDIA */}
        <Card className="shadow-sm rounded-xl border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Media</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {formData.main_image_url && (
              <img src={formData.main_image_url} alt="" className="w-full aspect-square object-cover rounded-md" />
            )}
            <div className="flex items-center justify-center border border-dashed border-gray-300 rounded-md h-36 cursor-pointer">
              <Plus />
            </div>
          </CardContent>
        </Card>

        {/* ORGANIZATION */}
        <Card className="shadow-sm rounded-xl border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Organization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Type</Label>
              <Input value={formData.brand} onChange={(e) => handleChange("brand", e.target.value)} />
            </div>
            <div>
              <Label>Vendor</Label>
              <Select value={formData.vendor_id} onValueChange={(val) => handleChange("vendor_id", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  {vendors?.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id}>{vendor.shop_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, idx) => (
                  <Badge key={idx} className="rounded-full px-3 py-1 text-sm bg-gray-100 flex items-center gap-2">
                    {tag}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleTagRemove(tag)} />
                  </Badge>
                ))}
              </div>
              <Input placeholder="Add tag..." onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleTagAdd(e.target.value);
                  e.target.value = "";
                }
              }} className="mt-2" />
            </div>
          </CardContent>
        </Card>

        {/* SEO SECTION */}
        <Card className="shadow-sm rounded-xl border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Search engine listing</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            <p>{formData.name}</p>
            <p>{formData.description}</p>
            <p className="mt-1 font-semibold">₦{parseFloat(formData.price).toLocaleString()}</p>
          </CardContent>
        </Card>

        {/* SAVE BUTTON */}
        <div className="flex justify-end pt-6">
          <Button onClick={handleSave} className="px-6 py-2 text-white bg-black rounded-md hover:bg-gray-900">Save</Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductEditPage;
