
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const fetchCartSummary = async (userId: string) => {
  const { count, error } = await supabase
    .from('cart_items')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching cart summary:', error);
    return 0;
  }
  return count || 0;
};

export const useCartSummary = () => {
  const { user } = useAuth();
  const { data: cartItemCount, ...rest } = useQuery<number>({
    queryKey: ['cartSummary', user?.id],
    queryFn: () => fetchCartSummary(user!.id),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  return { cartItemCount: cartItemCount ?? 0, ...rest };
};
