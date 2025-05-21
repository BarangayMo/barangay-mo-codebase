import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCard, ProductCardType } from '@/components/marketplace/ProductCard';
import { Star, ChevronLeft, ChevronRight, ShoppingCart, Heart, Minus, Plus, Share2, Store, Truck, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const DEFAULT_PRODUCT_IMAGE = "/lovable-uploads/fde1e978-0d35-49ec-9f4b-1f03b096b981.png";

// Define types based on expected Supabase response and component needs
interface Vendor {
  id: string;
  shop_name: string;
}

interface ProductCategory {
  id: string;
  name: string;
}

interface ProductSpecification {
  key: string;
  value: string;
}

interface ProductDetailType {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  stock_quantity: number;
  main_image_url?: string | null;
  gallery_image_urls?: string[] | null;
  average_rating?: number;
  rating_count?: number;
  sold_count?: number;
  is_active?: boolean;
  tags?: string[];
  specifications?: ProductSpecification[];
  shipping_info?: string | null;
  return_policy?: string | null;
  vendors?: Vendor;
  product_categories?: ProductCategory;
  created_at: string;
}

// Function to fetch product by ID
const fetchProductById = async (productId: string): Promise<ProductDetailType | null> => {
  if (!productId) return null;
  console.log("Fetching product with ID:", productId);
  
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      description,
      price,
      original_price,
      stock_quantity,
      main_image_url,
      gallery_image_urls,
      average_rating,
      rating_count,
      sold_count,
      is_active,
      tags,
      specifications,
      shipping_info,
      return_policy,
      created_at,
      vendors (id, shop_name), 
      product_categories (id, name)
    `)
    .eq('id', productId)
    .single();

  if (error) {
    console.error("Error fetching product by ID:", error.message);
    throw error;
  }
  
  console.log("Product data fetched (raw):", data);

  if (data) {
    let processedSpecifications: ProductSpecification[] | undefined = undefined;
    if (data.specifications && typeof data.specifications === 'object' && !Array.isArray(data.specifications)) {
      // Attempt to parse if it's a single object or a JSON string representing an array
      let specsArray: any[] = [];
      if (typeof data.specifications === 'string') {
        try {
          specsArray = JSON.parse(data.specifications);
        } catch (e) {
          console.warn("Failed to parse specifications JSON string:", data.specifications, e);
        }
      } else if (typeof data.specifications === 'object' && data.specifications !== null) {
        // If it's already an object but not an array, wrap it if it's a single spec
        // This part might need refinement based on actual single object structure
        // For now, assume it might be an array-like object or needs to be treated as an array of one
         if (Array.isArray(data.specifications)) {
           specsArray = data.specifications;
         } else {
            // If it's a single object like {key:"Color", value:"Red"}, this won't work directly
            // The original code was expecting an array.
            // The DB schema for `specifications` is jsonb. It could be `[{key:"k", value:"v"}]` or `{"key":"k", "value":"v"}`.
            // The safest is to expect an array. If it's not, log a warning.
            console.warn("Fetched specifications is an object but not an array as expected:", data.specifications);
         }
      }

      if (Array.isArray(specsArray)) {
        const validSpecifications: ProductSpecification[] = [];
        let allItemsValid = true;
        for (const item of specsArray) {
          if (
            typeof item === 'object' &&
            item !== null &&
            'key' in item &&
            typeof item.key === 'string' &&
            'value' in item &&
            typeof item.value === 'string'
          ) {
            validSpecifications.push({ key: item.key, value: item.value });
          } else {
            allItemsValid = false;
            console.warn("Invalid specification item:", item);
            break; 
          }
        }
        if (allItemsValid && validSpecifications.length > 0) {
          processedSpecifications = validSpecifications;
        } else if (!allItemsValid) {
           console.warn("Fetched specifications array contains one or more invalid items:", specsArray);
        }
      }
    } else if (data.specifications === null) {
      // Specifications are null, which is fine
    }


    const productDetailData: ProductDetailType = {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      original_price: data.original_price,
      stock_quantity: data.stock_quantity,
      main_image_url: data.main_image_url,
      gallery_image_urls: data.gallery_image_urls as string[] | null,
      average_rating: data.average_rating,
      rating_count: data.rating_count,
      sold_count: data.sold_count,
      is_active: data.is_active,
      tags: data.tags as string[] | undefined,
      specifications: processedSpecifications,
      shipping_info: data.shipping_info,
      return_policy: data.return_policy,
      vendors: data.vendors as Vendor | undefined,
      product_categories: data.product_categories as ProductCategory | undefined,
      created_at: data.created_at,
    };
    console.log("Processed product data:", productDetailData);
    return productDetailData;
  }
  
  return null;
};

const fetchSimilarProducts = async (categoryId?: string, currentProductId?: string): Promise<ProductCardType[]> => {
  if (!categoryId || !currentProductId) return [];
  console.log(`Fetching similar products for category ID: ${categoryId}, excluding product ID: ${currentProductId}`);
  
  let query = supabase
    .from("products")
    .select(`
      id,
      name,
      price,
      original_price,
      stock_quantity,
      main_image_url,
      average_rating,
      rating_count,
      sold_count,
      is_active,
      tags,
      vendors (shop_name), 
      product_categories (name)
    `)
    .eq('product_category_id', categoryId)
    .neq('id', currentProductId) // Exclude the current product
    .eq('is_active', true)
    .limit(5);

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching similar products:", error.message);
    throw error;
  }
  // Ensure mapping to ProductCardType if structure differs slightly
  return (data || []).map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    original_price: p.original_price,
    stock_quantity: p.stock_quantity,
    main_image_url: p.main_image_url,
    average_rating: p.average_rating,
    rating_count: p.rating_count,
    sold_count: p.sold_count,
    is_active: p.is_active,
    tags: p.tags,
    vendors: p.vendors as { shop_name: string } | null | undefined,
    product_categories: p.product_categories as { name: string } | null | undefined,
  }));
};


// Main ProductDetail Component
export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth(); // Assuming useAuth provides user info, including user.id
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  
  useEffect(() => {
    console.log("ProductDetail mounted with ID from useParams:", id);
  }, [id]);
  
  const { data: product, isLoading, error } = useQuery<ProductDetailType | null>({
    queryKey: ['product', id], 
    queryFn: () => fetchProductById(id!),
    enabled: !!id,
  });

  const { data: similarProducts, isLoading: isLoadingSimilar } = useQuery<ProductCardType[]>({
    queryKey: ['similarProducts', product?.product_categories?.id, id],
    queryFn: () => fetchSimilarProducts(product?.product_categories?.id, id),
    enabled: !!product?.product_categories?.id && !!id,
  });

  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (product?.main_image_url) {
      setSelectedImage(product.main_image_url);
    } else if (product?.gallery_image_urls && product.gallery_image_urls.length > 0 && product.gallery_image_urls[0]) {
      setSelectedImage(product.gallery_image_urls[0]);
    } else {
       setSelectedImage(DEFAULT_PRODUCT_IMAGE); // Fallback if no images at all
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (!product) {
      toast({ title: "Error", description: "Product not available.", variant: "destructive" });
      return;
    }
    if (!user) {
      toast({ title: "Authentication Required", description: "Please log in to add items to your cart.", variant: "destructive", action: <Button onClick={() => navigate('/login')}>Login</Button> });
      return;
    }
    if (quantity <= 0) {
      toast({ title: "Invalid Quantity", description: "Quantity must be at least 1.", variant: "default" });
      return;
    }
    if (quantity > product.stock_quantity) {
       toast({ 
        title: "Stock Limit Exceeded", 
        description: `Only ${product.stock_quantity} of ${product.name} available.`,
        variant: "default"
      });
      return;
    }
    if (quantity > product.stock_quantity) {
       toast({ 
        title: "Stock Limit Reached", 
        description: `Cannot add ${quantity}. You have ${quantity} in cart, and only ${product.stock_quantity} total stock available.`,
        variant: "default"
      });
      return;
    }


    try {
      const { data: existingItem, error: fetchError } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116: No rows found, not an error here
        throw fetchError;
      }

      const currentCartQuantity = existingItem ? existingItem.quantity : 0;
      if (currentCartQuantity + quantity > product.stock_quantity) {
        toast({ 
          title: "Stock Limit Reached", 
          description: `Cannot add ${quantity}. You have ${currentCartQuantity} in cart, and only ${product.stock_quantity} total stock available.`,
          variant: "default"
        });
        return;
      }
      

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ quantity: newQuantity, added_at: new Date().toISOString() })
          .eq('id', existingItem.id);
        if (updateError) throw updateError;
        toast({ title: "Cart Updated", description: `${product.name} quantity updated in your cart.` });
      } else {
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: product.id,
            quantity: quantity,
          });
        if (insertError) throw insertError;
        toast({
          title: "Added to Cart",
          description: `${quantity} x ${product.name} has been added to your cart.`,
          action: (
            <Button variant="outline" size="sm" onClick={() => navigate('/marketplace/cart')}>
              View Cart
            </Button>
          ),
        });
      }
      queryClient.invalidateQueries({ queryKey: ['cartItems', user.id] });
      queryClient.invalidateQueries({ queryKey: ['cartSummary', user.id] });
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      toast({ title: "Error Adding to Cart", description: `Failed to add item: ${error.message}`, variant: "destructive" });
    }
  };

  const handleBuyNow = () => {
    if (!product) return;
    if (!user) {
      toast({ title: "Authentication Required", description: "Please log in to buy items.", variant: "destructive", action: <Button onClick={() => navigate('/login')}>Login</Button> });
      return;
    }
    if (quantity <= 0) {
      toast({ title: "Invalid Quantity", description: "Quantity must be at least 1.", variant: "default" });
      return;
    }
    if (quantity > product.stock_quantity) {
       toast({ 
        title: "Stock Limit Exceeded", 
        description: `Only ${product.stock_quantity} of ${product.name} available for purchase.`,
        variant: "default"
      });
      return;
    }
    // Navigate to checkout with product info (assuming checkout page handles single item purchase)
    // This might need adjustment if checkout page expects an array of cartItems
    const itemToCheckout = {
      cart_item_id: `buynow-${product.id}-${Date.now()}`, // Synthetic cart_item_id for Buy Now
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.main_image_url || product.gallery_image_urls?.[0] || DEFAULT_PRODUCT_IMAGE,
      seller: product.vendors?.shop_name || "N/A",
      stock_quantity: product.stock_quantity,
      max_quantity: product.stock_quantity, 
    };
    console.log(`Buying ${quantity} of ${product.name} now.`);
    navigate('/marketplace/checkout', { state: { cartItems: [itemToCheckout], total: product.price * quantity, isBuyNow: true } });
  };

  const incrementQuantity = () => setQuantity(prev => Math.min(prev + 1, product?.stock_quantity || 1));
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const discountPercentage = product && product.original_price && product.price < product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  // Create displayGallery using main_image_url and gallery_image_urls
  let displayGallery: string[] = [];
  if (product?.main_image_url) {
    displayGallery.push(product.main_image_url);
  }
  if (product?.gallery_image_urls) {
    product.gallery_image_urls.forEach(imgUrl => {
      if (imgUrl && (!product.main_image_url || imgUrl !== product.main_image_url)) {
        displayGallery.push(imgUrl);
      }
    });
  }
  // If displayGallery is empty after all, add default image
  if (displayGallery.length === 0) {
    displayGallery.push(DEFAULT_PRODUCT_IMAGE);
  }
  // Ensure no duplicates if main_image_url was also in gallery_image_urls
  displayGallery = [...new Set(displayGallery)];

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto p-4 md:p-6">
          <Skeleton className="h-8 w-1/4 mb-4" />
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Skeleton className="w-full h-[300px] md:h-[400px] rounded-lg" />
              <div className="flex gap-2 mt-2">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="w-16 h-16 rounded-md" />)}
              </div>
            </div>
            <div>
              <Skeleton className="h-10 w-3/4 mb-2" />
              <Skeleton className="h-6 w-1/2 mb-4" />
              <Skeleton className="h-20 w-full mb-4" />
              <Skeleton className="h-10 w-1/3 mb-4" />
              <Skeleton className="h-12 w-full mb-4" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    console.error("Error or no product found:", error, "Product ID:", id);
    return (
      <Layout>
        <div className="max-w-5xl mx-auto p-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">Product Not Found</h2>
          <p className="text-muted-foreground mb-6">
            {error ? `Error: ${error.message}` : `The product with ID: ${id} does not exist or is no longer available.`}
          </p>
          <Button asChild>
            <Link to="/marketplace">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Marketplace
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-4 md:p-6">
        {/* Breadcrumbs */}
        <div className="text-sm text-muted-foreground mb-4">
          <Link to="/marketplace" className="hover:underline">Marketplace</Link>
          {product.product_categories && (
            <>
              <ChevronRight className="inline h-4 w-4 mx-1" />
              <Link to={`/marketplace?category=${product.product_categories.name.toLowerCase().replace(/\s+/g, '-')}`} className="hover:underline">
                {product.product_categories.name}
              </Link>
            </>
          )}
          <ChevronRight className="inline h-4 w-4 mx-1" />
          <span className="truncate max-w-[200px] sm:max-w-xs md:max-w-sm inline-block align-bottom">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {/* Image Gallery */}
          <div>
            <div className="border rounded-lg p-2 bg-white mb-2 aspect-square flex items-center justify-center">
              <img 
                src={selectedImage || DEFAULT_PRODUCT_IMAGE} 
                alt={product.name} 
                className="w-full h-auto object-contain rounded-lg max-h-[350px] md:max-h-[400px]"
                onError={(e) => (e.currentTarget.src = DEFAULT_PRODUCT_IMAGE)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {displayGallery.length > 0 && !(displayGallery.length === 1 && displayGallery[0] === DEFAULT_PRODUCT_IMAGE) ? displayGallery.map((imageSrc, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(imageSrc)}
                  className={cn(
                    "w-16 h-16 md:w-20 md:h-20 border rounded-md p-1 flex-shrink-0 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary",
                    selectedImage === imageSrc ? "border-primary ring-2 ring-primary" : "border-gray-200"
                  )}
                >
                  <img 
                    src={imageSrc || DEFAULT_PRODUCT_IMAGE} 
                    alt={`${product.name} thumbnail ${index + 1}`} 
                    className="w-full h-full object-contain"
                    onError={(e) => (e.currentTarget.src = DEFAULT_PRODUCT_IMAGE)}
                  />
                </button>
              )) : (
                 <div className="w-16 h-16 md:w-20 md:h-20 border rounded-md p-1 bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <img 
                      src={DEFAULT_PRODUCT_IMAGE} 
                      alt="Default product thumbnail" 
                      className="w-full h-full object-contain"
                    />
                 </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
            
            <div className="flex items-center gap-4 flex-wrap">
              {product.average_rating && product.average_rating > 0 ? (
                <div className="flex items-center">
                  <span className="text-yellow-500 font-bold mr-1">{product.average_rating.toFixed(1)}</span>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={cn("h-5 w-5", i < Math.round(product.average_rating!) ? "fill-yellow-400 text-yellow-400" : "text-gray-300")} />
                  ))}
                  {product.rating_count !== undefined && <span className="text-sm text-muted-foreground ml-2">({product.rating_count} ratings)</span>}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">No ratings yet</span>
              )}
              {product.sold_count !== undefined && product.sold_count > 0 && <span className="text-sm text-muted-foreground">| {product.sold_count} sold</span>}
            </div>

            <div>
              <span className="text-3xl font-bold text-primary">₱{product.price.toFixed(2)}</span>
              {product.original_price && discountPercentage > 0 && (
                <span className="text-xl text-gray-400 line-through ml-2">₱{product.original_price.toFixed(2)}</span>
              )}
              {discountPercentage > 0 && (
                <Badge variant="destructive" className="ml-2">-{discountPercentage}%</Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Availability:</span>
              {product.stock_quantity > 0 ? (
                <span className="text-green-600 font-medium">
                  In Stock ({product.stock_quantity} available)
                </span>
              ) : (
                <span className="text-red-600 font-medium">Out of Stock</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <Button variant="ghost" size="icon" onClick={decrementQuantity} disabled={quantity <= 1} className="h-8 w-8">
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-3 text-sm w-8 text-center">{quantity}</span>
                <Button variant="ghost" size="icon" onClick={incrementQuantity} disabled={quantity >= product.stock_quantity} className="h-8 w-8">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button 
                size="lg" 
                onClick={handleAddToCart} 
                disabled={product.stock_quantity === 0 || !user || quantity > product.stock_quantity}
                className="bg-blue-500 hover:bg-blue-600 text-white flex-1"
              >
                <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
              </Button>
              <Button 
                size="lg" 
                onClick={handleBuyNow} 
                disabled={product.stock_quantity === 0 || !user || quantity > product.stock_quantity}
                className="bg-primary hover:bg-primary/90 text-white flex-1"
              >
                Buy Now
              </Button>
            </div>
            
            <div className="flex items-center gap-4 mt-4 text-sm">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <Heart className="mr-2 h-4 w-4" /> Add to Wishlist
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <Share2 className="mr-2 h-4 w-4" /> Share
              </Button>
            </div>
            
            {product.vendors && (
              <div className="mt-6 border-t pt-4">
                <p className="text-sm text-muted-foreground mb-1">Sold by:</p>
                <div className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-primary" />
                  <Link to={`/marketplace/vendor/${product.vendors.id}`} className="font-medium hover:underline text-primary">
                    {product.vendors.shop_name}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 md:mt-12">
          <h2 className="text-xl font-semibold mb-3">Product Description</h2>
          <div className="text-muted-foreground whitespace-pre-wrap prose prose-sm max-w-none">
            {product.description || "No description available."}
          </div>
          
          {product.specifications && product.specifications.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mt-6 mb-3">Specifications</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                {product.specifications.map(spec => (
                  <li key={spec.key}><strong>{spec.key}:</strong> {spec.value}</li>
                ))}
              </ul>
            </>
          )}
        </div>
        
        {(product.shipping_info || product.return_policy) && (
            <div className="mt-8 md:mt-12 grid md:grid-cols-2 gap-6 border-t pt-6">
                {product.shipping_info && (
                    <div>
                        <h3 className="text-lg font-medium mb-2 flex items-center"><Truck className="mr-2 h-5 w-5 text-primary" /> Shipping Information</h3>
                        <p className="text-sm text-muted-foreground">{product.shipping_info}</p>
                    </div>
                )}
                {product.return_policy && (
                    <div>
                        <h3 className="text-lg font-medium mb-2 flex items-center"><RotateCcw className="mr-2 h-5 w-5 text-primary" /> Return Policy</h3>
                        <p className="text-sm text-muted-foreground">{product.return_policy}</p>
                    </div>
                )}
            </div>
        )}

        {isLoadingSimilar && (
            <div className="mt-8 md:mt-12">
                <h2 className="text-xl font-semibold mb-4">Similar Products</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-36 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    ))}
                </div>
            </div>
        )}
        {similarProducts && similarProducts.length > 0 && (
          <div className="mt-8 md:mt-12">
            <h2 className="text-xl font-semibold mb-4">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {similarProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
