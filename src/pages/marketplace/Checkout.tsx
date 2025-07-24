import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useCartSummary } from "@/hooks/useCartSummary";
import { useToast } from "@/hooks/use-toast";
import { CheckoutBillingAddress } from "@/components/checkout/CheckoutBillingAddress";
import { CheckoutShippingForm } from "@/components/checkout/CheckoutShippingForm";
import { CheckoutPaymentInfo } from "@/components/checkout/CheckoutPaymentInfo";
import { CheckoutContactForm } from "@/components/checkout/CheckoutContactForm";
import { CheckoutOrderSummary } from "@/components/checkout/CheckoutOrderSummary";
import { 
  ShoppingCart, 
  User, 
  MapPin, 
  CreditCard, 
  Truck,
  CheckCircle
} from "lucide-react";

export default function Checkout() {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { cartSummary } = useCartSummary();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form state
  const [shippingInfo, setShippingInfo] = useState({
    firstName: profile?.first_name || '',
    lastName: profile?.last_name || '',
    address: '',
    city: '',
    province: '',
    zipCode: '',
    phone: ''
  });
  
  const [billingInfo, setBillingInfo] = useState({
    firstName: profile?.first_name || '',
    lastName: profile?.last_name || '',
    address: '',
    city: '',
    province: '',
    zipCode: '',
    phone: ''
  });
  
  const [paymentInfo, setPaymentInfo] = useState({
    method: 'credit_card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

  const [contactInfo, setContactInfo] = useState({
    email: user?.email || '',
    phone: ''
  });

  const [useSameAddress, setUseSameAddress] = useState(true);

  useEffect(() => {
    if (profile) {
      setShippingInfo(prev => ({
        ...prev,
        firstName: profile.first_name || '',
        lastName: profile.last_name || ''
      }));
      setBillingInfo(prev => ({
        ...prev,
        firstName: profile.first_name || '',
        lastName: profile.last_name || ''
      }));
    }
  }, [profile]);

  useEffect(() => {
    if (useSameAddress) {
      setBillingInfo(shippingInfo);
    }
  }, [shippingInfo, useSameAddress]);

  const steps = [
    {
      title: "Contact Information",
      icon: User,
      component: (
        <CheckoutContactForm 
          contactInfo={contactInfo}
          setContactInfo={setContactInfo}
        />
      )
    },
    {
      title: "Shipping Address",
      icon: Truck,
      component: (
        <CheckoutShippingForm 
          shippingInfo={shippingInfo}
          setShippingInfo={setShippingInfo}
        />
      )
    },
    {
      title: "Billing Address",
      icon: MapPin,
      component: (
        <CheckoutBillingAddress 
          billingInfo={billingInfo}
          setBillingInfo={setBillingInfo}
          useSameAddress={useSameAddress}
          setUseSameAddress={setUseSameAddress}
        />
      )
    },
    {
      title: "Payment Information",
      icon: CreditCard,
      component: (
        <CheckoutPaymentInfo 
          paymentInfo={paymentInfo}
          setPaymentInfo={setPaymentInfo}
        />
      )
    },
    {
      title: "Order Review",
      icon: CheckCircle,
      component: (
        <CheckoutOrderSummary 
          shippingInfo={shippingInfo}
          billingInfo={billingInfo}
          paymentInfo={paymentInfo}
          contactInfo={contactInfo}
          cartSummary={cartSummary}
        />
      )
    }
  ];

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return contactInfo.email && contactInfo.phone;
      case 1:
        return shippingInfo.firstName && shippingInfo.lastName && 
               shippingInfo.address && shippingInfo.city && 
               shippingInfo.province && shippingInfo.zipCode;
      case 2:
        return billingInfo.firstName && billingInfo.lastName && 
               billingInfo.address && billingInfo.city && 
               billingInfo.province && billingInfo.zipCode;
      case 3:
        return paymentInfo.method === 'cash_on_delivery' || 
               (paymentInfo.cardNumber && paymentInfo.expiryDate && 
                paymentInfo.cvv && paymentInfo.nameOnCard);
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Order placed successfully!",
        description: "You will receive a confirmation email shortly.",
      });
      
      // Navigate to order confirmation page
      navigate('/marketplace/order-confirmation', {
        state: {
          orderNumber: 'ORD-' + Date.now(),
          shippingInfo,
          billingInfo,
          paymentInfo,
          contactInfo,
          cartSummary
        }
      });
    } catch (error) {
      toast({
        title: "Order failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!cartSummary || cartSummary.items.length === 0) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center">
            <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some items to your cart to proceed with checkout.</p>
            <Button onClick={() => navigate('/marketplace')}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order in a few simple steps</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index <= currentStep 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {index < currentStep ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-12 h-0.5 mx-2 ${
                        index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                {steps.map((step, index) => (
                  <span key={index} className={`${
                    index === currentStep ? 'font-medium text-blue-600' : ''
                  }`}>
                    {step.title}
                  </span>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {React.createElement(steps[currentStep].icon, { className: "w-5 h-5" })}
                  {steps[currentStep].title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {steps[currentStep].component}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              
              {currentStep === steps.length - 1 ? (
                <Button
                  onClick={handlePlaceOrder}
                  disabled={!canProceed() || isProcessing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isProcessing ? "Processing..." : "Place Order"}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                >
                  Next
                </Button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cartSummary.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">₱{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₱{cartSummary.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₱{cartSummary.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>₱{cartSummary.tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₱{cartSummary.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
