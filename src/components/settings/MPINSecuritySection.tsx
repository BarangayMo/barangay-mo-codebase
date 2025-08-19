import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Shield, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function MPINSecuritySection() {
  const [currentMpin, setCurrentMpin] = useState("");
  const [newMpin, setNewMpin] = useState("");
  const [confirmMpin, setConfirmMpin] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSettingUp, setIsSettingUp] = useState(false);

  const handleSetupMpin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newMpin !== confirmMpin) {
      toast.error("MPIN confirmation doesn't match");
      return;
    }

    if (newMpin.length !== 4 || !/^\d{4}$/.test(newMpin)) {
      toast.error("MPIN must be exactly 4 digits");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('set_user_mpin', {
        mpin_text: newMpin
      });

      if (error) {
        throw error;
      }

      toast.success("MPIN set successfully!");
      setNewMpin("");
      setConfirmMpin("");
      setIsSettingUp(false);
    } catch (error: any) {
      console.error('MPIN setup error:', error);
      toast.error(error.message || "Failed to set MPIN");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeMpin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newMpin !== confirmMpin) {
      toast.error("New MPIN confirmation doesn't match");
      return;
    }

    if (newMpin.length !== 4 || !/^\d{4}$/.test(newMpin)) {
      toast.error("MPIN must be exactly 4 digits");
      return;
    }

    if (currentMpin.length !== 4 || !/^\d{4}$/.test(currentMpin)) {
      toast.error("Please enter your current 4-digit MPIN");
      return;
    }

    setLoading(true);
    try {
      // First verify current MPIN
      const { data: user } = await supabase.auth.getUser();
      if (!user.user?.email) {
        throw new Error("User not found");
      }

      const { data: verifyResult, error: verifyError } = await supabase.rpc('verify_user_mpin', {
        p_email: user.user.email,
        p_mpin: currentMpin
      });

      if (verifyError) {
        throw verifyError;
      }

      const result = verifyResult as any;
      if (!result.ok) {
        throw new Error("Current MPIN is incorrect");
      }

      // Set new MPIN
      const { error: setError } = await supabase.rpc('set_user_mpin', {
        mpin_text: newMpin
      });

      if (setError) {
        throw setError;
      }

      toast.success("MPIN changed successfully!");
      setCurrentMpin("");
      setNewMpin("");
      setConfirmMpin("");
      setIsSettingUp(false);
    } catch (error: any) {
      console.error('MPIN change error:', error);
      toast.error(error.message || "Failed to change MPIN");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          MPIN Security
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Set up a 4-digit MPIN for quick and secure access to your account.
          </p>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-green-600">Enhanced security for quick login</span>
          </div>
        </div>

        {!isSettingUp ? (
          <div className="space-y-4">
            <Button 
              onClick={() => setIsSettingUp(true)}
              className="w-full"
              variant="outline"
            >
              <Lock className="h-4 w-4 mr-2" />
              Set Up / Change MPIN
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSetupMpin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-mpin">Current MPIN (if changing)</Label>
              <Input
                id="current-mpin"
                type="password"
                maxLength={4}
                placeholder="Enter current MPIN"
                value={currentMpin}
                onChange={(e) => setCurrentMpin(e.target.value.replace(/\D/g, ''))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-mpin">New MPIN</Label>
              <Input
                id="new-mpin"
                type="password"
                maxLength={4}
                placeholder="Enter 4-digit MPIN"
                value={newMpin}
                onChange={(e) => setNewMpin(e.target.value.replace(/\D/g, ''))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-mpin">Confirm MPIN</Label>
              <Input
                id="confirm-mpin"
                type="password"
                maxLength={4}
                placeholder="Confirm 4-digit MPIN"
                value={confirmMpin}
                onChange={(e) => setConfirmMpin(e.target.value.replace(/\D/g, ''))}
                required
              />
            </div>

            <div className="flex gap-2">
              <Button 
                type="submit" 
                disabled={loading}
                className="flex-1"
              >
                {loading ? "Setting up..." : currentMpin ? "Change MPIN" : "Set MPIN"}
              </Button>
              <Button 
                type="button"
                variant="outline"
                onClick={() => {
                  setIsSettingUp(false);
                  setCurrentMpin("");
                  setNewMpin("");
                  setConfirmMpin("");
                }}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Security Tips:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Use a unique 4-digit combination</li>
            <li>• Don't share your MPIN with anyone</li>
            <li>• After 5 failed attempts, your account will be locked for 15 minutes</li>
            <li>• MPIN works only on this device for security</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}