
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Users, Shield } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "resident"
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await register(
        formData.email,
        formData.password,
        {
          role: formData.role
        }
      );

      if (error) {
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: error.message
        });
      } else {
        navigate("/phone");
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "An unexpected error occurred"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="mb-6">
          <Link to="/" className="text-blue-600 flex items-center">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Link>
        </div>

        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png" 
            alt="Logo" 
            className="h-16 w-auto mx-auto" 
          />
          <h1 className="text-2xl font-bold mt-4">Create Account</h1>
          <p className="text-gray-600">Join your barangay's digital community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label className="text-gray-900 font-semibold text-lg">Select your role</Label>
            <RadioGroup
              value={formData.role}
              onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
              className="grid grid-cols-1 gap-3"
            >
              <div>
                <RadioGroupItem value="resident" id="resident-mobile" className="peer sr-only" />
                <Label 
                  htmlFor="resident-mobile" 
                  className="flex items-center justify-center p-6 border-2 border-gray-200 rounded-xl cursor-pointer transition-all duration-200 peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:border-gray-300 hover:bg-gray-50 font-medium"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">Resident</div>
                      <div className="text-sm text-gray-500">Access community services and information</div>
                    </div>
                  </div>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="official" id="official-mobile" className="peer sr-only" />
                <Label 
                  htmlFor="official-mobile" 
                  className="flex items-center justify-center p-6 border-2 border-gray-200 rounded-xl cursor-pointer transition-all duration-200 peer-checked:border-red-500 peer-checked:bg-red-50 hover:border-gray-300 hover:bg-gray-50 font-medium"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-red-100 rounded-full">
                      <Shield className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">Official</div>
                      <div className="text-sm text-gray-500">Manage community and serve residents</div>
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">Email Address</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="juan.delacruz@example.com"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10 font-inter border-gray-200 bg-gray-50 rounded-lg focus-visible:ring-blue-500"
                required
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="●●●●●●●●"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="pl-10 pr-10 font-inter border-gray-200 bg-gray-50 rounded-lg focus-visible:ring-blue-500"
                required
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500">Password must be at least 8 characters</p>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <input type="checkbox" id="terms" className="rounded border-gray-300" required />
            <label htmlFor="terms" className="text-sm text-gray-600 font-inter">
              I agree to the <Link to="/terms" className="text-blue-600 font-medium">Terms of Service</Link> and <Link to="/privacy" className="text-blue-600 font-medium">Privacy Policy</Link>
            </label>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-3 transition font-medium text-base"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register Account"}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm font-inter">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-800 transition">
              Login
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e4ecfc] via-[#fff] to-[#fbedda] px-4 py-8">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-6 md:p-8">
        <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to home
        </Link>
        
        <h1 className="font-outfit text-2xl md:text-3xl font-bold mb-2 text-gray-900">
          Create your account
        </h1>
        <p className="text-gray-500 mb-6">Join your barangay's digital community</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label className="text-gray-900 font-semibold text-lg">Select your role</Label>
            <RadioGroup
              value={formData.role}
              onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
              className="grid grid-cols-1 gap-3"
            >
              <div>
                <RadioGroupItem value="resident" id="resident" className="peer sr-only" />
                <Label 
                  htmlFor="resident" 
                  className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer transition-all duration-200 peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:border-gray-300 hover:bg-gray-50 font-medium"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Resident</div>
                      <div className="text-sm text-gray-500">Access community services</div>
                    </div>
                  </div>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="official" id="official" className="peer sr-only" />
                <Label 
                  htmlFor="official" 
                  className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer transition-all duration-200 peer-checked:border-red-500 peer-checked:bg-red-50 hover:border-gray-300 hover:bg-gray-50 font-medium"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-100 rounded-full">
                      <Shield className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Official</div>
                      <div className="text-sm text-gray-500">Manage community</div>
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email-desktop" className="text-gray-700">Email Address</Label>
            <div className="relative">
              <Input
                id="email-desktop"
                type="email"
                placeholder="juan.delacruz@example.com"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10 font-inter border-gray-200 bg-gray-50 rounded-lg focus-visible:ring-blue-500"
                required
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password-desktop" className="text-gray-700">Password</Label>
            <div className="relative">
              <Input
                id="password-desktop"
                type={showPassword ? "text" : "password"}
                placeholder="●●●●●●●●"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="pl-10 pr-10 font-inter border-gray-200 bg-gray-50 rounded-lg focus-visible:ring-blue-500"
                required
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500">Password must be at least 8 characters</p>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <input type="checkbox" id="terms-desktop" className="rounded border-gray-300" required />
            <label htmlFor="terms-desktop" className="text-sm text-gray-600 font-inter">
              I agree to the <Link to="/terms" className="text-blue-600 font-medium">Terms of Service</Link> and <Link to="/privacy" className="text-blue-600 font-medium">Privacy Policy</Link>
            </label>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 font-inter text-white rounded-lg py-3 transition font-medium text-base"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register Account"}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm font-inter">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-800 transition">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
