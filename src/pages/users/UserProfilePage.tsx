import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DashboardPageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEnhancedToast } from "@/components/ui/enhanced-toast";
import { UserPersonalInfo } from "@/components/users/profile/UserPersonalInfo";
import { UserActivityTabs } from "@/components/users/profile/UserActivityTabs";
import { UserAdminControls } from "@/components/users/profile/UserAdminControls";
import { UserProfile } from "@/components/users/profile/types";
import { CheckCircle, AlertTriangle } from "lucide-react";

// Mock data for user activity
const marketListings = [
  { id: "1", title: "Handcrafted Wooden Chair", date: "2023-04-15", status: "Active" },
  { id: "2", title: "Organic Vegetables Bundle", date: "2023-03-20", status: "Sold" }
];

const jobListings = [
  { id: "1", title: "Community Volunteer", date: "2023-04-10", type: "Part-time" }
];

const purchases = [
  { id: "1", item: "Bamboo Water Container", date: "2023-04-18", price: "$24.99" },
  { id: "2", item: "Local Artisan Basket", date: "2023-03-05", price: "$35.50" }
];

export default function UserProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast, ToastContainer } = useEnhancedToast();

  useEffect(() => {
    loadUserProfile();
  }, [id]);

  const loadUserProfile = async () => {
    try {
      // First, get the user's profile data
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .eq('id', id)
        .single();

      if (userError) throw userError;

      // Separately fetch the user email (in a real app, you would get this from auth tables)
      let email = `user-${id}@example.com`;
      
      // Get user settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', id)
        .single();

      // Get user activity
      const { data: activityData, error: activityError } = await supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', id)
        .order('created_at', { ascending: false });

      if (settingsError && settingsError.code !== 'PGRST116') {
        throw settingsError;
      }

      setProfile({
        ...userData,
        email,
        settings: settingsData || {
          is_banned: false,
          can_sell: true,
          is_verified: false,
          phone_number: null,
          address: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: id || ''
        },
        activities: activityData || []
      });
    } catch (error) {
      console.error("Error loading profile:", error);
      showToast({
        title: "Error loading profile",
        description: "Could not load user profile data",
        variant: "destructive",
        icon: <AlertTriangle className="h-5 w-5" />
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserSettings = async (setting: string, value: boolean) => {
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({ 
          user_id: id,
          [setting]: value,
        });

      if (error) throw error;

      setProfile(prev => prev && {
        ...prev,
        settings: {
          ...prev.settings!,
          [setting]: value
        }
      });

      showToast({
        title: "Settings updated",
        description: "User settings have been updated successfully",
        variant: "success",
        icon: <CheckCircle className="h-5 w-5" />
      });
    } catch (error) {
      showToast({
        title: "Error updating settings",
        description: "Could not update user settings",
        variant: "destructive",
        icon: <AlertTriangle className="h-5 w-5" />
      });
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Loading User Profile">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-lg">Loading user profile...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!profile) {
    return (
      <AdminLayout title="User Not Found">
        <div className="flex flex-col items-center justify-center h-96">
          <h1 className="text-2xl font-bold mb-4">User not found</h1>
          <p className="text-gray-500 mb-6">The requested user profile could not be found.</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`User Profile - ${profile.first_name} ${profile.last_name}`}>
      <ToastContainer />
      <DashboardPageHeader
        title="User Profile"
        description="View and manage user information"
        breadcrumbItems={[
          { label: "Users", href: "/admin/users" },
          { label: "Profile" }
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UserPersonalInfo 
          first_name={profile.first_name}
          last_name={profile.last_name}
          email={profile.email}
          settings={profile.settings}
        />

        <UserActivityTabs
          marketListings={marketListings}
          jobListings={jobListings}
          purchases={purchases}
          activities={profile.activities}
        />

        <UserAdminControls
          settings={profile.settings!}
          onUpdateSettings={updateUserSettings}
        />
      </div>
    </AdminLayout>
  );
}
