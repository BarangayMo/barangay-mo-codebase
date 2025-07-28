
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Official {
  id: string;
  user_id: string | null;
  position: string;
  barangay: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  suffix?: string;
  term_start: string | null;
  term_end: string | null;
  status: 'active' | 'inactive';
  contact_phone: string | null;
  contact_email: string | null;
  years_of_service: number;
  achievements: string[] | null;
  created_at: string;
  updated_at: string;
}

export const useOfficials = (barangay?: string) => {
  return useQuery({
    queryKey: ['officials', barangay],
    queryFn: async () => {
      try {
        let query = supabase
          .from('officials')
          .select('*')
          .order('created_at', { ascending: false });

        if (barangay) {
          query = query.eq('barangay', barangay);
        }

        const { data, error } = await query;
        if (error) throw error;
        return (data as Official[]) || [];
      } catch (error) {
        console.error('Error fetching officials:', error);
        return [];
      }
    },
  });
};

export const useCreateOfficial = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (official: Omit<Official, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        const { data, error } = await supabase
          .from('officials')
          .insert(official)
          .select()
          .single();

        if (error) throw error;
        return data as Official;
      } catch (error) {
        console.error('Error creating official:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['officials'] });
      toast({
        title: "Success",
        description: "Official added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add official. Please try again.",
        variant: "destructive",
      });
      console.error('Create official error:', error);
    },
  });
};

export const useUpdateOfficial = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Official> & { id: string }) => {
      try {
        const { data, error } = await supabase
          .from('officials')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data as Official;
      } catch (error) {
        console.error('Error updating official:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['officials'] });
      toast({
        title: "Success",
        description: "Official updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update official. Please try again.",
        variant: "destructive",
      });
      console.error('Update official error:', error);
    },
  });
};
