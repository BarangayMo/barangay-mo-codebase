
import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { RoleButton } from "@/components/ui/role-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingBag, CreditCard, ArrowLeft } from "lucide-react"; // Added ShoppingBag, ArrowLeft
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

const DEFAULT_PRODUCT_IMAGE = "/lovable-uploads/fde1e978-0d35-49ec-9f4b-1f03b096b981.png"; // Default image

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const { cartItems = [], total: subtotalFromCart = 0, specialInstructions = "" } = (location.state as CheckoutLocationState) || {};

  // Form state
  const [contactEmail, setContactEmail] = useState(user?.email || "");
  const [saveInfo, setSaveInfo] = useState(false);

  const [shippingCountry, setShippingCountry] = useState("Nigeria");
  const [shippingFirstName, setShippingFirstName] = useState(user?.firstName || "");
  const [shippingLastName, setShippingLastName] = useState(user?.lastName || "");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingApartment, setShippingApartment] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingState, setShippingState] = useState("Lagos");
  const [shippingPostalCode, setShippingPostalCode] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState(specialInstructions);
  
  const [billingAddressOption, setBillingAddressOption] = useState("same"); // "same" or "different"

  // Payment state (mock)
  const [paymentMethod, setPaymentMethod] = useState("paystack"); // Default to paystack
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch user address details on mount
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
        } else if (data) {
          if (data.address && typeof data.address === 'object') {
            const addr = data.address as any;
            setShippingAddress(addr.street || "");
            setShippingApartment(addr.apartment || "");
            setShippingCity(addr.city || "");
            setShippingState(addr.state || "Lagos");
            setShippingPostalCode(addr.postalCode || "");
            setShippingCountry(addr.country || "Nigeria");
          }
          // Assuming contactEmail is for email, phone_number for contact field if it's phone
          // For simplicity, if user.email is not set, we can try to use phone_number if available for contact
          if (!contactEmail && data.phone_number) {
            setContactEmail(data.phone_number);
          }
        }
      };
      fetchUserSettings();
      if (user.firstName) setShippingFirstName(user.firstName);
      if (user.lastName) setShippingLastName(user.lastName);
      if (user.email) setContactEmail(user.email);
    }
  }, [user]);


  const handleSaveInformation = async () => {
    if (!user || !user.id) return;

    const addressPayload = {
      street: shippingAddress,
      apartment: shippingApartment,
      city: shippingCity,
      state: shippingState,
      postalCode: shippingPostalCode,
      country: shippingCountry,
    };

    // Update profiles table for names
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ first_name: shippingFirstName, last_name: shippingLastName })
      .eq('id', user.id);

    if (profileError) {
      toast({ title: "Error", description: "Could not update name information.", variant: "destructive" });
      // Continue with address saving
    }
    
    // Update user_settings for address
    // Check if contactEmail is an email or phone to decide where to save
    let phonePayload = {};
    if (contactEmail && !contactEmail.includes('@')) { // Basic check for phone
        phonePayload = { phone_number: contactEmail };
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
        // Create if not exists - though AuthProvider usually creates a profile, user_settings might not exist
        const { error } = await supabase
            .from('user_settings')
            .insert({ user_id: user.id, address: addressPayload, ...phonePayload });
        settingsError = error;
    }

    if (settingsError) {
      toast({ title: "Error", description: "Could not save shipping information.", variant: "destructive" });
    } else {
      toast({ title: "Information Saved", description: "Your information has been saved for next time." });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  const shippingCost = 0; // "FREE"
  const taxRate = 0.075; // Example tax rate 7.5%
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
                <div className="space-y-4">
                  <Select value={shippingCountry} onValueChange={setShippingCountry}>
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Country/Region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nigeria">Nigeria</SelectItem>
                      {/* Add other countries as needed */}
                    </SelectContent>
                  </Select>
                  <div className="grid grid-cols-2 gap-4">
                    <Input id="firstName" placeholder="First name (optional)" value={shippingFirstName} onChange={e => setShippingFirstName(e.target.value)} />
                    <Input id="lastName" placeholder="Last name" value={shippingLastName} onChange={e => setShippingLastName(e.target.value)} required />
                  </div>
                  <Input id="address" placeholder="Address" value={shippingAddress} onChange={e => setShippingAddress(e.target.value)} required />
                  <Input id="apartment" placeholder="Apartment, suite, etc. (optional)" value={shippingApartment} onChange={e => setShippingApartment(e.target.value)} />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input id="city" placeholder="City" className="md:col-span-1" value={shippingCity} onChange={e => setShippingCity(e.target.value)} required />
                    <Select value={shippingState} onValueChange={setShippingState}>
                      <SelectTrigger id="state" className="md:col-span-1">
                        <SelectValue placeholder="State" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Lagos">Lagos</SelectItem>
                        {/* Add other states as needed */}
                      </SelectContent>
                    </Select>
                    <Input id="postalCode" placeholder="Postal code (optional)" className="md:col-span-1" value={shippingPostalCode} onChange={e => setShippingPostalCode(e.target.value)} />
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
                             {/* Placeholder for other icons/text */}
                            <span className="text-xs border px-1 rounded-sm">+3</span>
                        </div>
                    </div>
                    <div className="p-6 text-center bg-gray-50 rounded-b-md">
                        {/* Simplified placeholder for Paystack redirection visual */}
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

            {/* Right Column: Order Summary */}
            <div className="bg-white md:bg-gray-100 p-0 md:p-6 rounded-lg md:border h-fit md:sticky md:top-24">
              <div className="space-y-3">
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
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-800">{item.name}</h3>
                      {/* Assuming Gold is a variant or detail, not present in CartItem directly */}
                      {/* <p className="text-xs text-gray-500">Gold</p> */}
                    </div>
                    <span className="text-sm font-medium text-gray-800">{formatCurrency(item.price * item.quantity, 'NGN')}</span>
                  </div>
                ))}
              </div>

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
                  <span className="text-gray-600">Estimated taxes</span>
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

