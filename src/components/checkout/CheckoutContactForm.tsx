
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface CheckoutContactFormProps {
  contactEmail: string;
  setContactEmail: (email: string) => void;
  saveInfo: boolean;
  setSaveInfo: (save: boolean) => void;
  isEmailDisabled: boolean;
}

export const CheckoutContactForm: React.FC<CheckoutContactFormProps> = ({
  contactEmail,
  setContactEmail,
  saveInfo,
  setSaveInfo,
  isEmailDisabled,
}) => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold text-gray-800">Contact</h2>
        {!isAuthenticated && <Link to="/login" className="text-sm text-primary hover:underline">Log in</Link>}
        {isAuthenticated && user?.email && <span className="text-sm text-gray-600">{user.email}</span>}
      </div>
      <Input
        id="contactEmail"
        placeholder="Email or mobile phone number"
        value={contactEmail}
        onChange={e => setContactEmail(e.target.value)}
        required
        disabled={isEmailDisabled}
      />
      <div className="mt-3 flex items-center">
        <Checkbox
          id="saveInfo"
          checked={saveInfo}
          onCheckedChange={checked => setSaveInfo(checked as boolean)}
        />
        <Label htmlFor="saveInfo" className="ml-2 text-sm text-gray-600">Save this information for next time</Label>
      </div>
    </div>
  );
};
