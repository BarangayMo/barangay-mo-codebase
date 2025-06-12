
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEnhancedToast } from "@/components/ui/enhanced-toast";
import { CheckCircle, AlertTriangle } from "lucide-react";
import React from "react";

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
  const { showToast } = useEnhancedToast();

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
      showToast({
        title: "Permissions updated",
        description: "Role permissions have been updated successfully.",
        variant: "success",
        icon: React.createElement(CheckCircle, { className: "h-5 w-5" })
      });
    },
    onError: (error) => {
      showToast({
        title: "Error",
        description: "Failed to update permissions. Please try again.",
        variant: "destructive",
        icon: React.createElement(AlertTriangle, { className: "h-5 w-5" })
      });
      console.error('Permissions update error:', error);
    },
  });
};
