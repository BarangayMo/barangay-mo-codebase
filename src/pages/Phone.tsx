
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function Phone() {
  const [phoneNumber, setPhoneNumber] = useState("");
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
        <h1 className="text-2xl font-semibold text-center mb-2">Create Account</h1>
        
        <div className="flex justify-center mb-8">
          <img 
            src="/lovable-uploads/69289dcf-6417-4971-9806-b93b578586d6.png"
            alt="Phone Number"
            className="w-32 h-32 object-contain"
          />
        </div>

        <h2 className="text-xl font-medium text-center mb-8">
          Enter Your Phone Number
        </h2>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="flex gap-2">
            <div className="relative flex items-center">
              <img
                src="/lovable-uploads/69289dcf-6417-4971-9806-b93b578586d6.png"
                alt="Philippines Flag"
                className="h-5 w-5 absolute left-3"
              />
              <Input
                value="+63"
                readOnly
                className="w-[72px] pl-10 bg-gray-50"
              />
            </div>
            <Input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="9XX XXX XXXX"
              className="flex-1"
            />
          </div>

          <Button type="submit" className="w-full h-12 bg-emerald-600 hover:bg-emerald-700">
            Submit
          </Button>
        </form>

        <p className="mt-6 text-sm text-gray-500 text-center">
          By continuing, you agree to our{" "}
          <Link to="/terms" className="text-emerald-600">Terms and Conditions</Link>
        </p>
      </div>
    </div>
  );
}
