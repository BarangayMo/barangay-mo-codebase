
import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Updated Product interface to match Supabase schema and potential joins
export interface ProductCardType {
  id: string; // UUID
  name: string;
  price: number;
  original_price?: number | null;
  stock_quantity: number;
  main_image_url?: string | null;
  average_rating?: number | null;
  rating_count?: number | null;
  sold_count?: number | null;
  is_active?: boolean | null;
  // Joined data (example - adjust based on actual query)
  vendors?: { shop_name: string } | null; // Renamed from 'vendor' to 'vendors' as Supabase often names relations this way
  product_categories?: { name: string } | null; // Renamed from 'category'
  // Fields from old interface to consider:
  // freeShipping: boolean; // Not in current Supabase schema for products
  // shopBadge?: string; // Could come from vendors.is_verified or similar
  // saleEvent?: string; // Could be derived from tags or a future promotions table
  justBought?: boolean; // UI state, not from DB
  tags?: string[] | null;
}

interface ProductCardProps {
  product: ProductCardType;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const addToCartMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!user) {
        toast({ title: "Login Required", description: "Please login to add items to your cart.", variant: "destructive" });
        throw new Error("User not authenticated");
      }
      // Check if item already in cart
      const { data: existingItem, error: fetchError } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116: single row not found
        throw fetchError;
      }

      if (existingItem) {
        // Update quantity
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id);
        if (error) throw error;
      } else {
        // Insert new item
        const { error } = await supabase
          .from('cart_items')
          .insert({ product_id: productId, user_id: user.id, quantity: 1 });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
      queryClient.invalidateQueries({ queryKey: ['cartItems'] }); // Invalidate cart query if you have one
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Could not add item to cart.",
        variant: "destructive",
      });
    },
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product.id) return;
    addToCartMutation.mutate(product.id);
  };

  const discountPercentage = product.original_price && product.price < product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const isAvailable = product.is_active !== false && product.stock_quantity > 0;

  return (
    <Link
      to={`/marketplace/${product.id}`}
      className="bg-white rounded-md overflow-hidden border shadow-sm flex flex-col justify-between"
    >
      <div>
        <div className="relative">
          {product.main_image_url ? (
            <img
              src={product.main_image_url}
              alt={product.name}
              className="w-full h-36 object-contain bg-white p-2"
            />
          ) : (
            <div className="w-full h-36 bg-gray-100 flex items-center justify-center">
              <ShoppingCart className="w-12 h-12 text-gray-300" />
            </div>
          )}
          
          {discountPercentage > 0 && (
            <div className="absolute bottom-0 left-0 bg-red-500 text-white text-xs px-1 font-semibold">
              -{discountPercentage}%
            </div>
          )}
          
          {product.justBought && ( // This is a UI prop, keep if needed for specific scenarios
            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center">
              <span>just bought</span>
            </div>
          )}
          
          {product.tags?.includes("SALE") && ( // Example: derive saleEvent from tags
            <div className="absolute top-2 right-2">
              <Badge className="bg-pink-500">SALE</Badge>
            </div>
          )}
        </div>

        <div className="p-2">
          <div className={cn("text-xs line-clamp-2 h-8", !isAvailable && "text-gray-400")}>
            {product.name}
          </div>
          
          <div className="flex items-baseline gap-1 mt-1">
            <div className="text-red-500 font-bold text-base">₱{product.price.toFixed(2)}</div>
            {discountPercentage > 0 && product.original_price && (
              <div className="line-through text-xs text-gray-400">₱{product.original_price.toFixed(2)}</div>
            )}
          </div>
          
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
            {product.average_rating && product.average_rating > 0 ? (
              <>
                <div className="flex items-center">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>{product.average_rating.toFixed(1)}</span>
                </div>
                <span>|</span>
              </>
            ) : (
              <div className="text-xs text-gray-400">No ratings yet</div>
            )}
            <span>{product.sold_count || 0} sold</span>
          </div>
          
          {/* Example: derive freeShipping from tags */}
          {product.tags?.includes("FREE_SHIPPING") && (
            <div className="flex items-center gap-1 mt-1">
              <div className="bg-teal-100 text-teal-600 text-[10px] px-1 rounded">
                FREE SHIPPING
              </div>
            </div>
          )}
          
          {product.vendors?.shop_name && (
            <div className="flex items-center gap-1 mt-1">
              {/* Consider a shop badge based on vendor verification or type */}
              {/* <div className="bg-red-500 text-white text-[10px] px-1 rounded"> LazMall </div> */}
              <div className="text-xs truncate">{product.vendors.shop_name}</div>
            </div>
          )}
          
          {!isAvailable && (
            <div className="mt-1 text-xs text-destructive font-medium">Out of stock</div>
          )}
        </div>
      </div>
      
      <div className="p-2 pt-0 mt-auto">
        <button
          onClick={handleAddToCart}
          className={cn(
            "w-full text-center py-1.5 rounded text-sm font-medium",
            isAvailable ? "bg-red-500 text-white hover:bg-red-600" : "bg-gray-200 text-gray-400 cursor-not-allowed"
          )}
          disabled={!isAvailable || addToCartMutation.isPending}
        >
          {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </Link>
  );
}
