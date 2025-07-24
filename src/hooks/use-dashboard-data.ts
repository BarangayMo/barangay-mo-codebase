import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  pendingMembershipRequests: number;
  openSupportTickets: number;
  userGrowth: number;
  productGrowth: number;
}

export interface LatestUser {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  created_at: string;
}

export interface LatestProduct {
  id: string;
  name: string;
  price: number;
  vendor: {
    shop_name: string;
  } | null;
  created_at: string;
  is_active: boolean;
}

export interface MembershipRequest {
  id: string;
  barangay_name: string;
  request_message: string | null;
  status: string;
  requested_at: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
  } | null;
}

export interface SupportTicket {
  id: string;
  title: string;
  status: string;
  priority: string;
  category: string;
  created_at: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
  } | null;
}

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      const [usersCount, productsCount, membershipRequestsCount, supportTicketsCount] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact' }),
        supabase.from('products').select('*', { count: 'exact' }),
        supabase.from('barangay_membership_requests').select('*', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('support_tickets').select('*', { count: 'exact' }).eq('status', 'open')
      ]);

      // Calculate growth (comparing last 7 days vs previous 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

      const [recentUsers, previousUsers, recentProducts, previousProducts] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact' }).gte('created_at', sevenDaysAgo.toISOString()),
        supabase.from('profiles').select('*', { count: 'exact' }).gte('created_at', fourteenDaysAgo.toISOString()).lt('created_at', sevenDaysAgo.toISOString()),
        supabase.from('products').select('*', { count: 'exact' }).gte('created_at', sevenDaysAgo.toISOString()),
        supabase.from('products').select('*', { count: 'exact' }).gte('created_at', fourteenDaysAgo.toISOString()).lt('created_at', sevenDaysAgo.toISOString())
      ]);

      // Calculate percentage growth
      const userGrowthRate = previousUsers.count && previousUsers.count > 0 
        ? Math.round(((recentUsers.count || 0) - (previousUsers.count || 0)) / (previousUsers.count || 1) * 100)
        : (recentUsers.count || 0) > 0 ? 100 : 0;

      const productGrowthRate = previousProducts.count && previousProducts.count > 0 
        ? Math.round(((recentProducts.count || 0) - (previousProducts.count || 0)) / (previousProducts.count || 1) * 100)
        : (recentProducts.count || 0) > 0 ? 100 : 0;

      return {
        totalUsers: usersCount.count || 0,
        totalProducts: productsCount.count || 0,
        pendingMembershipRequests: membershipRequestsCount.count || 0,
        openSupportTickets: supportTicketsCount.count || 0,
        userGrowth: userGrowthRate,
        productGrowth: productGrowthRate,
      };
    },
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
    staleTime: 10000, // Data is considered stale after 10 seconds
  });
};

export const useLatestUsers = () => {
  return useQuery({
    queryKey: ['latest-users'],
    queryFn: async (): Promise<LatestUser[]> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, role, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
  });
};

export const useLatestProducts = () => {
  return useQuery({
    queryKey: ['latest-products'],
    queryFn: async (): Promise<LatestProduct[]> => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          price,
          created_at,
          is_active,
          vendors!inner(shop_name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data?.map(product => ({
        ...product,
        vendor: product.vendors ? { shop_name: product.vendors.shop_name } : null
      })) || [];
    },
  });
};

export const useMembershipRequests = () => {
  return useQuery({
    queryKey: ['membership-requests'],
    queryFn: async (): Promise<MembershipRequest[]> => {
      const { data, error } = await supabase
        .from('barangay_membership_requests')
        .select(`
          id,
          barangay_name,
          request_message,
          status,
          requested_at,
          user_id
        `)
        .order('requested_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Fetch user profiles separately
      if (!data || data.length === 0) return [];

      const userIds = data.map(request => request.user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', userIds);

      // Map profiles to requests
      return data.map(request => ({
        id: request.id,
        barangay_name: request.barangay_name,
        request_message: request.request_message,
        status: request.status,
        requested_at: request.requested_at,
        profiles: profiles?.find(profile => profile.id === request.user_id) || null
      }));
    },
  });
};

export const useSupportTickets = () => {
  return useQuery({
    queryKey: ['support-tickets'],
    queryFn: async (): Promise<SupportTicket[]> => {
      const { data, error } = await supabase
        .from('support_tickets')
        .select(`
          id,
          title,
          status,
          priority,
          category,
          created_at,
          user_id
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Fetch user profiles separately
      if (!data || data.length === 0) return [];

      const userIds = data.map(ticket => ticket.user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', userIds);

      // Map profiles to tickets
      return data.map(ticket => ({
        id: ticket.id,
        title: ticket.title,
        status: ticket.status,
        priority: ticket.priority,
        category: ticket.category,
        created_at: ticket.created_at,
        profiles: profiles?.find(profile => profile.id === ticket.user_id) || null
      }));
    },
  });
};
