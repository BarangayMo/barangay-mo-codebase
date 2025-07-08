
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function MPin() {
  const [mpin, setMpin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate MPIN verification
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl p-8">
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png" 
            alt="eGov.PH Logo" 
            className="h-16 w-auto mx-auto mb-4" 
          />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Enter MPIN</h1>
          <p className="text-gray-600">Enter your 4-digit MPIN to continue</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="mpin" className="text-gray-700">MPIN</Label>
            <Input
              id="mpin"
              type="password"
              maxLength={4}
              value={mpin}
              onChange={(e) => setMpin(e.target.value)}
              className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500 text-center text-2xl tracking-widest"
              required
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
            disabled={isLoading || mpin.length !== 4}
          >
            {isLoading ? "Verifying..." : "Continue"}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <Link to="/login" className="text-red-600 hover:text-red-700 text-sm">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
