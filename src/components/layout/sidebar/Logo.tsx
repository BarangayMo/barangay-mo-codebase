
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center justify-center p-2">
      <img 
        src="/lovable-uploads/bd0f61d0-eeec-48d3-bbb1-348d45dda847.png" 
        alt="Admin Dashboard" 
        className="h-10"
      />
    </Link>
  );
};
