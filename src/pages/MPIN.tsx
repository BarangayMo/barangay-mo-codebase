import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ScanFace, Fingerprint, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function MPIN() {
  const [otp, setOtp] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [biometricsAvailable, setBiometricsAvailable] = useState<'none' | 'face' | 'fingerprint'>('none');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { userRole, isAuthenticated, user } = useAuth();

  // Check session and fetch last login device info
  useEffect(() => {
    const checkSessionAndFetchDevice = async () => {
      try {
        // First check if there's an active session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        if (!session) {
          // Try to get last device info from local storage
          const lastDevice = localStorage.getItem('lastLoginDevice');
          if (lastDevice) {
            const deviceInfo = JSON.parse(lastDevice);
            setPhoneNumber(deviceInfo.phone_number || '');
          } else {
            // No stored device info, redirect to login
            navigate('/login');
          }
          return;
        }

        // If we have a session, fetch device info
        const { data, error } = await supabase
          .from('user_devices')
          .select('phone_number, mpin')
          .eq('user_id', session.user.id)
          .eq('is_active', true)
          .single();

        if (error) {
          console.error('Error fetching device info:', error);
          // Don't redirect, just show stored info if available
          const lastDevice = localStorage.getItem('lastLoginDevice');
          if (lastDevice) {
            const deviceInfo = JSON.parse(lastDevice);
            setPhoneNumber(deviceInfo.phone_number || '');
          }
          return;
        }

        if (data) {
          setPhoneNumber(data.phone_number || '');
          // Store device info for future quick access
          localStorage.setItem('lastLoginDevice', JSON.stringify({
            phone_number: data.phone_number
          }));
        }
      } catch (error) {
        console.error('Error in session check:', error);
        const lastDevice = localStorage.getItem('lastLoginDevice');
        if (lastDevice) {
          const deviceInfo = JSON.parse(lastDevice);
          setPhoneNumber(deviceInfo.phone_number || '');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkSessionAndFetchDevice();
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
      if (!user?.id) {
        toast.error('No user found');
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
        // Biometric authentication successful
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
          navigate("/login");
        }
      }
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      toast.error('Biometric authentication failed');
    }
  };

  const handleNumPadInput = (value: string) => {
    if (otp.length < 4) {
      setOtp(prev => prev + value);
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

    try {
      // First check current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;

      if (session?.user) {
        // User is already authenticated, verify MPIN
        const { data, error } = await supabase
          .from('user_devices')
          .select('mpin')
          .eq('user_id', session.user.id)
          .eq('is_active', true)
          .single();

        if (error) {
          // If no device found, try stored MPIN
          const storedMpin = localStorage.getItem('lastLoginMpin');
          if (storedMpin === otp) {
            handleSuccessfulLogin(session.user);
            return;
          }
          throw error;
        }

        if (data?.mpin === otp) {
          handleSuccessfulLogin(session.user);
        } else {
          toast.error('Invalid PIN');
          setOtp(''); // Clear the input
        }
      } else {
        // No active session, try to sign in with stored credentials
        const storedMpin = localStorage.getItem('lastLoginMpin');
        const storedEmail = localStorage.getItem('lastLoginEmail');
        
        if (storedMpin === otp && storedEmail) {
          // Use stored email to sign in
          const { error: signInError } = await supabase.auth.signInWithOtp({
            email: storedEmail
          });

          if (signInError) {
            toast.error('Authentication failed. Please login again.');
            navigate('/login');
            return;
          }

          // Wait for session to be established
          const { data: { user: newUser } } = await supabase.auth.getUser();
          if (newUser) {
            handleSuccessfulLogin(newUser);
          } else {
            navigate('/login');
          }
        } else {
          toast.error('Invalid PIN or no stored credentials');
          setOtp(''); // Clear the input
        }
      }
    } catch (error) {
      console.error('Error in login process:', error);
      toast.error('Login failed. Please try again');
      navigate('/login');
    }
  };

  const handleSuccessfulLogin = async (user: any) => {
    // Store credentials and device info for future quick access
    localStorage.setItem('lastLoginDevice', JSON.stringify({
      phone_number: phoneNumber // Using the current phoneNumber state
    }));
    localStorage.setItem('lastLoginMpin', otp);
    localStorage.setItem('lastLoginEmail', user.email || '');

    // Update device info
    try {
      await supabase.from('user_devices').upsert({
        user_id: user.id,
        phone_number: phoneNumber,
        mpin: otp,
        is_active: true,
        last_used: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating device info:', error);
    }

    // Navigate based on role
    if (userRole === "official") {
      navigate("/official-dashboard");
    } else if (userRole === "superadmin") {
      navigate("/admin");
    } else {
      navigate("/resident-home");
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

          {/* Phone Number Display */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-900 mb-1">{phoneNumber}</h1>
            <p className="text-gray-500 text-sm">Walter</p>
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

          {/* Biometrics Button - Only show if available */}
          {biometricsAvailable !== 'none' && (
            <Button
              variant="outline"
              className="w-full h-11 mb-3 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white hover:text-white border-none rounded-xl font-medium transition-all duration-150 active:scale-95"
              onClick={handleBiometricAuth}
            >
              {getBiometricsIcon()}
              {getBiometricsButtonText()}
            </Button>
          )}

          {/* Skip Button */}
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-gray-400 hover:text-gray-600 mb-2 transition-colors duration-150 flex items-center"
          >
            <ArrowRight className="mr-1 h-4 w-4" />
            Skip for now
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
