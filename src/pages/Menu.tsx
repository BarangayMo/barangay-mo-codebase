
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useRbiForms } from "@/hooks/use-rbi-forms";
import { 
  LogOut, 
  ThumbsUp, 
  ToggleRight,
  FileText, 
  CircleHelp,
  User,
  ChevronLeft, 
  ChevronRight,
  LogIn,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/contexts/LanguageContext";
import { MobileNavbar } from "@/components/layout/MobileNavbar";
import { useTheme } from "@/components/theme-provider";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
  const { logout, isAuthenticated, userRole } = useAuth();
  const { language } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { rbiForms, isLoading: rbiLoading } = useRbiForms();
  
  // Select the appropriate translations based on language
  const t = translations[language];

  // Calculate RBI progress for residents
  const getRbiProgress = () => {
    if (!rbiForms || rbiLoading) return 0;
    const hasCompletedRbi = rbiForms.length > 0;
    const approvedRbi = rbiForms.find(form => form.status === 'approved');
    
    if (approvedRbi) return 100;
    if (hasCompletedRbi) return 75; // Submitted but not approved
    return 0; // Not started
  };

  const rbiProgress = getRbiProgress();

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
      className="bg-gray-50 min-h-screen pb-20 dark:bg-zinc-900"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div 
        className="px-4 py-4 flex items-center border-b bg-white dark:bg-zinc-800 dark:border-zinc-700"
        variants={itemVariants}
      >
        <button onClick={handleBack} className="mr-4 text-gray-700 dark:text-gray-300">
          <ChevronLeft className="w-8 h-8" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t.menu}</h1>
      </motion.div>

      <motion.div className="px-4 py-3" variants={itemVariants}>
        {/* RBI Progress Section for Residents */}
        {userRole === "resident" && !rbiLoading && (
          <div className="mb-6 p-4 bg-white dark:bg-zinc-800 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {rbiProgress === 100 ? (
                  <>
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <span className="font-medium text-gray-800 dark:text-gray-200">RBI Registration Complete</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-6 w-6 text-yellow-500" />
                    <span className="font-medium text-gray-800 dark:text-gray-200">RBI Registration</span>
                  </>
                )}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">{rbiProgress}%</span>
            </div>
            <Progress value={rbiProgress} className="mb-2" indicatorClassName="bg-resident" />
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              {rbiProgress === 0 && "Start your RBI registration"}
              {rbiProgress === 75 && "Waiting for approval"}
              {rbiProgress === 100 && "Registration complete"}
            </div>
            {rbiProgress < 100 && (
              <Button asChild size="sm" className="bg-resident hover:bg-resident-dark text-white">
                <Link to="/rbi-registration">
                  {rbiProgress === 0 ? "Start RBI" : "Check Status"}
                </Link>
              </Button>
            )}
          </div>
        )}

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
              <User className="text-gray-600 dark:text-gray-400 w-6 h-6 mr-3" />
              <p className="font-medium text-gray-800 dark:text-gray-200">{t.profile}</p>
            </div>
            <ChevronRight className="h-6 w-6 text-gray-400 dark:text-gray-500" />
          </motion.div>

          {/* Feedback Item */}
          <motion.div 
            className="p-4 flex items-center border-b dark:border-zinc-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-700/50"
            variants={itemVariants}
            whileTap={{ scale: 0.98 }}
          >
            <ThumbsUp className="text-gray-600 dark:text-gray-400 w-6 h-6 mr-3" />
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">{t.feedback}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t.feedbackDesc}</p>
            </div>
          </motion.div>
          
          {/* Switch Themes Item */}
          <motion.div 
            className="p-4 flex items-center justify-between border-b dark:border-zinc-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-700/50"
            variants={itemVariants}
          >
            <div className="flex items-center">
              <ToggleRight className="text-gray-600 dark:text-gray-400 w-6 h-6 mr-3" />
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
              <FileText className="text-gray-600 dark:text-gray-400 w-6 h-6 mr-3" />
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
              <CircleHelp className="text-gray-600 dark:text-gray-400 w-6 h-6 mr-3" />
              <p className="font-medium text-gray-800 dark:text-gray-200">{t.faq}</p>
            </div>
            <ChevronRight className="h-6 w-6 text-gray-400 dark:text-gray-500" />
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
              <FileText className="text-gray-600 dark:text-gray-400 w-6 h-6 mr-3" />
              <p className="font-medium text-gray-800 dark:text-gray-200">{t.privacy}</p>
            </div>
            <ChevronRight className="h-6 w-6 text-gray-400 dark:text-gray-500" />
          </motion.div>
          
          {/* Terms and Conditions Item */}
          <motion.div 
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-700/50"
            variants={itemVariants}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center">
              <FileText className="text-gray-600 dark:text-gray-400 w-6 h-6 mr-3" />
              <p className="font-medium text-gray-800 dark:text-gray-200">{t.terms}</p>
            </div>
            <ChevronRight className="h-6 w-6 text-gray-400 dark:text-gray-500" />
          </motion.div>
        </div>
        
        {/* Sign Out/In Button */}
        <motion.div 
          className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm overflow-hidden"
          variants={itemVariants}
        >
          {isAuthenticated ? (
            <button 
              onClick={handleLogout}
              className="p-4 flex items-center w-full text-left text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              <LogOut className="w-6 h-6 mr-3" />
              <p className="font-medium">{t.logout}</p>
            </button>
          ) : (
            <button 
              onClick={handleLogin}
              className="p-4 flex items-center w-full text-left text-primary hover:bg-primary/10 dark:text-blue-400 dark:hover:bg-blue-400/10"
            >
              <LogIn className="w-6 h-6 mr-3" />
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
