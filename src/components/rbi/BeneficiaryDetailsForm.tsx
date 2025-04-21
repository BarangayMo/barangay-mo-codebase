
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldCheck } from "lucide-react";

const BeneficiaryDetailsForm = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <ShieldCheck className="text-blue-600 w-6 h-6" />
        <h2 className="text-xl font-semibold">Beneficiary Programs</h2>
      </div>
      
      <div>
        <Label className="text-base mb-4 block">
          Are you a beneficiary of any of the following programs? 
          (Ikaw ba ay beneficiaries ng mga sumusunod?)
        </Label>
        
        <div className="space-y-3 mt-4">
          <div className="flex items-start space-x-2">
            <Checkbox id="4ps" />
            <div>
              <Label htmlFor="4ps" className="font-medium">4P's (Pantawid Pamilyang Pilipino Program)</Label>
              <p className="text-sm text-gray-500">Government's conditional cash transfer program</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox id="soloParent" />
            <div>
              <Label htmlFor="soloParent" className="font-medium">Solo Parent Program</Label>
              <p className="text-sm text-gray-500">Support program for single parents</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox id="pwd" />
            <div>
              <Label htmlFor="pwd" className="font-medium">PWD (Persons With Disability)</Label>
              <p className="text-sm text-gray-500">Support services for persons with disabilities</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox id="senior" />
            <div>
              <Label htmlFor="senior" className="font-medium">Senior Citizen Program</Label>
              <p className="text-sm text-gray-500">Benefits and privileges for senior citizens</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox id="none" />
            <div>
              <Label htmlFor="none" className="font-medium">None</Label>
              <p className="text-sm text-gray-500">Not a beneficiary of any program</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox id="other" />
            <div>
              <Label htmlFor="other" className="font-medium">Other</Label>
              <p className="text-sm text-gray-500">Please specify in the comments</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 italic">
            Note: Documentation may be required to verify eligibility for these programs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryDetailsForm;
