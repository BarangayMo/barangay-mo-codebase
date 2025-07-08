
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Welcome() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50">
      <div className="max-w-md w-full text-center p-8">
        <img 
          src="/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png" 
          alt="eGov.PH Logo" 
          className="h-20 w-auto mx-auto mb-8" 
        />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to eGov.PH</h1>
        <p className="text-gray-600 mb-8">Your digital government services platform</p>
        
        <div className="space-y-4">
          <Link to="/login">
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
              Login
            </Button>
          </Link>
          <Link to="/register/role">
            <Button variant="outline" className="w-full border-red-600 text-red-600 hover:bg-red-50">
              Register
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
