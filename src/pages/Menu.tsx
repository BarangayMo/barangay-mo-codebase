
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LogOut, 
  ThumbsUp, 
  ToggleRight,
  FileText, 
  CircleHelp
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/contexts/LanguageContext";
import { MobileNavbar } from "@/components/layout/MobileNavbar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

// Translation dictionary for all text in the component
const translations = {
  en: {
    menu: "Settings",
    general: "General",
    legal: "General", // Keeping as "General" to match the design while maintaining existing translations
    feedback: "Leave feedback",
    feedbackDesc: "Let us know how you like the app!",
    themes: "Switch themes",
    cache: "Clear cache",
    faq: "FAQ",
    privacy: "Data privacy terms",
    terms: "Terms and conditions",
    logout: "Sign out"
  },
  fil: {
    menu: "Settings",
    general: "Pangkalahatan",
    legal: "Pangkalahatan",
    feedback: "Mag-iwan ng feedback",
    feedbackDesc: "Ipaalam sa amin kung paano mo nagustuhan ang app!",
    themes: "Palitan ang tema",
    cache: "I-clear ang cache",
    faq: "FAQ",
    privacy: "Mga tuntunin sa privacy ng data",
    terms: "Mga tuntunin at kondisyon",
    logout: "Mag-sign out"
  }
};

export const Menu = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { language } = useLanguage();
  const { theme, setTheme } = useTheme();
  
  // Select the appropriate translations based on language
  const t = translations[language];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header */}
      <div className="px-4 py-4 flex items-center border-b bg-white">
        <button onClick={handleBack} className="mr-4">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">{t.menu}</h1>
      </div>

      <div className="px-4 py-3">
        <h2 className="text-sm text-gray-500 mb-2">{t.general}</h2>
        
        {/* General Settings Group */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          {/* Feedback Item */}
          <div className="p-4 flex items-center border-b">
            <ThumbsUp className="text-gray-600 w-5 h-5 mr-3" />
            <div>
              <p className="font-medium">{t.feedback}</p>
              <p className="text-sm text-gray-500">{t.feedbackDesc}</p>
            </div>
          </div>
          
          {/* Switch Themes Item */}
          <div className="p-4 flex items-center justify-between border-b">
            <div className="flex items-center">
              <ToggleRight className="text-gray-600 w-5 h-5 mr-3" />
              <p className="font-medium">{t.themes}</p>
            </div>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            />
          </div>
          
          {/* Clear Cache Item */}
          <div className="p-4 flex items-center border-b">
            <div className="flex items-center flex-1">
              <FileText className="text-gray-600 w-5 h-5 mr-3" />
              <p className="font-medium">{t.cache}</p>
            </div>
          </div>
          
          {/* FAQ Item */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <CircleHelp className="text-gray-600 w-5 h-5 mr-3" />
              <p className="font-medium">{t.faq}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        {/* Legal Group */}
        <h2 className="text-sm text-gray-500 mb-2">{t.legal}</h2>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          {/* Privacy Terms Item */}
          <div className="p-4 flex items-center justify-between border-b">
            <div className="flex items-center">
              <FileText className="text-gray-600 w-5 h-5 mr-3" />
              <p className="font-medium">{t.privacy}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
          
          {/* Terms and Conditions Item */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="text-gray-600 w-5 h-5 mr-3" />
              <p className="font-medium">{t.terms}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        {/* Sign Out Button */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <button 
            onClick={handleLogout}
            className="p-4 flex items-center w-full text-left text-red-600"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <p className="font-medium">{t.logout}</p>
          </button>
        </div>
      </div>
      
      <MobileNavbar />
    </div>
  );
};

export default Menu;
