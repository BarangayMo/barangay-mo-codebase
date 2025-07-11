
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserCheck, UserX, Mail, Phone, MapPin } from "lucide-react";
import { OfficialDetailsModal } from "@/components/officials/OfficialDetailsModal";

interface Official {
  id: string;
  first_name: string | null;
  last_name: string | null;
  middle_name: string | null;
  email: string | null;
  phone_number: string | null;
  barangay: string | null;
  municipality: string | null;
  province: string | null;
  region: string | null;
  status: string | null;
  role: string | null;
  officials_data: any;
  created_at: string | null;
  last_login: string | null;
}

export default function OfficialsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOfficial, setSelectedOfficial] = useState<Official | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: officials, isLoading } = useQuery({
    queryKey: ['officials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'official')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Official[];
    },
  });

  const filteredOfficials = officials?.filter(official => {
    const fullName = `${official.first_name || ''} ${official.last_name || ''}`.toLowerCase();
    const barangay = (official.barangay || '').toLowerCase();
    const municipality = (official.municipality || '').toLowerCase();
    
    return fullName.includes(searchTerm.toLowerCase()) ||
           barangay.includes(searchTerm.toLowerCase()) ||
           municipality.includes(searchTerm.toLowerCase());
  }) || [];

  const activeOfficials = filteredOfficials.filter(official => 
    official.status === 'active' || official.status === null
  );

  const inactiveOfficials = filteredOfficials.filter(official => 
    official.status === 'inactive'
  );

  const handleViewDetails = (official: Official) => {
    setSelectedOfficial(official);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status: string | null) => {
    if (status === 'active' || status === null) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
    }
    return <Badge variant="secondary" className="bg-red-100 text-red-800">Inactive</Badge>;
  };

  const renderOfficialCard = (official: Official) => (
    <Card key={official.id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">
              {official.first_name} {official.middle_name} {official.last_name}
            </CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" />
              {official.barangay}, {official.municipality}
            </CardDescription>
          </div>
          {getStatusBadge(official.status)}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 text-sm text-gray-600">
          {official.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>{official.email}</span>
            </div>
          )}
          {official.phone_number && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{official.phone_number}</span>
            </div>
          )}
          {official.last_login && (
            <p className="text-xs text-gray-500">
              Last login: {new Date(official.last_login).toLocaleDateString()}
            </p>
          )}
        </div>
        <div className="mt-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleViewDetails(official)}
            className="w-full"
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading officials...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Officials Management</h1>
        <p className="text-gray-600">Manage and view all barangay officials in the system.</p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by name, barangay, or municipality..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Active Officials ({activeOfficials.length})
          </TabsTrigger>
          <TabsTrigger value="inactive" className="flex items-center gap-2">
            <UserX className="h-4 w-4" />
            Inactive Officials ({inactiveOfficials.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          {activeOfficials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeOfficials.map(renderOfficialCard)}
            </div>
          ) : (
            <div className="text-center py-12">
              <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Officials Found</h3>
              <p className="text-gray-600">
                {searchTerm ? "No officials match your search criteria." : "There are no active officials in the system."}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="inactive" className="mt-6">
          {inactiveOfficials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inactiveOfficials.map(renderOfficialCard)}
            </div>
          ) : (
            <div className="text-center py-12">
              <UserX className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Inactive Officials Found</h3>
              <p className="text-gray-600">
                {searchTerm ? "No inactive officials match your search criteria." : "There are no inactive officials in the system."}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <OfficialDetailsModal
        official={selectedOfficial}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOfficial(null);
        }}
      />
    </div>
  );
}
