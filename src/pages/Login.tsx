
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, Link } from "react-router-dom";

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
  const [error, setError] = useState<string | null>(null);

  // Demo: clicking any auto-login logs in user as given role
  const handleLogin = (role: UserRole) => {
    login(role);
    // after logging in, go to correct page
    switch(role) {
      case "official":
        navigate("/official-dashboard");
        break;
      case "superadmin":
        navigate("/admin");
        break;
      case "resident":
      default:
        navigate("/resident-home");
        break;
    }
  };

  // Manual login simulation: just demo error for illustration
  const submitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo, trigger error if wrong password provided.
    if (password !== "password123") {
      setError("The password entered is wrong!");
      return;
    }
    setError(null);
    handleLogin("resident");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f8fc] px-4 py-10">
      <div className="w-full max-w-3xl rounded-3xl bg-white flex flex-col md:flex-row shadow-xl overflow-hidden border">
        {/* Left - Brand panel */}
        <div className="hidden md:flex flex-col w-1/2 bg-[#3c41ff] text-white p-8 justify-between relative">
          <div>
            <div className="text-lg font-bold mb-8 tracking-widest">SMART BARANGAY</div>
            <div className="mt-8">
              <div className="font-extrabold text-3xl md:text-4xl leading-tight drop-shadow">Start your journey with us.</div>
              <div className="opacity-90 mt-6 text-lg">Discover a smarter, easier way to connect with your Barangay. Register, get updates, manage your RBI, shop, and more—all from one place.</div>
            </div>
          </div>
          <div className="mt-auto flex flex-col gap-3">
            {/* Reviews slider - for demo, static */}
            <div className="rounded-2xl  bg-white/[.12] p-5 backdrop-blur text-base drop-shadow flex items-center gap-3">
              <img src={REVIEWS[0].avatar} alt="" className="w-10 h-10 rounded-full border-2 border-white/60 flex-shrink-0"/>
              <div>
                <div className="italic">&quot;{REVIEWS[0].text}&quot;</div>
                <div className="mt-2 flex items-center gap-2 text-white/80 text-xs">
                  <b>{REVIEWS[0].author}</b>
                  <span className="rounded bg-white/20 px-2 py-0.5 ml-2">{REVIEWS[0].subtitle}</span>
                </div>
              </div>
            </div>
            {/* Dots */}
            <div className="flex gap-1 mt-2">
              <span className="inline-block w-2 h-2 rounded-full bg-white/90" />
              <span className="inline-block w-2 h-2 rounded-full bg-white/40" />
              <span className="inline-block w-2 h-2 rounded-full bg-white/40" />
            </div>
          </div>
        </div>

        {/* Right - Login panel */}
        <div className="flex-1 bg-white flex flex-col justify-center px-8 py-10">
          <div className="w-full max-w-sm mx-auto">
            <div className="mb-6 text-xl md:text-2xl font-bold text-[#23263a]">Login</div>
            <div className="mb-8 text-gray-500 text-sm">
              Don&apos;t have an account?
              <Link to="/register" className="ml-2 text-[#3c41ff] font-medium hover:underline">Register</Link>
            </div>
            <form className="space-y-4" onSubmit={submitLogin}>
              <div>
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="mt-1"
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
                  className={`mt-1 ${error ? "border-red-400 ring-2 ring-red-100" : ""}`}
                  required
                />
                {error && (
                  <div className="text-xs text-red-600 mt-2">{error}</div>
                )}
              </div>
              <Button
                type="submit"
                className="w-full font-semibold text-base mt-2 bg-[#3c41ff] hover:bg-[#2328c4] transition"
              >
                Sign In
              </Button>
            </form>

            {/* Autologin quick-options */}
            <div className="mt-8">
              <div className="flex items-center space-x-4 text-center text-xs mb-2 text-muted">or quick login as:</div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleLogin("resident")}
                  className="text-[#2da94f] bg-[#f0fbe9] hover:bg-[#c3edcb]/80 border border-[#b8e7be]"
                >
                  Resident Demo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleLogin("official")}
                  className="text-[#c11f3c] bg-[#fbeaed] hover:bg-[#f2ced4]/80 border border-[#ebb5c2]"
                >
                  Official Demo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleLogin("superadmin")}
                  className="text-[#3c41ff] bg-[#eef0fe] hover:bg-[#d5d7f9] border border-[#b1b7f0]"
                >
                  Super Admin Demo
                </Button>
              </div>
            </div>

            {/* Reviews at bottom for mobile */}
            <div className="mt-8 md:hidden">
              <div className="rounded-2xl bg-[#f5f7ff] p-3 flex items-center gap-3">
                <img src={REVIEWS[1].avatar} alt="" className="w-10 h-10 rounded-full flex-shrink-0"/>
                <div>
                  <div className="italic text-xs">&quot;{REVIEWS[1].text}&quot;</div>
                  <div className="mt-2 flex items-center gap-2 text-[.85em] opacity-60">
                    <b>{REVIEWS[1].author}</b>
                    <span className="rounded bg-[#e7e7fa] px-2 py-0.5 ml-1">{REVIEWS[1].subtitle}</span>
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
