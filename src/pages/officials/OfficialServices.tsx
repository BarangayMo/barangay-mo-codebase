
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Users,
  Clock
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ServiceFormDialog } from "@/components/services/ServiceFormDialog";
import { DeleteServiceDialog } from "@/components/services/DeleteServiceDialog";

const OfficialServices = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: services, isLoading } = useQuery({
    queryKey: ['official-services', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data: officialProfile } = await supabase
        .from('profiles')
        .select('barangay')
        .eq('id', user.id)
        .single();

      if (!officialProfile?.barangay) return [];

      const { data: services, error } = await supabase
        .from('services')
        .select('*')
        .eq('barangay_id', officialProfile.barangay)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return services || [];
    },
    enabled: !!user?.id
  });

  const createServiceMutation = useMutation({
    mutationFn: async (serviceData: any) => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('barangay')
        .eq('id', user?.id)
        .single();

      if (!profile?.barangay) throw new Error("No barangay associated with user");

      const { error } = await supabase
        .from('services')
        .insert({
          ...serviceData,
          created_by: user?.id,
          barangay_id: profile.barangay
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['official-services'] });
      toast({
        title: "Success",
        description: "Service created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create service.",
        variant: "destructive",
      });
    }
  });

  const updateServiceMutation = useMutation({
    mutationFn: async ({ serviceId, serviceData }: { serviceId: string; serviceData: any }) => {
      const { error } = await supabase
        .from('services')
        .update(serviceData)
        .eq('id', serviceId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['official-services'] });
      toast({
        title: "Success",
        description: "Service updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update service.",
        variant: "destructive",
      });
    }
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (serviceId: string) => {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['official-services'] });
      toast({
        title: "Success",
        description: "Service deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete service.",
        variant: "destructive",
      });
    }
  });

  const toggleServiceMutation = useMutation({
    mutationFn: async ({ serviceId, isActive }: { serviceId: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('services')
        .update({ is_active: isActive })
        .eq('id', serviceId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['official-services'] });
      toast({
        title: "Service updated",
        description: "Service status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update service status.",
        variant: "destructive",
      });
    }
  });

  const handleEdit = (service: any) => {
    setSelectedService(service);
    setShowEditDialog(true);
  };

  const handleDelete = (service: any) => {
    setSelectedService(service);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (selectedService) {
      deleteServiceMutation.mutate(selectedService.id);
      setShowDeleteDialog(false);
      setSelectedService(null);
    }
  };

  const filteredServices = services?.filter(service => 
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto py-6 px-4">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-official mb-2">Community Services</h1>
            <p className="text-gray-600">Manage services for your barangay residents</p>
          </div>
          <Button 
            className="bg-official hover:bg-official-dark"
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search services..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {filteredServices.map((service) => (
            <Card key={service.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{service.title}</h3>
                      <Badge variant={service.is_active ? "default" : "secondary"}>
                        {service.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {service.service_type}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Created {format(new Date(service.created_at), 'MMM dd, yyyy')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Active</span>
                      <Switch
                        checked={service.is_active}
                        onCheckedChange={(checked) => 
                          toggleServiceMutation.mutate({ 
                            serviceId: service.id, 
                            isActive: checked 
                          })
                        }
                      />
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEdit(service)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(service)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredServices.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No services found</p>
                <Button 
                  className="mt-4 bg-official hover:bg-official-dark"
                  onClick={() => setShowCreateDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first service
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Dialogs */}
        <ServiceFormDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSubmit={createServiceMutation.mutateAsync}
          isLoading={createServiceMutation.isPending}
          mode="create"
        />

        <ServiceFormDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onSubmit={(data) => updateServiceMutation.mutateAsync({ 
            serviceId: selectedService?.id, 
            serviceData: data 
          })}
          initialData={selectedService}
          isLoading={updateServiceMutation.isPending}
          mode="edit"
        />

        <DeleteServiceDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={handleConfirmDelete}
          serviceName={selectedService?.title || ""}
          isLoading={deleteServiceMutation.isPending}
        />
      </div>
    </Layout>
  );
};

export default OfficialServices;
