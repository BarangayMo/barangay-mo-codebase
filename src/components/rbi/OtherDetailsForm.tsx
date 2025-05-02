
import { Calendar, Info } from "lucide-react";
import { FloatingInput } from "@/components/ui/floating-input";
import { FloatingSelect } from "@/components/ui/floating-select";
import { SelectItem } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const OtherDetailsForm = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Info className="text-blue-600 w-6 h-6" />
        <h2 className="text-xl font-semibold">Other Details</h2>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FloatingInput 
            id="dateOfBirth" 
            label="Date of Birth" 
            type="date" 
            placeholder=" " 
            icon={<Calendar className="text-gray-400 w-5 h-5" />}
          />
          
          <div className="space-y-2">
            <Label className="text-base">Sex</Label>
            <RadioGroup defaultValue="male" className="flex gap-4 pt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Female</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <FloatingInput 
          id="placeOfBirth" 
          label="Place of Birth" 
          placeholder="City, Province, Country" 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FloatingSelect 
            id="bloodType" 
            label="Blood Type"
          >
            <SelectItem value="A+">A+</SelectItem>
            <SelectItem value="A-">A-</SelectItem>
            <SelectItem value="B+">B+</SelectItem>
            <SelectItem value="B-">B-</SelectItem>
            <SelectItem value="AB+">AB+</SelectItem>
            <SelectItem value="AB-">AB-</SelectItem>
            <SelectItem value="O+">O+</SelectItem>
            <SelectItem value="O-">O-</SelectItem>
          </FloatingSelect>
          
          <FloatingInput 
            id="religion" 
            label="Religion" 
            placeholder=" " 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FloatingSelect 
            id="civilStatus" 
            label="Civil Status"
          >
            <SelectItem value="single">Single</SelectItem>
            <SelectItem value="married">Married</SelectItem>
            <SelectItem value="divorced">Divorced</SelectItem>
            <SelectItem value="widowed">Widowed</SelectItem>
            <SelectItem value="separated">Separated</SelectItem>
          </FloatingSelect>
          
          <FloatingInput 
            id="contactNumber" 
            label="Contact Number" 
            placeholder="+63 XXX XXX XXXX" 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FloatingInput 
            id="email" 
            label="Email Address" 
            type="email" 
            placeholder="your@email.com" 
          />
          
          <FloatingInput 
            id="nationality" 
            label="Nationality" 
            placeholder=" " 
            defaultValue="Filipino" 
          />
        </div>
        
        <FloatingInput 
          id="eyeColor" 
          label="Eye Color" 
          placeholder=" " 
        />
      </div>
    </div>
  );
};

export default OtherDetailsForm;
