
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const fetchCartSummary = async (userId: string) => {
  console.log('🔄 Fetching cart summary for user:', userId);
  
  const { count, error } = await supabase
    .from('cart_items')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) {
    console.error('❌ Error fetching cart summary:', error);
    return 0;
  }
  
  console.log('📊 Cart summary count:', count);
  return count || 0;
};

export const useCartSummary = () => {
  const { user } = useAuth();
  
  const { data: cartItemCount, ...rest } = useQuery<number>({
    queryKey: ['cartSummary', user?.id],
    queryFn: () => fetchCartSummary(user!.id),
    enabled: !!user,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  return { cartItemCount: cartItemCount ?? 0, ...rest };
};
