import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ScanFace, Fingerprint, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface DeviceData {
  mpin: string;
  biometricEnabled: boolean;
  failedAttempts: number;
  email: string;
  userRole?: string;
}

export default function MPIN() {
  const [otp, setOtp] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [biometricsAvailable, setBiometricsAvailable] = useState<'none' | 'face' | 'fingerprint'>('none');
  const [isLoading, setIsLoading] = useState(true);
  const [deviceData, setDeviceData] = useState<DeviceData | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const navigate = useNavigate();
  const { userRole, isAuthenticated, user } = useAuth();

  // Generate device fingerprint
  const getDeviceFingerprint = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx!.textBaseline = 'top';
    ctx!.font = '14px Arial';
    ctx!.fillText('Device fingerprint', 2, 2);
    
    return btoa(
      navigator.userAgent +
      navigator.language +
      screen.width + 'x' + screen.height +
      new Date().getTimezoneOffset() +
      canvas.toDataURL()
    ).substring(0, 32);
  };

  // Load device data on mount
  useEffect(() => {
    const loadDeviceData = () => {
      const fingerprint = getDeviceFingerprint();
      const storageKey = `quicklogin_${fingerprint}`;
      const stored = localStorage.getItem(storageKey);
      
      if (stored) {
        try {
          const data = JSON.parse(stored);
          setDeviceData(data);
          setUserEmail(data.email);
          setUserName(data.email.split('@')[0]); // Use email prefix as name
          setFailedAttempts(data.failedAttempts || 0);
        } catch (error) {
          console.error('Error parsing stored device data:', error);
          // If no stored data, redirect to login
          navigate('/login');
        }
      } else {
        // No stored device data, redirect to login
        navigate('/login');
      }
      setIsLoading(false);
    };

    loadDeviceData();
  }, [navigate]);

  useEffect(() => {
    // Check for biometrics availability
    const checkBiometrics = async () => {
      try {
        // Check if device has Face ID (iOS Safari/WebKit)
        if (window.navigator.userAgent.includes('iPhone') || window.navigator.userAgent.includes('iPad')) {
          if ('FaceID' in window) {
            setBiometricsAvailable('face');
          }
        }
        // Check for fingerprint/touch ID support using WebAuthn
        else if ('credentials' in navigator && 'PublicKeyCredential' in window) {
          // Check if platform authenticator is available
          const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          if (available) {
            setBiometricsAvailable('fingerprint');
          }
        }
      } catch (error) {
        console.error('Error checking biometrics:', error);
      }
    };

    checkBiometrics();
  }, []);

  const handleBiometricAuth = async () => {
    try {
      if (!deviceData?.biometricEnabled) {
        toast.error('Biometric authentication not set up');
        return;
      }

      // Create WebAuthn credential options
      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
        challenge: new Uint8Array(32),
        timeout: 60000,
        rpId: window.location.hostname,
        userVerification: "required",
        allowCredentials: [] // Allow any registered credential
      };

      // Request biometric verification
      const credential = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions
      });

      if (credential) {
        // Reset failed attempts on success
        const fingerprint = getDeviceFingerprint();
        const storageKey = `quicklogin_${fingerprint}`;
        const updatedData = { ...deviceData, failedAttempts: 0 };
        localStorage.setItem(storageKey, JSON.stringify(updatedData));
        
        // Navigate based on stored user role
        const role = deviceData.userRole || 'resident';
        switch(role) {
          case "official":
            navigate("/official-dashboard");
            break;
          case "superadmin":
            navigate("/admin");
            break;
          case "resident":
          default:
            navigate("/resident-home");
            break;
        }
      }
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      toast.error('Biometric authentication failed');
    }
  };

  const handleNumPadInput = (value: string) => {
    if (otp.length < 4) {
      const newOtp = otp + value;
      setOtp(newOtp);
      
      // Auto-submit when 4 digits are entered
      if (newOtp.length === 4) {
        setTimeout(() => {
          if (deviceData && newOtp === deviceData.mpin) {
            // Reset failed attempts on success
            const fingerprint = getDeviceFingerprint();
            const storageKey = `quicklogin_${fingerprint}`;
            const updatedData = { ...deviceData, failedAttempts: 0 };
            localStorage.setItem(storageKey, JSON.stringify(updatedData));
            
            // Navigate based on stored user role
            const role = deviceData.userRole || 'resident';
            switch(role) {
              case "official":
                navigate("/official-dashboard");
                break;
              case "superadmin":
                navigate("/admin");
                break;
              case "resident":
              default:
                navigate("/resident-home");
                break;
            }
          } else {
            const newFailedAttempts = failedAttempts + 1;
            setFailedAttempts(newFailedAttempts);
            
            if (deviceData) {
              // Update stored failed attempts
              const fingerprint = getDeviceFingerprint();
              const storageKey = `quicklogin_${fingerprint}`;
              const updatedData = { ...deviceData, failedAttempts: newFailedAttempts };
              localStorage.setItem(storageKey, JSON.stringify(updatedData));
            }
            
            if (newFailedAttempts >= 5) {
              toast.error('Too many failed attempts. Redirecting to password login.');
              setTimeout(() => navigate('/login'), 2000);
            } else {
              toast.error(`Invalid PIN. ${5 - newFailedAttempts} attempts remaining.`);
              setOtp(''); // Clear the input
            }
          }
        }, 100); // Small delay for visual feedback
      }
    }
  };

  const handleNumPadDelete = () => {
    setOtp(prev => prev.slice(0, -1));
  };

  const handleLogin = async () => {
    if (otp.length !== 4) {
      toast.error('Please enter a 4-digit PIN');
      return;
    }

    if (!deviceData) {
      toast.error('No device data found');
      navigate('/login');
      return;
    }

    // Check if too many failed attempts
    if (failedAttempts >= 5) {
      toast.error('Too many failed attempts. Please use password login.');
      navigate('/login');
      return;
    }

    // Verify MPIN
    if (deviceData.mpin === otp) {
      // Reset failed attempts on success
      const fingerprint = getDeviceFingerprint();
      const storageKey = `quicklogin_${fingerprint}`;
      const updatedData = { ...deviceData, failedAttempts: 0 };
      localStorage.setItem(storageKey, JSON.stringify(updatedData));
      
      // Navigate based on stored user role
      const role = deviceData.userRole || 'resident';
      switch(role) {
        case "official":
          navigate("/official-dashboard");
          break;
        case "superadmin":
          navigate("/admin");
          break;
        case "resident":
        default:
          navigate("/resident-home");
          break;
      }
    } else {
      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);
      
      // Update stored failed attempts
      const fingerprint = getDeviceFingerprint();
      const storageKey = `quicklogin_${fingerprint}`;
      const updatedData = { ...deviceData, failedAttempts: newFailedAttempts };
      localStorage.setItem(storageKey, JSON.stringify(updatedData));
      
      if (newFailedAttempts >= 5) {
        toast.error('Too many failed attempts. Redirecting to password login.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error(`Invalid PIN. ${5 - newFailedAttempts} attempts remaining.`);
        setOtp(''); // Clear the input
      }
    }
  };

  const handleSkip = () => {
    // Skip should go to login, not directly to dashboard pages
    // Only authenticated users should access dashboard pages
    if (isAuthenticated) {
      switch(userRole) {
        case "official":
          navigate("/official-dashboard");
          break;
        case "superadmin":
          navigate("/admin");
          break;
        case "resident":
        default:
          navigate("/resident-home");
          break;
      }
    } else {
      // Not authenticated, go to login
      navigate("/login");
    }
  };

  const numbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', '⌫']
  ];

  const getBiometricsButtonText = () => {
    switch (biometricsAvailable) {
      case 'face':
        return 'Use Face ID';
      case 'fingerprint':
        return 'Use Biometrics';
      default:
        return '';
    }
  };

  const getBiometricsIcon = () => {
    switch (biometricsAvailable) {
      case 'face':
        return <ScanFace className="mr-2 h-5 w-5" />;
      case 'fingerprint':
        return <Fingerprint className="mr-2 h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen max-h-screen flex flex-col bg-white font-inter overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-6 flex-shrink-0">
        <Link to="/welcome" className="text-gray-600 hover:text-gray-800 transition-colors">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <div className="flex-1" />
      </div>

      {/* Content Container */}
      <div className="flex-1 flex flex-col items-center justify-between px-6 pb-4 min-h-0">
        {/* Top Section */}
        <div className="flex flex-col items-center flex-shrink-0">
          {/* Logo */}
          <div className="mb-4">
            <img 
              src="/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png" 
              alt="Barangay Mo Logo" 
              className="h-10 w-auto mx-auto"
            />
          </div>

          {/* User Email Display */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-900 mb-1">{userEmail}</h1>
            <p className="text-gray-500 text-sm">{userName}</p>
          </div>
        </div>

        {/* PIN Section - Moved closer to number pad */}
        <div className="flex flex-col items-center flex-shrink-0 w-full max-w-sm">
          {/* Title */}
          <h2 className="text-base text-gray-600 mb-4 text-center">Enter your Barangay Mo PIN</h2>

          {/* PIN Dots */}
          <div className="flex items-center justify-center gap-4 mb-6">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-colors duration-200 ${
                  index < otp.length ? 'bg-red-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Number Pad */}
          <div className="grid grid-cols-3 gap-4 mb-6 w-full max-w-xs">
            {numbers.map((row, rowIndex) => (
              row.map((num, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    h-16 w-full flex items-center justify-center text-2xl font-bold
                    ${!num ? 'invisible' : 'hover:bg-red-50 active:bg-red-100 rounded-full transition-all duration-150 active:scale-95'}
                  `}
                  onClick={() => {
                    if (num === '⌫') {
                      handleNumPadDelete();
                    } else if (num) {
                      handleNumPadInput(num);
                    }
                  }}
                >
                  {num}
                </button>
              ))
            ))}
          </div>

          {/* Biometrics Button - Only show if available and enabled */}
          {biometricsAvailable !== 'none' && deviceData?.biometricEnabled && (
            <Button
              variant="outline"
              className="w-full h-11 mb-3 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white hover:text-white border-none rounded-xl font-medium transition-all duration-150 active:scale-95"
              onClick={handleBiometricAuth}
            >
              {getBiometricsIcon()}
              {getBiometricsButtonText()}
            </Button>
          )}

          {/* Failed attempts warning */}
          {failedAttempts > 0 && (
            <div className="text-center mb-3">
              <p className="text-sm text-red-500">
                {failedAttempts >= 5 
                  ? "Too many failed attempts" 
                  : `${5 - failedAttempts} attempts remaining`}
              </p>
            </div>
          )}

          {/* Skip Button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/login')}
            className="text-gray-400 hover:text-gray-600 mb-2 transition-colors duration-150 flex items-center"
          >
            <ArrowRight className="mr-1 h-4 w-4" />
            Use Password Instead
          </Button>

          {/* Forgot PIN Link */}
          <div className="text-center">
            <Link 
              to="/forgot-mpin" 
              className="text-red-500 hover:text-red-600 font-medium transition-colors duration-150 text-sm"
            >
              Forgot MPIN?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
