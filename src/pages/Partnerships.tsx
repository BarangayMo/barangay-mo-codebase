
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Globe, Shield, Users } from "lucide-react";

export default function Partnerships() {
  return (
    <Layout>
      <Helmet>
        <title>Partnerships - Barangay Mo</title>
      </Helmet>
      <div className="container max-w-7xl mx-auto px-4">
        <PageHeader
          title="Partnerships"
          subtitle="Join forces with Barangay Mo to build better communities"
          breadcrumbs={[{ label: "Partnerships" }]}
        />
        
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-600">
            At Barangay Mo, we believe that strong partnerships are essential for creating meaningful impact in communities across the Philippines.
          </p>
          
          <h2 className="text-2xl font-bold mt-8">Why Partner With Us?</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mt-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <Globe className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold">Nationwide Reach</h3>
              <p className="text-gray-600 mt-2">
                Connect with over 42,000 barangays across the Philippines through our growing platform.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <Users className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold">Community Focus</h3>
              <p className="text-gray-600 mt-2">
                Direct access to local leaders and residents who care deeply about their communities.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <Shield className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold">Trusted Platform</h3>
              <p className="text-gray-600 mt-2">
                Leverage our established reputation and trust among local government units.
              </p>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mt-12">Partnership Opportunities</h2>
          <ul>
            <li>Technology Partners</li>
            <li>Service Providers</li>
            <li>Government Agencies</li>
            <li>NGOs and Community Organizations</li>
            <li>Educational Institutions</li>
            <li>Corporate Social Responsibility Programs</li>
          </ul>
          
          <div className="mt-8 bg-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-blue-800">Interested in partnering with us?</h3>
            <p className="mt-2">
              Tara na! Let's explore how we can work together to build stronger, more connected communities.
            </p>
            <Button className="mt-4">Contact Our Partnership Team</Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
