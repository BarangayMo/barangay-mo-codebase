
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Star, ShoppingCart, Heart, ChevronLeft, Minus, Plus } from 'lucide-react';
import { DEFAULT_PRODUCT_IMAGE } from '@/lib/constants';
import { useWishlist } from '@/hooks/useWishlist';
import { useCartActions } from '@/hooks/useCartActions';
import { cn } from '@/lib/utils';
import { ProductCardType } from '@/components/marketplace/ProductCard';
import { useToast } from '@/hooks/use-toast';
import { ShareButton } from '@/components/ui/share-button';

interface ProductDetailType extends ProductCardType {
  description?: string;
  additional_images?: string[];
}

const fetchProductDetail = async (productId: string): Promise<ProductDetailType> => {
  console.log('🔄 Fetching product detail for ID:', productId);
  
  const { data, error } = await supabase
    .from('products')
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
    .eq('id', productId)
    .single();

  if (error) {
    console.error('❌ Error fetching product detail:', error);
    throw error;
  }

  console.log('✅ Product detail fetched:', data);
  return data as ProductDetailType;
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>("");
  
  const { isInWishlist, toggleWishlist, isAddingToWishlist } = useWishlist();
  const { addToCart, isAddingToCart } = useCartActions();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductDetail(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (product?.main_image_url) {
      setSelectedImage(product.main_image_url);
    }
  }, [product]);

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="h-96 w-full" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
            <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/marketplace">Back to Marketplace</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const discountPercentage = product.original_price && product.price < product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const images = product.additional_images ? [product.main_image_url, ...product.additional_images] : [product.main_image_url];
  const availableImages = images.filter(img => img);

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock_quantity) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    console.log('🛒 Adding to cart:', {
      product_id: product.id,
      name: product.name,
      price: product.price,
      image: product.main_image_url,
      quantity: quantity
    });
    
    addToCart({
      product_id: product.id,
      name: product.name,
      price: product.price,
      image: product.main_image_url,
      quantity: quantity
    });
  };

  const handleBuyNow = () => {
    console.log('🚀 Buy Now clicked for product:', product.id);
    
    // Create a cart item object for the checkout
    const cartItem = {
      cart_item_id: `temp_${Date.now()}`, // Temporary ID for buy now
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.main_image_url,
      seller: product.vendors?.shop_name || "N/A",
      stock_quantity: product.stock_quantity,
      max_quantity: product.stock_quantity
    };

    // Calculate total
    const total = product.price * quantity;
    
    // Navigate to checkout with the single item
    navigate("/marketplace/checkout", {
      state: {
        cartItems: [cartItem],
        total: total,
        specialInstructions: ""
      }
    });
    
    toast({
      title: "Proceeding to Checkout",
      description: `${product.name} - Quantity: ${quantity}`,
    });
  };

  const handleWishlistClick = () => {
    toggleWishlist(product.id);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6 mb-20 md:mb-0">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link to="/marketplace" className="hover:text-gray-700">Marketplace</Link>
          <span>›</span>
          {product.product_categories?.name && (
            <>
              <span>{product.product_categories.name}</span>
              <span>›</span>
            </>
          )}
          <span className="text-gray-900">{product.name}</span>
        </nav>

        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="mb-6 -ml-3"
        >
          <Link to="/marketplace">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={selectedImage || DEFAULT_PRODUCT_IMAGE}
                alt={product.name}
                className="w-full h-full object-contain"
                onError={(e) => (e.currentTarget.src = DEFAULT_PRODUCT_IMAGE)}
              />
            </div>
            {availableImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {availableImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={cn(
                      "flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors",
                      selectedImage === image ? "border-blue-500" : "border-gray-200"
                    )}
                  >
                    <img
                      src={image || DEFAULT_PRODUCT_IMAGE}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.src = DEFAULT_PRODUCT_IMAGE)}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                {product.average_rating !== undefined && (
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span>{product.average_rating?.toFixed(1) || 'No ratings yet'}</span>
                    {product.rating_count !== undefined && (
                      <span className="ml-1">({product.rating_count} reviews)</span>
                    )}
                  </div>
                )}
                {product.sold_count !== undefined && (
                  <span>• {product.sold_count} sold</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-3xl font-bold text-red-600">₱{product.price.toFixed(2)}</span>
                {product.original_price && discountPercentage > 0 && (
                  <>
                    <span className="text-lg text-gray-400 line-through">₱{product.original_price.toFixed(2)}</span>
                    <Badge variant="destructive">-{discountPercentage}%</Badge>
                  </>
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-600">Availability:</span>
                <span className={cn(
                  "font-medium",
                  product.is_active && product.stock_quantity > 0 ? "text-green-600" : "text-red-600"
                )}>
                  {product.is_active && product.stock_quantity > 0 
                    ? `In Stock (${product.stock_quantity} available)` 
                    : "Out of Stock"
                  }
                </span>
              </div>
            </div>

            {product.description && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Quantity:</label>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock_quantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex space-x-3">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={!product.is_active || product.stock_quantity === 0 || isAddingToCart}
                  className="flex-1"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {isAddingToCart ? "Adding..." : "Add to Cart"}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-6"
                  onClick={handleBuyNow}
                  disabled={!product.is_active || product.stock_quantity === 0}
                >
                  Buy Now
                </Button>
              </div>
              
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleWishlistClick}
                  disabled={isAddingToWishlist}
                  className={cn(
                    "flex items-center space-x-2",
                    isInWishlist(product.id) ? "text-red-600" : "text-gray-600"
                  )}
                >
                  <Heart className={cn("h-4 w-4", isInWishlist(product.id) && "fill-current")} />
                  <span>{isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}</span>
                </Button>
                <ShareButton
                  title={product.name}
                  description={`Check out this amazing product: ${product.name} - ₱${product.price.toFixed(2)}`}
                  itemId={product.id}
                  itemType="product"
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 text-gray-600"
                />
              </div>
            </div>

            {/* Vendor Info - Made non-clickable */}
            {product.vendors?.shop_name && (
              <div className="border-t pt-4">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-gray-600">Sold by:</span>
                  <span className="font-medium text-gray-900">{product.vendors.shop_name}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
