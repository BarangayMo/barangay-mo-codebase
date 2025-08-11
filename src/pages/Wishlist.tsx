import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/contexts/AuthContext';
import { ProductCard, ProductCardType } from '@/components/marketplace/ProductCard';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const fetchWishlistProducts = async (productIds: string[]): Promise<ProductCardType[]> => {
  if (productIds.length === 0) return [];
  
  console.log('🔄 Fetching wishlist products:', productIds);
  
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
    .in('id', productIds)
    .eq('is_active', true);

  if (error) {
    console.error('❌ Error fetching wishlist products:', error);
    throw error;
  }

  console.log('✅ Wishlist products fetched:', data);
  return data as ProductCardType[];
};

export default function Wishlist() {
  const { user } = useAuth();
  const { wishlistItems, isLoading: isWishlistLoading } = useWishlist();

  console.log('🏪 Wishlist page rendering:', { 
    wishlistItemsCount: wishlistItems.length, 
    isWishlistLoading,
    user: user?.email 
  });

  const { data: products, isLoading: isProductsLoading, error } = useQuery({
    queryKey: ['wishlist-products', wishlistItems],
    queryFn: () => fetchWishlistProducts(wishlistItems),
    enabled: wishlistItems.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const isLoading = isWishlistLoading || isProductsLoading;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6 mb-20 md:mb-0">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <Heart className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600">
              {isLoading ? 'Loading...' : `${wishlistItems.length} item${wishlistItems.length !== 1 ? 's' : ''} saved`}
            </p>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-36 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500 mb-2">Error loading wishlist: {(error as Error).message}</p>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-6">Start browsing and save items you like to your wishlist.</p>
            <Button asChild>
              <Link to="/marketplace" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Browse Marketplace
              </Link>
            </Button>
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">Some items in your wishlist are no longer available.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}