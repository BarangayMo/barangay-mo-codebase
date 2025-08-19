import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEnhancedToast } from "@/components/ui/enhanced-toast";
import { mpinAuth } from "@/services/mpinAuth";
import { Shield, Lock, CheckCircle, AlertCircle } from "lucide-react";

interface MPINSecuritySectionProps {
  accentColor: string;
}

export const MPINSecuritySection = ({ accentColor }: MPINSecuritySectionProps) => {
  const [hasMpin, setHasMpin] = useState<boolean | null>(null);
  const [isChangingMpin, setIsChangingMpin] = useState(false);
  const [mpin, setMpin] = useState("");
  const [confirmMpin, setConfirmMpin] = useState("");
  const [currentMpin, setCurrentMpin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useEnhancedToast();

  useEffect(() => {
    checkMpinStatus();
  }, []);

  const checkMpinStatus = async () => {
    const hasSetup = await mpinAuth.hasMpinSetup();
    setHasMpin(hasSetup);
  };

  const handleSetupMpin = async () => {
    if (mpin !== confirmMpin) {
      showToast({
        title: "Error",
        description: "MPIN confirmation doesn't match",
        variant: "destructive",
        icon: <AlertCircle className="h-5 w-5" />
      });
      return;
    }

    if (mpin.length < 4) {
      showToast({
        title: "Error", 
        description: "MPIN must be at least 4 digits",
        variant: "destructive",
        icon: <AlertCircle className="h-5 w-5" />
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await mpinAuth.setMpin(mpin);
      
      if (result.success) {
        showToast({
          title: "Success",
          description: "MPIN set up successfully!",
          variant: "success",
          icon: <CheckCircle className="h-5 w-5" />
        });
        setHasMpin(true);
        setMpin("");
        setConfirmMpin("");
        setIsChangingMpin(false);
      } else {
        showToast({
          title: "Error",
          description: result.error || "Failed to set up MPIN",
          variant: "destructive",
          icon: <AlertCircle className="h-5 w-5" />
        });
      }
    } catch (error) {
      showToast({
        title: "Error",
        description: "Failed to set up MPIN",
        variant: "destructive",
        icon: <AlertCircle className="h-5 w-5" />
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeMpin = async () => {
    if (!currentMpin) {
      showToast({
        title: "Error",
        description: "Please enter your current MPIN",
        variant: "destructive",
        icon: <AlertCircle className="h-5 w-5" />
      });
      return;
    }

    if (mpin !== confirmMpin) {
      showToast({
        title: "Error",
        description: "New MPIN confirmation doesn't match",
        variant: "destructive",
        icon: <AlertCircle className="h-5 w-5" />
      });
      return;
    }

    if (mpin.length < 4) {
      showToast({
        title: "Error", 
        description: "MPIN must be at least 4 digits",
        variant: "destructive",
        icon: <AlertCircle className="h-5 w-5" />
      });
      return;
    }

    setIsLoading(true);
    try {
      // First verify current MPIN
      const credentials = mpinAuth.getStoredCredentials();
      if (!credentials) {
        showToast({
          title: "Error",
          description: "User session not found",
          variant: "destructive",
          icon: <AlertCircle className="h-5 w-5" />
        });
        setIsLoading(false);
        return;
      }

      const verifyResult = await mpinAuth.verifyMpin(currentMpin);
      if (!verifyResult.success) {
        showToast({
          title: "Error",
          description: "Current MPIN is incorrect",
          variant: "destructive",
          icon: <AlertCircle className="h-5 w-5" />
        });
        setIsLoading(false);
        return;
      }

      // Set new MPIN
      const result = await mpinAuth.setMpin(mpin);
      
      if (result.success) {
        showToast({
          title: "Success",
          description: "MPIN updated successfully!",
          variant: "success",
          icon: <CheckCircle className="h-5 w-5" />
        });
        setMpin("");
        setConfirmMpin("");
        setCurrentMpin("");
        setIsChangingMpin(false);
      } else {
        showToast({
          title: "Error",
          description: result.error || "Failed to update MPIN",
          variant: "destructive",
          icon: <AlertCircle className="h-5 w-5" />
        });
      }
    } catch (error) {
      showToast({
        title: "Error",
        description: "Failed to update MPIN",
        variant: "destructive",
        icon: <AlertCircle className="h-5 w-5" />
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setMpin("");
    setConfirmMpin("");
    setCurrentMpin("");
    setIsChangingMpin(false);
  };

  if (hasMpin === null) {
    return null; // Loading
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          MPIN Security
        </CardTitle>
        <CardDescription>
          {hasMpin 
            ? "Manage your 4-digit MPIN for quick and secure access"
            : "Set up a 4-digit MPIN for quick and secure access to your account"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {hasMpin && !isChangingMpin ? (
          // MPIN is already set up
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <h4 className="font-medium text-green-800 dark:text-green-200">MPIN is set up</h4>
                <p className="text-sm text-green-600 dark:text-green-300">
                  You can now use MPIN for quick login
                </p>
              </div>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Benefits of MPIN:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Quick access without typing email/password</li>
                <li>• Secure authentication with local storage</li>
                <li>• Works seamlessly across your devices</li>
                <li>• Enhanced security with failed attempt protection</li>
              </ul>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setIsChangingMpin(true)}
                className="flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Change MPIN
              </Button>
            </div>
          </div>
        ) : (
          // MPIN setup or change form
          <div className="space-y-4">
            {hasMpin && (
              <div className="space-y-2">
                <Label htmlFor="current-mpin" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Current MPIN
                </Label>
                <Input
                  id="current-mpin"
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4}
                  value={currentMpin}
                  onChange={(e) => setCurrentMpin(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••"
                  className="text-center text-2xl tracking-widest"
                  autoComplete="off"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="setup-mpin" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                {hasMpin ? "New" : "Enter"} 4-digit MPIN
              </Label>
              <Input
                id="setup-mpin"
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                value={mpin}
                onChange={(e) => setMpin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="text-center text-2xl tracking-widest"
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-setup-mpin" className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Confirm MPIN
              </Label>
              <Input
                id="confirm-setup-mpin"
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                value={confirmMpin}
                onChange={(e) => setConfirmMpin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="text-center text-2xl tracking-widest"
                autoComplete="off"
              />
            </div>

            {!hasMpin && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Why set up MPIN?</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Login quickly without typing your full password</li>
                  <li>• Enhanced security with biometric-like access</li>
                  <li>• Secure local storage of session data</li>
                  <li>• Perfect for frequent app usage</li>
                </ul>
              </div>
            )}

            <div className="flex gap-3">
              <Button 
                onClick={hasMpin ? handleChangeMpin : handleSetupMpin} 
                disabled={isLoading || mpin.length < 4 || confirmMpin.length < 4 || (hasMpin && !currentMpin)}
                className={accentColor}
              >
                {isLoading 
                  ? (hasMpin ? "Updating..." : "Setting up...") 
                  : (hasMpin ? "Update MPIN" : "Set up MPIN")
                }
              </Button>

              {isChangingMpin && (
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};