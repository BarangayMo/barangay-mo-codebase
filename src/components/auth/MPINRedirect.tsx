import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mpinAuthService } from "@/services/mpinAuth";

export function MPINRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if device has stored credentials on app start
    const storedCredentials = mpinAuthService.hasStoredCredentials();
    
    if (storedCredentials) {
      // Redirect to MPIN page if credentials found
      navigate("/mpin", { replace: true });
    } else {
      // No stored credentials, redirect to login
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return null; // This component doesn't render anything
}