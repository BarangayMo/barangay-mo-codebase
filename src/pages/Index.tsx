
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, MapPin, ShieldCheck, Users } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <Layout>
      <div className="w-full">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-12 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-full md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Smart Barangay
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 mb-6">
                  Connecting communities, empowering residents, and streamlining local governance
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <Link to="/register">Join Your Community</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/about">Learn More</Link>
                  </Button>
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <img 
                  src="/placeholder.svg" 
                  alt="Smart Barangay Platform" 
                  className="rounded-lg shadow-lg w-full max-h-[400px] object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Everything Your Community Needs</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Community Management</h3>
                <p className="text-gray-600">Efficient resident registration, verification, and management system.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="bg-green-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Job Opportunities</h3>
                <p className="text-gray-600">Connect with local employment opportunities within your barangay.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="bg-orange-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Local Marketplace</h3>
                <p className="text-gray-600">Buy and sell products and services within your local community.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="bg-purple-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <ShieldCheck className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Secure & Verified</h3>
                <p className="text-gray-600">Role-based access control ensures data security and privacy.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to join your smart barangay?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Get connected with your community, access local services, and stay updated with important announcements.
            </p>
            <Button asChild size="lg" variant="secondary" className="mb-4">
              <Link to="/register">Register Now <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
