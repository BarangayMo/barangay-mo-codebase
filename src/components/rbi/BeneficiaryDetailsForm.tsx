
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldCheck } from "lucide-react";

const BeneficiaryDetailsForm = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <ShieldCheck className="text-blue-600 w-6 h-6" />
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Beneficiary Programs</h2>
          <p className="text-sm text-gray-500 mt-1">
            Government assistance programs you may be enrolled in
          </p>
        </div>
      </div>
      
      <div>
        <Label className="text-gray-700 font-medium mb-4 block">
          Are you a beneficiary of any of the following programs? 
          (Ikaw ba ay beneficiaries ng mga sumusunod?)
        </Label>
        
        <div className="space-y-4 mt-4">
          <div className="flex items-start space-x-3 bg-blue-50 p-3 rounded-lg">
            <Checkbox id="4ps" className="h-5 w-5 mt-0.5 text-blue-600 border-blue-300" />
            <div>
              <Label htmlFor="4ps" className="font-medium text-gray-700">4P's (Pantawid Pamilyang Pilipino Program)</Label>
              <p className="text-sm text-gray-500">Government's conditional cash transfer program</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 bg-blue-50 p-3 rounded-lg">
            <Checkbox id="soloParent" className="h-5 w-5 mt-0.5 text-blue-600 border-blue-300" />
            <div>
              <Label htmlFor="soloParent" className="font-medium text-gray-700">Solo Parent Program</Label>
              <p className="text-sm text-gray-500">Support program for single parents</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 bg-blue-50 p-3 rounded-lg">
            <Checkbox id="pwd" className="h-5 w-5 mt-0.5 text-blue-600 border-blue-300" />
            <div>
              <Label htmlFor="pwd" className="font-medium text-gray-700">PWD (Persons With Disability)</Label>
              <p className="text-sm text-gray-500">Support services for persons with disabilities</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 bg-blue-50 p-3 rounded-lg">
            <Checkbox id="senior" className="h-5 w-5 mt-0.5 text-blue-600 border-blue-300" />
            <div>
              <Label htmlFor="senior" className="font-medium text-gray-700">Senior Citizen Program</Label>
              <p className="text-sm text-gray-500">Benefits and privileges for senior citizens</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 bg-blue-50 p-3 rounded-lg">
            <Checkbox id="none" className="h-5 w-5 mt-0.5 text-blue-600 border-blue-300" />
            <div>
              <Label htmlFor="none" className="font-medium text-gray-700">None</Label>
              <p className="text-sm text-gray-500">Not a beneficiary of any program</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 bg-blue-50 p-3 rounded-lg">
            <Checkbox id="other" className="h-5 w-5 mt-0.5 text-blue-600 border-blue-300" />
            <div>
              <Label htmlFor="other" className="font-medium text-gray-700">Other</Label>
              <p className="text-sm text-gray-500">Please specify in the comments</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-blue-700 italic bg-blue-50 p-3 rounded-lg">
            Note: Documentation may be required to verify eligibility for these programs.
            Please prepare necessary certificates or IDs for verification purposes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryDetailsForm;
