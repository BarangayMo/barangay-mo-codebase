
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Play, Menu, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Welcome() {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, userRole } = useAuth();

  // Redirect authenticated users to their appropriate dashboard
  useEffect(() => {
    if (isAuthenticated && userRole) {
      switch(userRole) {
        case "official":
          navigate("/official-dashboard", { replace: true });
          break;
        case "superadmin":
          navigate("/admin", { replace: true });
          break;
        case "resident":
        default:
          navigate("/resident-home", { replace: true });
          break;
      }
    }
  }, [isAuthenticated, userRole, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 md:p-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png" 
            alt="Barangay Mo Logo" 
            className="h-8 w-auto md:h-10"
          />
          <div>
            <h1 className="text-lg md:text-xl font-bold text-gray-900">Barangay Mo</h1>
            <p className="text-xs md:text-sm text-gray-600">Digital Governance Platform</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6">
            <Link to="/features" className="text-gray-600 hover:text-red-600 transition-colors">Features</Link>
            <Link to="/about" className="text-gray-600 hover:text-red-600 transition-colors">About</Link>
            <Link to="/contact" className="text-gray-600 hover:text-red-600 transition-colors">Contact</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/mpin">
              <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                Register
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          <Menu className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-b border-gray-200 p-4">
          <nav className="flex flex-col gap-4 mb-4">
            <Link to="/features" className="text-gray-600 hover:text-red-600 transition-colors">Features</Link>
            <Link to="/about" className="text-gray-600 hover:text-red-600 transition-colors">About</Link>
            <Link to="/contact" className="text-gray-600 hover:text-red-600 transition-colors">Contact</Link>
          </nav>
          <div className="flex flex-col gap-3">
            <Link to="/mpin">
              <Button variant="outline" className="w-full border-red-600 text-red-600 hover:bg-red-50">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                Register
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Welcome to{" "}
            <span className="text-red-600">Barangay Mo</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Empowering Filipino communities through digital governance. 
            Connect with your barangay, access services, and participate in local democracy.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/register">
              <Button 
                size="lg" 
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg"
              >
                Get Started Today
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => setShowVideoModal(true)}
              className="border-red-600 text-red-600 hover:bg-red-50 px-8 py-3 text-lg"
            >
              <Play className="h-5 w-5 mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Connection</h3>
            <p className="text-gray-600">
              Connect with your neighbors, participate in community discussions, and stay updated on local events.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Digital Services</h3>
            <p className="text-gray-600">
              Access barangay services online, submit requests, and track the status of your applications.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Transparent Governance</h3>
            <p className="text-gray-600">
              Stay informed about barangay activities, budgets, and decisions through our transparent platform.
            </p>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Barangay Mo Demo</h3>
                <button 
                  onClick={() => setShowVideoModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Demo video coming soon...</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
