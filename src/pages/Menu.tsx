
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Home, 
  ShoppingCart, 
  Briefcase, 
  Settings, 
  UserPlus, 
  HelpCircle, 
  Share, 
  Headphones, 
  Info, 
  Shield, 
  LogOut, 
  Trash2 
} from "lucide-react";
import { Link } from "react-router-dom";

const Menu = () => {
  const { user, logout, userRole } = useAuth();
  const appVersion = "1.0.0"; // You can make this dynamic if needed
  const currentYear = new Date().getFullYear();

  // Create a handler function that will call logout
  const handleLogout = () => {
    logout();
  };

  // Define menu items with icons
  const menuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: ShoppingCart, label: "My Cart", path: "/marketplace/cart" },
    { icon: Briefcase, label: "My Jobs", path: "/jobs" },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: UserPlus, label: "Add a Member", path: "/add-member" },
    { icon: HelpCircle, label: "FAQs", path: "/faqs" },
    { icon: Share, label: "Share App", path: "/share" },
    { icon: Headphones, label: "Support", path: "/support" },
    { icon: Info, label: "About Us", path: "/about" },
    { icon: Shield, label: "Terms and Policies", path: "/terms" },
  ];

  // Get the appropriate accent color based on user role
  const accentColor = userRole === "resident" ? "text-resident" : "text-official";
  const accentBgColor = userRole === "resident" ? "bg-resident" : "bg-official";

  return (
    <Layout>
      <div className="container max-w-lg mx-auto p-4">
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/lovable-uploads/07f9ee00-178f-4302-85d8-83a44b75bb9d.png" alt={user?.name} />
                <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{user?.name || "User"}</h2>
                <p className="text-gray-500">{user?.email || "No email provided"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <Link key={index} to={item.path}>
              <Button variant="ghost" className="w-full justify-start text-base h-12 hover:bg-gray-100">
                <item.icon className={`mr-3 h-5 w-5 ${accentColor}`} />
                <span>{item.label}</span>
              </Button>
            </Link>
          ))}
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-base h-12 hover:bg-gray-100" 
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5 text-gray-500" /> Log out
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-base h-12 hover:bg-gray-100 text-red-600" 
          >
            <Trash2 className="mr-3 h-5 w-5" /> Delete Account
          </Button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Barangay Mo App v{appVersion}</p>
          <p className="mt-2">&copy; {currentYear} All rights reserved.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Menu;
