import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: 'resident' | 'official' | 'superadmin' | null;
  created_at: string | null;
  last_login: string | null;
  status: 'online' | 'offline' | 'archived' | null;
  avatar_url: string | null;
  invited_by: string | null;
}

export interface UserInvitation {
  id: string;
  email: string;
  role: 'resident' | 'official';
  first_name: string | null;
  last_name: string | null;
  welcome_message: string | null;
  invited_by: string | null;
  status: 'pending' | 'accepted' | 'expired';
  expires_at: string;
  created_at: string;
}

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          role,
          created_at,
          last_login,
          status,
          avatar_url,
          invited_by
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get user emails from auth.users table through a join or separate query
      const userIds = profiles?.map(p => p.id) || [];
      
      // For now, we'll fetch users without emails since we can't access auth.users directly
      // In a real implementation, this would require a database function or API endpoint
      const usersWithEmails = profiles?.map(profile => ({
        ...profile,
        email: `user-${profile.id.slice(0, 8)}@example.com` // Placeholder email
      } as User)) || [];

      return usersWithEmails;
    },
  });
};

export const useUserInvitations = () => {
  return useQuery({
    queryKey: ['user-invitations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_invitations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as UserInvitation[];
    },
  });
};

export const useCreateInvitation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (invitation: {
      email: string;
      role: 'resident' | 'official';
      first_name?: string;
      last_name?: string;
      welcome_message?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('user_invitations')
        .insert({
          ...invitation,
          invited_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-invitations'] });
      toast({
        title: "Invitation sent",
        description: "User invitation has been sent successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send invitation. Please try again.",
        variant: "destructive",
      });
      console.error('Invitation error:', error);
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: 'resident' | 'official' }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['role-settings'] });
      toast({
        title: "Role updated",
        description: "User role has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive",
      });
      console.error('Role update error:', error);
    },
  });
};

export const useArchiveUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (userId: string) => {
      if (!userId) throw new Error("Missing userId");
      console.log("Archiving user ID:", userId);

      const { data, error } = await supabase
        .from("profiles")
        .update({ status: "archived" }) // ✅ ensure this is not empty
        .eq("id", userId)                // ✅ ensure userId is valid
        .select();                       // ❌ don't use .single() for now

      if (error) {
        console.error("Archive Supabase error:", error);
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error("User not found or already archived");
      }

      return data[0];
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "User archived",
        description: "User has been archived successfully.",
      });
    },

    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to archive user.",
        variant: "destructive",
      });
      console.error("Archive error:", error);
    },
  });
};
