
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface RoleSetting {
  id: string;
  role: 'resident' | 'official';
  permissions: string[];
  user_count: number;
  created_at: string;
  updated_at: string;
}

export const useRoleSettings = () => {
  return useQuery({
    queryKey: ['role-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_role_settings')
        .select('*')
        .order('role');

      if (error) throw error;
      return data as RoleSetting[];
    },
  });
};

export const useUpdateRolePermissions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ role, permissions }: { role: string; permissions: string[] }) => {
      const { data, error } = await supabase
        .from('user_role_settings')
        .update({ permissions })
        .eq('role', role)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-settings'] });
      toast({
        title: "Permissions updated",
        description: "Role permissions have been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update permissions. Please try again.",
        variant: "destructive",
      });
      console.error('Permissions update error:', error);
    },
  });
};
