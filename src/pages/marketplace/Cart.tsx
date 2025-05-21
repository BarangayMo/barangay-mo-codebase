import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Trash2, ShoppingBag, Package } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const DEFAULT_PRODUCT_IMAGE = "/lovable-uploads/fde1e978-0d35-49ec-9f4b-1f03b096b981.png";

// Mock cart data
const initialCartItems = [
  {
    id: 1,
    name: "Rice 5kg Premium Quality",
    price: 250.00,
    quantity: 2,
    image: "/lovable-uploads/bf986c64-ee34-427c-90ad-0512f2e7f353.png",
    seller: "Barangay Coop"
  },
  {
    id: 7,
    name: "Shangri-La Bamboo Fresh Hotel Shampoo 500ml",
    price: 180.00,
    quantity: 1,
    image: "/lovable-uploads/3ee20358-a5dd-4933-a21d-71d3f13d0047.png",
    seller: "Hotel Supplies PH"
  },
  {
    id: 3, // Example of item that might miss an image in real data
    name: "Stainless Steel Vegetable Grater",
    price: 288.53,
    quantity: 1,
    image: "", // Empty image string to test default
    seller: "Metro Cookwares"
  }
];

export default function Cart() {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [promoCode, setPromoCode] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 50 : 0;
  const discount = isPromoApplied ? subtotal * 0.05 : 0; // 5% discount
  const total = subtotal + shipping - discount;
  
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map(item => 
      item.id === id ? {...item, quantity: newQuantity} : item
    ));
  };
  
  const removeItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart",
    });
  };
  
  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "save5") {
      setIsPromoApplied(true);
      toast({
        title: "Promo code applied",
        description: "5% discount has been applied to your order",
      });
    } else {
      toast({
        title: "Invalid promo code",
        description: "Please enter a valid promo code",
        variant: "destructive",
      });
    }
  };
  
  const handleCheckout = () => {
    navigate("/marketplace/checkout");
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6 pb-20">
        <div className="flex items-center mb-4">
          <Link to="/marketplace" className="flex items-center text-sm text-muted-foreground hover:text-primary">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Shopping
          </Link>
        </div>
        
        <h1 className="text-2xl font-bold mb-6">Your Cart ({cartItems.length})</h1>
        
        {cartItems.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex gap-4 p-4 border rounded-lg bg-white">
                    <div className="w-20 h-20 flex-shrink-0 bg-gray-100 flex items-center justify-center rounded">
                      <img 
                        src={item.image || DEFAULT_PRODUCT_IMAGE} 
                        alt={item.name}
                        className="w-full h-full object-contain p-1"
                        onError={(e) => (e.currentTarget.src = DEFAULT_PRODUCT_IMAGE)}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{item.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{item.seller}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center">
                          <button 
                            className="w-8 h-8 flex items-center justify-center border rounded-l-md hover:bg-gray-50"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <div className="w-10 h-8 flex items-center justify-center border-t border-b">
                            {item.quantity}
                          </div>
                          <button
                            className="w-8 h-8 flex items-center justify-center border rounded-r-md hover:bg-gray-50"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="font-semibold text-right">
                      ₱{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={e => setPromoCode(e.target.value)}
                  />
                  <Button onClick={applyPromoCode} disabled={isPromoApplied}>
                    Apply
                  </Button>
                </div>
                {isPromoApplied && (
                  <p className="text-sm text-green-600 mt-1">Promo code applied: 5% discount</p>
                )}
              </div>
            </div>
            
            <div>
              <div className="bg-white border rounded-lg p-4">
                <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>₱{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₱{shipping.toFixed(2)}</span>
                  </div>
                  {isPromoApplied && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount (5%)</span>
                      <span>- ₱{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 mt-2 font-bold flex justify-between text-lg">
                    <span>Total</span>
                    <span>₱{total.toFixed(2)}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-4" 
                  onClick={handleCheckout}
                  size="lg"
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingBag className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-4">Looks like you haven't added any items to your cart yet.</p>
            <Button asChild>
              <Link to="/marketplace">Start Shopping</Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
