
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronLeft } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

export default function Phone() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+63");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/verify");
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 w-[100px] justify-between pl-2 pr-3">
                  <img
                    src="/lovable-uploads/69289dcf-6417-4971-9806-b93b578586d6.png"
                    alt="Philippines Flag"
                    className="h-5 w-5"
                  />
                  <span>{countryCode}</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setCountryCode("+63")}>
                  <div className="flex items-center gap-2">
                    <img
                      src="/lovable-uploads/69289dcf-6417-4971-9806-b93b578586d6.png"
                      alt="Philippines Flag"
                      className="h-5 w-5"
                    />
                    <span>+63 Philippines</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="9XX XXX XXXX"
              className="flex-1"
              type="tel"
            />
          </div>

          <Button type="submit" className="w-full h-12 bg-emerald-600 hover:bg-emerald-700">
            Submit
          </Button>
        </motion.form>

        <p className="mt-6 text-sm text-gray-500 text-center">
          By continuing, you agree to our{" "}
          <Link to="/terms" className="text-emerald-600">Terms and Conditions</Link>
        </p>
      </div>
    </div>
  );
}
