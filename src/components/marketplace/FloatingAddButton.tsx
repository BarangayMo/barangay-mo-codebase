
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useUserApproval } from "@/hooks/use-user-approval";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const FloatingAddButton = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data: approval } = useUserApproval();
  const { toast } = useToast();

  const handleClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to add products",
        variant: "destructive"
      });
      return;
    }

    if (!approval?.canAddProducts) {
      toast({
        title: "Approval Required",
        description: "Your account needs to be approved by an admin to add products",
        variant: "destructive"
      });
      return;
    }

    navigate("/marketplace/add-product");
  };

  // Only show button if user is authenticated
  if (!isAuthenticated) return null;

  return (
    <Button
      onClick={handleClick}
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50 bg-primary hover:bg-primary/90"
      size="icon"
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
};
