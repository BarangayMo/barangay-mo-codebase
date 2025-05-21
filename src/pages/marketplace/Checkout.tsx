import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { RoleButton } from "@/components/ui/role-button";
import { ShoppingBag } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { CheckoutContactForm } from "@/components/checkout/CheckoutContactForm";
import { CheckoutShippingForm } from "@/components/checkout/CheckoutShippingForm";
import { CheckoutPaymentInfo } from "@/components/checkout/CheckoutPaymentInfo";
import { CheckoutBillingAddress } from "@/components/checkout/CheckoutBillingAddress";
import { CheckoutOrderSummary } from "@/components/checkout/CheckoutOrderSummary";

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
  const {
    toast
  } = useToast();
  const {
    user,
    isAuthenticated
  } = useAuth();
  const {
    cartItems = [],
    total: subtotalFromCart = 0,
    specialInstructions = ""
  } = location.state as CheckoutLocationState || {};

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
        const {
          data,
          error
        } = await supabase.from('user_settings').select('address, phone_number').eq('user_id', user.id).maybeSingle();
        if (error) {
          console.error("Error fetching user settings:", error);
        }
        const initialDetails: SavedShippingDetails = {
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          address: "",
          apartment: "",
          city: "",
          state: "Metro Manila",
          // Default, can be overridden by saved data
          postalCode: "",
          country: "Philippines",
          contactEmail: user.email || ""
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
        if (data?.phone_number && !initialDetails.contactEmail) {
          // Use phone if email not primary
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
      country: shippingCountry // Will be "Philippines"
    };

    // Update profiles table for names
    const {
      error: profileError
    } = await supabase.from('profiles').update({
      first_name: shippingFirstName,
      last_name: shippingLastName
    }).eq('id', user.id);
    if (profileError) {
      toast({
        title: "Error",
        description: "Could not update name information.",
        variant: "destructive"
      });
    }
    let phonePayload = {};
    if (contactEmail && !contactEmail.includes('@')) {
      phonePayload = {
        phone_number: contactEmail
      };
    } else if (contactEmail && contactEmail.includes('@') && user.email !== contactEmail) {
      // If user entered a new email in contact field, we are not updating auth.users.email here.
      // This example focuses on shipping contact which might be phone or existing email.
      // To update user.email, supabase.auth.updateUser({ email: contactEmail }) would be needed,
      // typically with verification. For simplicity, we assume contactEmail is either phone or matches user.email.
    }
    const {
      data: existingSettings,
      error: fetchError
    } = await supabase.from('user_settings').select('user_id').eq('user_id', user.id).maybeSingle();
    if (fetchError) {
      console.error("Error checking user_settings:", fetchError);
      toast({
        title: "Error",
        description: "Could not save information.",
        variant: "destructive"
      });
      return;
    }
    let settingsError;
    if (existingSettings) {
      const {
        error
      } = await supabase.from('user_settings').update({
        address: addressPayload,
        ...phonePayload
      }).eq('user_id', user.id);
      settingsError = error;
    } else {
      const {
        error
      } = await supabase.from('user_settings').insert({
        user_id: user.id,
        address: addressPayload,
        ...phonePayload
      });
      settingsError = error;
    }
    if (settingsError) {
      toast({
        title: "Error",
        description: "Could not save shipping information.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Information Saved",
        description: "Your information has been saved for next time."
      });
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
        contactEmail: contactEmail
      };
      setSavedShippingDetails(newSavedDetails);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Error",
        description: "Please log in to proceed.",
        variant: "destructive"
      });
      navigate("/login", {
        state: {
          from: location
        }
      });
      return;
    }
    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty.",
        variant: "default"
      });
      return;
    }

    // Basic validation for required fields if not using saved address
    if (!useSavedAddress) { // Only validate if user is NOT using a saved address (i.e., fields are enabled)
        // Check if any of the required fields that are NOT disabled are empty
        if (!shippingLastName || !shippingAddress || !shippingCity || !shippingState ) {
            toast({
                title: "Missing Information",
                description: "Please fill in all required delivery fields.",
                variant: "destructive"
            });
            return;
        }
    } // If useSavedAddress is true, we assume saved details are sufficient or user is aware.

    if (saveInfo) {
      await handleSaveInformation();
    }
    setIsProcessing(true);

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      navigate("/marketplace/order-confirmation", {
        state: {
          orderDetails: {
            cartItems,
            total: finalTotal,
            deliveryNotes,
            shippingAddress: {
              firstName: shippingFirstName,
              lastName: shippingLastName,
              address: shippingAddress,
              apartment: shippingApartment,
              city: shippingCity,
              state: shippingState,
              postalCode: shippingPostalCode,
              country: shippingCountry,
              contact: contactEmail
            }
          }
        }
      });
      toast({
        title: "Order placed successfully",
        description: "Thank you for your purchase!"
      });
    }, 1500);
  };
  const shippingCost = 0;
  const taxRate = 0.075;
  const estimatedTaxes = subtotalFromCart * taxRate;
  const finalTotal = subtotalFromCart + shippingCost + estimatedTaxes;
  return (
    <Layout hideFooter={true}>
      <div className="min-h-screen bg-gray-50">
        {/* Custom Header */}
        <header className="py-4 px-6 md:px-12 lg:px-24 bg-white border-b">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link to="/marketplace" className="text-2xl font-bold tracking-tight text-gray-900 mx-0 px-0">Checkout</Link>
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
              <CheckoutContactForm
                contactEmail={contactEmail}
                setContactEmail={setContactEmail}
                saveInfo={saveInfo}
                setSaveInfo={setSaveInfo}
                isEmailDisabled={useSavedAddress && !!savedShippingDetails?.contactEmail}
              />
              <CheckoutShippingForm
                shippingCountry={shippingCountry}
                shippingFirstName={shippingFirstName} setShippingFirstName={setShippingFirstName}
                shippingLastName={shippingLastName} setShippingLastName={setShippingLastName}
                shippingAddress={shippingAddress} setShippingAddress={setShippingAddress}
                shippingApartment={shippingApartment} setShippingApartment={setShippingApartment}
                shippingCity={shippingCity} setShippingCity={setShippingCity}
                shippingState={shippingState} setShippingState={setShippingState}
                shippingPostalCode={shippingPostalCode} setShippingPostalCode={setShippingPostalCode}
                deliveryNotes={deliveryNotes} setDeliveryNotes={setDeliveryNotes}
                useSavedAddress={useSavedAddress} handleUseSavedAddressChange={handleUseSavedAddressChange}
                isSavedAddressCheckboxDisabled={!savedShippingDetails && !user?.id}
                areAddressFieldsDisabled={useSavedAddress}
              />
              <CheckoutPaymentInfo />
              <CheckoutBillingAddress
                billingAddressOption={billingAddressOption}
                setBillingAddressOption={setBillingAddressOption}
              />
              <RoleButton type="submit" size="lg" className="w-full mt-6 text-lg py-3 h-auto" disabled={isProcessing || cartItems.length === 0}>
                {isProcessing ? "Processing..." : "Pay now"}
              </RoleButton>
            </form>

            {/* Right Column: Order Summary - md:sticky ensures it sticks on medium screens and up */}
            <CheckoutOrderSummary
              cartItems={cartItems}
              subtotal={subtotalFromCart}
              shippingCost={shippingCost}
              estimatedTaxes={estimatedTaxes}
              finalTotal={finalTotal}
            />
          </div>
        </main>

        {/* Custom Footer (original location, will be hidden by Layout prop) */}
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
