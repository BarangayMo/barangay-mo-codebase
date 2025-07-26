import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrayInput } from "@/components/ui/array-input";
import { useToast } from "@/hooks/use-toast";

interface ServiceFormData {
  title: string;
  description: string;
  service_type: string;
  is_active: boolean;
  requirements: string[];
  contact_info: {
    phone?: string;
    email?: string;
    office_hours?: string;
  };
}

interface ServiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ServiceFormData) => Promise<void>;
  initialData?: Partial<ServiceFormData>;
  isLoading?: boolean;
  mode: 'create' | 'edit';
}

export const ServiceFormDialog = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading = false,
  mode
}: ServiceFormDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ServiceFormData>({
    title: "",
    description: "",
    service_type: "general",
    is_active: true,
    requirements: [],
    contact_info: {}
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        service_type: initialData.service_type || "general",
        is_active: initialData.is_active ?? true,
        requirements: initialData.requirements || [],
        contact_info: initialData.contact_info || {}
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Service title is required",
        variant: "destructive"
      });
      return;
    }

    try {
      await onSubmit(formData);
      onOpenChange(false);
      // Reset form
      setFormData({
        title: "",
        description: "",
        service_type: "general",
        is_active: true,
        requirements: [],
        contact_info: {}
      });
    } catch (error) {
      console.error("Error submitting service:", error);
    }
  };

  const serviceTypes = [
    { value: "general", label: "General Service" },
    { value: "health", label: "Health Service" },
    { value: "education", label: "Education Service" },
    { value: "security", label: "Security Service" },
    { value: "infrastructure", label: "Infrastructure Service" },
    { value: "social", label: "Social Service" },
    { value: "emergency", label: "Emergency Service" }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create New Service' : 'Edit Service'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Service Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter service title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="service_type">Service Type</Label>
              <Select
                value={formData.service_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, service_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the service and how residents can access it"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Requirements</Label>
            <ArrayInput
              values={formData.requirements}
              onChange={(requirements) => setFormData(prev => ({ ...prev, requirements }))}
              placeholder="Add requirement (e.g., Valid ID, Proof of residency)"
            />
          </div>

          <div className="space-y-4">
            <Label className="text-base font-medium">Contact Information</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.contact_info.phone || ""}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    contact_info: { ...prev.contact_info, phone: e.target.value }
                  }))}
                  placeholder="Contact phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.contact_info.email || ""}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    contact_info: { ...prev.contact_info, email: e.target.value }
                  }))}
                  placeholder="Contact email"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="office_hours">Office Hours</Label>
                <Input
                  id="office_hours"
                  value={formData.contact_info.office_hours || ""}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    contact_info: { ...prev.contact_info, office_hours: e.target.value }
                  }))}
                  placeholder="e.g., Monday-Friday 8AM-5PM"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
            />
            <Label htmlFor="is_active">Service is active</Label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-official hover:bg-official-dark"
            >
              {isLoading ? "Saving..." : mode === 'create' ? "Create Service" : "Update Service"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};