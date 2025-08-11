
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';

export interface RbiForm {
  id: string;
  rbi_number: string | null;
  status: string;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  form_data: any;
}

export function useRbiForms() {
  const { user } = useAuth();

  const { data: rbiForms = [], isLoading, error, refetch } = useQuery({
    queryKey: ['user-rbi-forms', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('rbi_forms')
        .select('id, rbi_number, status, submitted_at, reviewed_at, reviewed_by, form_data')
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const mutate = () => {
    refetch();
  };

  return {
    rbiForms,
    isLoading,
    error: error?.message || null,
    mutate
  };
}
