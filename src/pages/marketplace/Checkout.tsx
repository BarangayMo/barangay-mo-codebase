import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { RoleButton } from "@/components/ui/role-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingBag, CreditCard, ArrowLeft } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from '@/lib/utils';
import { supabase } from "@/integrations/supabase/client";

// Define interfaces for cart items and location state
interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
}

interface CheckoutLocationState {
  cartItems: CartItem[];
  total: number;
  specialInstructions?: string;
}

interface SavedShippingDetails {
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  contactEmail: string;
}

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const { cartItems = [], total: subtotalFromCart = 0, specialInstructions = "" } = (location.state as CheckoutLocationState) || {};

  // State for originally fetched user address details
  const [savedShippingDetails, setSavedShippingDetails] = useState<SavedShippingDetails | null>(null);
  const [useSavedAddress, setUseSavedAddress] = useState(true);

  // Form state
  const [contactEmail, setContactEmail] = useState(user?.email || "");
  const [saveInfo, setSaveInfo] = useState(false);

  const [shippingCountry, setShippingCountry] = useState("Philippines"); // Default and disabled
  const [shippingFirstName, setShippingFirstName] = useState(user?.firstName || "");
  const [shippingLastName, setShippingLastName] = useState(user?.lastName || "");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingApartment, setShippingApartment] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingState, setShippingState] = useState("Metro Manila"); // Default state
  const [shippingPostalCode, setShippingPostalCode] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState(specialInstructions);
  
  const [billingAddressOption, setBillingAddressOption] = useState("same");
  const [paymentMethod, setPaymentMethod] = useState("paystack");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (user?.id) {
      const fetchUserSettings = async () => {
        const { data, error } = await supabase
          .from('user_settings')
          .select('address, phone_number')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching user settings:", error);
        } 
        
        const initialDetails: SavedShippingDetails = {
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            address: "",
            apartment: "",
            city: "",
            state: "Metro Manila", // Default, can be overridden by saved data
            postalCode: "",
            country: "Philippines",
            contactEmail: user.email || "",
        };
        let foundSavedAddress = false;

        if (data?.address && typeof data.address === 'object') {
          const addr = data.address as any;
          initialDetails.address = addr.street || "";
          initialDetails.apartment = addr.apartment || "";
          initialDetails.city = addr.city || "";
          initialDetails.state = addr.state || "Metro Manila";
          initialDetails.postalCode = addr.postalCode || "";
          initialDetails.country = addr.country || "Philippines";
          foundSavedAddress = true;
        }
        if (data?.phone_number && !initialDetails.contactEmail) { // Use phone if email not primary
             initialDetails.contactEmail = data.phone_number;
        }
        
        setSavedShippingDetails(initialDetails);

        if (foundSavedAddress) {
            setShippingFirstName(initialDetails.firstName);
            setShippingLastName(initialDetails.lastName);
            setShippingAddress(initialDetails.address);
            setShippingApartment(initialDetails.apartment);
            setShippingCity(initialDetails.city);
            setShippingState(initialDetails.state);
            setShippingPostalCode(initialDetails.postalCode);
            setContactEmail(initialDetails.contactEmail);
            setUseSavedAddress(true);
        } else {
            // No saved address, but still prefill names and email from user object
            setShippingFirstName(user.firstName || "");
            setShippingLastName(user.lastName || "");
            setContactEmail(user.email || "");
            setUseSavedAddress(false);
        }
      };
      fetchUserSettings();
    } else {
      setUseSavedAddress(false); // No user, not using saved address
    }
  }, [user]);

  const handleUseSavedAddressChange = (checked: boolean) => {
    setUseSavedAddress(checked);
    if (checked && savedShippingDetails) {
        // User wants to use saved address, populate form from savedShippingDetails
        setShippingFirstName(savedShippingDetails.firstName);
        setShippingLastName(savedShippingDetails.lastName);
        setShippingAddress(savedShippingDetails.address);
        setShippingApartment(savedShippingDetails.apartment);
        setShippingCity(savedShippingDetails.city);
        setShippingState(savedShippingDetails.state);
        setShippingPostalCode(savedShippingDetails.postalCode);
        setContactEmail(savedShippingDetails.contactEmail);
    } else {
        // User wants to enter a new address. Fields are now enabled.
        // Optionally clear them if you want a fresh start, e.g.:
        // setShippingFirstName(user?.firstName || ""); setShippingLastName(user?.lastName || ""); 
        // setShippingAddress(""); // etc.
        // For now, current values (possibly from user object if no saved address) remain for editing.
    }
  };

  const handleSaveInformation = async () => {
    if (!user || !user.id) return;

    const addressPayload = {
      street: shippingAddress,
      apartment: shippingApartment,
      city: shippingCity,
      state: shippingState,
      postalCode: shippingPostalCode,
      country: shippingCountry, // Will be "Philippines"
    };

    // Update profiles table for names
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ first_name: shippingFirstName, last_name: shippingLastName })
      .eq('id', user.id);

    if (profileError) {
      toast({ title: "Error", description: "Could not update name information.", variant: "destructive" });
    }
    
    let phonePayload = {};
    if (contactEmail && !contactEmail.includes('@')) { 
        phonePayload = { phone_number: contactEmail };
    } else if (contactEmail && contactEmail.includes('@') && user.email !== contactEmail) {
        // If user entered a new email in contact field, we are not updating auth.users.email here.
        // This example focuses on shipping contact which might be phone or existing email.
        // To update user.email, supabase.auth.updateUser({ email: contactEmail }) would be needed,
        // typically with verification. For simplicity, we assume contactEmail is either phone or matches user.email.
    }


    const { data: existingSettings, error: fetchError } = await supabase
        .from('user_settings')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();

    if (fetchError) {
        console.error("Error checking user_settings:", fetchError);
        toast({ title: "Error", description: "Could not save information.", variant: "destructive" });
        return;
    }

    let settingsError;
    if (existingSettings) {
        const { error } = await supabase
            .from('user_settings')
            .update({ address: addressPayload, ...phonePayload })
            .eq('user_id', user.id);
        settingsError = error;
    } else {
        const { error } = await supabase
            .from('user_settings')
            .insert({ user_id: user.id, address: addressPayload, ...phonePayload });
        settingsError = error;
    }

    if (settingsError) {
      toast({ title: "Error", description: "Could not save shipping information.", variant: "destructive" });
    } else {
      toast({ title: "Information Saved", description: "Your information has been saved for next time." });
      // Re-fetch or update savedShippingDetails if information was successfully saved
      const newSavedDetails: SavedShippingDetails = {
        firstName: shippingFirstName,
        lastName: shippingLastName,
        address: shippingAddress,
        apartment: shippingApartment,
        city: shippingCity,
        state: shippingState,
        postalCode: shippingPostalCode,
        country: shippingCountry,
        contactEmail: contactEmail,
      };
      setSavedShippingDetails(newSavedDetails);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
        toast({ title: "Authentication Error", description: "Please log in to proceed.", variant: "destructive" });
        navigate("/login", { state: { from: location } });
        return;
    }
    if (cartItems.length === 0) {
        toast({ title: "Empty Cart", description: "Your cart is empty.", variant: "default" });
        return;
    }
    
    // Basic validation for required fields if not using saved address
    if (!useSavedAddress) {
        if (!shippingLastName || !shippingAddress || !shippingCity || !shippingState) {
            toast({ title: "Missing Information", description: "Please fill in all required delivery fields.", variant: "destructive"});
            return;
        }
    }


    if (saveInfo) {
      await handleSaveInformation();
    }
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      navigate("/marketplace/order-confirmation", { state: { orderDetails: { cartItems, total: finalTotal, deliveryNotes, shippingAddress: {
        firstName: shippingFirstName, lastName: shippingLastName, address: shippingAddress, apartment: shippingApartment, city: shippingCity, state: shippingState, postalCode: shippingPostalCode, country: shippingCountry, contact: contactEmail
      }} } });
      toast({
        title: "Order placed successfully",
        description: "Thank you for your purchase!",
      });
    }, 1500);
  };

  const shippingCost = 0; 
  const taxRate = 0.075; 
  const estimatedTaxes = subtotalFromCart * taxRate;
  const finalTotal = subtotalFromCart + shippingCost + estimatedTaxes;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Custom Header */}
        <header className="py-4 px-6 md:px-12 lg:px-24 bg-white border-b">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link to="/marketplace" className="text-2xl font-bold tracking-tight text-gray-900">GYBLOOM</Link>
            <Link to="/marketplace/cart" className="relative">
              <ShoppingBag className="h-6 w-6 text-gray-500 hover:text-gray-700" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
        </header>

        <main className="py-8 px-4 md:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto grid md:grid-cols-[2fr_1fr] gap-8 lg:gap-12">
            {/* Left Column: Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
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
                  onChange={(e) => setContactEmail(e.target.value)}
                  required 
                  disabled={useSavedAddress && !!savedShippingDetails?.contactEmail} // Disable if using saved address with contact info
                />
                 <div className="mt-3 flex items-center">
                  <Checkbox 
                    id="saveInfo" 
                    checked={saveInfo}
                    onCheckedChange={(checked) => setSaveInfo(checked as boolean)}
                  />
                  <Label htmlFor="saveInfo" className="ml-2 text-sm text-gray-600">Save this information for next time</Label>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Delivery</h2>
                <div className="mt-3 mb-4 flex items-center">
                  <Checkbox
                    id="useSavedAddress"
                    checked={useSavedAddress}
                    onCheckedChange={handleUseSavedAddressChange}
                    disabled={!savedShippingDetails && !user?.id} // Disable if no saved details to use and not logged in
                  />
                  <Label htmlFor="useSavedAddress" className="ml-2 text-sm text-gray-600">Use my saved address</Label>
                </div>
                <div className="space-y-4">
                  <Select value={shippingCountry} onValueChange={setShippingCountry} disabled>
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Country/Region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Philippines">Philippines</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input id="firstName" placeholder="First name (optional)" value={shippingFirstName} onChange={e => setShippingFirstName(e.target.value)} disabled={useSavedAddress} />
                    <Input id="lastName" placeholder="Last name" value={shippingLastName} onChange={e => setShippingLastName(e.target.value)} required disabled={useSavedAddress} />
                  </div>
                  <Input id="address" placeholder="Address" value={shippingAddress} onChange={e => setShippingAddress(e.target.value)} required disabled={useSavedAddress} />
                  <Input id="apartment" placeholder="Apartment, suite, etc. (optional)" value={shippingApartment} onChange={e => setShippingApartment(e.target.value)} disabled={useSavedAddress} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <Input id="city" placeholder="City" className="sm:col-span-1 md:col-span-1" value={shippingCity} onChange={e => setShippingCity(e.target.value)} required disabled={useSavedAddress} />
                    <Select value={shippingState} onValueChange={setShippingState} disabled={useSavedAddress}>
                      <SelectTrigger id="state" className="sm:col-span-1 md:col-span-1">
                        <SelectValue placeholder="State / Province" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Dynamically include current state and some defaults */}
                        {shippingState && <SelectItem value={shippingState}>{shippingState}</SelectItem>}
                        {shippingState !== "Metro Manila" && <SelectItem value="Metro Manila">Metro Manila</SelectItem>}
                        {shippingState !== "Luzon" && <SelectItem value="Luzon">Luzon</SelectItem>}
                        {shippingState !== "Visayas" && <SelectItem value="Visayas">Visayas</SelectItem>}
                        {shippingState !== "Mindanao" && <SelectItem value="Mindanao">Mindanao</SelectItem>}
                        {/* Add more Philippine states/regions or a comprehensive list */}
                        <SelectItem value="Abra">Abra</SelectItem>
                        <SelectItem value="Agusan del Norte">Agusan del Norte</SelectItem>
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
                    <Input id="postalCode" placeholder="Postal code (optional)" className="sm:col-span-2 md:col-span-1" value={shippingPostalCode} onChange={e => setShippingPostalCode(e.target.value)} disabled={useSavedAddress} />
                  </div>
                  <Textarea 
                    id="deliveryNotes" 
                    placeholder="Delivery Notes (Optional)" 
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Shipping method</h2>
                <div className="border rounded-md p-4 flex justify-between items-center bg-white">
                  <span className="text-sm">Standard</span>
                  <span className="text-sm font-medium">FREE</span>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Payment</h2>
                <p className="text-xs text-gray-500 mb-2">All transactions are secure and encrypted.</p>
                <div className="border rounded-md bg-white">
                    <div className="p-4 border-b flex justify-between items-center">
                        <span className="font-medium">Paystack</span>
                        <div className="flex items-center space-x-1">
                            <CreditCard className="h-5 w-5 text-yellow-500" />
                            <span className="text-xs">VISA</span>
                            <CreditCard className="h-5 w-5 text-blue-600" />
                            <span className="text-xs">Mastercard</span>
                            <span className="text-xs border px-1 rounded-sm">+3</span>
                        </div>
                    </div>
                    <div className="p-6 text-center bg-gray-50 rounded-b-md">
                        <svg className="mx-auto h-12 w-auto text-gray-400 mb-3" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <rect width="48" height="30" rx="3" fill="#E5E7EB"/>
                            <path d="M0 8C0 5.23858 2.23858 3 5 3H43C45.7614 3 48 5.23858 48 8V12H0V8Z" fill="#D1D5DB"/>
                            <circle cx="6" cy="7" r="1.5" fill="#fff"/>
                            <circle cx="10" cy="7" r="1.5" fill="#fff"/>
                            <circle cx="14" cy="7" r="1.5" fill="#fff"/>
                            <path d="M30 20L38 20M34 16V24" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <p className="text-xs text-gray-500">After clicking "Pay now", you will be redirected to Paystack to complete your purchase securely.</p>
                    </div>
                </div>
              </div>

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

              <RoleButton 
                type="submit" 
                size="lg"
                className="w-full mt-6 text-lg py-3 h-auto" 
                disabled={isProcessing || cartItems.length === 0}
              >
                {isProcessing ? "Processing..." : "Pay now"}
              </RoleButton>
            </form>

            {/* Right Column: Order Summary - md:sticky ensures it sticks on medium screens and up */}
            <div className="bg-white md:bg-gray-100 p-4 md:p-6 rounded-lg md:border h-fit md:sticky md:top-24">
              {/* ... keep existing code (Order Summary content: cart items, subtotal, shipping, taxes, total) */}
              <div className="space-y-3">
                {cartItems.length === 0 && (
                  <p className="text-gray-600 text-sm">Your cart is empty. Add items to proceed.</p>
                )}
                {cartItems.map(item => (
                  <div key={item.product_id} className="flex items-center gap-4 pb-3 border-b last:border-b-0">
                    <div className="relative">
                      <img 
                        src={item.image || DEFAULT_PRODUCT_IMAGE} 
                        alt={item.name} 
                        className="w-16 h-16 object-cover rounded-md border"
                        onError={(e) => (e.currentTarget.src = DEFAULT_PRODUCT_IMAGE)}
                      />
                      <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{item.quantity}</span>
                    </div>
                    <div className="flex-1 min-w-0"> {/* Added min-w-0 for better truncation if needed */}
                      <h3 className="text-sm font-medium text-gray-800 truncate">{item.name}</h3>
                    </div>
                    <span className="text-sm font-medium text-gray-800">{formatCurrency(item.price * item.quantity, 'NGN')}</span>
                  </div>
                ))}
              </div>

              {cartItems.length > 0 && (
                <>
                  <div className="space-y-2 pt-6 border-t mt-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium text-gray-800">{formatCurrency(subtotalFromCart, 'NGN')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium text-green-600">FREE</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Estimated taxes (7.5%)</span>
                      <span className="font-medium text-gray-800">{formatCurrency(estimatedTaxes, 'NGN')}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-lg font-semibold pt-4 border-t mt-4">
                    <span className="text-gray-800">Total</span>
                    <div className="flex items-baseline">
                      <span className="text-xs text-gray-500 mr-1">NGN</span>
                      <span className="text-gray-900">{formatCurrency(finalTotal, 'NGN').replace('NGN','').trim()}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>

        {/* Custom Footer */}
        <footer className="py-8 px-6 md:px-12 lg:px-24 mt-12 border-t bg-gray-50">
          <div className="max-w-7xl mx-auto flex flex-wrap gap-x-6 gap-y-2 justify-center text-xs text-gray-500">
            <Link to="#" className="hover:text-primary">Refund policy</Link>
            <Link to="#" className="hover:text-primary">Privacy policy</Link>
            <Link to="#" className="hover:text-primary">Terms of service</Link>
            <Link to="#" className="hover:text-primary">Contact information</Link>
          </div>
        </footer>
      </div>
    </Layout>
  );
}
