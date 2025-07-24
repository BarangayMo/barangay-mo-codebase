
import { Star, MapPin, Eye, ShoppingCart, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/marketplace";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "@/hooks/useWishlist";
import { useCartActions } from "@/hooks/useCartActions";
import { ShareButton } from "@/components/ui/share-button";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCartActions();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      vendor: product.vendor
    });
  };

  const handleWishlistToggle = () => {
    toggleWishlist(product.id);
  };

  return (
    <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg border-gray-200 hover:border-gray-300">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-t-lg"
          onClick={() => navigate(`/marketplace/product/${product.id}`)}
        />
        
        {product.discount && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1">
            -{product.discount}%
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
            description={`Check out this product: ${product.name} for ${product.price}`}
            itemId={product.id}
            itemType="product"
            variant="ghost"
            size="icon"
            showLabel={false}
            className="h-8 w-8 bg-white/90 hover:bg-white text-gray-600"
          />
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 
          className="font-semibold text-gray-900 mb-1 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer"
          onClick={() => navigate(`/marketplace/product/${product.id}`)}
        >
          {product.name}
        </h3>
        
        <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
          <MapPin className="h-3 w-3" />
          <span>{product.vendor}</span>
        </div>
        
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating) 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-600">({product.rating})</span>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              {product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {product.originalPrice}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-600">{product.sold || 0} sold</span>
        </div>
        
        {/* Mobile-first responsive button layout */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            size="sm"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add to Cart
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-gray-300 hover:bg-gray-50 text-gray-700 text-sm py-2"
            onClick={() => onQuickView?.(product)}
          >
            <Eye className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Quick View</span>
            <span className="sm:hidden">View</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
