
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, UserCircle, Settings, Bell, Clock, MessageSquare, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LanguageSelector } from "@/components/layout/LanguageSelector";

export const Menu = () => {
  const navigate = useNavigate();
  const { logout, userRole } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    {
      title: "Aking Profile",
      icon: <UserCircle className="w-5 h-5" />,
      href: "/resident-profile",
    },
    {
      title: "Mga Setting",
      icon: <Settings className="w-5 h-5" />,
      href: "/settings",
    },
    {
      title: "Mga Notification",
      icon: <Bell className="w-5 h-5" />,
      href: "/notifications",
    },
    {
      title: "Mga Aktibidad",
      icon: <Clock className="w-5 h-5" />,
      href: "/activities",
    },
    {
      title: "Mga Mensahe",
      icon: <MessageSquare className="w-5 h-5" />,
      href: "/messages",
    },
  ];

  return (
    <div className="container max-w-md mx-auto p-4 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-6">Menu</h1>

      <Card className="p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Wika / Language</h2>
          <LanguageSelector />
        </div>
        <p className="text-sm text-gray-500">Piliin ang inyong gustong wika</p>
      </Card>

      <Card className="p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Mga Setting at Preferences</h2>
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate(item.href)}
            >
              <div className="flex items-center">
                {item.icon}
                <span className="ml-3">{item.title}</span>
              </div>
            </Button>
          ))}
        </div>
      </Card>

      {userRole && (
        <Card className="p-4 mb-6">
          <h2 className="text-lg font-semibold mb-2">Dashboard</h2>
          <p className="text-sm text-gray-500 mb-4">
            Access your {userRole} dashboard
          </p>
          <Button
            className="w-full"
            onClick={() => 
              navigate(
                userRole === "resident" 
                  ? "/resident-home" 
                  : userRole === "official" 
                    ? "/official-dashboard" 
                    : "/admin"
              )
            }
          >
            Go to Dashboard
          </Button>
        </Card>
      )}

      <Separator className="my-6" />
      
      <Button 
        variant="destructive" 
        className="w-full flex items-center justify-center" 
        onClick={handleLogout}
      >
        <LogOut className="mr-2 h-5 w-5" />
        Mag-logout
      </Button>
    </div>
  );
};

export default Menu;
