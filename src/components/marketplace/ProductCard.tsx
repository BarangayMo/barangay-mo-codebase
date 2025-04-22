
import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  seller: string;
  image: string;
  available: boolean;
  rating: number;
  ratingCount: number;
  sold: number;
  freeShipping: boolean;
  saleEvent?: string;
  justBought?: boolean;
  shopBadge?: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      title: "Added to cart",
      description: "Item has been added to your cart",
    });
  };

  return (
    <Link
      to={`/marketplace/${product.id}`}
      className="bg-white rounded-md overflow-hidden border shadow-sm"
    >
      <div className="relative">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-36 object-contain bg-white p-2"
          />
        ) : (
          <div className="w-full h-36 bg-gray-100 flex items-center justify-center">
            <ShoppingCart className="w-12 h-12 text-gray-300" />
          </div>
        )}
        
        {product.discount > 0 && (
          <div className="absolute bottom-0 left-0 bg-red-500 text-white text-xs px-1 font-semibold">
            -{product.discount}%
          </div>
        )}
        
        {product.justBought && (
          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center">
            <span>just bought</span>
          </div>
        )}
        
        {product.saleEvent && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-pink-500">{product.saleEvent}</Badge>
          </div>
        )}
      </div>

      <div className="p-2">
        <div className={cn("text-xs line-clamp-2 h-8", !product.available && "text-gray-400")}>
          {product.name}
        </div>
        
        <div className="flex items-center gap-1 mt-1">
          <div className="text-red-500 font-bold text-base">₱{product.price.toFixed(2)}</div>
          {product.discount > 0 && (
            <div className="line-through text-xs text-gray-400">₱{product.originalPrice.toFixed(2)}</div>
          )}
        </div>
        
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
          <div className="flex items-center">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>{product.rating}</span>
          </div>
          <span>|</span>
          <span>{product.sold} sold</span>
        </div>
        
        <div className="flex items-center gap-1 mt-1">
          {product.freeShipping && (
            <div className="bg-teal-100 text-teal-600 text-[10px] px-1 rounded">
              FREE SHIPPING
            </div>
          )}
        </div>
        
        {product.shopBadge && (
          <div className="flex items-center gap-1 mt-1">
            <div className="bg-red-500 text-white text-[10px] px-1 rounded">
              {product.shopBadge}
            </div>
            <div className="text-xs truncate">{product.seller}</div>
          </div>
        )}
        
        {!product.available && (
          <div className="mt-1 text-xs text-destructive font-medium">Out of stock</div>
        )}
      </div>
      
      <div className="p-2 pt-0">
        <button
          onClick={handleAddToCart}
          className={cn(
            "w-full text-center py-1.5 rounded text-sm font-medium",
            product.available ? "bg-red-500 text-white" : "bg-gray-200 text-gray-400"
          )}
          disabled={!product.available}
        >
          Add to Cart
        </button>
      </div>
    </Link>
  );
}
