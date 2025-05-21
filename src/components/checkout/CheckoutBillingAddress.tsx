
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface CheckoutBillingAddressProps {
  billingAddressOption: string;
  setBillingAddressOption: (option: string) => void;
}

export const CheckoutBillingAddress: React.FC<CheckoutBillingAddressProps> = ({
  billingAddressOption,
  setBillingAddressOption,
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-3">Billing address</h2>
      <RadioGroup value={billingAddressOption} onValueChange={setBillingAddressOption} className="space-y-3">
        <Label htmlFor="sameAddress" className="flex items-center p-4 border rounded-md cursor-pointer bg-white hover:border-primary has-[:checked]:border-primary has-[:checked]:ring-1 has-[:checked]:ring-primary">
          <RadioGroupItem value="same" id="sameAddress" className="mr-3" />
          Same as shipping address
        </Label>
        <Label htmlFor="differentAddress" className="flex items-center p-4 border rounded-md cursor-pointer bg-white hover:border-primary has-[:checked]:border-primary has-[:checked]:ring-1 has-[:checked]:ring-primary">
          <RadioGroupItem value="different" id="differentAddress" className="mr-3" />
          Use a different billing address
        </Label>
      </RadioGroup>
      {/* TODO: Add form for different billing address if selected */}
    </div>
  );
};
