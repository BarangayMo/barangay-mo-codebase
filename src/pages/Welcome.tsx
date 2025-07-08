
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Welcome() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-md w-full text-center p-8">
        <img 
          src="/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png" 
          alt="Barangay Mo Logo" 
          className="h-20 w-auto mx-auto mb-8" 
        />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Barangay Mo</h1>
        <p className="text-gray-600 mb-8">Your smart barangay management system</p>
        
        <div className="space-y-4">
          <Link to="/login">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Login
            </Button>
          </Link>
          <Link to="/register/role">
            <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
              Register
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
