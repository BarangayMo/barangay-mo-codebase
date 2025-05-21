
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast'; // Ensure this is the correct path for your toast

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

  const addToCartMutation = useMutation({
    mutationFn: async (item: AddToCartVariables) => {
      if (!user || !user.id) {
        throw new Error('User not authenticated');
      }

      // Check if item already exists in cart for this user
      const { data: existingItem, error: fetchError } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('product_id', item.product_id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116: 'Fetched result not found' (expected if item not in cart)
        console.error('Error fetching existing cart item:', fetchError);
        throw new Error('Could not check cart. ' + fetchError.message);
      }

      if (existingItem) {
        // Item exists, update quantity
        const newQuantity = existingItem.quantity + item.quantity;
        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
          .eq('id', existingItem.id);
        if (updateError) {
          console.error('Error updating cart item quantity:', updateError);
          throw new Error('Could not update item quantity in cart. ' + updateError.message);
        }
      } else {
        // Item does not exist, insert new
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: item.product_id,
            name: item.name, // Assuming name, price, image are denormalized for cart display
            price: item.price,
            image_url: item.image,
            quantity: item.quantity,
          });
        if (insertError) {
          console.error('Error inserting new cart item:', insertError);
          throw new Error('Could not add item to cart. ' + insertError.message);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartSummary', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['cartItems', user?.id] }); // Invalidate full cart if you have such a query
      toast({
        title: 'Item Added to Cart',
        description: 'The product has been successfully added to your cart.',
      });
    },
    onError: (error: Error) => {
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

