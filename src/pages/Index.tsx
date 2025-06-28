import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, MapPin, ShieldCheck, Users, ShoppingCart, Star } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingScreen } from "@/components/ui/loading";

export default function Index() {
  const currentYear = new Date().getFullYear();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  // Redirect mobile users to welcome page
  useEffect(() => {
    if (isMobile) {
      navigate('/welcome');
    }
  }, [isMobile, navigate]);

  // Show loading screen for mobile users while redirecting
  if (isMobile) {
    return <LoadingScreen />;
  }
  
  return (
    <Layout hideFooter={isMobile}>
      <div className="w-full -mt-4">
        <section className="relative w-full min-h-[100vh] md:min-h-[85vh] flex items-center">
          <div 
            className="absolute inset-0 bg-[url('https://static.wixstatic.com/media/b17ef9_9db19658a9df45e79d0727344ed3b6a3~mv2.jpg')] bg-cover bg-center"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80" />
          
          <div className="relative z-10 w-full mx-auto max-w-7xl px-6 md:px-4 py-8 md:py-8 text-white">
            <div className="w-full max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="w-full md:w-1/2 text-center md:text-left">
                  <Badge className="mb-6 md:mb-4 bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm text-sm px-4 py-2">
                    Mabuhay! Beta Version 1.0
                  </Badge>
                  
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 md:mb-6 text-white font-outfit leading-tight">
                    Your Smart <br />
                    <span className="relative">
                      Barangay
                      <svg className="absolute -bottom-2 left-0 w-full h-2 text-yellow-300 hidden md:block" viewBox="0 0 100 10" preserveAspectRatio="none">
                        <path d="M0,0 L100,0 C60,10 40,10 0,0 Z" fill="currentColor" />
                      </svg>
                    </span>
                  </h1>
                  
                  <p className="text-lg md:text-2xl text-white/90 mb-10 md:mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
                    Connecting communities, empowering residents, and streamlining local governance in the Philippines.
                  </p>
                  
                  <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start mb-10 md:mb-8 px-4 md:px-0">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90 font-medium shadow-lg h-14 text-lg rounded-xl">
                      <Link to="/register" className="flex items-center gap-2">
                        Join Your Community
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </Button>
                    
                    <Button size="lg" variant="outline" className="bg-transparent backdrop-blur-sm border-white text-white hover:bg-white/10 h-14 text-lg rounded-xl">
                      <Link to="/about">Learn More</Link>
                    </Button>
                  </div>
                  
                  <div className="mt-8 flex flex-col items-center md:items-start gap-4 md:gap-3 justify-center md:justify-start">
                    <div className="flex items-center gap-3">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((_, i) => (
                          <Star key={i} className="w-5 h-5 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-white/80 text-base md:text-sm font-medium">5.0 Rating</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 md:w-4 md:h-4 text-white/80" />
                      <span className="text-white/80 text-base md:text-sm font-medium">10k+ Users</span>
                    </div>
                    
                    <div className="flex flex-col gap-2 md:gap-1.5 mt-2 md:mt-1 text-center md:text-left">
                      <p className="text-white/90 text-sm font-medium">Serving 42,045 barangays across the Philippines</p>
                      <p className="text-white/90 text-sm font-medium">Supporting 1,489 municipalities with digital solutions</p>
                      <p className="text-white/90 text-sm font-medium">Connected with 145 cities nationwide</p>
                      <p className="text-white/90 text-sm font-medium">Present in all 81 provinces of the country</p>
                    </div>
                  </div>
                </div>
                
                <div className="w-full md:w-2/5 relative mt-8 md:mt-0">
                  <div className="rounded-3xl md:rounded-2xl overflow-hidden backdrop-blur-sm bg-white/10 p-2 md:p-1 shadow-2xl border border-white/20">
                    <img 
                      src="/lovable-uploads/f39411e2-71c1-4c46-8b45-5fc0f2d8eca5.png"
                      alt="Community Illustration" 
                      className="w-full h-auto rounded-2xl md:rounded-xl"
                    />
                  </div>
                  
                  <div className="absolute -top-4 md:-top-6 -right-4 md:-right-6 bg-white/90 backdrop-blur-sm p-3 md:p-4 rounded-xl md:rounded-lg shadow-xl rotate-3 hidden md:block">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-blue-600">Local Marketplace</span>
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-2 md:-bottom-4 -left-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl md:rounded-lg shadow-xl -rotate-3 hidden md:block">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-600">Secure & Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-white mx-4 md:mx-0 rounded-t-3xl md:rounded-none -mt-6 md:mt-0">
          <div className="container mx-auto px-6 md:px-4">
            <div className="text-center mb-10 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-3 font-outfit">Everything Your Community Needs</h2>
              <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Barangay Mo provides a comprehensive platform tailored to the needs of Filipino communities.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              <div className="bg-white p-6 md:p-6 rounded-2xl md:rounded-xl shadow-lg md:shadow-md border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="bg-blue-100 p-4 md:p-3 rounded-2xl md:rounded-full w-16 h-16 md:w-14 md:h-14 flex items-center justify-center mb-5 md:mb-4 mx-auto md:mx-0">
                  <Users className="h-7 w-7 md:h-6 md:w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 font-outfit text-center md:text-left">Community Management</h3>
                <p className="text-gray-600 text-center md:text-left leading-relaxed">Efficient resident registration, verification, and management system.</p>
              </div>
              
              <div className="bg-white p-6 md:p-6 rounded-2xl md:rounded-xl shadow-lg md:shadow-md border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="bg-green-100 p-4 md:p-3 rounded-2xl md:rounded-full w-16 h-16 md:w-14 md:h-14 flex items-center justify-center mb-5 md:mb-4 mx-auto md:mx-0">
                  <Briefcase className="h-7 w-7 md:h-6 md:w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 font-outfit text-center md:text-left">Job Opportunities</h3>
                <p className="text-gray-600 text-center md:text-left leading-relaxed">Connect with local employment opportunities within your barangay.</p>
              </div>
              
              <div className="bg-white p-6 md:p-6 rounded-2xl md:rounded-xl shadow-lg md:shadow-md border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="bg-orange-100 p-4 md:p-3 rounded-2xl md:rounded-full w-16 h-16 md:w-14 md:h-14 flex items-center justify-center mb-5 md:mb-4 mx-auto md:mx-0">
                  <MapPin className="h-7 w-7 md:h-6 md:w-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 font-outfit text-center md:text-left">Local Marketplace</h3>
                <p className="text-gray-600 text-center md:text-left leading-relaxed">Buy and sell products and services within your local community.</p>
              </div>
              
              <div className="bg-white p-6 md:p-6 rounded-2xl md:rounded-xl shadow-lg md:shadow-md border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="bg-purple-100 p-4 md:p-3 rounded-2xl md:rounded-full w-16 h-16 md:w-14 md:h-14 flex items-center justify-center mb-5 md:mb-4 mx-auto md:mx-0">
                  <ShieldCheck className="h-7 w-7 md:h-6 md:w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 font-outfit text-center md:text-left">Secure & Verified</h3>
                <p className="text-gray-600 text-center md:text-left leading-relaxed">Role-based access control ensures data security and privacy.</p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-12 md:py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-3xl md:rounded-[40px] mx-4 mb-8 md:mb-0">
          <div className="container mx-auto px-6 md:px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 font-outfit">Tara na! Ready to join your barangay?</h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Get connected with your community, access local services, and stay updated with important announcements.
            </p>
            <Button asChild size="lg" variant="secondary" className="mb-4 font-medium h-14 text-lg rounded-xl shadow-lg">
              <Link to="/register" className="flex items-center gap-2">Register Now <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </section>

        {/* Desktop footer - hidden on mobile */}
        <footer className="py-8 text-center text-sm text-gray-500 hidden md:block">
          <p>&copy; {currentYear} Barangay Mo. All rights reserved.</p>
        </footer>
      </div>
    </Layout>
  );
}
