
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center justify-center p-2">
      <img 
        src="/lovable-uploads/d6bf0909-f59b-42dc-8d79-b45a400a1081.png" 
        alt="Admin Dashboard" 
        className="h-10 w-10"
      />
    </Link>
  );
};
