
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, X, Upload, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoleButton } from "@/components/ui/role-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DashboardPageHeader } from "@/components/dashboard/PageHeader";

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  stock_quantity: string;
  category_id: string;
  is_active: boolean;
  vendor_id?: string;
  main_image_url?: string;
  additional_images?: string[];
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
    stock_quantity: "",
    category_id: "",
    is_active: true,
    main_image_url: "",
    additional_images: [],
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
        stock_quantity: product.stock_quantity?.toString() || "",
        category_id: product.category_id || "",
        is_active: product.is_active ?? true,
        vendor_id: product.vendor_id || "",
        main_image_url: product.main_image_url || "",
        additional_images: product.gallery_image_urls || [],
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
    queryClient.invalidateQueries({ queryKey: ['superadmin-products'] }); // Adjust if your query key is different
    toast.success(isEditing ? 'Product updated successfully' : 'Product created successfully');
    handleBackToProducts(); // Make sure this navigates to /admin/smarketplace/products
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
      <div className="p-6 max-w-7xl mx-auto">
        <DashboardPageHeader
          title={isEditing ? 'Edit Product' : 'Create Product'}
          description={isEditing ? 'Update your product information' : 'Fill in product details'}
          breadcrumbItems={[
            { label: 'S-Marketplace', href: '/admin/smarketplace' },
            { label: 'Products', href: '/admin/smarketplace/products' },
            { label: isEditing ? 'Edit Product' : 'Create Product' }
          ]}
          actionButton={{
            label: saveProductMutation.isPending ? (isEditing ? 'Saving...' : 'Creating...') : (isEditing ? 'Save & Publish' : 'Create'),
            onClick: () => formRef.current?.requestSubmit(),
            icon: <Save className="h-4 w-4" />,
            variant: 'default',
            disabled: saveProductMutation.isPending
          }}
          secondaryActions={[{
            label: 'Back to List',
            onClick: handleBackToProducts,
            icon: <ArrowLeft className="h-4 w-4" />,
            variant: 'ghost'
          }]}
        />

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter product name"
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      SKU will be automatically generated when the product is created
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Enter product description"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        placeholder="0.00"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stock_quantity">Stock Quantity *</Label>
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

                    <div className="space-y-2">
                      <Label htmlFor="category_id">Category</Label>
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
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                    />
                    <Label htmlFor="is_active">Active Product</Label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Product Images</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Main Image */}
                  <div className="space-y-2">
                    <Label>Main Product Image</Label>
                    <div className="flex items-center gap-4">
                      {formData.main_image_url && (
                        <div className="relative">
                          <img 
                            src={formData.main_image_url} 
                            alt="Main product" 
                            className="w-20 h-20 object-cover rounded-md border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                            onClick={() => handleInputChange('main_image_url', '')}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                      <div className="flex-1">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file, true);
                          }}
                          className="hidden"
                          id="main-image-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('main-image-upload')?.click()}
                          className="flex items-center gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          {formData.main_image_url ? 'Change Main Image' : 'Upload Main Image'}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Additional Images */}
                  <div className="space-y-2">
                    <Label>Additional Images</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.additional_images?.map((imageUrl, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={imageUrl} 
                            alt={`Additional ${index + 1}`} 
                            className="w-full h-20 object-cover rounded-md border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                            onClick={() => removeAdditionalImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      <div className="flex items-center justify-center h-20 md:h-24 md:w-35 border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400 ">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file, false);
                          }}
                          className="hidden"
                          id="additional-image-upload"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => document.getElementById('additional-image-upload')?.click()}
                          className="h-full w-full flex flex-col items-center gap-1 text-gray-500 md:h-32 md:w-32 lg:h-36 lg:w-36"
                        >
                          <Plus className="h-5 w-5 md:h-6 md:w-6" />
                          <span className="text-xs md:text-sm lg:text-base whitespace-nowrap">Add Image</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <RoleButton
              type="submit"
              disabled={saveProductMutation.isPending}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {saveProductMutation.isPending ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}
            </RoleButton>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={saveProductMutation.isPending}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter product name"
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      SKU will be automatically generated when the product is created
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Enter product description"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        placeholder="0.00"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stock_quantity">Stock Quantity *</Label>
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

                    <div className="space-y-2">
                      <Label htmlFor="category_id">Category</Label>
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
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                    />
                    <Label htmlFor="is_active">Active Product</Label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Product Images</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Main Image */}
                  <div className="space-y-2">
                    <Label>Main Product Image</Label>
                    <div className="flex items-center gap-4">
                      {formData.main_image_url && (
                        <div className="relative">
                          <img 
                            src={formData.main_image_url} 
                            alt="Main product" 
                            className="w-20 h-20 object-cover rounded-md border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                            onClick={() => handleInputChange('main_image_url', '')}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                      <div className="flex-1">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file, true);
                          }}
                          className="hidden"
                          id="main-image-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('main-image-upload')?.click()}
                          className="flex items-center gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          {formData.main_image_url ? 'Change Main Image' : 'Upload Main Image'}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Additional Images */}
                  <div className="space-y-2">
                    <Label>Additional Images</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.additional_images?.map((imageUrl, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={imageUrl} 
                            alt={`Additional ${index + 1}`} 
                            className="w-full h-20 object-cover rounded-md border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                            onClick={() => removeAdditionalImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      <div className="flex items-center justify-center h-20 md:h-24 border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file, false);
                          }}
                          className="hidden"
                          id="additional-image-upload"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => document.getElementById('additional-image-upload')?.click()}
                          className="h-full w-full flex flex-col items-center gap-1 text-gray-500 md:h-32 md:w-32 lg:h-36 lg:w-36"
                        >
                          <Plus className="h-5 w-5 md:h-6 md:w-6" />
                          <span className="text-xs md:text-sm lg:text-base whitespace-nowrap">Add Image</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <RoleButton
              type="submit"
              disabled={saveProductMutation.isPending || !currentVendor}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {saveProductMutation.isPending ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}
            </RoleButton>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={saveProductMutation.isPending}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ProductEditPage;
