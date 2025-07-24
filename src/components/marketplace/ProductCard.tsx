
import * as React from "react";
import { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Star, Heart, Share2, ShoppingCart } from "lucide-react";
import { DEFAULT_PRODUCT_IMAGE } from "@/lib/constants";
import { useWishlist } from "@/hooks/useWishlist";
import { useShare } from "@/hooks/useShare";
import { useCartActions } from "@/hooks/useCartActions";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Define the product data structure
export interface ProductCardType {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  main_image_url?: string;
  stock_quantity: number;
  average_rating?: number;
  rating_count?: number;
  sold_count?: number;
  is_active?: boolean;
  tags?: string[];
  vendors?: { shop_name: string };
  product_categories?: { name: string };
}

interface ProductCardProps {
  product: ProductCardType;
}

export const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    id,
    name,
    price,
    original_price,
    main_image_url,
    average_rating,
    rating_count,
    sold_count,
    vendors,
    is_active,
    stock_quantity
  } = product;

  const { isInWishlist, toggleWishlist, isAddingToWishlist } = useWishlist();
  const { shareProduct } = useShare();
  const { addToCart, isAddingToCart } = useCartActions();

  const discountPercentage = original_price && price < original_price
    ? Math.round(((original_price - price) / original_price) * 100)
    : 0;
    
  console.log("Product card rendering with ID:", id, "Image URL:", main_image_url);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🔄 Wishlist button clicked for product:', id);
    toggleWishlist(id);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🔄 Share button clicked for product:', id, name);
    shareProduct(id, name);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🛒 Add to cart clicked for product:', id);
    
    addToCart({
      product_id: id,
      name: name,
      price: price,
      image: main_image_url,
      quantity: 1
    });
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🚀 Buy Now clicked for product:', id);
    
    // Create a cart item object for the checkout
    const cartItem = {
      cart_item_id: `temp_${Date.now()}`, // Temporary ID for buy now
      product_id: id,
      name: name,
      price: price,
      quantity: 1,
      image: main_image_url,
      seller: vendors?.shop_name || "N/A",
      stock_quantity: stock_quantity,
      max_quantity: stock_quantity
    };

    // Calculate total
    const total = price * 1;
    
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
      description: `${name} - Quantity: 1`,
    });
  };

  return (
    <div className="group border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
      <Link to={`/marketplace/product/${id}`} className="block">
        <div className="relative aspect-square bg-gray-100 group/image">
          <img
            src={main_image_url || DEFAULT_PRODUCT_IMAGE}
            alt={name}
            className="object-contain w-full h-full p-2"
            onError={(e) => (e.currentTarget.src = DEFAULT_PRODUCT_IMAGE)}
          />
          {discountPercentage > 0 && (
            <Badge variant="destructive" className="absolute top-2 left-2">
              -{discountPercentage}%
            </Badge>
          )}
          
          {/* Wishlist and Share buttons */}
          <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover/image:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="secondary"
              className={cn(
                "h-8 w-8 rounded-full shadow-md hover:shadow-lg transition-all",
                isInWishlist(id) ? "bg-red-100 text-red-600 hover:bg-red-200" : "bg-white/90 text-gray-600 hover:bg-white"
              )}
              onClick={handleWishlistClick}
              disabled={isAddingToWishlist}
            >
              <Heart className={cn("h-3.5 w-3.5", isInWishlist(id) && "fill-current")} />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-white/90 text-gray-600 hover:bg-white shadow-md hover:shadow-lg transition-all"
              onClick={handleShareClick}
            >
              <Share2 className="h-3.5 w-3.5" />
            </Button>
          </div>
          
          {!is_active && (
            <div className="absolute inset-0 bg-gray-800/70 flex items-center justify-center">
              <span className="text-white font-medium px-2 py-1 rounded">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-3">
        <Link to={`/marketplace/product/${id}`}>
          <div className="text-sm font-medium line-clamp-2 group-hover:text-blue-600 transition-colors">
            {name}
          </div>
        </Link>
        <div className="mt-1">
          <span className="text-red-600 font-semibold">₱{price.toFixed(2)}</span>
          {original_price && discountPercentage > 0 && (
            <span className="text-gray-400 text-xs line-through ml-2">
              ₱{original_price.toFixed(2)}
            </span>
          )}
        </div>
        <div className="mt-1 flex items-center text-xs text-gray-500">
          {vendors?.shop_name && (
            <span className="line-clamp-1">{vendors.shop_name}</span>
          )}
        </div>
        <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
          {average_rating !== undefined && (
            <div className="flex items-center">
              <Star className={cn("h-3 w-3 mr-1", average_rating > 0 ? "fill-yellow-400 text-yellow-400" : "text-gray-300")} />
              <span>{average_rating?.toFixed(1) || 'N/A'}</span>
              {rating_count !== undefined && <span className="ml-1">({rating_count})</span>}
            </div>
          )}
          {sold_count !== undefined && (
            <span>{sold_count} sold</span>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="mt-3 flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-xs"
            onClick={handleAddToCart}
            disabled={!is_active || stock_quantity === 0 || isAddingToCart}
          >
            <ShoppingCart className="h-3 w-3 mr-1" />
            {isAddingToCart ? "Adding..." : "Add to Cart"}
          </Button>
          <Button
            size="sm"
            className="flex-1 text-xs"
            onClick={handleBuyNow}
            disabled={!is_active || stock_quantity === 0}
          >
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
};
