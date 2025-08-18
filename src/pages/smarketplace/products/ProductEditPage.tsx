import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, X, Upload, Plus, Trash2, Eye, EyeOff, Package, ShoppingCart, Truck, BarChart3, Tag, Search, Globe, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoleButton } from "@/components/ui/role-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DashboardPageHeader } from "@/components/dashboard/PageHeader";

interface ProductVariant {
  id: string;
  option1?: string;
  option2?: string;
  option3?: string;
  price: string;
  compare_price?: string;
  cost_per_item?: string;
  inventory_quantity: string;
  sku?: string;
  barcode?: string;
  track_quantity: boolean;
  continue_selling: boolean;
  requires_shipping: boolean;
  weight?: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  compare_price?: string;
  cost_per_item?: string;
  stock_quantity: string;
  category_id: string;
  is_active: boolean;
  vendor_id?: string;
  main_image_url?: string;
  additional_images?: string[];
  // Inventory
  track_quantity: boolean;
  continue_selling: boolean;
  // Shipping
  requires_shipping: boolean;
  weight?: string;
  // SEO
  seo_title?: string;
  seo_description?: string;
  url_handle?: string;
  // Organization
  product_type?: string;
  tags?: string[];
  // Variants
  has_variants: boolean;
  option1_name?: string;
  option1_values?: string[];
  option2_name?: string;
  option2_values?: string[];
  option3_name?: string;
  option3_values?: string[];
  variants?: ProductVariant[];
}

const ProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, userRole } = useAuth();
  const isEditing = id !== "new";

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    compare_price: "",
    cost_per_item: "",
    stock_quantity: "",
    category_id: "",
    is_active: true,
    main_image_url: "",
    additional_images: [],
    track_quantity: true,
    continue_selling: false,
    requires_shipping: true,
    weight: "",
    seo_title: "",
    seo_description: "",
    url_handle: "",
    product_type: "",
    tags: [],
    has_variants: false,
    option1_name: "",
    option1_values: [],
    option2_name: "",
    option2_values: [],
    option3_name: "",
    option3_values: [],
    variants: [],
  });

  const [vendorCreationError, setVendorCreationError] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  // Handle image upload
  const handleImageUpload = async (file: File, isMainImage = false) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('User Uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('User Uploads')
        .getPublicUrl(filePath);

      if (isMainImage) {
        handleInputChange('main_image_url', publicUrl);
      } else {
        const currentImages = formData.additional_images || [];
        handleInputChange('additional_images', [...currentImages, publicUrl]);
      }

      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    }
  };

  const removeAdditionalImage = (index: number) => {
    const currentImages = formData.additional_images || [];
    const newImages = currentImages.filter((_, i) => i !== index);
    handleInputChange('additional_images', newImages);
  };

  // Fetch product categories
  const { data: categories } = useQuery({
    queryKey: ['product-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  // Create vendor mutation
  const createVendorMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const vendorData = {
        user_id: user.id,
        shop_name: `${user.name || user.firstName || 'User'} Shop`,
        shop_description: `Welcome to ${user.name || user.firstName || 'User'}'s shop!`,
        is_verified: true
      };

      const { data, error } = await supabase
        .from('vendors')
        .insert([vendorData])
        .select()
        .single();

      if (error) {
        // Check if it's a duplicate error
        if (error.code === '23505') {
          // Unique constraint violation - vendor already exists
          const { data: existingVendor, error: fetchError } = await supabase
            .from('vendors')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (fetchError) {
            throw new Error('Failed to retrieve existing vendor information');
          }

          return existingVendor;
        }
        throw error;
      }

      return data;
    },
    onError: (error) => {
      console.error('Vendor creation error:', error);
      setVendorCreationError(error.message);
    },
    onSuccess: () => {
      setVendorCreationError(null);
      // Invalidate vendor query to refresh
      queryClient.invalidateQueries({ queryKey: ['user-vendor', user?.id] });
    },
  });

  // Fetch or create user's vendor info
  const { data: vendor, isLoading: isVendorLoading, error: vendorError } = useQuery({
    queryKey: ['user-vendor', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      console.log('Fetching vendor for user:', user.id);
      
      // First try to find existing vendor
      const { data: existingVendor, error: fetchError } = await supabase
        .from('vendors')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching vendor:', fetchError);
        throw new Error('Failed to fetch vendor information');
      }
      
      // If vendor exists, return it
      if (existingVendor) {
        console.log('Found existing vendor:', existingVendor);
        return existingVendor;
      }
      
      // If no vendor exists, we'll need to create one
      console.log('No vendor found, will need to create one');
      return null;
    },
    enabled: !!user?.id,
  });

  // Auto-create vendor if none exists
  useEffect(() => {
    if (user?.id && vendor === null && !isVendorLoading && !vendorError && !createVendorMutation.isPending) {
      console.log('Auto-creating vendor for user');
      createVendorMutation.mutate();
    }
  }, [user?.id, vendor, isVendorLoading, vendorError, createVendorMutation]);

  // Fetch existing product if editing (with user filtering)
  const { data: product } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!isEditing || !id) return null;
      
      let query = supabase
        .from('products')
        .select('*, vendors!inner(*)')
        .eq('id', id);
      
      // If not superadmin, filter by user's vendor
      if (userRole !== 'superadmin' && user?.id) {
        query = query.eq('vendors.user_id', user.id);
      }
      
      const { data, error } = await query.single();
      if (error) throw error;
      return data;
    },
    enabled: isEditing && !!id,
  });

  // Populate form with existing product data
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        compare_price: "",
        cost_per_item: "",
        stock_quantity: product.stock_quantity?.toString() || "",
        category_id: product.category_id || "",
        is_active: product.is_active ?? true,
        vendor_id: product.vendor_id || "",
        main_image_url: product.main_image_url || "",
        additional_images: product.gallery_image_urls || [],
        track_quantity: true,
        continue_selling: false,
        requires_shipping: true,
        weight: "",
        seo_title: "",
        seo_description: "",
        url_handle: "",
        product_type: "",
        tags: [],
        has_variants: false,
        option1_name: "",
        option1_values: [],
        option2_name: "",
        option2_values: [],
        option3_name: "",
        option3_values: [],
        variants: [],
      });
    }
  }, [product]);

  // Save product mutation
  const saveProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const currentVendor = vendor || (createVendorMutation.data);
      
      if (!currentVendor?.id) {
        throw new Error('Vendor information not available. Please try again.');
      }

      const productData = {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price) || 0,
        stock_quantity: parseInt(data.stock_quantity) || 0,
        category_id: data.category_id || null,
        is_active: data.is_active,
        vendor_id: currentVendor.id,
        main_image_url: data.main_image_url || null,
        gallery_image_urls: data.additional_images || [],
      };

      if (isEditing && id) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      if (userRole === 'resident') {
        queryClient.invalidateQueries({ queryKey: ['resident-products'] });
        toast.success(isEditing ? 'Product updated successfully' : 'Product created successfully');
        handleBackToProducts();
      } else if (userRole === 'official') {
        queryClient.invalidateQueries({ queryKey: ['official-products'] });
        toast.success(isEditing ? 'Official product updated' : 'Official product created');
        handleBackToProducts();
      } else if (userRole === 'superadmin') {
        queryClient.invalidateQueries({ queryKey: ['superadmin-products'] });
        toast.success(isEditing ? 'Product updated successfully' : 'Product created successfully');
        handleBackToProducts();
      }
    },
    onError: (error) => {
      console.error('Product save error:', error);
      toast.error('Failed to save product: ' + error.message);
    },
  });

  const handleInputChange = (field: keyof ProductFormData, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Valid price is required');
      return;
    }

    if (!formData.stock_quantity || parseInt(formData.stock_quantity) < 0) {
      toast.error('Valid stock quantity is required');
      return;
    }

    const currentVendor = vendor || createVendorMutation.data;
    
    if (isVendorLoading || createVendorMutation.isPending) {
      toast.error('Please wait while we set up your vendor information');
      return;
    }

    if (!currentVendor) {
      toast.error('Unable to create vendor information. Please try again.');
      return;
    }

    saveProductMutation.mutate(formData);
  };

  const handleBackToProducts = () => {
    if (userRole === 'resident') {
      navigate('/resident/products');
    }
    else if (userRole === 'official') {
      navigate('/official/products'); 
    }
    else {
      navigate('/admin/smarketplace/products/all');
    }
  };

  const handleCancel = () => {
    handleBackToProducts();
  };

  // Loading state for vendor setup
  if (isVendorLoading || createVendorMutation.isPending) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Setting up your vendor information...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state for vendor creation
  if (vendorCreationError || (vendorError && !vendor)) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                <h3 className="text-lg font-medium text-red-800 mb-2">Setup Required</h3>
                <p className="text-red-600 mb-4">
                  {vendorCreationError || 'Unable to set up vendor information. This is required to create products.'}
                </p>
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => createVendorMutation.mutate()}
                    disabled={createVendorMutation.isPending}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {createVendorMutation.isPending ? 'Retrying...' : 'Try Again'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleBackToProducts}
                  >
                    Back to Products
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const currentVendor = vendor || createVendorMutation.data;

  return userRole === 'superadmin' ? (
    <AdminLayout title={isEditing ? 'Edit Product' : 'Add Product'}>
      <div className="min-h-screen bg-gray-50">
        {/* Top Header Bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={handleBackToProducts}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    {isEditing ? product?.name || 'Edit Product' : 'Add product'}
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <span>S-Marketplace</span>
                    <span>/</span>
                    <span>Products</span>
                    <span>/</span>
                    <span>{isEditing ? 'Edit' : 'Create'}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={handleBackToProducts}>
                  Discard
                </Button>
                <Button 
                  onClick={() => formRef.current?.requestSubmit()}
                  disabled={saveProductMutation.isPending}
                  className="bg-gray-900 hover:bg-gray-800 text-white"
                >
                  {saveProductMutation.isPending ? (
                    isEditing ? 'Saving...' : 'Creating...'
                  ) : (
                    'Save'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="max-w-7xl mx-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content - Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Product Information Card */}
                <Card className="shadow-sm">
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-gray-900">
                          Title
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Short sleeve t-shirt"
                          className="text-lg font-medium"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium text-gray-900">
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          placeholder="A brief description of your product"
                          rows={4}
                          className="resize-none"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Media Card */}
                <Card className="shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-medium text-gray-900">Media</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <div className="space-y-2">
                        <div className="flex justify-center">
                          <Upload className="h-10 w-10 text-gray-400" />
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Add photos or drag and drop</p>
                          <p className="text-xs text-gray-500">Up to 10 photos</p>
                        </div>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          id="media-upload"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleImageUpload(e.target.files[0], true);
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('media-upload')?.click()}
                          className="mt-2"
                        >
                          Add from computer
                        </Button>
                      </div>
                    </div>
                    
                    {/* Display uploaded images */}
                    {(formData.main_image_url || formData.additional_images?.length) && (
                      <div className="grid grid-cols-4 gap-4">
                        {formData.main_image_url && (
                          <div className="relative aspect-square border border-gray-200 rounded-lg overflow-hidden">
                            <img
                              src={formData.main_image_url}
                              alt="Main product"
                              className="w-full h-full object-cover"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute top-1 right-1 h-6 w-6 p-0 bg-black/50 text-white hover:bg-black/70"
                              onClick={() => handleInputChange('main_image_url', '')}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                        {formData.additional_images?.map((url, index) => (
                          <div key={index} className="relative aspect-square border border-gray-200 rounded-lg overflow-hidden">
                            <img
                              src={url}
                              alt={`Product ${index + 2}`}
                              className="w-full h-full object-cover"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute top-1 right-1 h-6 w-6 p-0 bg-black/50 text-white hover:bg-black/70"
                              onClick={() => removeAdditionalImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Pricing Card */}
                <Card className="shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-medium text-gray-900">Pricing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price" className="text-sm font-medium text-gray-900">
                          Price
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => handleInputChange('price', e.target.value)}
                            placeholder="0.00"
                            className="pl-7"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="compare_price" className="text-sm font-medium text-gray-900">
                          Compare-at price
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <Input
                            id="compare_price"
                            type="number"
                            step="0.01"
                            value={formData.compare_price}
                            onChange={(e) => handleInputChange('compare_price', e.target.value)}
                            placeholder="0.00"
                            className="pl-7"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cost_per_item" className="text-sm font-medium text-gray-900">
                          Cost per item
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <Input
                            id="cost_per_item"
                            type="number"
                            step="0.01"
                            value={formData.cost_per_item}
                            onChange={(e) => handleInputChange('cost_per_item', e.target.value)}
                            placeholder="0.00"
                            className="pl-7"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600">
                      Customers won't see this
                    </div>
                  </CardContent>
                </Card>

                {/* Inventory Card */}
                <Card className="shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-medium text-gray-900">Inventory</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="track_quantity"
                        checked={formData.track_quantity}
                        onCheckedChange={(checked) => handleInputChange('track_quantity', checked as boolean)}
                      />
                      <Label htmlFor="track_quantity" className="text-sm font-medium text-gray-900">
                        Track quantity
                      </Label>
                    </div>
                    
                    {formData.track_quantity && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="stock_quantity" className="text-sm font-medium text-gray-900">
                              Quantity
                            </Label>
                            <Input
                              id="stock_quantity"
                              type="number"
                              min="0"
                              value={formData.stock_quantity}
                              onChange={(e) => handleInputChange('stock_quantity', e.target.value)}
                              placeholder="0"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="continue_selling"
                            checked={formData.continue_selling}
                            onCheckedChange={(checked) => handleInputChange('continue_selling', checked as boolean)}
                          />
                          <Label htmlFor="continue_selling" className="text-sm font-medium text-gray-900">
                            Continue selling when out of stock
                          </Label>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Shipping Card */}
                <Card className="shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-medium text-gray-900">Shipping</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="requires_shipping"
                        checked={formData.requires_shipping}
                        onCheckedChange={(checked) => handleInputChange('requires_shipping', checked as boolean)}
                      />
                      <Label htmlFor="requires_shipping" className="text-sm font-medium text-gray-900">
                        This is a physical product
                      </Label>
                    </div>
                    
                    {formData.requires_shipping && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="weight" className="text-sm font-medium text-gray-900">
                              Weight
                            </Label>
                            <div className="flex">
                              <Input
                                id="weight"
                                type="number"
                                step="0.01"
                                value={formData.weight}
                                onChange={(e) => handleInputChange('weight', e.target.value)}
                                placeholder="0.0"
                                className="rounded-r-none"
                              />
                              <div className="bg-gray-50 border border-l-0 border-gray-300 rounded-r-md px-3 py-2 text-sm text-gray-500">
                                kg
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Variants Card */}
                <Card className="shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-medium text-gray-900">Variants</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="has_variants"
                        checked={formData.has_variants}
                        onCheckedChange={(checked) => handleInputChange('has_variants', checked as boolean)}
                      />
                      <Label htmlFor="has_variants" className="text-sm font-medium text-gray-900">
                        This product has multiple options, like different sizes or colors
                      </Label>
                    </div>
                    
                    {formData.has_variants && (
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-900">Option name</Label>
                              <Input
                                value={formData.option1_name}
                                onChange={(e) => handleInputChange('option1_name', e.target.value)}
                                placeholder="Size"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-900">Option values</Label>
                              <Input
                                value={formData.option1_values?.join(', ')}
                                onChange={(e) => handleInputChange('option1_values', e.target.value.split(', ').filter(v => v.trim()))}
                                placeholder="Small, Medium, Large"
                              />
                            </div>
                          </div>
                          
                          {formData.option1_name && (
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Input
                                  value={formData.option2_name}
                                  onChange={(e) => handleInputChange('option2_name', e.target.value)}
                                  placeholder="Color"
                                />
                              </div>
                              <div className="space-y-2">
                                <Input
                                  value={formData.option2_values?.join(', ')}
                                  onChange={(e) => handleInputChange('option2_values', e.target.value.split(', ').filter(v => v.trim()))}
                                  placeholder="Red, Blue, Green"
                                />
                              </div>
                            </div>
                          )}
                          
                          {formData.option2_name && (
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Input
                                  value={formData.option3_name}
                                  onChange={(e) => handleInputChange('option3_name', e.target.value)}
                                  placeholder="Material"
                                />
                              </div>
                              <div className="space-y-2">
                                <Input
                                  value={formData.option3_values?.join(', ')}
                                  onChange={(e) => handleInputChange('option3_values', e.target.value.split(', ').filter(v => v.trim()))}
                                  placeholder="Cotton, Polyester"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="text-xs text-gray-600">
                          Separate values with commas
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Search Engine Optimization Card */}
                <Card className="shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-medium text-gray-900 flex items-center">
                      <Globe className="h-5 w-5 mr-2" />
                      Search engine listing preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                        {formData.seo_title || formData.name || 'Add a title'}
                      </div>
                      <div className="text-green-700 text-sm">
                        yourstore.com/products/{formData.url_handle || 'product-handle'}
                      </div>
                      <div className="text-gray-600 text-sm mt-1">
                        {formData.seo_description || 'Add a description to see how this product might appear in a search engine listing'}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="seo_title" className="text-sm font-medium text-gray-900">
                          Page title
                        </Label>
                        <Input
                          id="seo_title"
                          value={formData.seo_title}
                          onChange={(e) => handleInputChange('seo_title', e.target.value)}
                          placeholder={formData.name}
                        />
                        <div className="text-xs text-gray-500">
                          {(formData.seo_title || formData.name || '').length} of 70 characters used
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="seo_description" className="text-sm font-medium text-gray-900">
                          Meta description
                        </Label>
                        <Textarea
                          id="seo_description"
                          value={formData.seo_description}
                          onChange={(e) => handleInputChange('seo_description', e.target.value)}
                          rows={3}
                          className="resize-none"
                        />
                        <div className="text-xs text-gray-500">
                          {(formData.seo_description || '').length} of 320 characters used
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="url_handle" className="text-sm font-medium text-gray-900">
                          URL handle
                        </Label>
                        <div className="flex">
                          <div className="bg-gray-50 border border-r-0 border-gray-300 rounded-l-md px-3 py-2 text-sm text-gray-500">
                            yourstore.com/products/
                          </div>
                          <Input
                            id="url_handle"
                            value={formData.url_handle}
                            onChange={(e) => handleInputChange('url_handle', e.target.value)}
                            placeholder="product-handle"
                            className="rounded-l-none"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Product Status Card */}
                <Card className="shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-medium text-gray-900">Product status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Select 
                      value={formData.is_active ? "active" : "draft"} 
                      onValueChange={(value) => handleInputChange('is_active', value === "active")}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            Active
                          </div>
                        </SelectItem>
                        <SelectItem value="draft">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                            Draft
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {/* Product Organization Card */}
                <Card className="shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-medium text-gray-900">Product organization</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="product_type" className="text-sm font-medium text-gray-900">
                        Product type
                      </Label>
                      <Input
                        id="product_type"
                        value={formData.product_type}
                        onChange={(e) => handleInputChange('product_type', e.target.value)}
                        placeholder="e.g. Shirts"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category_id" className="text-sm font-medium text-gray-900">
                        Product category
                      </Label>
                      <Select value={formData.category_id} onValueChange={(value) => handleInputChange('category_id', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories?.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="tags" className="text-sm font-medium text-gray-900">
                        Tags
                      </Label>
                      <Input
                        id="tags"
                        value={formData.tags?.join(', ')}
                        onChange={(e) => handleInputChange('tags', e.target.value.split(', ').filter(t => t.trim()))}
                        placeholder="vintage, cotton, summer"
                      />
                      <div className="text-xs text-gray-500">
                        Separate tags with commas
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Preview Card */}
                <Card className="shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-medium text-gray-900">Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                        {formData.main_image_url ? (
                          <img 
                            src={formData.main_image_url} 
                            alt="Product preview" 
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Package className="h-12 w-12 text-gray-400" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium text-sm">
                          {formData.name || 'Product title'}
                        </div>
                        <div className="text-lg font-semibold">
                          ${formData.price || '0.00'}
                        </div>
                        {formData.compare_price && parseFloat(formData.compare_price) > parseFloat(formData.price || '0') && (
                          <div className="text-sm text-gray-500 line-through">
                            ${formData.compare_price}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  ) : (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={handleBackToProducts}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Product Management</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">
            {isEditing ? 'Update your product information' : 'Create a new product for your marketplace'}
          </p>
          {currentVendor && (
            <p className="text-sm text-gray-600 mt-2">
              Shop: <span className="font-medium">{currentVendor.shop_name}</span>
            </p>
          )}
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Product Information Card */}
              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-gray-900">
                        Product Name
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter product name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-medium text-gray-900">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Describe your product"
                        rows={4}
                        className="resize-none"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Media Card */}
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-medium text-gray-900">Media</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Main Image */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-900">Product Image</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      {formData.main_image_url ? (
                        <div className="relative">
                          <img 
                            src={formData.main_image_url} 
                            alt="Product" 
                            className="mx-auto h-32 w-32 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleInputChange('main_image_url', '')}
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white hover:bg-red-600"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 mb-2">Drop files to upload</p>
                          <label className="cursor-pointer">
                            <span className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                              Choose files
                            </span>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(file, true);
                              }}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Images */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-900">Additional Images</Label>
                    <div className="grid grid-cols-3 gap-4">
                      {formData.additional_images?.map((url, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={url} 
                            alt={`Additional ${index + 1}`} 
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAdditionalImage(index)}
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white hover:bg-red-600"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg h-24 flex items-center justify-center hover:border-gray-400 transition-colors">
                        <label className="cursor-pointer flex flex-col items-center">
                          <Plus className="h-6 w-6 text-gray-400 mb-1" />
                          <span className="text-xs text-gray-500">Add Image</span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, false);
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing Card */}
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-medium text-gray-900">Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-sm font-medium text-gray-900">
                        Price
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₱</span>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.price}
                          onChange={(e) => handleInputChange('price', e.target.value)}
                          placeholder="0.00"
                          className="pl-8"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock_quantity" className="text-sm font-medium text-gray-900">
                        Stock Quantity
                      </Label>
                      <Input
                        id="stock_quantity"
                        type="number"
                        min="0"
                        value={formData.stock_quantity}
                        onChange={(e) => handleInputChange('stock_quantity', e.target.value)}
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Right Column */}
            <div className="space-y-6">
              {/* Product Status */}
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-medium text-gray-900">Product status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="is_active" className="text-sm font-medium text-gray-900">
                        Status
                      </Label>
                      <Switch
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                      />
                    </div>
                    <p className="text-sm text-gray-600">
                      {formData.is_active ? 'Product is active and visible to customers' : 'Product is hidden from customers'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Product Organization */}
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-medium text-gray-900">Product organization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-900">Product category</Label>
                      <Select value={formData.category_id} onValueChange={(value) => handleInputChange('category_id', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories?.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-900">Vendor</Label>
                      <Input 
                        value={currentVendor?.shop_name || ''}
                        disabled
                        className="bg-gray-50 text-sm"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saveProductMutation.isPending}
              className="order-1 sm:order-2"
            >
              {saveProductMutation.isPending ? (
                isEditing ? 'Updating...' : 'Creating...'
              ) : (
                isEditing ? 'Update Product' : 'Create Product'
              )}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ProductEditPage;