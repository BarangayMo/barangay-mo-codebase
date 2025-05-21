
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LogOut, 
  ThumbsUp, 
  ToggleRight,
  FileText, 
  CircleHelp,
  User,
  ChevronLeft, 
  ChevronRight,
  LogIn
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/contexts/LanguageContext";
import { MobileNavbar } from "@/components/layout/MobileNavbar";
import { useTheme } from "@/components/theme-provider"; // Changed import
import { motion } from "framer-motion";

// Translation dictionary for all text in the component
const translations = {
  en: {
    menu: "Settings",
    general: "General",
    legal: "Legal",
    feedback: "Leave feedback",
    feedbackDesc: "Let us know how you like the app!",
    themes: "Switch themes",
    cache: "Clear cache",
    faq: "FAQ",
    privacy: "Data privacy terms",
    terms: "Terms and conditions",
    logout: "Sign out",
    login: "Sign in",
    profile: "My Profile"
  },
  fil: {
    menu: "Settings",
    general: "Pangkalahatan",
    legal: "Legal",
    feedback: "Mag-iwan ng feedback",
    feedbackDesc: "Ipaalam sa amin kung paano mo nagustuhan ang app!",
    themes: "Palitan ang tema",
    cache: "I-clear ang cache",
    faq: "FAQ",
    privacy: "Mga tuntunin sa privacy ng data",
    terms: "Mga tuntunin at kondisyon",
    logout: "Mag-sign out",
    login: "Mag-sign in",
    profile: "Aking Profile"
  }
};

// Animation variants for page transitions
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.4,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

export const Menu = () => {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const { theme, setTheme } = useTheme(); // This will now use the theme from src/components/theme-provider.tsx
  
  // Select the appropriate translations based on language
  const t = translations[language];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/resident-profile');
    } else {
      navigate('/login');
    }
  };

  return (
    <motion.div 
      className="bg-gray-50 min-h-screen pb-20 dark:bg-zinc-900" // Added dark mode class
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div 
        className="px-4 py-4 flex items-center border-b bg-white dark:bg-zinc-800 dark:border-zinc-700" // Added dark mode classes
        variants={itemVariants}
      >
        <button onClick={handleBack} className="mr-4 text-gray-700 dark:text-gray-300">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t.menu}</h1>
      </motion.div>

      <motion.div className="px-4 py-3" variants={itemVariants}>
        <h2 className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t.general}</h2>
        
        {/* General Settings Group */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm overflow-hidden mb-6">
          {/* Profile Item - New */}
          <motion.div 
            className="p-4 flex items-center justify-between border-b dark:border-zinc-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-700/50"
            variants={itemVariants}
            whileTap={{ scale: 0.98 }}
            onClick={handleProfileClick}
          >
            <div className="flex items-center">
              <User className="text-gray-600 dark:text-gray-400 w-5 h-5 mr-3" />
              <p className="font-medium text-gray-800 dark:text-gray-200">{t.profile}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </motion.div>

          {/* Feedback Item */}
          <motion.div 
            className="p-4 flex items-center border-b dark:border-zinc-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-700/50"
            variants={itemVariants}
            whileTap={{ scale: 0.98 }}
          >
            <ThumbsUp className="text-gray-600 dark:text-gray-400 w-5 h-5 mr-3" />
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">{t.feedback}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t.feedbackDesc}</p>
            </div>
          </motion.div>
          
          {/* Switch Themes Item */}
          <motion.div 
            className="p-4 flex items-center justify-between border-b dark:border-zinc-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-700/50"
            variants={itemVariants}
            // Removed whileTap for Switch, as it interferes with the switch interaction
          >
            <div className="flex items-center">
              <ToggleRight className="text-gray-600 dark:text-gray-400 w-5 h-5 mr-3" />
              <p className="font-medium text-gray-800 dark:text-gray-200">{t.themes}</p>
            </div>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
            />
          </motion.div>
          
          {/* Clear Cache Item */}
          <motion.div 
            className="p-4 flex items-center border-b dark:border-zinc-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-700/50"
            variants={itemVariants}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center flex-1">
              <FileText className="text-gray-600 dark:text-gray-400 w-5 h-5 mr-3" />
              <p className="font-medium text-gray-800 dark:text-gray-200">{t.cache}</p>
            </div>
          </motion.div>
          
          {/* FAQ Item */}
          <motion.div 
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-700/50"
            variants={itemVariants}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center">
              <CircleHelp className="text-gray-600 dark:text-gray-400 w-5 h-5 mr-3" />
              <p className="font-medium text-gray-800 dark:text-gray-200">{t.faq}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </motion.div>
        </div>
        
        {/* Legal Group */}
        <h2 className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t.legal}</h2>
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm overflow-hidden mb-6">
          {/* Privacy Terms Item */}
          <motion.div 
            className="p-4 flex items-center justify-between border-b dark:border-zinc-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-700/50"
            variants={itemVariants}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center">
              <FileText className="text-gray-600 dark:text-gray-400 w-5 h-5 mr-3" />
              <p className="font-medium text-gray-800 dark:text-gray-200">{t.privacy}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </motion.div>
          
          {/* Terms and Conditions Item */}
          <motion.div 
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-700/50"
            variants={itemVariants}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center">
              <FileText className="text-gray-600 dark:text-gray-400 w-5 h-5 mr-3" />
              <p className="font-medium text-gray-800 dark:text-gray-200">{t.terms}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </motion.div>
        </div>
        
        {/* Sign Out/In Button */}
        <motion.div 
          className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm overflow-hidden"
          variants={itemVariants}
          // Removed whileTap, button has its own feedback
        >
          {isAuthenticated ? (
            <button 
              onClick={handleLogout}
              className="p-4 flex items-center w-full text-left text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <p className="font-medium">{t.logout}</p>
            </button>
          ) : (
            <button 
              onClick={handleLogin}
              className="p-4 flex items-center w-full text-left text-primary hover:bg-primary/10 dark:text-blue-400 dark:hover:bg-blue-400/10"
            >
              <LogIn className="w-5 h-5 mr-3" />
              <p className="font-medium">{t.login}</p>
            </button>
          )}
        </motion.div>
      </motion.div>
      
      <MobileNavbar />
    </motion.div>
  );
};

export default Menu;
