import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Heart, MessageSquare, Package, Star, Truck, Check, ShoppingCart, Store } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard, ProductCardType } from "@/components/marketplace/ProductCard"; // For similar products
import { cn } from "@/lib/utils";

// More detailed Product type for this page
export interface ProductDetailType {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  original_price?: number | null;
  stock_quantity: number;
  sku?: string | null;
  category_id?: string | null; // Will fetch category name separately if needed for display
  product_categories?: { id: string, name: string } | null; // If joined
  vendor_id: string; // Will fetch vendor details
  vendors?: { // This structure comes from Supabase join
      id: string;
      shop_name: string;
      shop_description?: string | null;
      logo_url?: string | null;
      is_verified?: boolean | null;
      created_at: string; // Assuming these come from a vendor fetch
      // user_id for further queries if needed for chat etc.
      // These stats would ideally come from aggregated queries or vendor specific table
      // rating: number; 
      // followers: number;
      // responseRate: number;
  } | null;
  brand?: string | null;
  main_image_url?: string | null;
  gallery_image_urls?: string[] | null;
  is_active?: boolean | null;
  tags?: string[] | null;
  weight_kg?: number | null;
  dimensions_cm?: { length?: number; width?: number; height?: number } | null;
  average_rating?: number | null;
  rating_count?: number | null;
  sold_count?: number | null;
  created_at: string;
  // Mocked fields to remove or replace:
  // highlights?: string[]; // Can derive from description or a new field
  // specifications?: Record<string, string>; // Derive from brand, weight, dimensions
}

