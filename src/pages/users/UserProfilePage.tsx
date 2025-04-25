
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { MapPin, Phone, Mail, Ban, Shield, MessageSquare } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DashboardPageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  settings?: {
    is_banned: boolean;
    can_sell: boolean;
    is_verified: boolean;
    phone_number: string | null;
    address: any;
  };
  activities?: Array<{
    id: string;
    activity_type: string;
    activity_data: any;
    created_at: string;
  }>;
}

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
      const [profileResponse, settingsResponse, activityResponse] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single(),
        supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', id)
          .single(),
        supabase
          .from('user_activity')
          .select('*')
          .eq('user_id', id)
          .order('created_at', { ascending: false })
      ]);

      if (profileResponse.error) throw profileResponse.error;

      setProfile({
        ...profileResponse.data,
        settings: settingsResponse.data,
        activities: activityResponse.data
      });
    } catch (error) {
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
                  <span>{settings.address.street}, {settings.address.city}</span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Activity Card */}
        <Card className="p-6 col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {activities?.map((activity) => (
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
            ))}
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
