
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AddToCartVariables {
  product_id: string;
  name: string;
  price: number;
  image?: string | null;
  quantity: number;
}

export const useCartActions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const addToCartMutation = useMutation({
    mutationFn: async (item: AddToCartVariables) => {
      console.log('🔄 Starting add to cart mutation:', item);
      
      if (!user || !user.id) {
        console.error('❌ User not authenticated');
        throw new Error('User not authenticated');
      }

      console.log('✅ User authenticated, checking existing cart item');

      // Check if item already exists in cart for this user
      const { data: existingItem, error: fetchError } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('product_id', item.product_id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116: 'Fetched result not found' (expected if item not in cart)
        console.error('❌ Error fetching existing cart item:', fetchError);
        throw new Error('Could not check cart. ' + fetchError.message);
      }

      if (existingItem) {
        console.log('📦 Item exists in cart, updating quantity');
        // Item exists, update quantity
        const newQuantity = existingItem.quantity + item.quantity;
        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
          .eq('id', existingItem.id);
        if (updateError) {
          console.error('❌ Error updating cart item quantity:', updateError);
          throw new Error('Could not update item quantity in cart. ' + updateError.message);
        }
        console.log('✅ Cart item quantity updated');
      } else {
        console.log('🆕 Item not in cart, inserting new item');
        // Item does not exist, insert new
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: item.product_id,
            name: item.name,
            price: item.price,
            image_url: item.image,
            quantity: item.quantity,
          });
        if (insertError) {
          console.error('❌ Error inserting new cart item:', insertError);
          throw new Error('Could not add item to cart. ' + insertError.message);
        }
        console.log('✅ New cart item inserted');
      }
    },
    onSuccess: () => {
      console.log('🎉 Add to cart successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['cartSummary', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['cartItems', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['cartDrawerItems', user?.id] });
      toast({
        title: 'Item Added to Cart',
        description: 'The product has been successfully added to your cart.',
      });
    },
    onError: (error: Error) => {
      console.error('❌ Add to cart failed:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add item to cart.',
        variant: 'destructive',
      });
    },
  });

  return {
    addToCart: addToCartMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
  };
};
