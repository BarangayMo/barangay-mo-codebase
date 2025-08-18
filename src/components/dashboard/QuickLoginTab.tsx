import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Fingerprint, Check, X, AlertCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface DeviceData {
  mpin: string;
  biometricEnabled: boolean;
  failedAttempts: number;
  email: string;
  userRole?: string;
}

export function QuickLoginTab() {
  const { user } = useAuth();
  const [mpinFirst, setMpinFirst] = useState("");
  const [mpinConfirm, setMpinConfirm] = useState("");
  const [isSettingMpin, setIsSettingMpin] = useState(false);
  const [deviceData, setDeviceData] = useState<DeviceData | null>(null);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  // Generate device fingerprint
  const getDeviceFingerprint = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx!.textBaseline = 'top';
    ctx!.font = '14px Arial';
    ctx!.fillText('Device fingerprint', 2, 2);
    
    return btoa(
      navigator.userAgent +
      navigator.language +
      screen.width + 'x' + screen.height +
      new Date().getTimezoneOffset() +
      canvas.toDataURL()
    ).substring(0, 32);
  };

  // Load device data on mount - only for current user, replace any existing data
  useEffect(() => {
    if (!user?.email) return;
    
    const fingerprint = getDeviceFingerprint();
    const storageKey = `quicklogin_${fingerprint}`;
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      try {
        const data = JSON.parse(stored);
        // Always update to current user's data (latest login account only)
        if (data.email !== user.email) {
          // Clear old user data and reset for current user
          setDeviceData(null);
        } else {
          setDeviceData(data);
        }
      } catch (error) {
        console.error('Error parsing stored device data:', error);
        setDeviceData(null);
      }
    }
  }, [user?.email]);

  // Check biometric availability
  useEffect(() => {
    const checkBiometrics = async () => {
      try {
        if ('credentials' in navigator && 'PublicKeyCredential' in window) {
          const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          setBiometricAvailable(available);
        }
      } catch (error) {
        console.error('Error checking biometrics:', error);
      }
    };
    checkBiometrics();
  }, []);

  const handleSetMpin = () => {
    if (mpinFirst.length !== 4) {
      toast.error("MPIN must be 4 digits");
      return;
    }

    if (mpinFirst !== mpinConfirm) {
      toast.error("Oops, they don't match. Try again 😊");
      return;
    }

    const fingerprint = getDeviceFingerprint();
    const storageKey = `quicklogin_${fingerprint}`;
    
    const newDeviceData: DeviceData = {
      mpin: mpinFirst,
      biometricEnabled: deviceData?.biometricEnabled || false,
      failedAttempts: 0,
      email: user!.email!,
      userRole: user!.role
    };

    localStorage.setItem(storageKey, JSON.stringify(newDeviceData));
    setDeviceData(newDeviceData);
    setMpinFirst("");
    setMpinConfirm("");
    setIsSettingMpin(false);
    
    toast.success("✨ MPIN set successfully!");
  };

  const handleEnableBiometric = async () => {
    if (!biometricAvailable) {
      toast.error("Biometric authentication not available on this device");
      return;
    }

    try {
      // Create a credential for biometric authentication
      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
        challenge: new Uint8Array(32),
        rp: {
          name: "Barangay Mo",
          id: window.location.hostname,
        },
        user: {
          id: new TextEncoder().encode(user!.id),
          name: user!.email!,
          displayName: user!.email!,
        },
        pubKeyCredParams: [{alg: -7, type: "public-key"}],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required"
        },
        timeout: 60000,
        attestation: "direct"
      };

      await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions
      });

      const fingerprint = getDeviceFingerprint();
      const storageKey = `quicklogin_${fingerprint}`;
      
      const updatedData: DeviceData = {
        ...deviceData!,
        biometricEnabled: true
      };

      localStorage.setItem(storageKey, JSON.stringify(updatedData));
      setDeviceData(updatedData);
      
      toast.success("🔐 Biometric login enabled!");
    } catch (error) {
      console.error('Biometric setup failed:', error);
      toast.error("Failed to set up biometric authentication");
    }
  };

  const handleResetQuickLogin = () => {
    const fingerprint = getDeviceFingerprint();
    const storageKey = `quicklogin_${fingerprint}`;
    
    localStorage.removeItem(storageKey);
    setDeviceData(null);
    setMpinFirst("");
    setMpinConfirm("");
    setIsSettingMpin(false);
    
    toast.success("Quick login reset successfully");
  };

  const hasMpin = deviceData?.mpin;
  const hasBiometric = deviceData?.biometricEnabled;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          <h2 className="text-xl font-semibold">Make logging in faster!</h2>
        </div>
        <p className="text-muted-foreground">
          Set a 4-digit MPIN or use your fingerprint to sign in instantly.
        </p>
      </div>

      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Current Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>MPIN</span>
            <Badge variant={hasMpin ? "default" : "secondary"}>
              {hasMpin ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
              {hasMpin ? "Set" : "Not set"}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Fingerprint</span>
            <Badge variant={hasBiometric ? "default" : "secondary"}>
              {hasBiometric ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
              {hasBiometric ? "Enabled" : "Not enabled"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* MPIN Setup */}
      <Card>
        <CardHeader>
          <CardTitle>MPIN Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isSettingMpin ? (
            <div className="space-y-4">
              {hasMpin && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Check className="h-4 w-4" />
                  MPIN is already set for this device
                </div>
              )}
              <Button 
                onClick={() => setIsSettingMpin(true)}
                className="w-full"
                variant={hasMpin ? "outline" : "default"}
              >
                {hasMpin ? "Change MPIN" : "Set MPIN"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Enter 4-digit MPIN</label>
                <Input
                  type="password"
                  maxLength={4}
                  value={mpinFirst}
                  onChange={(e) => setMpinFirst(e.target.value.replace(/\D/g, ''))}
                  placeholder="****"
                  className="text-center text-2xl tracking-widest"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Confirm MPIN</label>
                <Input
                  type="password"
                  maxLength={4}
                  value={mpinConfirm}
                  onChange={(e) => setMpinConfirm(e.target.value.replace(/\D/g, ''))}
                  placeholder="****"
                  className="text-center text-2xl tracking-widest"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSetMpin} className="flex-1">
                  Set MPIN
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsSettingMpin(false);
                    setMpinFirst("");
                    setMpinConfirm("");
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Biometric Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fingerprint className="h-5 w-5" />
            Biometric Authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!biometricAvailable ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              Biometric authentication not available on this device
            </div>
          ) : hasBiometric ? (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Check className="h-4 w-4" />
              Biometric login is enabled for this device
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Use your fingerprint or face to log in quickly and securely.
              </p>
              <Button 
                onClick={handleEnableBiometric}
                className="w-full"
                disabled={!hasMpin}
              >
                Enable Fingerprint
              </Button>
              {!hasMpin && (
                <p className="text-xs text-muted-foreground">
                  Set up MPIN first to enable biometric authentication
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reset */}
      {(hasMpin || hasBiometric) && (
        <Card>
          <CardContent className="pt-6">
            <Button 
              variant="destructive" 
              onClick={handleResetQuickLogin}
              className="w-full"
            >
              Reset / Disable Quick Login
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              This will remove all quick login settings for this device
            </p>
          </CardContent>
        </Card>
      )}

      {/* Security Note */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-2">
            <Lock className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Security Note</p>
              <p>Quick login settings are stored locally on this device only. You can always use your email and password to sign in.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}