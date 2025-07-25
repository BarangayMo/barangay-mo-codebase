import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Mail } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";

interface LocationState {
  email: string;
  name: string;
}

export default function OfficialRegistrationSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const locationState = location.state as LocationState;

  // Redirect if no location state
  useEffect(() => {
    if (!locationState?.email || !locationState?.name) {
      navigate('/register/role');
    }
  }, [locationState, navigate]);

  if (!locationState?.email || !locationState?.name) {
    return null;
  }

  const logoUrl = "/lovable-uploads/141c2a56-35fc-4123-a51f-358481e0f167.png";

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 text-white bg-red-600">
          <div className="w-6" />
          <h1 className="text-lg font-bold">Registration Submitted</h1>
          <div className="w-6" />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center p-6">
          <div className="text-center space-y-6">
            {/* Logo */}
            <img src={logoUrl} alt="eGov.PH Logo" className="h-16 w-auto mx-auto mb-6" />

            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <CheckCircle className="h-24 w-24 text-green-500" />
                <Clock className="h-8 w-8 text-orange-500 absolute -bottom-1 -right-1 bg-white rounded-full p-1" />
              </div>
            </div>

            {/* Title */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Registration Submitted Successfully!
              </h2>
              <p className="text-lg text-gray-600">
                Thank you, {locationState.name}
              </p>
            </div>

            {/* Message */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-left">
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-amber-800 text-sm">
                    Pending Review
                  </h3>
                  <p className="text-amber-700 text-sm mt-1">
                    Your official registration form has been submitted for review by the Super-Admin. 
                    You will be notified once your application has been processed.
                  </p>
                </div>
              </div>
            </div>

            {/* Email Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-800 text-sm">
                    Email Notifications
                  </h3>
                  <p className="text-blue-700 text-sm mt-1">
                    Updates will be sent to: <span className="font-medium">{locationState.email}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* What's Next */}
            <div className="text-left space-y-3">
              <h3 className="font-semibold text-gray-800">What's Next?</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <span className="font-semibold text-red-600 mt-0.5">1.</span>
                  <span>Your application will be reviewed by the Super-Admin</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-semibold text-red-600 mt-0.5">2.</span>
                  <span>If approved, an account will be created automatically</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-semibold text-red-600 mt-0.5">3.</span>
                  <span>You'll receive login credentials and further instructions</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-4 space-y-3">
          <Button 
            onClick={() => navigate('/login')} 
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 h-12 text-base font-medium"
          >
            Go to Login
          </Button>
          <Button 
            onClick={() => navigate('/')} 
            variant="outline" 
            className="w-full border-red-600 text-red-600 hover:bg-red-50 py-3 h-12 text-base font-medium"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  // Desktop version
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-8 py-6">
          <div className="flex items-center justify-center">
            <img src={logoUrl} alt="eGov.PH Logo" className="h-8 w-auto" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center space-y-6">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <CheckCircle className="h-32 w-32 text-green-500" />
                <Clock className="h-12 w-12 text-orange-500 absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg" />
              </div>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Registration Submitted Successfully!
              </h1>
              <p className="text-xl text-gray-600">
                Thank you, {locationState.name}
              </p>
            </div>

            {/* Message */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-left">
              <div className="flex items-start space-x-4">
                <Clock className="h-6 w-6 text-amber-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-amber-800 mb-2">
                    Pending Review
                  </h3>
                  <p className="text-amber-700">
                    Your official registration form has been submitted for review by the Super-Admin. 
                    You will be notified once your application has been processed.
                  </p>
                </div>
              </div>
            </div>

            {/* Email Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
              <div className="flex items-start space-x-4">
                <Mail className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-800 mb-2">
                    Email Notifications
                  </h3>
                  <p className="text-blue-700">
                    Updates will be sent to: <span className="font-medium">{locationState.email}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* What's Next */}
            <div className="text-left space-y-4">
              <h3 className="font-semibold text-gray-800 text-lg">What's Next?</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start space-x-3">
                  <span className="font-bold text-red-600 text-lg mt-0.5">1.</span>
                  <span>Your application will be reviewed by the Super-Admin</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="font-bold text-red-600 text-lg mt-0.5">2.</span>
                  <span>If approved, an account will be created automatically</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="font-bold text-red-600 text-lg mt-0.5">3.</span>
                  <span>You'll receive login credentials and further instructions</span>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex space-x-4 pt-6">
              <Button 
                onClick={() => navigate('/login')} 
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 h-12 text-base font-medium"
              >
                Go to Login
              </Button>
              <Button 
                onClick={() => navigate('/')} 
                variant="outline" 
                className="flex-1 border-red-600 text-red-600 hover:bg-red-50 py-3 h-12 text-base font-medium"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}