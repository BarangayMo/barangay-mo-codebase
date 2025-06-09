
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Settings, Save, Loader2 } from "lucide-react";
import { useSystemSettings, useUpdateSystemSetting } from "@/hooks/use-system-settings";

export const UserSettingsTab = () => {
  const { data: settings = [], isLoading, error } = useSystemSettings();
  const updateSettingMutation = useUpdateSystemSetting();

  const [localSettings, setLocalSettings] = useState<Record<string, any>>({});

  // Initialize local settings when data is loaded
  React.useEffect(() => {
    if (settings.length > 0) {
      const initialSettings: Record<string, any> = {};
      settings.forEach(setting => {
        initialSettings[setting.setting_key] = setting.setting_value;
      });
      setLocalSettings(initialSettings);
    }
  }, [settings]);

  const handleSettingChange = (key: string, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSetting = (key: string) => {
    updateSettingMutation.mutate({
      settingKey: key,
      value: localSettings[key],
    });
  };

  const getSettingValue = (key: string, defaultValue: any = false) => {
    return localSettings[key] !== undefined ? localSettings[key] : defaultValue;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-8">
        Error loading settings. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">User Settings</h2>
        <div className="flex items-center text-sm text-gray-500">
          <Settings className="h-4 w-4 mr-2" />
          System Configuration
        </div>
      </div>

      <div className="grid gap-6">
        {/* Authentication Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Authentication & Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Allow User Registration</Label>
                <p className="text-sm text-gray-500">Allow new users to create accounts</p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={getSettingValue('allow_user_registration', true)}
                  onCheckedChange={(checked) => handleSettingChange('allow_user_registration', checked)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSaveSetting('allow_user_registration')}
                  disabled={updateSettingMutation.isPending}
                >
                  <Save className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Email Verification Required</Label>
                <p className="text-sm text-gray-500">Require email verification for new accounts</p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={getSettingValue('email_verification_required', true)}
                  onCheckedChange={(checked) => handleSettingChange('email_verification_required', checked)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSaveSetting('email_verification_required')}
                  disabled={updateSettingMutation.isPending}
                >
                  <Save className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                <p className="text-sm text-gray-500">Require 2FA for all users</p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={getSettingValue('two_factor_required', false)}
                  onCheckedChange={(checked) => handleSettingChange('two_factor_required', checked)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSaveSetting('two_factor_required')}
                  disabled={updateSettingMutation.isPending}
                >
                  <Save className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label className="text-sm font-medium">Session Timeout (minutes)</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={getSettingValue('session_timeout_minutes', 60)}
                  onChange={(e) => handleSettingChange('session_timeout_minutes', parseInt(e.target.value))}
                  className="w-32"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSaveSetting('session_timeout_minutes')}
                  disabled={updateSettingMutation.isPending}
                >
                  <Save className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Management Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">User Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Admin Approval Required</Label>
                <p className="text-sm text-gray-500">Require admin approval for new accounts</p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={getSettingValue('admin_approval_required', false)}
                  onCheckedChange={(checked) => handleSettingChange('admin_approval_required', checked)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSaveSetting('admin_approval_required')}
                  disabled={updateSettingMutation.isPending}
                >
                  <Save className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Auto-Archive Inactive Users</Label>
                <p className="text-sm text-gray-500">Archive users inactive for 90+ days</p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={getSettingValue('auto_archive_inactive_users', false)}
                  onCheckedChange={(checked) => handleSettingChange('auto_archive_inactive_users', checked)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSaveSetting('auto_archive_inactive_users')}
                  disabled={updateSettingMutation.isPending}
                >
                  <Save className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label className="text-sm font-medium">Data Retention (days)</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={getSettingValue('data_retention_days', 365)}
                  onChange={(e) => handleSettingChange('data_retention_days', parseInt(e.target.value))}
                  className="w-32"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSaveSetting('data_retention_days')}
                  disabled={updateSettingMutation.isPending}
                >
                  <Save className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Welcome Emails</Label>
                <p className="text-sm text-gray-500">Send welcome email to new users</p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={getSettingValue('welcome_emails_enabled', true)}
                  onCheckedChange={(checked) => handleSettingChange('welcome_emails_enabled', checked)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSaveSetting('welcome_emails_enabled')}
                  disabled={updateSettingMutation.isPending}
                >
                  <Save className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Login Notifications</Label>
                <p className="text-sm text-gray-500">Notify users of successful logins</p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={getSettingValue('login_notifications_enabled', false)}
                  onCheckedChange={(checked) => handleSettingChange('login_notifications_enabled', checked)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSaveSetting('login_notifications_enabled')}
                  disabled={updateSettingMutation.isPending}
                >
                  <Save className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
