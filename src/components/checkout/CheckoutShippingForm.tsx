
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CheckoutShippingFormProps {
  shippingCountry: string;
  shippingFirstName: string;
  setShippingFirstName: (name: string) => void;
  shippingLastName: string;
  setShippingLastName: (name: string) => void;
  shippingAddress: string;
  setShippingAddress: (address: string) => void;
  shippingApartment: string;
  setShippingApartment: (apartment: string) => void;
  shippingCity: string;
  setShippingCity: (city: string) => void;
  shippingState: string;
  setShippingState: (state: string) => void;
  shippingPostalCode: string;
  setShippingPostalCode: (code: string) => void;
  deliveryNotes: string;
  setDeliveryNotes: (notes: string) => void;
  useSavedAddress: boolean;
  handleUseSavedAddressChange: (checked: boolean) => void;
  isSavedAddressCheckboxDisabled: boolean;
  areAddressFieldsDisabled: boolean;
}

export const CheckoutShippingForm: React.FC<CheckoutShippingFormProps> = ({
  shippingCountry,
  shippingFirstName, setShippingFirstName,
  shippingLastName, setShippingLastName,
  shippingAddress, setShippingAddress,
  shippingApartment, setShippingApartment,
  shippingCity, setShippingCity,
  shippingState, setShippingState,
  shippingPostalCode, setShippingPostalCode,
  deliveryNotes, setDeliveryNotes,
  useSavedAddress, handleUseSavedAddressChange,
  isSavedAddressCheckboxDisabled,
  areAddressFieldsDisabled,
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-3">Delivery</h2>
      <div className="mt-3 mb-4 flex items-center">
        <Checkbox
          id="useSavedAddress"
          checked={useSavedAddress}
          onCheckedChange={handleUseSavedAddressChange}
          disabled={isSavedAddressCheckboxDisabled}
        />
        <Label htmlFor="useSavedAddress" className="ml-2 text-sm text-gray-600">Use my saved address</Label>
      </div>
      <div className="space-y-4">
        <Select value={shippingCountry} disabled>
          <SelectTrigger id="country">
            <SelectValue placeholder="Country/Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Philippines">Philippines</SelectItem>
          </SelectContent>
        </Select>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input id="firstName" placeholder="First name (optional)" value={shippingFirstName} onChange={e => setShippingFirstName(e.target.value)} disabled={areAddressFieldsDisabled} />
          <Input id="lastName" placeholder="Last name" value={shippingLastName} onChange={e => setShippingLastName(e.target.value)} required disabled={areAddressFieldsDisabled} />
        </div>
        <Input id="address" placeholder="Address" value={shippingAddress} onChange={e => setShippingAddress(e.target.value)} required disabled={areAddressFieldsDisabled} />
        <Input id="apartment" placeholder="Apartment, suite, etc. (optional)" value={shippingApartment} onChange={e => setShippingApartment(e.target.value)} disabled={areAddressFieldsDisabled} />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Input id="city" placeholder="City" className="sm:col-span-1 md:col-span-1" value={shippingCity} onChange={e => setShippingCity(e.target.value)} required disabled={areAddressFieldsDisabled} />
          <Select value={shippingState} onValueChange={setShippingState} disabled={areAddressFieldsDisabled}>
            <SelectTrigger id="state" className="sm:col-span-1 md:col-span-1">
              <SelectValue placeholder="State / Province" />
            </SelectTrigger>
            <SelectContent>
              {/* Minimal list, expand as needed or use dynamic data */}
              {shippingState && <SelectItem value={shippingState}>{shippingState}</SelectItem>}
              {shippingState !== "Metro Manila" && <SelectItem value="Metro Manila">Metro Manila</SelectItem>}
              <SelectItem value="Abra">Abra</SelectItem>
              <SelectItem value="Agusan del Norte">Agusan del Norte</SelectItem>
              {/* ... (include all other states from original file) ... */}
               <SelectItem value="Luzon">Luzon</SelectItem>
               <SelectItem value="Visayas">Visayas</SelectItem>
               <SelectItem value="Mindanao">Mindanao</SelectItem>
               <SelectItem value="Agusan del Sur">Agusan del Sur</SelectItem>
               <SelectItem value="Aklan">Aklan</SelectItem>
               <SelectItem value="Albay">Albay</SelectItem>
               <SelectItem value="Antique">Antique</SelectItem>
               <SelectItem value="Apayao">Apayao</SelectItem>
               <SelectItem value="Aurora">Aurora</SelectItem>
               <SelectItem value="Basilan">Basilan</SelectItem>
               <SelectItem value="Bataan">Bataan</SelectItem>
               <SelectItem value="Batanes">Batanes</SelectItem>
               <SelectItem value="Batangas">Batangas</SelectItem>
               <SelectItem value="Benguet">Benguet</SelectItem>
               <SelectItem value="Biliran">Biliran</SelectItem>
               <SelectItem value="Bohol">Bohol</SelectItem>
               <SelectItem value="Bukidnon">Bukidnon</SelectItem>
               <SelectItem value="Bulacan">Bulacan</SelectItem>
               <SelectItem value="Cagayan">Cagayan</SelectItem>
               <SelectItem value="Camarines Norte">Camarines Norte</SelectItem>
               <SelectItem value="Camarines Sur">Camarines Sur</SelectItem>
               <SelectItem value="Camiguin">Camiguin</SelectItem>
               <SelectItem value="Capiz">Capiz</SelectItem>
               <SelectItem value="Catanduanes">Catanduanes</SelectItem>
               <SelectItem value="Cavite">Cavite</SelectItem>
               <SelectItem value="Cebu">Cebu</SelectItem>
               <SelectItem value="Cotabato">Cotabato</SelectItem>
               <SelectItem value="Davao de Oro">Davao de Oro</SelectItem>
               <SelectItem value="Davao del Norte">Davao del Norte</SelectItem>
               <SelectItem value="Davao del Sur">Davao del Sur</SelectItem>
               <SelectItem value="Davao Occidental">Davao Occidental</SelectItem>
               <SelectItem value="Davao Oriental">Davao Oriental</SelectItem>
               <SelectItem value="Dinagat Islands">Dinagat Islands</SelectItem>
               <SelectItem value="Eastern Samar">Eastern Samar</SelectItem>
               <SelectItem value="Guimaras">Guimaras</SelectItem>
               <SelectItem value="Ifugao">Ifugao</SelectItem>
               <SelectItem value="Ilocos Norte">Ilocos Norte</SelectItem>
               <SelectItem value="Ilocos Sur">Ilocos Sur</SelectItem>
               <SelectItem value="Iloilo">Iloilo</SelectItem>
               <SelectItem value="Isabela">Isabela</SelectItem>
               <SelectItem value="Kalinga">Kalinga</SelectItem>
               <SelectItem value="La Union">La Union</SelectItem>
               <SelectItem value="Laguna">Laguna</SelectItem>
               <SelectItem value="Lanao del Norte">Lanao del Norte</SelectItem>
               <SelectItem value="Lanao del Sur">Lanao del Sur</SelectItem>
               <SelectItem value="Leyte">Leyte</SelectItem>
               <SelectItem value="Maguindanao del Norte">Maguindanao del Norte</SelectItem>
               <SelectItem value="Maguindanao del Sur">Maguindanao del Sur</SelectItem>
               <SelectItem value="Marinduque">Marinduque</SelectItem>
               <SelectItem value="Masbate">Masbate</SelectItem>
               <SelectItem value="Misamis Occidental">Misamis Occidental</SelectItem>
               <SelectItem value="Misamis Oriental">Misamis Oriental</SelectItem>
               <SelectItem value="Mountain Province">Mountain Province</SelectItem>
               <SelectItem value="Negros Occidental">Negros Occidental</SelectItem>
               <SelectItem value="Negros Oriental">Negros Oriental</SelectItem>
               <SelectItem value="Northern Samar">Northern Samar</SelectItem>
               <SelectItem value="Nueva Ecija">Nueva Ecija</SelectItem>
               <SelectItem value="Nueva Vizcaya">Nueva Vizcaya</SelectItem>
               <SelectItem value="Occidental Mindoro">Occidental Mindoro</SelectItem>
               <SelectItem value="Oriental Mindoro">Oriental Mindoro</SelectItem>
               <SelectItem value="Palawan">Palawan</SelectItem>
               <SelectItem value="Pampanga">Pampanga</SelectItem>
               <SelectItem value="Pangasinan">Pangasinan</SelectItem>
               <SelectItem value="Quezon">Quezon</SelectItem>
               <SelectItem value="Quirino">Quirino</SelectItem>
               <SelectItem value="Rizal">Rizal</SelectItem>
               <SelectItem value="Romblon">Romblon</SelectItem>
               <SelectItem value="Samar">Samar</SelectItem>
               <SelectItem value="Sarangani">Sarangani</SelectItem>
               <SelectItem value="Siquijor">Siquijor</SelectItem>
               <SelectItem value="Sorsogon">Sorsogon</SelectItem>
               <SelectItem value="South Cotabato">South Cotabato</SelectItem>
               <SelectItem value="Southern Leyte">Southern Leyte</SelectItem>
               <SelectItem value="Sultan Kudarat">Sultan Kudarat</SelectItem>
               <SelectItem value="Sulu">Sulu</SelectItem>
               <SelectItem value="Surigao del Norte">Surigao del Norte</SelectItem>
               <SelectItem value="Surigao del Sur">Surigao del Sur</SelectItem>
               <SelectItem value="Tarlac">Tarlac</SelectItem>
               <SelectItem value="Tawi-Tawi">Tawi-Tawi</SelectItem>
               <SelectItem value="Zambales">Zambales</SelectItem>
               <SelectItem value="Zamboanga del Norte">Zamboanga del Norte</SelectItem>
               <SelectItem value="Zamboanga del Sur">Zamboanga del Sur</SelectItem>
               <SelectItem value="Zamboanga Sibugay">Zamboanga Sibugay</SelectItem>
            </SelectContent>
          </Select>
          <Input id="postalCode" placeholder="Postal code (optional)" className="sm:col-span-2 md:col-span-1" value={shippingPostalCode} onChange={e => setShippingPostalCode(e.target.value)} disabled={areAddressFieldsDisabled} />
        </div>
        <Textarea id="deliveryNotes" placeholder="Delivery Notes (Optional)" value={deliveryNotes} onChange={e => setDeliveryNotes(e.target.value)} className="min-h-[80px]" />
      </div>
    </div>
  );
};
