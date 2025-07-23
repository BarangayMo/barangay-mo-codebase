import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { ProductCardType } from '@/components/marketplace/ProductCard';

const WISHLIST_STORAGE_KEY = 'marketplace_wishlist';

interface WishlistItem {
  id: string;
  product_id: string;
  created_at: string;
}

export const useWishlist = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [localWishlist, setLocalWishlist] = useState<string[]>([]);

  // Load local wishlist from localStorage on mount
  useEffect(() => {
    console.log('🔄 Loading local wishlist from localStorage...');
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (stored) {
      try {
        const parsedWishlist = JSON.parse(stored);
        setLocalWishlist(parsedWishlist);
        console.log('✅ Local wishlist loaded:', parsedWishlist);
      } catch (error) {
        console.error('❌ Error parsing local wishlist:', error);
        localStorage.removeItem(WISHLIST_STORAGE_KEY);
      }
    }
  }, []);

  // Fetch wishlist from Supabase (authenticated users only)
  const { data: supabaseWishlist, isLoading } = useQuery({
    queryKey: ['wishlist', user?.id],
    queryFn: async (): Promise<WishlistItem[]> => {
      console.log('🔄 Fetching wishlist from Supabase for user:', user?.id);
      const { data, error } = await supabase
        .from('wishlists')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching wishlist:', error);
        throw error;
      }

      console.log('✅ Supabase wishlist fetched:', data);
      return data || [];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get current wishlist (Supabase for authenticated, localStorage for guest)
  const wishlistItems = user ? 
    (supabaseWishlist?.map(item => item.product_id) || []) : 
    localWishlist;

  // Add to wishlist mutation
  const addToWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      console.log('🔄 Adding product to wishlist:', productId);
      
      if (user) {
        console.log('🔄 Adding to Supabase wishlist for user:', user.id);
        const { data, error } = await supabase
          .from('wishlists')
          .insert({
            user_id: user.id,
            product_id: productId,
          })
          .select()
          .single();

        if (error) {
          console.error('❌ Error adding to Supabase wishlist:', error);
          if (error.code === '23505') { // Unique constraint violation
            throw new Error('ALREADY_IN_WISHLIST');
          }
          throw error;
        }
        
        console.log('✅ Added to Supabase wishlist:', data);
        return data;
      } else {
        console.log('🔄 Adding to local wishlist');
        const newWishlist = [...localWishlist, productId];
        setLocalWishlist(newWishlist);
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(newWishlist));
        console.log('✅ Added to local wishlist:', newWishlist);
        return { product_id: productId };
      }
    },
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ['wishlist', user.id] });
      }
      toast.success('Added to Wishlist ✅');
    },
    onError: (error: any) => {
      console.error('❌ Add to wishlist error:', error);
      if (error.message === 'ALREADY_IN_WISHLIST') {
        toast.warning('Already in Wishlist ⚠️');
      } else {
        toast.error('Failed to add to wishlist');
      }
    },
  });

  // Remove from wishlist mutation
  const removeFromWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      console.log('🔄 Removing product from wishlist:', productId);
      
      if (user) {
        console.log('🔄 Removing from Supabase wishlist for user:', user.id);
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);

        if (error) {
          console.error('❌ Error removing from Supabase wishlist:', error);
          throw error;
        }
        
        console.log('✅ Removed from Supabase wishlist');
      } else {
        console.log('🔄 Removing from local wishlist');
        const newWishlist = localWishlist.filter(id => id !== productId);
        setLocalWishlist(newWishlist);
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(newWishlist));
        console.log('✅ Removed from local wishlist:', newWishlist);
      }
    },
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ['wishlist', user.id] });
      }
      toast.success('Removed from Wishlist 🗑️');
    },
    onError: (error) => {
      console.error('❌ Remove from wishlist error:', error);
      toast.error('Failed to remove from wishlist');
    },
  });

  // Toggle wishlist item
  const toggleWishlist = (productId: string) => {
    console.log('🔄 Toggling wishlist for product:', productId);
    const isInWishlist = wishlistItems.includes(productId);
    
    if (isInWishlist) {
      console.log('🔄 Product is in wishlist, removing...');
      removeFromWishlistMutation.mutate(productId);
    } else {
      console.log('🔄 Product not in wishlist, adding...');
      addToWishlistMutation.mutate(productId);
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId: string) => {
    return wishlistItems.includes(productId);
  };

  return {
    wishlistItems,
    isLoading,
    toggleWishlist,
    isInWishlist,
    addToWishlist: addToWishlistMutation.mutate,
    removeFromWishlist: removeFromWishlistMutation.mutate,
    isAddingToWishlist: addToWishlistMutation.isPending,
    isRemovingFromWishlist: removeFromWishlistMutation.isPending,
  };
};