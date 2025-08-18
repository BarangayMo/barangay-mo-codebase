import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Lock, Delete } from "lucide-react";
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

  const handleNumberClick = (number: string) => {
    if (mpin.length < 4) {
      setMpin(prev => prev + number);
    }
  };

  const handleBackspace = () => {
    setMpin(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setMpin("");
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

      // Verify the OTP returned by the edge function to create a session
      if (data.email_otp) {
        const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
          email,
          token: data.email_otp,
          type: 'email'
        });

        if (verifyError) {
          console.error("OTP verify error:", verifyError);
          toast.error("Failed to verify sign-in. Please try again.");
          return;
        }

        if (!verifyData?.session) {
          console.error("No session received after verifyOtp");
          toast.error("Authentication failed - no session data");
          return;
        }
      } else {
        console.error("No OTP received from server");
        toast.error("Authentication failed - missing OTP");
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
      {step === "email" ? (
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/login")}
                className="p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl">MPIN Login</CardTitle>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">
              Enter your email address to continue with MPIN login
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-sm">
          {/* Header with user email */}
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep("email")}
                className="p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Lock className="h-5 w-5 text-primary" />
              <div className="w-8" /> {/* Spacer for alignment */}
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Welcome back</h2>
              <p className="text-sm text-muted-foreground break-all">{email}</p>
              <p className="text-xs text-muted-foreground">Enter your 4-digit MPIN</p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* MPIN Display */}
            <div className="flex justify-center space-x-3">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center"
                >
                  {mpin[index] && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
              ))}
            </div>

            {/* Number Pad */}
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                <Button
                  key={number}
                  variant="outline"
                  size="lg"
                  className="h-16 text-xl font-semibold"
                  onClick={() => handleNumberClick(number.toString())}
                  disabled={loading}
                >
                  {number}
                </Button>
              ))}
              
              {/* Bottom row: Clear, 0, Backspace */}
              <Button
                variant="ghost"
                size="lg"
                className="h-16 text-sm"
                onClick={handleClear}
                disabled={loading || mpin.length === 0}
              >
                Clear
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-16 text-xl font-semibold"
                onClick={() => handleNumberClick("0")}
                disabled={loading}
              >
                0
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="h-16"
                onClick={handleBackspace}
                disabled={loading || mpin.length === 0}
              >
                <Delete className="h-5 w-5" />
              </Button>
            </div>

            {/* Login Button */}
            <Button 
              onClick={handleLogin}
              className="w-full h-12"
              disabled={loading || mpin.length !== 4}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}