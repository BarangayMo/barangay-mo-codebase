
//my-change
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
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-md border border-gray-200 hover:border-gray-300 flex flex-col overflow-hidden">
      <div className="relative">
        <img
          src={product.main_image_url}
          alt={product.name}
          className="w-full aspect-[4/3] object-cover"
          onClick={() => navigate(`/marketplace/product/${product.id}`)}
        />

        {product.original_price && product.price < product.original_price && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded">
            -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
          </Badge>
        )}

        <div className="absolute top-2 right-2 flex flex-col gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-white/90 hover:bg-white shadow-sm"
            onClick={handleWishlistToggle}
          >
            <Heart 
              className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} 
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
            className="h-8 w-8 bg-white/90 hover:bg-white shadow-sm text-gray-700"
          />
        </div>
      </div>

      <CardContent className="p-4 flex flex-col flex-1">
        <h3 
          className="font-medium text-gray-900 mb-1 line-clamp-2 text-base hover:text-blue-600 transition-colors"
          onClick={() => navigate(`/marketplace/product/${product.id}`)}
        >
          {product.name}
        </h3>

        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{product.vendors?.shop_name || 'N/A'}</span>
        </div>

        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center gap-0.5">
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
          <span className="text-xs text-gray-500">({product.average_rating || 0})</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-gray-900">
              ₱{product.price}
            </span>
            {product.original_price && product.price < product.original_price && (
              <span className="text-xs text-gray-500 line-through">
                ₱{product.original_price}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500">{product.sold_count || 0} sold</span>
        </div>

        <div className="mt-auto flex flex-col gap-2">
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm w-full"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add to Cart
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 hover:bg-gray-50 text-gray-700 text-sm w-full"
            onClick={() => onQuickView?.(product)}
          >
            <Eye className="h-4 w-4 mr-1" />
            Quick View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export type { ProductCardType };
export { type Product };
