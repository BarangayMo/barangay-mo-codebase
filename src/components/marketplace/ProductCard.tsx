
import { Star, MapPin, Eye, ShoppingCart, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product, ProductCardType } from "@/types/marketplace";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "@/hooks/useWishlist";
import { useCartActions } from "@/hooks/useCartActions";
import { ShareButton } from "@/components/ui/share-button";

interface ProductCardProps {
  product: ProductCardType;
  onQuickView?: (product: ProductCardType) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCartActions();

  const handleAddToCart = () => {
    addToCart({
      product_id: product.id,
      name: product.name,
      price: product.price,
      image: product.main_image_url,
      quantity: 1
    });
  };

  const handleWishlistToggle = () => {
    toggleWishlist(product.id);
  };

  return (
    <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg border-gray-200 hover:border-gray-300 h-full flex flex-col">
      <div className="relative">
        <img
          src={product.main_image_url}
          alt={product.name}
          className="w-full h-36 sm:h-40 md:h-48 object-cover rounded-t-lg"
          onClick={() => navigate(`/marketplace/product/${product.id}`)}
        />
        
        {product.original_price && product.price < product.original_price && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1">
            -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
          </Badge>
        )}
        
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-white/90 hover:bg-white"
            onClick={handleWishlistToggle}
          >
            <Heart 
              className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
            />
          </Button>
          
          <ShareButton
            title={product.name}
            description={`Check out this product: ${product.name} for ₱${product.price}`}
            itemId={product.id}
            itemType="product"
            variant="ghost"
            size="icon"
            showLabel={false}
            className="h-8 w-8 bg-white/90 hover:bg-white text-gray-600"
          />
        </div>
      </div>
      
      <CardContent className="p-3 sm:p-4 flex-1 flex flex-col">
        <h3 
          className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm sm:text-base hover:text-blue-600 transition-colors cursor-pointer min-h-[2.5rem] sm:min-h-[3rem]"
          onClick={() => navigate(`/marketplace/product/${product.id}`)}
        >
          {product.name}
        </h3>
        
        <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{product.vendors?.shop_name || 'N/A'}</span>
        </div>
        
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.average_rating || 0) 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-600">({product.average_rating || 0})</span>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            <span className="text-sm sm:text-lg font-bold text-gray-900 truncate">
              ₱{product.price}
            </span>
            {product.original_price && product.price < product.original_price && (
              <span className="text-xs sm:text-sm text-gray-500 line-through truncate">
                ₱{product.original_price}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-600 flex-shrink-0">{product.sold_count || 0} sold</span>
        </div>
        
        {/* Responsive button layout with proper spacing */}
        <div className="flex flex-col gap-2 mt-auto">
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm py-2 min-h-[32px] sm:min-h-[36px] w-full"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span className="truncate">Add to Cart</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 hover:bg-gray-50 text-gray-700 text-xs sm:text-sm py-2 min-h-[32px] sm:min-h-[36px] w-full"
            onClick={() => onQuickView?.(product)}
          >
            <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span className="truncate">Quick View</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Export types for other components to use
export type { ProductCardType };
export { type Product };
