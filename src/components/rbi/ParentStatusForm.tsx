import { Users } from "lucide-react";
import { FloatingSelect } from "@/components/ui/floating-select";
import { SelectItem } from "@/components/ui/select";
import { RbiFormComponentProps } from "@/types/rbi";

const ParentStatusForm = ({ formData, setFormData, errors, setErrors }: RbiFormComponentProps) => {
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, parentDetails: { ...prev.parentDetails, [field]: value } }));
    // Clear error when user selects
    if (errors?.parentDetails?.[field]) {
      setErrors(prev => ({
        ...prev,
        parentDetails: { ...prev.parentDetails, [field]: null }
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Users className="text-primary w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Parent Status</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Information about your parents' marital status
          </p>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="bg-muted/50 p-6 rounded-lg">
          <FloatingSelect 
            id="parentStatus" 
            label="Parent Status"
            className="focus-visible:ring-primary"
            value={formData?.parentDetails?.parentStatus || ""}
            onValueChange={(value) => handleChange("parentStatus", value)}
            error={errors?.parentDetails?.parentStatus}
          >
            <SelectItem value="married">Married</SelectItem>
            <SelectItem value="separated">Separated</SelectItem>
            <SelectItem value="divorced">Divorced</SelectItem>
            <SelectItem value="widowed">Widowed</SelectItem>
            <SelectItem value="single">Single Parent</SelectItem>
            <SelectItem value="unknown">Unknown</SelectItem>
          </FloatingSelect>
        </div>
      </div>
    </div>
  );
};

export default ParentStatusForm;