
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEnhancedToast } from "@/components/ui/enhanced-toast";
import { CheckCircle, AlertTriangle } from "lucide-react";
import React from "react";

export interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export const useSystemSettings = () => {
  return useQuery({
    queryKey: ['system-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_system_settings')
        .select('*')
        .order('setting_key');

      if (error) throw error;
      return data as SystemSetting[];
    },
  });
};

export const useUpdateSystemSetting = () => {
  const queryClient = useQueryClient();
  const { showToast } = useEnhancedToast();

  return useMutation({
    mutationFn: async ({ settingKey, value }: { settingKey: string; value: any }) => {
      const { data, error } = await supabase
        .from('user_system_settings')
        .update({ setting_value: value })
        .eq('setting_key', settingKey)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      showToast({
        title: "Setting updated",
        description: "System setting has been updated successfully.",
        variant: "success",
        icon: React.createElement(CheckCircle, { className: "h-5 w-5" })
      });
    },
    onError: (error) => {
      showToast({
        title: "Error",
        description: "Failed to update setting. Please try again.",
        variant: "destructive",
        icon: React.createElement(AlertTriangle, { className: "h-5 w-5" })
      });
      console.error('Setting update error:', error);
    },
  });
};
