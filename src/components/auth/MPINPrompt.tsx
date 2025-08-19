import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mpinAuth } from "@/services/mpinAuth";

export const MPINPrompt = () => {
  const [hasMpin, setHasMpin] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkMpinStatus();
  }, []);

  const checkMpinStatus = async () => {
    const hasSetup = await mpinAuth.hasMpinSetup();
    setHasMpin(hasSetup);
  };

  const handleSetupMpin = () => {
    navigate('/mpin-setup');
  };

  const handleSkip = () => {
    // User can skip, redirect to appropriate dashboard
    // This will be handled by the main auth flow
  };

  if (hasMpin === null) {
    return null; // Loading
  }

  if (hasMpin) {
    return null; // Already has MPIN, don't show prompt
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-xl">Secure Your Account</CardTitle>
        <CardDescription>
          Set up a 4-digit MPIN for quick and secure access to your account
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
            <Clock className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">Quick Access</h4>
              <p className="text-xs text-muted-foreground">
                Login in seconds without typing your full password
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
            <Shield className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">Enhanced Security</h4>
              <p className="text-xs text-muted-foreground">
                Your MPIN is securely encrypted and stored locally
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button onClick={handleSetupMpin} className="w-full">
            Set up MPIN now
          </Button>
          
          <Button variant="ghost" onClick={handleSkip} className="w-full">
            Skip for now
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          You can set up MPIN later in your account settings
        </p>
      </CardContent>
    </Card>
  );
};