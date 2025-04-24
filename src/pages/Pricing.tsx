
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

export default function Pricing() {
  return (
    <Layout>
      <Helmet>
        <title>Pricing - Barangay Mo</title>
      </Helmet>
      <div className="container max-w-7xl mx-auto px-4">
        <PageHeader
          title="Pricing"
          subtitle="Affordable plans for communities of all sizes"
          breadcrumbs={[{ label: "Pricing" }]}
        />
        
        <div className="grid md:grid-cols-3 gap-8 mt-8">
          <Card className="p-6 border border-gray-200">
            <h3 className="text-xl font-bold mb-2">Basic</h3>
            <p className="text-gray-500 mb-4">For small barangays</p>
            <div className="text-3xl font-bold mb-6">₱0<span className="text-lg text-gray-500">/month</span></div>
            <ul className="space-y-3 mb-8">
              {["Resident registration", "Community announcements", "Basic reporting"].map((feature) => (
                <li key={feature} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full">Get Started</Button>
          </Card>
          
          <Card className="p-6 border-2 border-blue-600 relative">
            <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 text-xs font-medium">Popular</div>
            <h3 className="text-xl font-bold mb-2">Standard</h3>
            <p className="text-gray-500 mb-4">For medium-sized communities</p>
            <div className="text-3xl font-bold mb-6">₱2,500<span className="text-lg text-gray-500">/month</span></div>
            <ul className="space-y-3 mb-8">
              {[
                "All Basic features",
                "Document processing",
                "Complaint system",
                "Event management",
                "SMS notifications"
              ].map((feature) => (
                <li key={feature} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full">Tara na! Subscribe</Button>
          </Card>
          
          <Card className="p-6 border border-gray-200">
            <h3 className="text-xl font-bold mb-2">Premium</h3>
            <p className="text-gray-500 mb-4">For large municipalities</p>
            <div className="text-3xl font-bold mb-6">₱5,000<span className="text-lg text-gray-500">/month</span></div>
            <ul className="space-y-3 mb-8">
              {[
                "All Standard features",
                "Advanced analytics",
                "Custom integrations",
                "Priority support",
                "Dedicated account manager"
              ].map((feature) => (
                <li key={feature} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full">Contact Sales</Button>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
