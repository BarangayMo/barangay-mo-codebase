
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

      // Calculate growth (simplified - comparing last 30 days vs previous 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const [recentUsers, recentProducts] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact' }).gte('created_at', thirtyDaysAgo.toISOString()),
        supabase.from('products').select('*', { count: 'exact' }).gte('created_at', thirtyDaysAgo.toISOString())
      ]);

      return {
        totalUsers: usersCount.count || 0,
        totalProducts: productsCount.count || 0,
        pendingMembershipRequests: membershipRequestsCount.count || 0,
        openSupportTickets: supportTicketsCount.count || 0,
        userGrowth: recentUsers.count || 0,
        productGrowth: recentProducts.count || 0,
      };
    },
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
          profiles!inner(first_name, last_name)
        `)
        .order('requested_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
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
          profiles!inner(first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
  });
};
