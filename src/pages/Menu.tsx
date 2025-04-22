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
  const rbiProgress = 65; // This should come from your user data

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
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/lovable-uploads/07f9ee00-178f-4302-85d8-83a44b75bb9d.png" alt={user?.name} />
                <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{user?.name || "User"}</h2>
                <p className="text-gray-500">{user?.email || "No email provided"}</p>
                <div className="mt-2 space-y-2">
                  <Link to="/resident-profile" className="flex items-center text-sm text-blue-600 hover:underline">
                    <Eye className="w-4 h-4 mr-1" />
                    View Public Profile
                  </Link>
                  {rbiProgress < 100 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">RBI Completion</span>
                        <span className="font-medium">{rbiProgress}%</span>
                      </div>
                      <Progress value={rbiProgress} className="h-2" />
                      <Link to="/rbi-registration" className="text-xs text-red-500 hover:underline">
                        Complete your RBI Registration
                      </Link>
                    </div>
                  )}
                </div>
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
