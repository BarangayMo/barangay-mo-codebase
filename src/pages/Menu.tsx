
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, UserCircle, Settings, Bell, Clock, MessageSquare, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LanguageSelector } from "@/components/layout/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { Avatar } from "@/components/ui/avatar";

// Translation dictionary for all text in the component
const translations = {
  en: {
    menu: "Menu",
    language: "Language",
    languageHint: "Select your preferred language",
    settingsTitle: "Settings and Preferences",
    profile: "My Profile",
    settings: "Settings",
    notifications: "Notifications",
    activities: "Activities",
    messages: "Messages",
    dashboard: "Dashboard",
    dashboardHint: "Access your dashboard",
    logout: "Logout",
  },
  fil: {
    menu: "Menu",
    language: "Wika / Language",
    languageHint: "Piliin ang inyong gustong wika",
    settingsTitle: "Mga Setting at Preferences",
    profile: "Aking Profile",
    settings: "Mga Setting",
    notifications: "Mga Notification",
    activities: "Mga Aktibidad",
    messages: "Mga Mensahe",
    dashboard: "Dashboard",
    dashboardHint: "Access your dashboard",
    logout: "Mag-logout",
  }
};

export const Menu = () => {
  const navigate = useNavigate();
  const { logout, userRole, user } = useAuth();
  const { language } = useLanguage();
  
  // Select the appropriate translations based on language
  const t = translations[language];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    {
      title: t.profile,
      icon: <UserCircle className="w-5 h-5" />,
      href: "/resident-profile",
    },
    {
      title: t.settings,
      icon: <Settings className="w-5 h-5" />,
      href: "/settings",
    },
    {
      title: t.notifications,
      icon: <Bell className="w-5 h-5" />,
      href: "/notifications",
    },
    {
      title: t.activities,
      icon: <Clock className="w-5 h-5" />,
      href: "/activities",
    },
    {
      title: t.messages,
      icon: <MessageSquare className="w-5 h-5" />,
      href: "/messages",
    },
  ];

  return (
    <div className="container max-w-md mx-auto p-4 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-6">{t.menu}</h1>

      {/* Profile Card */}
      {user && (
        <Card className="p-4 mb-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <UserCircle className="h-12 w-12" />
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">{user.firstName} {user.lastName}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">{t.language}</h2>
          <LanguageSelector />
        </div>
        <p className="text-sm text-gray-500">{t.languageHint}</p>
      </Card>

      <Card className="p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">{t.settingsTitle}</h2>
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
          <h2 className="text-lg font-semibold mb-2">{t.dashboard}</h2>
          <p className="text-sm text-gray-500 mb-4">
            {t.dashboardHint}
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
            {t.dashboard}
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
        {t.logout}
      </Button>
    </div>
  );
};

export default Menu;
