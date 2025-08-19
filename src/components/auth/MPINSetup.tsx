import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { mpinAuth } from "@/services/mpinAuth";
import { Lock, Shield, CheckCircle } from "lucide-react";

interface MPINSetupProps {
  onSetupComplete: () => void;
  onSkip?: () => void;
}

export const MPINSetup = ({ onSetupComplete, onSkip }: MPINSetupProps) => {
  const [mpin, setMpin] = useState("");
  const [confirmMpin, setConfirmMpin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSetupMpin = async () => {
    if (mpin !== confirmMpin) {
      toast({
        title: "Error",
        description: "MPIN confirmation doesn't match",
        variant: "destructive"
      });
      return;
    }

    if (mpin.length < 4) {
      toast({
        title: "Error", 
        description: "MPIN must be at least 4 digits",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await mpinAuth.setMpin(mpin);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "MPIN set up successfully!",
        });
        onSetupComplete();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to set up MPIN",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set up MPIN",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Set up MPIN</CardTitle>
        <CardDescription>
          Create a 4-digit MPIN for quick and secure access to your account
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mpin" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Enter 4-digit MPIN
            </Label>
            <Input
              id="mpin"
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
            <Label htmlFor="confirm-mpin" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Confirm MPIN
            </Label>
            <Input
              id="confirm-mpin"
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
        </div>

        <div className="space-y-3">
          <Button 
            onClick={handleSetupMpin} 
            disabled={isLoading || mpin.length < 4 || confirmMpin.length < 4}
            className="w-full"
          >
            {isLoading ? "Setting up..." : "Set up MPIN"}
          </Button>

          {onSkip && (
            <Button variant="ghost" onClick={onSkip} className="w-full">
              Skip for now
            </Button>
          )}
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Benefits of MPIN:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Quick access without typing email/password</li>
            <li>• Secure biometric-like authentication</li>
            <li>• Works even when offline</li>
            <li>• Can be changed anytime in settings</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};