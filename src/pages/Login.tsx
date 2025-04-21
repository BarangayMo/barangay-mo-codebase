
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleLogin = (role: UserRole) => {
    login(role);
    
    // Navigate based on role
    switch(role) {
      case "official":
        navigate("/manage-residents");
        break;
      case "superadmin":
        navigate("/admin");
        break;
      case "resident":
      default:
        navigate("/");
        break;
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 flex flex-col items-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Sign in to your Smart Barangay account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  className="w-full"
                  onClick={() => handleLogin("resident")}
                >
                  Sign In
                </Button>
              </div>
            </form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleLogin("resident")}
                  className="bg-resident-light text-resident hover:bg-resident hover:text-resident-foreground"
                >
                  Login as Resident
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleLogin("official")}
                  className="bg-official-light text-official hover:bg-official hover:text-official-foreground"
                >
                  Login as Official
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleLogin("superadmin")}
                >
                  Login as Super Admin
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="text-sm text-gray-500 text-center w-full">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:text-blue-800">
                Register
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
