
import PageTemplate from "../PageTemplate";
import { User, Star, Clock, UserX } from "lucide-react";

const CustomersAllPage = () => {
  const tabItems = [
    { icon: <User className="h-4 w-4" />, label: "All", value: "all" },
    { icon: <Star className="h-4 w-4" />, label: "VIP", value: "vip" },
    { icon: <Clock className="h-4 w-4" />, label: "New", value: "new" },
    { icon: <UserX className="h-4 w-4" />, label: "Inactive", value: "inactive" }
  ];

  return (
    <PageTemplate 
      title="All Customers" 
      description="View and manage marketplace customers"
      hasTabs={true}
      tabItems={tabItems}
    />
  );
};

export default CustomersAllPage;
