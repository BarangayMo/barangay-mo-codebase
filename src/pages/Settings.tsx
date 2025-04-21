
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
  const { userRole } = useAuth();
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    updates: false,
    marketing: false,
  });

  const getAccentColor = () => {
    switch (userRole) {
      case 'official':
        return 'bg-official text-white hover:bg-official-dark';
      case 'resident':
        return 'bg-resident text-white hover:bg-resident-dark';
      default:
        return '';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account preferences and settings
            </p>
          </div>
        </div>

        <Tabs defaultValue="preferences" className="space-y-4">
          <TabsList>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>

          <TabsContent value="preferences" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize how Smart Barangay looks on your device
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="theme-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Switch between light and dark appearance
                    </p>
                  </div>
                  <Switch
                    id="theme-mode"
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Theme Color</Label>
                    <p className="text-sm text-muted-foreground">
                      Your theme is based on your account type
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div 
                      className={`w-6 h-6 rounded-full bg-official ${userRole === 'official' ? 'ring-2 ring-official ring-offset-2' : ''}`}
                      title="Official Theme"
                    />
                    <div 
                      className={`w-6 h-6 rounded-full bg-resident ${userRole === 'resident' ? 'ring-2 ring-resident ring-offset-2' : ''}`}
                      title="Resident Theme"
                    />
                    <div 
                      className={`w-6 h-6 rounded-full bg-primary ${userRole === 'superadmin' ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                      title="Admin Theme"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Language & Region</CardTitle>
                <CardDescription>
                  Set your preferred language and regional settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <select 
                      id="language" 
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="en">English</option>
                      <option value="fil">Filipino</option>
                      <option value="tgl">Tagalog</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="region">Region</Label>
                    <select 
                      id="region" 
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="ncr">National Capital Region</option>
                      <option value="region1">Region 1</option>
                      <option value="region2">Region 2</option>
                      <option value="region3">Region 3</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Decide which notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates via email
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={notifications.email}
                      onCheckedChange={(checked) => 
                        setNotifications({ ...notifications, email: checked })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive alerts on your device
                      </p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={notifications.push}
                      onCheckedChange={(checked) => 
                        setNotifications({ ...notifications, push: checked })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="update-notifications">Updates & Announcements</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about system updates
                      </p>
                    </div>
                    <Switch
                      id="update-notifications"
                      checked={notifications.updates}
                      onCheckedChange={(checked) => 
                        setNotifications({ ...notifications, updates: checked })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketing-notifications">Marketing & Promotions</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive marketing and promotional emails
                      </p>
                    </div>
                    <Switch
                      id="marketing-notifications"
                      checked={notifications.marketing}
                      onCheckedChange={(checked) => 
                        setNotifications({ ...notifications, marketing: checked })
                      }
                    />
                  </div>
                </div>
                
                <Button className={getAccentColor()}>Save Notification Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Update your account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full-name">Full Name</Label>
                    <input 
                      id="full-name" 
                      type="text" 
                      className="w-full p-2 border rounded-md"
                      defaultValue="John Doe"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <input 
                      id="email" 
                      type="email" 
                      className="w-full p-2 border rounded-md"
                      defaultValue="john.doe@example.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <input 
                      id="phone" 
                      type="tel" 
                      className="w-full p-2 border rounded-md"
                      defaultValue="+63 918 123 4567"
                    />
                  </div>
                  
                  {userRole === 'resident' && (
                    <div className="space-y-2">
                      <Label htmlFor="rbi-number">RBI Number</Label>
                      <input 
                        id="rbi-number" 
                        type="text" 
                        className="w-full p-2 border rounded-md"
                        defaultValue="RBI-2023-12345"
                        disabled
                      />
                    </div>
                  )}
                </div>
                
                <Button className={getAccentColor()}>Update Account Information</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <input 
                      id="current-password" 
                      type="password" 
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <input 
                      id="new-password" 
                      type="password" 
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <input 
                      id="confirm-password" 
                      type="password" 
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
                
                <Button className={getAccentColor()}>Change Password</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Control your privacy preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="profile-visibility">Profile Visibility</Label>
                      <p className="text-sm text-muted-foreground">
                        Make your profile visible to other members
                      </p>
                    </div>
                    <Switch
                      id="profile-visibility"
                      defaultChecked={true}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="data-sharing">Data Sharing</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow sharing of non-personal data for improvement
                      </p>
                    </div>
                    <Switch
                      id="data-sharing"
                      defaultChecked={true}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="cookies">Cookie Preferences</Label>
                      <p className="text-sm text-muted-foreground">
                        Manage cookie usage on this platform
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage Cookies
                    </Button>
                  </div>
                </div>
                
                <Button className={getAccentColor()}>Save Privacy Settings</Button>
                
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-2">Data Management</h3>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline">Download My Data</Button>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
