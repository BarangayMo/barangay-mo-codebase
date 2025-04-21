
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronLeft, CreditCard, Wallet, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const paymentMethods = [
  { id: "cod", name: "Cash on Delivery", icon: Wallet },
  { id: "card", name: "Credit/Debit Card", icon: CreditCard },
];

// Mock order summary
const orderSummary = {
  subtotal: 680.00,
  shipping: 50.00,
  discount: 34.00,
  total: 696.00,
  items: 2
};

export default function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      navigate("/marketplace/order-confirmation");
      toast({
        title: "Order placed successfully",
        description: "Thank you for your purchase!",
      });
    }, 1500);
  };
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto pb-20">
        <div className="flex items-center mb-4">
          <Link to="/marketplace/cart" className="flex items-center text-sm text-muted-foreground hover:text-primary">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Cart
          </Link>
        </div>
        
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        
        <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white border rounded-lg p-4">
              <h2 className="font-semibold text-lg mb-4">Shipping Information</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" required />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" required />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" required />
                </div>
                
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" required />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="barangay">Barangay</Label>
                    <Input id="barangay" required />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" required defaultValue="Quezon City" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="notes">Delivery Notes (Optional)</Label>
                  <Textarea id="notes" placeholder="Special instructions for delivery" />
                </div>
              </div>
            </div>
            
            <div className="bg-white border rounded-lg p-4">
              <h2 className="font-semibold text-lg mb-4">Payment Method</h2>
              
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <div 
                      key={method.id} 
                      className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                        paymentMethod === method.id ? 'border-primary bg-primary/5' : ''
                      }`}
                    >
                      <RadioGroupItem value={method.id} id={`payment-${method.id}`} className="mr-3" />
                      <Label htmlFor={`payment-${method.id}`} className="flex items-center cursor-pointer flex-1">
                        <Icon className="h-5 w-5 mr-2" />
                        {method.name}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
              
              {paymentMethod === "card" && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input id="cardName" required />
                    </div>
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" required />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" type="password" maxLength={4} required />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <div className="bg-white border rounded-lg p-4 sticky top-20">
              <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal ({orderSummary.items} items)</span>
                  <span>₱{orderSummary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₱{orderSummary.shipping.toFixed(2)}</span>
                </div>
                {orderSummary.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>- ₱{orderSummary.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-2 mt-2 font-bold flex justify-between">
                  <span>Total</span>
                  <span>₱{orderSummary.total.toFixed(2)}</span>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full mt-4" 
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Place Order"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
