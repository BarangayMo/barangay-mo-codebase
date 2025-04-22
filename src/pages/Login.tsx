import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, Link } from "react-router-dom";
import { Fingerprint } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useToast } from "@/components/ui/use-toast";
import { demoLogin } from "@/utils/demo-auth";

const REVIEWS = [
  {
    text: "Amazing! So easy to use and helped me with my account quickly.",
    author: "Maria D.",
    subtitle: "Resident",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg"
  },
  {
    text: "Much better than calling the barangay office—love it!",
    author: "Jon A.",
    subtitle: "Official",
    avatar: "https://randomuser.me/api/portraits/men/76.jpg"
  },
  {
    text: "The portal is a game changer for our community. Thank you!",
    author: "Ellen P.",
    subtitle: "Resident",
    avatar: "https://randomuser.me/api/portraits/women/80.jpg"
  },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { toast } = useToast();

  const submitLogin = async (e: React.FormEvent) => {
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
    
    try {
      const { error } = await demoLogin(role);
      if (error) {
        toast({
          variant: "destructive",
          title: "Demo login failed",
          description: error.message
        });
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Demo login failed",
        description: err.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricLogin = () => {
    setTimeout(() => {
      handleDemoLogin("resident");
    }, 1000);
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="mb-6">
          <Link to="/" className="text-blue-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </Link>
        </div>

        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png" 
            alt="Logo" 
            className="h-16 w-auto mx-auto" 
          />
          <h1 className="text-2xl font-bold mt-4">Welcome Back</h1>
          <p className="text-gray-600">Log in to your account</p>
        </div>

        <form className="space-y-5" onSubmit={submitLogin}>
          <div>
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mt-1 text-base"
              required
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
            <Input
              id="password"
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
          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-blue-600">
              Forgot password?
            </Link>
          </div>
          <Button
            type="submit"
            className="w-full font-semibold text-base mt-2 bg-emerald-600 hover:bg-emerald-700 transition"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300"></span>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>
          
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleBiometricLogin}
          >
            <Fingerprint className="w-5 h-5" />
            Sign in with Biometrics
          </Button>
        </form>
        
        <div className="mt-6 space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300"></span>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">demo logins</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleDemoLogin("resident")}
              className="text-emerald-600 border-emerald-200"
            >
              Resident
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleDemoLogin("official")}
              className="text-red-600 border-red-200"  
            >
              Official
            </Button>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 font-medium">
              Register
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F9FB] px-4 py-10">
      <div className="w-full max-w-5xl rounded-3xl bg-white shadow-2xl flex flex-col md:flex-row overflow-hidden border-2 border-[#e0e2ec] scale-100 md:scale-100">
        <div className="hidden md:flex flex-col w-1/2 bg-[#528462] text-white p-12 justify-between gap-8" style={{ background: "linear-gradient(120deg, #39bc90 40%, #72d1de 100%)" }}>
          <div>
            <div className="text-xl font-bold mb-8 tracking-widest">SMART BARANGAY</div>
            <div className="mt-8">
              <div className="font-extrabold text-4xl leading-tight drop-shadow">Your Community, Smarter</div>
              <div className="opacity-90 mt-6 text-lg">Login to connect with your Barangay. Get updates, manage your RBI, shop, and more—with a modern experience.</div>
            </div>
          </div>
          <div className="mt-auto flex flex-col gap-3">
            <div className="rounded-2xl bg-white/[.16] p-5 backdrop-blur text-base drop-shadow flex items-center gap-3">
              <img src={REVIEWS[0].avatar} alt="" className="w-12 h-12 rounded-full border-2 border-white/60 flex-shrink-0" />
              <div>
                <div className="italic">&quot;{REVIEWS[0].text}&quot;</div>
                <div className="mt-2 flex items-center gap-2 text-white/80 text-xs">
                  <b>{REVIEWS[0].author}</b>
                  <span className="rounded bg-white/40 px-2 py-0.5 ml-2">{REVIEWS[0].subtitle}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-1 mt-2">
              <span className="inline-block w-2 h-2 rounded-full bg-white/90" />
              <span className="inline-block w-2 h-2 rounded-full bg-white/40" />
              <span className="inline-block w-2 h-2 rounded-full bg-white/40" />
            </div>
          </div>
        </div>
        <div className="flex-1 bg-white flex flex-col justify-center px-8 py-12 md:px-12 md:py-16">
          <div className="w-full max-w-md mx-auto">
            <div className="mb-6 text-2xl font-bold text-[#23263a]">Login</div>
            <div className="mb-8 text-gray-500 text-sm">
              Don&apos;t have an account?
              <Link to="/register" className="ml-2 text-[#3c41ff] font-medium hover:underline">Register</Link>
            </div>
            <form className="space-y-6" onSubmit={submitLogin}>
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
            <div className="mt-8 md:hidden">
              <div className="rounded-2xl bg-[#f5f7ff] p-3 flex items-center gap-3">
                <img src={REVIEWS[1].avatar} alt="" className="w-10 h-10 rounded-full flex-shrink-0" />
                <div>
                  <div className="italic text-xs">&quot;{REVIEWS[1].text}&quot;</div>
                  <div className="mt-2 flex items-center gap-2 text-[.85em] opacity-60">
                    <b>{REVIEWS[1].author}</b>
                    <span className="rounded bg-[#e7e7fa] px-2 py-0.5 ml-1">{REVIEWS[1].subtitle}</span>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-[#e8f5e9] p-3 flex items-center gap-3 mt-2">
                <img src={REVIEWS[2].avatar} alt="" className="w-10 h-10 rounded-full flex-shrink-0" />
                <div>
                  <div className="italic text-xs">&quot;{REVIEWS[2].text}&quot;</div>
                  <div className="mt-2 flex items-center gap-2 text-[.85em] opacity-60">
                    <b>{REVIEWS[2].author}</b>
                    <span className="rounded bg-[#cdf6e2] px-2 py-0.5 ml-1">{REVIEWS[2].subtitle}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