const fetchProductById = async (productId: string): Promise<ProductDetailType | null> => {
  if (!productId) return null;
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      vendors (*), 
      product_categories (id, name)
    `)
    .eq("id", productId)
    .eq("is_active", true)
    .single();

  if (error) {
    console.error("Error fetching product by ID:", error);
    throw error;
  }
  return data as ProductDetailType | null;
};

const fetchSimilarProducts = async (categoryId?: string | null, currentProductId?: string): Promise<ProductCardType[]> => {
  let query = supabase
    .from("products")
    .select(`
      id, name, price, original_price, stock_quantity, main_image_url, average_rating, rating_count, sold_count, is_active, tags,
      vendors (shop_name), 
      product_categories (name)
    `)
    .eq('is_active', true)
    .limit(4); // Fetch 4 similar products

  if (categoryId && currentProductId) {
    query = query.eq('category_id', categoryId).neq('id', currentProductId);
  } else if (currentProductId) {
    query = query.neq('id', currentProductId);
  }
  
  const { data, error } = await query;
  if (error) {
    console.error("Error fetching similar products:", error);
    return [];
  }
  return data as ProductCardType[];
};


export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  
  const { data: product, isLoading, error } = useQuery<ProductDetailType | null>({
    queryKey: ['product', productId],
    queryFn: () => fetchProductById(productId!),
    enabled: !!productId,
  });

  const { data: similarProducts, isLoading: isLoadingSimilar } = useQuery<ProductCardType[]>({
    queryKey: ['similarProducts', product?.product_categories?.id, productId],
    queryFn: () => fetchSimilarProducts(product?.product_categories?.id, productId),
    enabled: !!product, // Fetch only when main product data is available
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, qty }: { productId: string; qty: number }) => {
      if (!user) {
        toast({ title: "Login Required", description: "Please login to add items to your cart.", variant: "destructive" });
        throw new Error("User not authenticated");
      }
      const { data: existingItem, error: fetchError } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      if (existingItem) {
        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + qty })
          .eq('id', existingItem.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert({ product_id: productId, user_id: user.id, quantity: qty });
        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      toast({
        title: "Added to cart",
        description: `${product?.name} has been added to your cart.`,
      });
      queryClient.invalidateQueries({ queryKey: ['cartItems'] });
    },
    onError: (err: Error) => {
      toast({
        title: "Error",
        description: err.message || "Could not add item to cart.",
        variant: "destructive",
      });
    },
  });
  
  const handleAddToCart = () => {
    if (!product) return;
    addToCartMutation.mutate({ productId: product.id, qty: quantity });
  };
  
  const handleBuyNow = () => {
    if (!product) return;
    // Check if mutation is already pending for the "Add to Cart" action with the same quantity
    // This check is to prevent re-triggering navigation if "Buy Now" is clicked while "Add to Cart" is processing.
    // However, the core logic of Buy Now might be different (e.g., direct to checkout with item details).
    // For now, it adds to cart then navigates.
    if (addToCartMutation.isPending && addToCartMutation.variables?.productId === product.id && addToCartMutation.variables?.qty === quantity) {
      // If "Add to Cart" is already processing this exact item and quantity,
      // we might want to wait for it to complete or handle differently.
      // For simplicity, we allow proceeding, but this could be refined.
    }
    
    addToCartMutation.mutate({ productId: product.id, qty: quantity}, {
      onSuccess: () => {
        // Original onSuccess still runs (toast, invalidateQueries)
        // Then navigate
        navigate("/marketplace/cart");
      }
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto p-6 space-y-6">
          <Skeleton className="h-8 w-1/3" />
          <div className="grid md:grid-cols-2 gap-6">
            <Skeleton className="w-full aspect-square rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto p-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">Product Not Found</h2>
          <p className="text-muted-foreground mb-6">
            {error ? error.message : "The product you are looking for does not exist or is no longer available."}
          </p>
          <Button asChild>
            <Link to="/marketplace">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Marketplace
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const discountPercentage = product.original_price && product.price < product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;
  
  const isAvailable = product.is_active !== false && product.stock_quantity > 0;

  const specifications: Record<string, string> = {};
  if (product.brand) specifications["Brand"] = product.brand;
  if (product.product_categories?.name) specifications["Category"] = product.product_categories.name;
  if (product.weight_kg) specifications["Weight"] = `${product.weight_kg} kg`;
  if (product.dimensions_cm) {
    let dims = [];
    if (product.dimensions_cm.length) dims.push(`L: ${product.dimensions_cm.length}cm`);
    if (product.dimensions_cm.width) dims.push(`W: ${product.dimensions_cm.width}cm`);
    if (product.dimensions_cm.height) dims.push(`H: ${product.dimensions_cm.height}cm`);
    if (dims.length > 0) specifications["Dimensions"] = dims.join(' x ');
  }
  if (product.sku) specifications["SKU"] = product.sku;


  return (
    <Layout>
      <div className="max-w-5xl mx-auto pb-20 px-4">
        <div className="flex items-center my-4">
          <Link to="/marketplace" className="flex items-center text-sm text-muted-foreground hover:text-primary">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Marketplace
          </Link>
        </div>
        
        <div className="bg-white rounded-lg border overflow-hidden mb-6">
          <div className="grid md:grid-cols-2 gap-6 p-6">
            {/* Product Images Column */}
            <div>
              {product.main_image_url ? (
                <img 
                  src={product.main_image_url} 
                  alt={product.name}
                  className="w-full aspect-square object-contain bg-gray-50 rounded-lg mb-4"
                />
              ) : (
                <div className="w-full aspect-square bg-gray-100 flex items-center justify-center rounded-lg mb-4">
                  <Package className="text-gray-400 w-16 h-16" />
                </div>
              )}
              {/* Gallery Images */}
              {product.gallery_image_urls && product.gallery_image_urls.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {product.gallery_image_urls.slice(0,3).map((url, index) => (
                    <img key={index} src={url} alt={`${product.name} gallery ${index + 1}`} className="w-full aspect-square object-contain bg-gray-50 rounded"/>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Details Column */}
            <div>
              <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1">{product.average_rating?.toFixed(1) || 'N/A'}</span>
                  <span className="text-muted-foreground ml-1">({product.rating_count || 0} ratings)</span>
                </div>
                <div className="text-muted-foreground">
                  {product.sold_count || 0} sold
                </div>
              </div>
              
              <div className="mb-4 bg-gray-50 p-3 rounded">
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold text-red-500">₱{product.price.toFixed(2)}</div>
                  {discountPercentage > 0 && product.original_price && (
                    <>
                      <div className="line-through text-muted-foreground">₱{product.original_price.toFixed(2)}</div>
                      <Badge variant="destructive">-{discountPercentage}%</Badge>
                    </>
                  )}
                </div>
                 {/* Placeholder for other promotions like coins */}
              </div>
              
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex items-start gap-2">
                  <div className="text-muted-foreground w-24 shrink-0">Seller:</div>
                  <div className="flex items-center">
                    {product.vendors?.is_verified && (
                      <Badge variant="secondary" className="mr-1 bg-blue-100 text-blue-700">
                        Verified
                      </Badge>
                    )}
                    <Link to={`/shops/${product.vendors?.id}`} className="text-primary hover:underline">
                      {product.vendors?.shop_name || "Unknown Seller"}
                    </Link>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="text-muted-foreground w-24 shrink-0">Shipping:</div>
                  <div className="flex items-center">
                    <Truck className="h-4 w-4 mr-1.5 text-green-600" />
                    {product.tags?.includes("FREE_SHIPPING") ? "Free Shipping Available" : "Standard Shipping"}
                     {/* Placeholder for shipping details/options */}
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="text-muted-foreground w-24 shrink-0">Availability:</div>
                  <div className={cn(isAvailable ? "text-green-600" : "text-red-600", "font-medium")}>
                    {isAvailable ? `${product.stock_quantity} in stock` : "Out of stock"}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="text-sm text-muted-foreground w-24 shrink-0">Quantity:</div>
                  <div className="flex items-center">
                    <button 
                      className="w-8 h-8 flex items-center justify-center border rounded-l-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      disabled={!isAvailable || quantity <= 1}
                    >
                      -
                    </button>
                    <div className="w-12 h-8 flex items-center justify-center border-t border-b text-center">
                      {quantity}
                    </div>
                    <button
                      className="w-8 h-8 flex items-center justify-center border rounded-r-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setQuantity(prev => Math.min(prev + 1, product.stock_quantity || 1))}
                      disabled={!isAvailable || quantity >= (product.stock_quantity || 0)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 border-primary text-primary hover:bg-primary/5"
                  onClick={handleAddToCart}
                  disabled={!isAvailable || (addToCartMutation.isPending && addToCartMutation.variables?.productId === product.id && addToCartMutation.variables?.qty === quantity)}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {addToCartMutation.isPending && addToCartMutation.variables?.productId === product.id && addToCartMutation.variables?.qty === quantity ? "Adding..." : "Add to Cart"}
                </Button>
                <Button 
                  className="flex-1 bg-red-500 hover:bg-red-600"
                  onClick={handleBuyNow}
                  disabled={!isAvailable || (addToCartMutation.isPending && addToCartMutation.variables?.productId === product.id && addToCartMutation.variables?.qty === quantity)}
                >
                  {addToCartMutation.isPending && addToCartMutation.variables?.productId === product.id && addToCartMutation.variables?.qty === quantity ? "Processing..." : "Buy Now"}
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-[2fr_1fr] gap-6">
          {/* Left Column: Tabs for Description, Specs, Reviews */}
          <div className="bg-white rounded-lg border overflow-hidden">
            <Tabs defaultValue="description">
              <TabsList className="w-full justify-start border-b rounded-none px-6 bg-gray-50">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({product.rating_count || 0})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="p-6">
                <h3 className="text-lg font-semibold mb-4">Product Description</h3>
                <div className="prose prose-sm max-w-none text-gray-700">
                  {product.description || "No description available."}
                </div>
                {/* Placeholder for product highlights if you add them to schema */}
              </TabsContent>
              
              <TabsContent value="specifications" className="p-6">
                <h3 className="text-lg font-semibold mb-4">Product Specifications</h3>
                {Object.keys(specifications).length > 0 ? (
                  <div className="space-y-2">
                    {Object.entries(specifications).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-3 py-2 border-b last:border-0">
                        <div className="text-muted-foreground">{key}</div>
                        <div className="col-span-2 text-gray-800">{value}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No specifications available.</p>
                )}
              </TabsContent>
              
              <TabsContent value="reviews" className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Customer Reviews</h3>
                  {product.rating_count && product.rating_count > 0 && (
                    <div className="flex items-center">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 font-bold">{product.average_rating?.toFixed(1)}</span>
                      <span className="text-muted-foreground ml-1">({product.rating_count} reviews)</span>
                    </div>
                  )}
                </div>
                {/* Placeholder for actual reviews list */}
                <div className="text-center py-8 text-muted-foreground">
                  No reviews yet for this product.
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Right Column: Shop Information */}
          {product.vendors && (
            <div className="bg-white rounded-lg border overflow-hidden self-start sticky top-20">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Shop Information</h3>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    {product.vendors.logo_url ? (
                      <AvatarImage src={product.vendors.logo_url} alt={product.vendors.shop_name} />
                    ) : (
                      <AvatarFallback>
                        <Store className="h-6 w-6" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <Link to={`/shops/${product.vendors.id}`} className="font-medium text-primary hover:underline">
                        {product.vendors.shop_name}
                    </Link>
                    <div className="text-xs text-muted-foreground">
                      Joined: {new Date(product.vendors.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                {/* Placeholder for vendor stats like rating, followers, response rate */}
                {/* These would typically require more complex queries or a separate vendor stats table */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                    <div className="text-center p-2 bg-gray-50 rounded"><span className="font-medium">{product.sold_count || 0}</span> Products Sold (by this shop)</div>
                    <div className="text-center p-2 bg-gray-50 rounded"><span className="font-medium">{product.vendors.is_verified ? "Yes" : "No"}</span> Verified Seller</div>
                </div>
                <Button variant="outline" className="w-full mb-2">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Chat with Seller
                </Button>
                <Button variant="secondary" className="w-full" asChild>
                  <Link to={`/shops/${product.vendors.id}`}>
                    <Store className="mr-2 h-4 w-4" />
                    Visit Shop
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Similar Products Section */}
        {isLoadingSimilar ? (
          <div className="mt-8">
            <Skeleton className="h-8 w-1/4 mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-60 w-full" />)}
            </div>
          </div>
        ) : similarProducts && similarProducts.length > 0 && (
          <div className="mt-8 bg-white rounded-lg border overflow-hidden p-6">
            <h3 className="text-lg font-semibold mb-4">Similar Products</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similarProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
