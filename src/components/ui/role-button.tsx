
import { Button } from "./button";
import { useAuth } from "@/contexts/AuthContext";
import { ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface RoleButtonProps extends ButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "dashboard";
}

export function RoleButton({ className, variant = "default", ...props }: RoleButtonProps) {
  const { userRole } = useAuth();
  
  const getButtonClass = () => {
    if (variant !== "default") return "";
    
    switch(userRole) {
      case "official":
        return "bg-red-600 hover:bg-red-700 text-white";
      case "resident":
        return "bg-blue-600 hover:bg-blue-700 text-white";
      default:
        return "";
    }
  };
  
  return (
    <Button
      className={cn(getButtonClass(), className)}
      variant={variant}
      {...props}
    />
  );
}
