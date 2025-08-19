import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { mpinAuth, StoredCredentials } from "@/services/mpinAuth";
import { Lock, User, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MPINLoginProps {
  onSuccess: () => void;
  onBackToLogin: () => void;
}

export const MPINLogin = ({ onSuccess, onBackToLogin }: MPINLoginProps) => {
  const [mpin, setMpin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [storedUser, setStoredUser] = useState<StoredCredentials | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const credentials = mpinAuth.getStoredCredentials();
    if (!credentials) {
      // No stored user, redirect to login
      onBackToLogin();
      return;
    }
    setStoredUser(credentials);
  }, [onBackToLogin]);

  const handleMpinLogin = async () => {
    if (mpin.length < 4) {
      toast({
        title: "Error",
        description: "Please enter your 4-digit MPIN",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await mpinAuth.verifyMpin(mpin);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Login successful!",
        });
        onSuccess();
      } else {
        toast({
          title: "Error",
          description: result.error || "Invalid MPIN",
          variant: "destructive"
        });
        setMpin(""); // Clear MPIN on error
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Login failed",
        variant: "destructive"
      });
      setMpin("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && mpin.length >= 4) {
      handleMpinLogin();
    }
  };

  const clearStoredUser = () => {
    mpinAuth.clearStoredCredentials();
    onBackToLogin();
  };

  if (!storedUser) {
    return null; // Will redirect to login
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-primary" />
        </div>
        <div>
          <CardTitle className="text-2xl">Welcome back!</CardTitle>
          <CardDescription className="mt-2">
            {storedUser.email}
          </CardDescription>
          <div className="inline-flex items-center px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mt-2">
            {storedUser.role.charAt(0).toUpperCase() + storedUser.role.slice(1)}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Lock className="w-4 h-4" />
              Enter your 4-digit MPIN
            </div>
            <Input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={mpin}
              onChange={(e) => setMpin(e.target.value.replace(/\D/g, ''))}
              onKeyPress={handleKeyPress}
              placeholder="••••"
              className="text-center text-3xl tracking-[0.5em] h-16"
              autoComplete="off"
              autoFocus
            />
          </div>

          {/* MPIN dots indicator */}
          <div className="flex justify-center gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full border-2 transition-colors ${
                  i < mpin.length 
                    ? 'bg-primary border-primary' 
                    : 'border-muted-foreground/30'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={handleMpinLogin} 
            disabled={isLoading || mpin.length < 4}
            className="w-full h-12"
          >
            {isLoading ? "Verifying..." : "Login"}
          </Button>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={onBackToLogin}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={clearStoredUser}
              className="flex-1"
            >
              Different User
            </Button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Forgot your MPIN? Use email/password login instead.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};