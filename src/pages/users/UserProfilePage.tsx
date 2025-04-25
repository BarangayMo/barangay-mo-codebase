
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { MapPin, Phone, Mail, MessageSquare } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DashboardPageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Json } from "@/integrations/supabase/types";

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  settings?: {
    is_banned: boolean | null;
    can_sell: boolean | null;
    is_verified: boolean | null;
    phone_number: string | null;
    address: Json | null;
    created_at: string;
    updated_at: string;
    user_id: string;
  };
  activities?: Array<{
    id: string;
    activity_type: string;
    activity_data: any;
    created_at: string;
  }>;
}

// Helper function to safely display address information
const formatAddress = (address: Json | null): string => {
  if (!address) return '';
  
  // Check if address is an object with street and city properties
  if (typeof address === 'object' && address !== null && !Array.isArray(address)) {
    const addressObj = address as Record<string, unknown>;
    const street = addressObj.street;
    const city = addressObj.city;
    
    if (street && city) {
      return `${street}, ${city}`;
    } else if (street) {
      return `${street}`;
    } else if (city) {
      return `${city}`;
    }
  }
  
  // If it's not an object or doesn't have the expected properties,
  // just return the string representation
  return String(address);
};

export default function UserProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadUserProfile();
  }, [id]);

  const loadUserProfile = async () => {
    try {
      // First, get the user's email from auth.users via profiles
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .eq('id', id)
        .single();

      if (userError) throw userError;

      // Separately fetch the user email from an auth endpoint or store it in profiles
      // For now, we'll use a placeholder email if not available
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
        // PGRST116 means no rows returned, which is fine for a new user
        throw settingsError;
      }

      setProfile({
        ...userData,
        email: email, // Include the email field
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
      toast({
        title: "Error loading profile",
        description: "Could not load user profile data",
        variant: "destructive"
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
          ...prev.settings,
          [setting]: value
        }
      });

      toast({
        title: "Settings updated",
        description: "User settings have been updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error updating settings",
        description: "Could not update user settings",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>User not found</div>;
  }

  const { first_name, last_name, email, settings, activities } = profile;

  return (
    <AdminLayout title={`User Profile - ${first_name} ${last_name}`}>
      <DashboardPageHeader
        title="User Profile"
        description="View and manage user information"
        breadcrumbItems={[
          { label: "Users", href: "/admin/users" },
          { label: "Profile" }
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Personal Info Card */}
        <Card className="p-6 col-span-1">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                {first_name?.[0]}{last_name?.[0]}
              </div>
              <div>
                <h3 className="font-medium">{first_name} {last_name}</h3>
                <p className="text-sm text-gray-500">Member</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4" />
                <span>{email}</span>
              </div>
              {settings?.phone_number && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4" />
                  <span>{settings.phone_number}</span>
                </div>
              )}
              {settings?.address && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{formatAddress(settings.address)}</span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Activity Card */}
        <Card className="p-6 col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {activities?.length ? activities.map((activity) => (
              <div key={activity.id} className="border-b pb-4">
                <div className="flex items-center justify-between">
                  <span className="capitalize">{activity.activity_type.replace('_', ' ')}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(activity.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {JSON.stringify(activity.activity_data)}
                </p>
              </div>
            )) : (
              <p className="text-gray-500">No recent activity</p>
            )}
          </div>
        </Card>

        {/* Admin Controls Card */}
        <Card className="p-6 col-span-1 md:col-span-3">
          <h2 className="text-xl font-semibold mb-4">Admin Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-medium">Account Status</h3>
                <p className="text-sm text-gray-500">Ban or unban user account</p>
              </div>
              <Switch
                checked={settings?.is_banned || false}
                onCheckedChange={(checked) => updateUserSettings('is_banned', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-medium">Selling Privileges</h3>
                <p className="text-sm text-gray-500">Allow user to sell items</p>
              </div>
              <Switch
                checked={settings?.can_sell || false}
                onCheckedChange={(checked) => updateUserSettings('can_sell', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-medium">Account Verification</h3>
                <p className="text-sm text-gray-500">Verify user's identity</p>
              </div>
              <Switch
                checked={settings?.is_verified || false}
                onCheckedChange={(checked) => updateUserSettings('is_verified', checked)}
              />
            </div>
          </div>
        </Card>

        {/* Communication Options */}
        <Card className="p-6 col-span-1 md:col-span-3">
          <h2 className="text-xl font-semibold mb-4">Communication</h2>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => window.location.href = `/messages/${id}`}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Message
            </Button>
            {settings?.phone_number && (
              <Button variant="outline" onClick={() => window.location.href = `tel:${settings.phone_number}`}>
                <Phone className="w-4 h-4 mr-2" />
                Call User
              </Button>
            )}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
