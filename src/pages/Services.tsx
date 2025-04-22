
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ShoppingCart, 
  FileText, 
  Shield, 
  Users, 
  Briefcase, 
  LifeBuoy, 
  Package, 
  Truck, 
  Heart, 
  Milestone 
} from "lucide-react";

const services = [
  {
    id: 1,
    title: "Document Requests",
    description: "Request and track barangay certificates, clearances, and other official documents",
    icon: FileText,
    color: "#0EA5E9", // Sky blue
    bgColor: "#EFF6FF" // Light blue bg
  },
  {
    id: 2,
    title: "Public Safety",
    description: "Report concerns and access emergency services in your area",
    icon: Shield,
    color: "#F97316", // Orange
    bgColor: "#FFF7ED" // Light orange bg
  },
  {
    id: 3,
    title: "Community Programs",
    description: "Discover and participate in local community development initiatives",
    icon: Users,
    color: "#8B5CF6", // Purple
    bgColor: "#F5F3FF" // Light purple bg
  },
  {
    id: 4,
    title: "Job Portal",
    description: "Find job opportunities and post vacancies in your barangay",
    icon: Briefcase,
    color: "#10B981", // Emerald
    bgColor: "#ECFDF5" // Light emerald bg
  },
  {
    id: 5,
    title: "Assistance Programs",
    description: "Access social welfare and emergency assistance programs",
    icon: LifeBuoy,
    color: "#EF4444", // Red
    bgColor: "#FEF2F2" // Light red bg
  },
  {
    id: 6,
    title: "Marketplace",
    description: "Buy and sell goods within your local community",
    icon: ShoppingCart,
    color: "#F59E0B", // Amber
    bgColor: "#FFFBEB" // Light amber bg
  },
  {
    id: 7,
    title: "Delivery Services",
    description: "Local delivery options for businesses and residents",
    icon: Truck,
    color: "#3B82F6", // Blue
    bgColor: "#EFF6FF" // Light blue bg
  },
  {
    id: 8,
    title: "Health Services",
    description: "Information on local health centers and vaccination programs",
    icon: Heart,
    color: "#EC4899", // Pink
    bgColor: "#FCE7F3" // Light pink bg
  },
  {
    id: 9,
    title: "Infrastructure Reports",
    description: "Report road issues, power outages, and water problems",
    icon: Milestone,
    color: "#6366F1", // Indigo
    bgColor: "#EEF2FF" // Light indigo bg
  },
  {
    id: 10,
    title: "Supply Distribution",
    description: "Information about relief goods and supply distribution points",
    icon: Package,
    color: "#14B8A6", // Teal
    bgColor: "#F0FDFA" // Light teal bg
  }
];

const Services = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Community Services</h1>
          <p className="text-muted-foreground">
            Access essential services provided by your barangay
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card 
              key={service.id} 
              className="overflow-hidden hover:shadow-md transition-shadow border-t-4"
              style={{ borderTopColor: service.color }}
            >
              <CardContent className="p-6">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: service.bgColor }}
                >
                  <service.icon style={{ color: service.color }} className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            More services coming soon!
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default Services;
