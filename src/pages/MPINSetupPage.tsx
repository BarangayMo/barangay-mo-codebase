import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MPINSetup } from "@/components/auth/MPINSetup";

export default function MPINSetupPage() {
  const navigate = useNavigate();
  const { userRole } = useAuth();

  const handleSetupComplete = () => {
    // Redirect based on user role
    if (userRole === 'official') {
      navigate('/official-dashboard');
    } else if (userRole === 'superadmin') {
      navigate('/admin');
    } else {
      navigate('/resident-home');
    }
  };

  const handleSkip = () => {
    // Allow user to skip MPIN setup
    handleSetupComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <MPINSetup onSetupComplete={handleSetupComplete} onSkip={handleSkip} />
    </div>
  );
}