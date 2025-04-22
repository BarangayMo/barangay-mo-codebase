
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Eye } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Menu = () => {
  const { user, logout, userRole } = useAuth();
  const rbiProgress = 65;
  const appVersion = "1.0.0";
  const currentYear = new Date().getFullYear();

  const handleLogout = () => {
    logout();
  };

  const menuCategories = [
    {
      title: "Main",
      items: [
        { icon: Home, label: "Home", path: "/" },
        { icon: User, label: "Public Profile", path: "/resident-profile" },
        { icon: ShoppingCart, label: "My Cart", path: "/marketplace/cart" },
        { icon: Briefcase, label: "My Jobs", path: "/jobs" },
      ]
    },
    {
      title: "Account",
      items: [
        { icon: Settings, label: "Settings", path: "/settings" },
        { icon: UserPlus, label: "Add a Member", path: "/add-member" },
      ]
    },
    {
      title: "Help & Support",
      items: [
        { icon: HelpCircle, label: "FAQs", path: "/faqs" },
        { icon: Share, label: "Share App", path: "/share" },
        { icon: Headphones, label: "Support", path: "/support" },
      ]
    },
    {
      title: "Information",
      items: [
        { icon: Info, label: "About Us", path: "/about" },
        { icon: Shield, label: "Terms and Policies", path: "/terms" },
      ]
    }
  ];

  return (
    <Layout>
      <div className="container max-w-lg mx-auto p-4">
        <Card className="mb-6 overflow-hidden">
          <div className="relative h-32 bg-gradient-to-r from-blue-600 to-blue-400">
            <div className="absolute -bottom-12 left-6">
              <Avatar className="h-24 w-24 ring-4 ring-white">
                <AvatarImage src="/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png" alt={user?.name} />
                <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
            </div>
          </div>
          
          <CardContent className="pt-16 pb-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{user?.name || "User"}</h2>
                <p className="text-gray-500 text-sm">{user?.email || "No email provided"}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Link to="/resident-profile" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                  <Eye className="w-4 h-4" /> View Profile
                </Link>
                {rbiProgress < 100 && (
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-2 text-sm mb-1">
                      <span className="text-gray-600">RBI Status</span>
                      <span className="font-medium">{rbiProgress}%</span>
                    </div>
                    <div className="w-32">
                      <Progress value={rbiProgress} className="h-1.5" />
                    </div>
                    <Link to="/rbi-registration" className="text-xs text-red-500 hover:underline mt-1 inline-block">
                      Complete Registration
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {menuCategories.map((category, index) => (
            <div key={index} className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500 px-2">{category.title}</h3>
              {category.items.map((item, itemIndex) => (
                <Link key={itemIndex} to={item.path}>
                  <Button variant="ghost" className="w-full justify-start text-base h-12 hover:bg-gray-100">
                    <item.icon className="mr-3 h-5 w-5 text-gray-500" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
          ))}
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500 px-2">Account Actions</h3>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-base h-12 hover:bg-gray-100" 
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-500" /> Log out
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-base h-12 hover:bg-red-50 text-red-600 border border-red-200 rounded-lg" 
                >
                  <Trash2 className="mr-3 h-5 w-5" /> Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
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
