import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MPINLogin } from "@/components/auth/MPINLogin";

export default function MPINLoginPage() {
  const navigate = useNavigate();
  const { userRole } = useAuth();

  const handleSuccess = () => {
    // Navigation will be handled by AuthContext after successful login
    console.log("MPIN login successful, waiting for auth redirect...");
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <MPINLogin onSuccess={handleSuccess} onBackToLogin={handleBackToLogin} />
    </div>
  );
}