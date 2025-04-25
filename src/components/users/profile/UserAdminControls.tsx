
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface UserAdminControlsProps {
  settings: {
    is_banned: boolean | null;
    can_sell: boolean | null;
    is_verified: boolean | null;
  };
  onUpdateSettings: (setting: string, value: boolean) => Promise<void>;
}

export const UserAdminControls = ({ settings, onUpdateSettings }: UserAdminControlsProps) => {
  return (
    <Card className="p-6 col-span-1 md:col-span-3">
      <h2 className="text-xl font-semibold mb-4">Admin Controls</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center justify-between p-4 rounded-lg border">
          <div className="space-y-1">
            <h3 className="font-medium">Account Status</h3>
            <p className="text-sm text-gray-500">Ban or unban user account</p>
          </div>
          <Switch
            checked={settings.is_banned || false}
            onCheckedChange={(checked) => onUpdateSettings('is_banned', checked)}
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border">
          <div className="space-y-1">
            <h3 className="font-medium">Selling Privileges</h3>
            <p className="text-sm text-gray-500">Allow user to sell items</p>
          </div>
          <Switch
            checked={settings.can_sell || false}
            onCheckedChange={(checked) => onUpdateSettings('can_sell', checked)}
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border">
          <div className="space-y-1">
            <h3 className="font-medium">Account Verification</h3>
            <p className="text-sm text-gray-500">Verify user's identity</p>
          </div>
          <Switch
            checked={settings.is_verified || false}
            onCheckedChange={(checked) => onUpdateSettings('is_verified', checked)}
          />
        </div>
      </div>
    </Card>
  );
};
