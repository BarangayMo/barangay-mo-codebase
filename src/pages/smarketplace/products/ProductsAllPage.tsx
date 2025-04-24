
import PageTemplate from "../PageTemplate";
import { ShoppingBag, Package, Tag, Settings } from "lucide-react";

const ProductsAllPage = () => {
  const tabItems = [
    { icon: <ShoppingBag className="h-4 w-4" />, label: "All", value: "all" },
    { icon: <Package className="h-4 w-4" />, label: "Active", value: "active" },
    { icon: <Tag className="h-4 w-4" />, label: "Out of Stock", value: "out-of-stock" },
    { icon: <Settings className="h-4 w-4" />, label: "Archived", value: "archived" }
  ];

  return (
    <PageTemplate 
      title="All Products" 
      description="View and manage all products in your marketplace" 
      hasTabs={true}
      tabItems={tabItems}
    />
  );
};

export default ProductsAllPage;
