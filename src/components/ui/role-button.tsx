
import { Button } from "./button";
import { useAuth } from "@/contexts/AuthContext";
import { ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface RoleButtonProps extends ButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function RoleButton({ className, variant = "default", ...props }: RoleButtonProps) {
  const { userRole } = useAuth();
  
  const getButtonClass = () => {
    if (variant !== "default") return "";
    
    switch(userRole) {
      case "official":
        return "bg-official hover:bg-official-dark text-white";
      case "resident":
        return "bg-resident hover:bg-resident-dark text-white";
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
