
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
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Plus, X } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";

const ProductEditPage = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    original_price: "",
    stock_quantity: "",
    sku: "",
    barcode: "",
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

  const [variants, setVariants] = useState([
    { id: 1, name: "Gold", price: "7000.00", quantity: "2" }
  ]);

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
      setFormData(prev => ({
        ...prev,
        ...product,
        slug: product.name?.toLowerCase().replace(/\s+/g, '-') || ""
      }));
    }
  }, [product]);

  const updateProduct = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from("products").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["product", id]);
      toast.success("Product updated.");
    },
    onError: (err: any) => toast.error("Error: " + err.message)
  });

  const handleChange = (key: string, value: any) => setFormData(prev => ({ ...prev, [key]: value }));

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
      stock_quantity: parseInt(formData.stock_quantity) || 0
    });
  };

  return (
    <AdminLayout title="Edit Product">
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-8 px-6 py-10">
        <div className="space-y-6">
          <Accordion type="multiple" className="space-y-6">
            <AccordionItem value="product-details">
              <AccordionTrigger>Product Details</AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Title</Label>
                      <Input value={formData.name} onChange={(e) => handleChange("name", e.target.value)} />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea rows={4} value={formData.description} onChange={(e) => handleChange("description", e.target.value)} />
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="media">
              <AccordionTrigger>Media</AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.main_image_url && (
                        <img src={formData.main_image_url} className="rounded-md object-cover w-full aspect-square" />
                      )}
                      <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-32 cursor-pointer">
                        <Plus />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="inventory">
              <AccordionTrigger>Inventory</AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>SKU</Label>
                      <Input value={formData.sku} onChange={(e) => handleChange("sku", e.target.value)} />
                    </div>
                    <div>
                      <Label>Quantity</Label>
                      <Input type="number" value={formData.stock_quantity} onChange={(e) => handleChange("stock_quantity", e.target.value)} />
                    </div>
                    <div>
                      <Label>Barcode</Label>
                      <Input value={formData.barcode} onChange={(e) => handleChange("barcode", e.target.value)} />
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="variants">
              <AccordionTrigger>Variants</AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="text-left p-2">Variant</th>
                            <th className="text-left p-2">Price</th>
                            <th className="text-left p-2">Quantity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {variants.map(v => (
                            <tr key={v.id} className="border-t">
                              <td className="p-2">{v.name}</td>
                              <td className="p-2">₦{v.price}</td>
                              <td className="p-2">{v.quantity}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="seo">
              <AccordionTrigger>Search Engine Listing</AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>URL and handle</Label>
                      <div className="text-sm text-blue-600">
                        https://yourstore.com/products/<Input className="inline w-auto" value={formData.slug} onChange={(e) => handleChange("slug", e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <Label>Meta title</Label>
                      <Input value={formData.name} onChange={(e) => handleChange("name", e.target.value)} />
                    </div>
                    <div>
                      <Label>Meta description</Label>
                      <Textarea rows={3} value={formData.description} onChange={(e) => handleChange("description", e.target.value)} />
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Status</CardTitle></CardHeader>
            <CardContent>
              <Select value={formData.is_active ? "active" : "draft"} onValueChange={(v) => handleChange("is_active", v === "active")}> 
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Vendor</CardTitle></CardHeader>
            <CardContent>
              <Select value={formData.vendor_id} onValueChange={(v) => handleChange("vendor_id", v)}>
                <SelectTrigger><SelectValue placeholder="Select vendor" /></SelectTrigger>
                <SelectContent>
                  {vendors?.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id}>{vendor.shop_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Tags</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, idx) => (
                  <Badge key={idx} className="bg-gray-100 rounded-full px-3 py-1 flex items-center gap-2">
                    {tag} <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                  </Badge>
                ))}
              </div>
              <Input placeholder="Add tag..." onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addTag((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = "";
                }
              }} className="mt-2" />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end z-50">
        <Button onClick={handleSave} className="bg-black text-white px-6 py-2 rounded-md">Save</Button>
      </div>
    </AdminLayout>
  );
};

export default ProductEditPage;
