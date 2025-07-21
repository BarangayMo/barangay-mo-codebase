
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserApproval } from "@/hooks/use-user-approval";

export const FloatingAddButton = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data: approvalData } = useUserApproval();

  if (!isAuthenticated || !approvalData?.isApproved) {
    return null;
  }

  return (
    <Button
      onClick={() => navigate("/marketplace/add-product")}
      className="fixed bottom-20 md:bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg bg-resident hover:bg-resident/90 text-white"
      size="icon"
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
};
