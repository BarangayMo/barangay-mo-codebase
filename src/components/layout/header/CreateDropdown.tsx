
import { Plus, Package, Store, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

export const CreateDropdown = () => {
  const navigate = useNavigate();

  const handleCreateProduct = () => {
    navigate('/admin/smarketplace/products/create');
  };

  const handleCreateVendor = () => {
    navigate('/admin/smarketplace/vendors/create');
  };

  const handleCreateOrder = () => {
    navigate('/admin/smarketplace/orders/create');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleCreateProduct} className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          Create Product
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCreateVendor} className="flex items-center gap-2">
          <Store className="h-4 w-4" />
          Create Vendor
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCreateOrder} className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4" />
          Create Order
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
