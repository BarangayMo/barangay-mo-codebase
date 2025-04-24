
import PageTemplate from "../PageTemplate";
import { Users, UserCheck, UserX, Clock } from "lucide-react";

const VendorsDirectoryPage = () => {
  const tabItems = [
    { icon: <Users className="h-4 w-4" />, label: "All", value: "all" },
    { icon: <UserCheck className="h-4 w-4" />, label: "Verified", value: "verified" },
    { icon: <Clock className="h-4 w-4" />, label: "Pending", value: "pending" },
    { icon: <UserX className="h-4 w-4" />, label: "Rejected", value: "rejected" }
  ];

  return (
    <PageTemplate 
      title="Vendor Directory" 
      description="Manage marketplace vendors and their profiles" 
      hasTabs={true}
      tabItems={tabItems}
    />
  );
};

export default VendorsDirectoryPage;
