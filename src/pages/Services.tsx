
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Settings } from "lucide-react";
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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

// Icon mapping for different service types
const getServiceIcon = (serviceType: string) => {
  const iconMap: { [key: string]: any } = {
    'document': FileText,
    'safety': Shield,
    'community': Users,
    'employment': Briefcase,
    'assistance': LifeBuoy,
    'marketplace': ShoppingCart,
    'delivery': Truck,
    'health': Heart,
    'infrastructure': Milestone,
    'supply': Package,
    'general': Settings
  };
  return iconMap[serviceType] || Settings;
};

// Color mapping for different service types
const getServiceColors = (serviceType: string) => {
  const colorMap: { [key: string]: { color: string; bgColor: string } } = {
    'document': { color: "#0EA5E9", bgColor: "#EFF6FF" },
    'safety': { color: "#F97316", bgColor: "#FFF7ED" },
    'community': { color: "#8B5CF6", bgColor: "#F5F3FF" },
    'employment': { color: "#10B981", bgColor: "#ECFDF5" },
    'assistance': { color: "#EF4444", bgColor: "#FEF2F2" },
    'marketplace': { color: "#F59E0B", bgColor: "#FFFBEB" },
    'delivery': { color: "#3B82F6", bgColor: "#EFF6FF" },
    'health': { color: "#EC4899", bgColor: "#FCE7F3" },
    'infrastructure': { color: "#6366F1", bgColor: "#EEF2FF" },
    'supply': { color: "#14B8A6", bgColor: "#F0FDFA" },
    'general': { color: "#6B7280", bgColor: "#F9FAFB" }
  };
  return colorMap[serviceType] || colorMap['general'];
};

const Services = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch services from database
  const { data: services, isLoading } = useQuery({
    queryKey: ['public-services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const filteredServices = services?.filter(service => 
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Community Services</h1>
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search services..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <p className="text-muted-foreground text-center">
            Access essential services provided by your barangay
          </p>
        </div>

        {/* Ad Space */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-dashed border-blue-200">
            <CardContent className="p-8 text-center">
              <div className="text-gray-500 text-lg font-medium mb-2">Advertisement Space</div>
              <div className="text-gray-400 text-sm">
                Your ads could be here • Contact us for advertising opportunities
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-4 lg:p-6">
                  <Skeleton className="w-10 h-10 lg:w-12 lg:h-12 rounded-full mb-3 lg:mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))
          ) : filteredServices.length > 0 ? (
            filteredServices.map((service) => {
              const ServiceIcon = getServiceIcon(service.service_type);
              const colors = getServiceColors(service.service_type);
              
              return (
                <Card 
                  key={service.id} 
                  className="overflow-hidden hover:shadow-md transition-shadow border-t-4"
                  style={{ borderTopColor: colors.color }}
                >
                  <CardContent className="p-4 lg:p-6">
                    <div 
                      className="w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center mb-3 lg:mb-4"
                      style={{ backgroundColor: colors.bgColor }}
                    >
                      <ServiceIcon style={{ color: colors.color }} className="h-5 w-5 lg:h-6 lg:w-6" />
                    </div>
                    <h3 className="text-lg lg:text-xl font-bold mb-2">{service.title}</h3>
                    <p className="text-muted-foreground text-sm lg:text-base">{service.description}</p>
                    {service.contact_info && Object.keys(service.contact_info).length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500">Contact available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <Settings className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">No Services Available</h3>
              <p className="text-gray-400">Services created by officials will appear here</p>
            </div>
          )}
        </div>

        {/* Bottom Ad Space */}
        <div className="mt-12">
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-dashed border-green-200">
            <CardContent className="p-6 text-center">
              <div className="text-gray-500 font-medium mb-1">Sponsored Content</div>
              <div className="text-gray-400 text-sm">
                Promote your business to the community
              </div>
            </CardContent>
          </Card>
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
