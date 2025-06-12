
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { demoLogin } from "@/utils/demo-auth";
import { Fingerprint } from "lucide-react";

export const LoginForm = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);
    
    try {
      const { error } = await login(email, password);
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: error.message
        });
        setLoginError(error.message);
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "An unexpected error occurred"
      });
      setLoginError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: "resident" | "official" | "superadmin") => {
    setIsLoading(true);
    setLoginError(null);
    
    try {
      toast({
        title: "Demo login",
        description: `Signing in as ${role}...`,
      });
      
      const { error } = await demoLogin(role);
      
      if (error) {
        console.error("Demo login error:", error);
        toast({
          variant: "destructive",
          title: "Demo login failed",
          description: error.message
        });
        setLoginError(error.message);
      } else {
        toast({
          title: "Success!",
          description: `Logged in as ${role}`,
        });
      }
    } catch (err: any) {
      console.error("Unexpected demo login error:", err);
      toast({
        variant: "destructive",
        title: "Demo login failed",
        description: err.message || "An unexpected error occurred"
      });
      setLoginError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricLogin = () => {
    toast({
      title: "Biometric login",
      description: "Using biometrics to log you in...",
    });
    
    setTimeout(() => {
      handleDemoLogin("resident");
    }, 1000);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-6 text-2xl font-bold text-[#23263a]">Login</div>
      <div className="mb-8 text-gray-500 text-sm">
        Don&apos;t have an account?
        <Link to="/register" className="ml-2 text-[#3c41ff] font-medium hover:underline">Register</Link>
      </div>
      
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="desktop-email" className="text-sm font-medium">Email</Label>
          <Input
            id="desktop-email"
            type="email"
            placeholder="name@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="mt-1 text-base"
            required
          />
        </div>
        <div>
          <Label htmlFor="desktop-password" className="text-sm font-medium">Password</Label>
          <Input
            id="desktop-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={`mt-1 text-base ${loginError ? "border-red-400 ring-2 ring-red-100" : ""}`}
            required
          />
          {loginError && (
            <div className="text-xs text-red-600 mt-2">{loginError}</div>
          )}
        </div>
        <Button
          type="submit"
          className="w-full font-semibold text-base mt-2 bg-[#34b98a] hover:bg-[#268d68] transition"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
      
      <div className="mt-8">
        <div className="flex items-center space-x-4 text-center text-xs mb-2 text-muted">or quick login as:</div>
        <div className="flex gap-2 flex-wrap">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleDemoLogin("resident")}
            className="text-[#2da94f] bg-[#f0fbe9] hover:bg-[#c3edcb]/80 border border-[#b8e7be]"
          >
            Resident Demo
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleDemoLogin("official")}
            className="text-[#c11f3c] bg-[#fbeaed] hover:bg-[#f2ced4]/80 border border-[#ebb5c2]"
          >
            Official Demo
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleDemoLogin("superadmin")}
            className="text-[#3c41ff] bg-[#eef0fe] hover:bg-[#d5d7f9] border border-[#b1b7f0]"
          >
            Super Admin Demo
          </Button>
        </div>
      </div>
    </div>
  );
};
