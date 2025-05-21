import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCard, ProductCardType } from '@/components/marketplace/ProductCard';
import { Star, ChevronLeft, ChevronRight, ShoppingCart, Heart, MessageSquare, Minus, Plus, Share2, Store, ShieldCheck, MapPin, Truck, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
// import { Box } from 'lucide-react'; // Replaced Box with default image

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

interface ProductImage {
  id: string;
  image_url: string;
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
  main_image_url?: string;
  average_rating?: number;
  rating_count?: number;
  sold_count?: number;
  is_active?: boolean;
  tags?: string[];
  specifications?: ProductSpecification[];
  shipping_info?: string;
  return_policy?: string;
  vendors?: Vendor;
  product_categories?: ProductCategory;
  product_images?: ProductImage[];
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
      product_categories (id, name),
      product_images (id, image_url)
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
    // Supabase returns specifications as Json | null. We need ProductSpecification[] | undefined.
    if (data.specifications && Array.isArray(data.specifications)) {
      // Basic check to see if it's an array of objects with key/value
      const isValidSpecArray = data.specifications.every(
        (item: any) => typeof item === 'object' && item !== null && 'key' in item && 'value' in item
      );
      if (isValidSpecArray) {
        processedSpecifications = data.specifications as ProductSpecification[];
      } else {
        console.warn("Fetched specifications are not in the expected format:", data.specifications);
      }
    } else if (data.specifications !== null) {
      console.warn("Fetched specifications are not an array or null:", data.specifications);
    }

    // Construct the ProductDetailType object carefully
    // The 'as any' for data is a temporary escape hatch if Supabase's inferred type for data (from types.ts)
    // isn't perfectly aligning yet, especially for nested objects like vendors/product_categories.
    // Ideally, Supabase's generated types should make this smooth.
    const productDetailData: ProductDetailType = {
      id: (data as any).id,
      name: (data as any).name,
      description: (data as any).description,
      price: (data as any).price,
      original_price: (data as any).original_price,
      stock_quantity: (data as any).stock_quantity,
      main_image_url: (data as any).main_image_url,
      average_rating: (data as any).average_rating,
      rating_count: (data as any).rating_count,
      sold_count: (data as any).sold_count,
      is_active: (data as any).is_active,
      tags: (data as any).tags,
      specifications: processedSpecifications, // Use the processed specifications
      shipping_info: (data as any).shipping_info,
      return_policy: (data as any).return_policy,
      vendors: (data as any).vendors as Vendor | undefined, // Cast nested structures if necessary
      product_categories: (data as any).product_categories as ProductCategory | undefined,
      product_images: (data as any).product_images as ProductImage[] | undefined,
      created_at: (data as any).created_at,
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
  return data as ProductCardType[];
};


// Main ProductDetail Component
export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth(); // Assuming useAuth provides user info
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
    enabled: !!product && !!id,
  });

  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (product?.main_image_url) {
      setSelectedImage(product.main_image_url);
    } else if (product && !product.main_image_url) {
      setSelectedImage(DEFAULT_PRODUCT_IMAGE);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    // Basic add to cart logic (actual implementation would use context/store)
    console.log(`Added ${quantity} of ${product.name} to cart.`);
    toast({
      title: "Added to Cart",
      description: `${quantity} x ${product.name} has been added to your cart.`,
      action: (
        <Button variant="outline" size="sm" onClick={() => navigate('/marketplace/cart')}>
          View Cart
        </Button>
      ),
    });
    // Example: Invalidate cart queries if using React Query for cart state
    // queryClient.invalidateQueries(['cart']);
  };

  const handleBuyNow = () => {
    if (!product) return;
    // Navigate to checkout with product info
    console.log(`Buying ${quantity} of ${product.name} now.`);
    navigate('/marketplace/checkout', { state: { product, quantity } });
  };

  const incrementQuantity = () => setQuantity(prev => Math.min(prev + 1, product?.stock_quantity || 1));
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const discountPercentage = product.original_price && product.price < product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const galleryImages = product.product_images?.map(img => img.image_url).filter(Boolean) as string[] || [];
  const displayGallery = [product.main_image_url, ...galleryImages].filter(Boolean) as string[];

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
              <Link to={`/marketplace?category=${product.product_categories.name}`} className="hover:underline">
                {product.product_categories.name}
              </Link>
            </>
          )}
          <ChevronRight className="inline h-4 w-4 mx-1" />
          <span className="truncate">{product.name}</span>
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
              {displayGallery.length > 0 ? displayGallery.map((imageSrc, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(imageSrc)}
                  className={cn(
                    "w-16 h-16 md:w-20 md:h-20 border rounded-md p-1 flex-shrink-0 hover:border-blue-500",
                    (selectedImage || product.main_image_url) === imageSrc ? "border-blue-500 ring-2 ring-blue-500" : "border-gray-200"
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
            
            <div className="flex items-center gap-4">
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
              {product.sold_count !== undefined && <span className="text-sm text-muted-foreground">| {product.sold_count} sold</span>}
            </div>

            <div>
              <span className="text-3xl font-bold text-red-600">₱{product.price.toFixed(2)}</span>
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
                <Button variant="ghost" size="icon" onClick={decrementQuantity} className="h-8 w-8">
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-3 text-sm">{quantity}</span>
                <Button variant="ghost" size="icon" onClick={incrementQuantity} className="h-8 w-8">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button 
                size="lg" 
                onClick={handleAddToCart} 
                disabled={product.stock_quantity === 0}
                className="bg-blue-500 hover:bg-blue-600 text-white flex-1"
              >
                <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
              </Button>
              <Button 
                size="lg" 
                onClick={handleBuyNow} 
                disabled={product.stock_quantity === 0}
                className="bg-red-500 hover:bg-red-600 text-white flex-1"
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
            
            {/* Vendor Info Teaser */}
            {product.vendors && (
              <div className="mt-6 border-t pt-4">
                <p className="text-sm text-muted-foreground mb-1">Sold by:</p>
                <div className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-primary" />
                  <Link to={`/marketplace/vendor/${product.vendors.id}`} className="font-medium hover:underline">
                    {product.vendors.shop_name}
                  </Link>
                </div>
                 {/* Add more vendor details or link to vendor page here */}
              </div>
            )}
          </div>
        </div>
        
        {/* Product Description & Specifications */}
        <div className="mt-8 md:mt-12">
          <h2 className="text-xl font-semibold mb-3">Product Description</h2>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {product.description || "No description available."}
          </p>
          
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
        
        {/* Shipping & Returns */}
        {(product.shipping_info || product.return_policy) && (
            <div className="mt-8 md:mt-12 grid md:grid-cols-2 gap-6">
                {product.shipping_info && (
                    <div>
                        <h3 className="text-lg font-medium mb-2 flex items-center"><Truck className="mr-2 h-5 w-5" /> Shipping Information</h3>
                        <p className="text-sm text-muted-foreground">{product.shipping_info}</p>
                    </div>
                )}
                {product.return_policy && (
                    <div>
                        <h3 className="text-lg font-medium mb-2 flex items-center"><RotateCcw className="mr-2 h-5 w-5" /> Return Policy</h3>
                        <p className="text-sm text-muted-foreground">{product.return_policy}</p>
                    </div>
                )}
            </div>
        )}

        {/* Similar Products */}
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {similarProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
