
import PageTemplate from "../PageTemplate";
import { Package, Check, Clock, AlertCircle, ShoppingCart } from "lucide-react";

const OrdersAllPage = () => {
  const tabItems = [
    { icon: <Package className="h-4 w-4" />, label: "All", value: "all" },
    { icon: <Clock className="h-4 w-4" />, label: "Processing", value: "processing" },
    { icon: <Check className="h-4 w-4" />, label: "Completed", value: "completed" },
    { icon: <AlertCircle className="h-4 w-4" />, label: "Issues", value: "issues" },
    { icon: <ShoppingCart className="h-4 w-4" />, label: "Abandoned", value: "abandoned" }
  ];

  return (
    <PageTemplate 
      title="All Orders" 
      description="View and manage customer orders" 
      hasTabs={true}
      tabItems={tabItems}
    />
  );
};

export default OrdersAllPage;
