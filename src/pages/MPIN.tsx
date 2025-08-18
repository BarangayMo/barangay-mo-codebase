import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Lock } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export default function MPIN() {
  const [mpin, setMpin] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "mpin">("email");
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  // Auto-fill last used email and skip email step
  useEffect(() => {
    try {
      const last = localStorage.getItem('last_login_email');
      if (last) {
        setEmail(last);
        setStep('mpin');
      }
    } catch {}
  }, []);

  const handleEmailSubmit = () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    setStep("mpin");
  };

  const handleLogin = async () => {
    if (mpin.length !== 4) {
      toast.error("Please enter a 4-digit MPIN");
      return;
    }

    setLoading(true);
    try {
      // Call the MPIN authentication edge function
      const { data, error } = await supabase.functions.invoke('mpin-auth', {
        body: { email, mpin }
      });

      if (error || !data.success) {
        console.error("MPIN auth error:", error || data);
        
        if (data?.reason === 'locked') {
          const lockedUntil = new Date(data.locked_until).toLocaleString();
          toast.error(`Account locked until ${lockedUntil}`);
        } else if (data?.reason === 'invalid') {
          toast.error(`Invalid MPIN. ${data.remaining_attempts} attempts remaining.`);
        } else if (data?.reason === 'not_set') {
          toast.error("MPIN not set. Please set up MPIN in settings first.");
        } else if (data?.reason === 'not_found') {
          toast.error("Email not found. Please check your email address.");
        } else {
          toast.error("Authentication failed. Please try again.");
        }
        return;
      }

      // Set the session using the tokens from the edge function
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token
      });

      if (sessionError) {
        console.error("Session set error:", sessionError);
        toast.error("Failed to establish session. Please try again.");
        return;
      }

      toast.success("Welcome back!");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("MPIN login error:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => step === "mpin" ? setStep("email") : navigate("/login")}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl">
                {step === "email" ? "MPIN Login" : "Enter MPIN"}
              </CardTitle>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            {step === "email" 
              ? "Enter your email address to continue with MPIN login"
              : "Enter your 4-digit MPIN to sign in"
            }
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === "email" ? (
            <>
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button 
                onClick={handleEmailSubmit}
                className="w-full"
                disabled={!email}
              >
                Continue
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Enter 4-digit MPIN"
                  value={mpin}
                  onChange={(e) => setMpin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="text-center text-2xl tracking-widest"
                  maxLength={4}
                  disabled={loading}
                />
              </div>
              <Button 
                onClick={handleLogin}
                className="w-full"
                disabled={loading || mpin.length !== 4}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}