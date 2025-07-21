
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useUserApproval } from "@/hooks/use-user-approval";
import { MediaUpload } from "@/components/ui/media-upload";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price must be positive"),
  original_price: z.number().optional(),
  stock_quantity: z.number().min(0, "Stock quantity must be non-negative"),
  category_id: z.string().min(1, "Category is required"),
  weight: z.number().optional(),
  dimensions: z.string().optional(),
  tags: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function AddProduct() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: approval, isLoading: checkingApproval } = useUserApproval();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mainImage, setMainImage] = useState<string>("");
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [categories, setCategories] = useState([]);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      stock_quantity: 1,
      price: 0,
    },
  });

  // Load categories on component mount
  useState(() => {
    const loadCategories = async () => {
      const { data } = await supabase
        .from('product_categories')
        .select('id, name')
        .order('name');
      
      setCategories(data || []);
    };
    loadCategories();
  });

  // Redirect if not approved
  if (!checkingApproval && !approval?.canAddProducts) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <h2 className="text-xl font-semibold mb-2">Approval Required</h2>
              <p className="text-muted-foreground mb-4">
                Your account needs to be approved by an admin before you can add products.
              </p>
              <Button onClick={() => navigate("/marketplace")}>
                Back to Marketplace
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const onSubmit = async (data: ProductFormData) => {
    if (!user?.id) return;

    setIsSubmitting(true);
    try {
      // Get vendor ID for the user
      const { data: vendor } = await supabase
        .from('vendors')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!vendor) {
        toast({
          title: "Error",
          description: "Vendor profile not found. Please contact support.",
          variant: "destructive"
        });
        return;
      }

      // Prepare tags array
      const tagsArray = data.tags ? data.tags.split(',').map(tag => tag.trim()) : [];

      // Insert product
      const { error } = await supabase
        .from('products')
        .insert({
          name: data.name,
          description: data.description,
          price: data.price,
          original_price: data.original_price || data.price,
          stock_quantity: data.stock_quantity,
          category_id: data.category_id,
          vendor_id: vendor.id,
          main_image_url: mainImage,
          additional_images: additionalImages,
          weight: data.weight,
          dimensions: data.dimensions,
          tags: tagsArray,
          is_active: true,
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Product added successfully!",
      });

      navigate("/marketplace");
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddImage = (url: string) => {
    if (additionalImages.length < 5) {
      setAdditionalImages(prev => [...prev, url]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/marketplace")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Add New Product</h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter product name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your product in detail"
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category: any) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Pricing & Inventory */}
              <Card>
                <CardHeader>
                  <CardTitle>Pricing & Inventory</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (₱)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="original_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Original Price (₱) - Optional</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stock_quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock Quantity</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Main Image</label>
                  <MediaUpload
                    value={mainImage}
                    onChange={setMainImage}
                    onRemove={() => setMainImage("")}
                    accept="image/*"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Additional Images (Max 5)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {additionalImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={image} 
                          alt={`Additional ${index + 1}`}
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    
                    {additionalImages.length < 5 && (
                      <div className="h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                        <MediaUpload
                          onChange={handleAddImage}
                          onRemove={() => {}}
                          accept="image/*"
                          className="h-full w-full"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Details */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg) - Optional</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dimensions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dimensions - Optional</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 10cm x 15cm x 5cm" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags (comma-separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., organic, handmade, local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/marketplace")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding Product..." : "Add Product"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Layout>
  );
}
