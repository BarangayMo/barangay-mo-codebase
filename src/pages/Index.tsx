
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, MapPin, ShieldCheck, Users, ShoppingCart, Star } from "lucide-react";
import { Layout } from "@/components/layout/Layout";

export default function Index() {
  const currentYear = new Date().getFullYear();
  
  return (
    <Layout>
      <div className="w-full -mt-4">
        <section className="relative w-full min-h-[85vh] flex items-center">
          <div 
            className="absolute inset-0 bg-[url('https://static.wixstatic.com/media/b17ef9_9db19658a9df45e79d0727344ed3b6a3~mv2.jpg')] bg-cover bg-center"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80" />
          
          <div className="relative z-10 w-full mx-auto max-w-7xl px-4 py-8 text-white">
            <div className="w-full max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="w-full md:w-1/2 text-center md:text-left">
                  <Badge className="mb-4 bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm">
                    Mabuhay! Beta Version 1.0
                  </Badge>
                  
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white font-outfit leading-tight">
                    Your Smart <br />
                    <span className="relative">
                      Barangay
                      <svg className="absolute -bottom-2 left-0 w-full h-2 text-yellow-300 hidden md:block" viewBox="0 0 100 10" preserveAspectRatio="none">
                        <path d="M0,0 L100,0 C60,10 40,10 0,0 Z" fill="currentColor" />
                      </svg>
                    </span>
                  </h1>
                  
                  <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-lg">
                    Connecting communities, empowering residents, and streamlining local governance in the Philippines.
                  </p>
                  
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-8">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90 font-medium shadow-lg">
                      <Link to="/register" className="flex items-center gap-2">
                        Join Your Community
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                    
                    <Button size="lg" variant="outline" className="bg-transparent backdrop-blur-sm border-white text-white hover:bg-white/10">
                      <Link to="/about">Learn More</Link>
                    </Button>
                  </div>
                  
                  <div className="mt-8 flex flex-col items-start gap-3 justify-center md:justify-start">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-white/80 text-sm">5.0 Rating</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-white/80" />
                      <span className="text-white/80 text-sm">10k+ Users</span>
                    </div>
                    
                    <div className="flex flex-col gap-1.5 mt-1">
                      <p className="text-white/90 text-sm">Serving 42,045 barangays across the Philippines</p>
                      <p className="text-white/90 text-sm">Supporting 1,489 municipalities with digital solutions</p>
                      <p className="text-white/90 text-sm">Connected with 145 cities nationwide</p>
                      <p className="text-white/90 text-sm">Present in all 81 provinces of the country</p>
                    </div>
                  </div>
                </div>
                
                <div className="w-full md:w-2/5 relative">
                  <div className="rounded-2xl overflow-hidden backdrop-blur-sm bg-white/10 p-1 shadow-2xl border border-white/20">
                    <img 
                      src="/lovable-uploads/f39411e2-71c1-4c46-8b45-5fc0f2d8eca5.png"
                      alt="Community Illustration" 
                      className="w-full h-auto"
                    />
                  </div>
                  
                  <div className="absolute -top-6 -right-6 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-xl rotate-3 hidden md:block">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-blue-600">Local Marketplace</span>
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-xl -rotate-3 hidden md:block">
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

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3 font-outfit">Everything Your Community Needs</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Barangay Mo provides a comprehensive platform tailored to the needs of Filipino communities.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 font-outfit">Community Management</h3>
                <p className="text-gray-600">Efficient resident registration, verification, and management system.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="bg-green-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 font-outfit">Job Opportunities</h3>
                <p className="text-gray-600">Connect with local employment opportunities within your barangay.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="bg-orange-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 font-outfit">Local Marketplace</h3>
                <p className="text-gray-600">Buy and sell products and services within your local community.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="bg-purple-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <ShieldCheck className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 font-outfit">Secure & Verified</h3>
                <p className="text-gray-600">Role-based access control ensures data security and privacy.</p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-[40px] mx-4">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6 font-outfit">Tara na! Ready to join your barangay?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Get connected with your community, access local services, and stay updated with important announcements.
            </p>
            <Button asChild size="lg" variant="secondary" className="mb-4 font-medium">
              <Link to="/register" className="flex items-center gap-2">Register Now <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </section>

        <footer className="py-8 text-center text-sm text-gray-500 md:hidden">
          <p>&copy; {currentYear} Barangay Mo. All rights reserved.</p>
        </footer>
      </div>
    </Layout>
  );
}
