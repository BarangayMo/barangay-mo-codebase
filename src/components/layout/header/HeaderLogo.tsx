
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function HeaderLogo() {
  const { userRole } = useAuth();
  
  return (
    <Link to="/" className="flex items-center gap-2">
      <img 
        src={userRole === "resident" 
          ? "/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png" 
          : "/lovable-uploads/141c2a56-35fc-4123-a51f-358481e0f167.png"} 
        alt="Logo" 
        className="h-8 w-auto" 
      />
    </Link>
  );
}
