
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { RoleButton } from "@/components/ui/role-button";

export default function EmailVerification() {
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    // Get email from location state or user data
    const emailFromState = location.state?.email;
    const userEmail = user?.email;
    
    if (emailFromState) {
      setEmail(emailFromState);
    } else if (userEmail) {
      setEmail(userEmail);
    }

    // Listen for auth state changes to detect email confirmation
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
          // Email confirmed, redirect to phone page
          navigate("/phone", { state: { phoneNumber: "" } });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [location.state, user, navigate]);

  const handleResendEmail = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No email address found. Please try registering again."
      });
      return;
    }

    setIsResending(true);
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Email Sent",
        description: "A new verification email has been sent to your inbox."
      });
    } catch (error) {
      console.error("Error resending email:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to resend verification email. Please try again."
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleOpenEmailApp = () => {
    // Try to open default email app
    window.location.href = "mailto:";
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-6">
      <Link to="/register" className="flex items-center gap-2 text-gray-600 mb-6 hover:text-gray-800 transition-colors">
        <ChevronLeft className="h-5 w-5" />
        Back
      </Link>

      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">Check your inbox</h1>
        </motion.div>
        
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-white rounded-full p-8 shadow-lg">
            <div className="relative">
              <Mail className="w-24 h-24 text-blue-500" />
              <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-2">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <p className="text-lg text-gray-700 mb-2">
            We sent a verification email to
          </p>
          <p className="text-gray-900 font-semibold text-lg mb-4">
            {email || "your email address"}
          </p>
          <p className="text-gray-600">
            Click the link in the email to get started!
          </p>
        </motion.div>

        <motion.div 
          className="w-full space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <RoleButton 
            onClick={handleOpenEmailApp}
            className="w-full h-12 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Open Email App
          </RoleButton>

          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">
              Didn't get the email?
            </p>
            <button 
              onClick={handleResendEmail}
              disabled={isResending}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? "Sending..." : "Send again"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
