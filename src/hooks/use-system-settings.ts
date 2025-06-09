
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

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
      toast({
        title: "Setting updated",
        description: "System setting has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update setting. Please try again.",
        variant: "destructive",
      });
      console.error('Setting update error:', error);
    },
  });
};
