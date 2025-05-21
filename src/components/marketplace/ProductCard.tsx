
import { FC } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

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
    is_active
  } = product;

  const discountPercentage = original_price && price < original_price
    ? Math.round(((original_price - price) / original_price) * 100)
    : 0;

  return (
    <Link to={`/marketplace/product/${id}`} className="group">
      <div className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
        <div className="relative aspect-square bg-gray-100">
          {main_image_url ? (
            <img
              src={main_image_url}
              alt={name}
              className="object-contain w-full h-full p-2"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full">
              <div className="text-3xl text-gray-300">📷</div>
            </div>
          )}
          {discountPercentage > 0 && (
            <Badge variant="destructive" className="absolute top-2 left-2">
              -{discountPercentage}%
            </Badge>
          )}
          {!is_active && (
            <div className="absolute inset-0 bg-gray-800/70 flex items-center justify-center">
              <span className="text-white font-medium px-2 py-1 rounded">Out of Stock</span>
            </div>
          )}
        </div>
        <div className="p-3">
          <div className="text-sm font-medium line-clamp-2 group-hover:text-blue-600 transition-colors">
            {name}
          </div>
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
        </div>
      </div>
    </Link>
  );
};
