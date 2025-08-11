
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, SkipForward } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { RoleButton } from "@/components/ui/role-button";

export default function Phone() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    if (location.state?.phoneNumber) {
      setPhoneNumber(location.state.phoneNumber);
    }
  }, [location.state]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/verify");
  };

  const handleSkip = () => {
    navigate("/rbi-registration");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-6">
      <Link to="/" className="flex items-center gap-2 text-gray-600 mb-6">
        <ChevronLeft className="h-5 w-5" />
        Back
      </Link>

      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl font-semibold text-center mb-2">Create Account</h1>
        </motion.div>
        
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <img 
            src="/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png"
            alt="Barangay Mo Logo"
            className="w-32 h-32 object-contain"
          />
        </motion.div>

        <motion.h2 
          className="text-xl font-medium text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          Enter Your Phone Number
        </motion.h2>

        <motion.form 
          onSubmit={handleSubmit} 
          className="w-full space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex gap-2">
            <div className="w-[100px]">
              <RoleButton variant="outline" className="w-full h-10 flex items-center gap-2 justify-between pl-2 pr-3">
                <img
                  src="/lovable-uploads/69289dcf-6417-4971-9806-b93b578586d6.png"
                  alt="Philippines Flag"
                  className="h-5 w-5"
                />
                <span>+63</span>
              </RoleButton>
            </div>
            <Input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="9XX XXX XXXX"
              className="flex-1"
              type="tel"
            />
          </div>

          <div className="space-y-3">
            <RoleButton type="submit" className="w-full h-12 text-white font-medium">
              Submit
            </RoleButton>
            
            <RoleButton 
              type="button"
              variant="ghost"
              onClick={handleSkip}
              className="w-full h-12 text-gray-600 hover:text-gray-800 hover:bg-gray-100 flex items-center gap-2 justify-center"
            >
              <SkipForward className="w-5 h-5" />
              Skip Verification
            </RoleButton>
          </div>
        </motion.form>

        <p className="mt-6 text-sm text-gray-500 text-center">
          By continuing, you agree to our{" "}
          <Link to="/terms" className="text-emerald-600">Terms and Conditions</Link>
        </p>
      </div>
    </div>
  );
}
