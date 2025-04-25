
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center justify-center">
      <img 
        src="/lovable-uploads/d6bf0909-f59b-42dc-8d79-b45a400a1081.png" 
        alt="Barangay Mo Admin" 
        className="h-8 w-8 transition-transform duration-300 ease-in-out"
      />
    </Link>
  );
};
