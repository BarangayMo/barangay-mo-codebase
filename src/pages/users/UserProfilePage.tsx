
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

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
  const [activeTab, setActiveTab] = useState("market");
  const { toast } = useToast();

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
          ...prev.settings!,
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
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${first_name} ${last_name}`} />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {first_name?.[0]}{last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-lg">{first_name} {last_name}</h3>
                <p className="text-sm text-gray-500">Member since {new Date(settings?.created_at || Date.now()).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="space-y-3 mt-4">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-500" />
                <span>{email}</span>
              </div>
              {settings?.phone_number && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{settings.phone_number}</span>
                </div>
              )}
              {settings?.address && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{formatAddress(settings.address)}</span>
                </div>
              )}
            </div>
          </div>

          <Separator className="my-6" />
          
          <h2 className="text-xl font-semibold mb-4">Communication</h2>
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => window.location.href = `/admin/messages/${id}`}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Message
            </Button>
            
            {settings?.phone_number && (
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => window.location.href = `tel:${settings.phone_number}`}
              >
                <Phone className="w-4 h-4 mr-2" />
                Call User
              </Button>
            )}

            {settings?.address && (
              <div className="mt-4">
                <h3 className="font-medium text-sm mb-2">User Location</h3>
                <div className="bg-gray-100 rounded-lg h-40 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-gray-500" />
                  <span className="ml-2 text-gray-500">Map View</span>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Activity Card */}
        <Card className="p-6 col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">User Activity</h2>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="market">Market Listings</TabsTrigger>
              <TabsTrigger value="jobs">Job Activities</TabsTrigger>
              <TabsTrigger value="purchases">Purchases</TabsTrigger>
              <TabsTrigger value="system">System Activity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="market">
              {marketListings.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2">Listing Title</th>
                        <th className="text-left py-3 px-2">Date</th>
                        <th className="text-left py-3 px-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {marketListings.map(item => (
                        <tr key={item.id} className="border-b">
                          <td className="py-3 px-2">{item.title}</td>
                          <td className="py-3 px-2">{new Date(item.date).toLocaleDateString()}</td>
                          <td className="py-3 px-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 py-8 text-center">No market listings found</p>
              )}
            </TabsContent>
            
            <TabsContent value="jobs">
              {jobListings.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2">Job Title</th>
                        <th className="text-left py-3 px-2">Date</th>
                        <th className="text-left py-3 px-2">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobListings.map(job => (
                        <tr key={job.id} className="border-b">
                          <td className="py-3 px-2">{job.title}</td>
                          <td className="py-3 px-2">{new Date(job.date).toLocaleDateString()}</td>
                          <td className="py-3 px-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {job.type}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 py-8 text-center">No job activities found</p>
              )}
            </TabsContent>
            
            <TabsContent value="purchases">
              {purchases.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2">Item</th>
                        <th className="text-left py-3 px-2">Date</th>
                        <th className="text-left py-3 px-2">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchases.map(purchase => (
                        <tr key={purchase.id} className="border-b">
                          <td className="py-3 px-2">{purchase.item}</td>
                          <td className="py-3 px-2">{new Date(purchase.date).toLocaleDateString()}</td>
                          <td className="py-3 px-2">{purchase.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 py-8 text-center">No purchases found</p>
              )}
            </TabsContent>
            
            <TabsContent value="system">
              {activities && activities.length > 0 ? (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="border-b pb-4">
                      <div className="flex items-center justify-between">
                        <span className="capitalize font-medium">{activity.activity_type.replace('_', ' ')}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(activity.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {typeof activity.activity_data === 'object' 
                          ? JSON.stringify(activity.activity_data)
                          : String(activity.activity_data)
                        }
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 py-8 text-center">No system activity found</p>
              )}
            </TabsContent>
          </Tabs>
        </Card>

        {/* Admin Controls Card */}
        <Card className="p-6 col-span-1 md:col-span-3">
          <h2 className="text-xl font-semibold mb-4">Admin Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="space-y-1">
                <h3 className="font-medium">Account Status</h3>
                <p className="text-sm text-gray-500">Ban or unban user account</p>
              </div>
              <Switch
                checked={settings?.is_banned || false}
                onCheckedChange={(checked) => updateUserSettings('is_banned', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="space-y-1">
                <h3 className="font-medium">Selling Privileges</h3>
                <p className="text-sm text-gray-500">Allow user to sell items</p>
              </div>
              <Switch
                checked={settings?.can_sell || false}
                onCheckedChange={(checked) => updateUserSettings('can_sell', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
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
      </div>
    </AdminLayout>
  );
}
