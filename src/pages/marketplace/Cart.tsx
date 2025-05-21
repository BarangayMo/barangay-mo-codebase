import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Trash2, ShoppingBag, Minus, Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from '@/lib/utils';

const DEFAULT_PRODUCT_IMAGE = "/lovable-uploads/fde1e978-0d35-49ec-9f4b-1f03b096b981.png";

interface CartProductDetails {
  id: string;
  name: string;
  price: number;
  main_image_url?: string | null;
  stock_quantity: number;
  vendors?: { shop_name: string } | null;
}

interface CartItemRecord {
  id: string; // cart_items.id
  quantity: number;
  products: CartProductDetails | null; // Joined product
}

interface CartItemDisplay {
  cart_item_id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
  seller?: string;
  stock_quantity: number;
  max_quantity: number; // Available stock for this item
}

const fetchCartItems = async (userId: string): Promise<CartItemDisplay[]> => {
  const { data: cartData, error: cartError } = await supabase
    .from('cart_items')
    .select(`
      id,
      quantity,
      products (
        id,
        name,
        price,
        main_image_url,
        stock_quantity,
        vendors (shop_name)
      )
    `)
    .eq('user_id', userId)
    .order('added_at', { ascending: false });

  if (cartError) {
    console.error("Error fetching cart items:", cartError);
    throw cartError;
  }
  if (!cartData) return [];

  return cartData
    .filter(item => item.products !== null) // Filter out items where product might have been deleted
    .map(item => {
      const product = item.products as CartProductDetails;
      return {
        cart_item_id: item.id,
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.main_image_url,
        seller: product.vendors?.shop_name || "N/A",
        stock_quantity: product.stock_quantity,
        max_quantity: product.stock_quantity,
      };
    });
};

export default function Cart() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [promoCode, setPromoCode] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  const { data: cartItems, isLoading, error: cartError } = useQuery<CartItemDisplay[]>({
    queryKey: ['cartItems', user?.id],
    queryFn: () => fetchCartItems(user!.id),
    enabled: !!user,
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ cartItemId, newQuantity }: { cartItemId: string, newQuantity: number }) => {
      const itemToUpdate = cartItems?.find(item => item.cart_item_id === cartItemId);
      if (itemToUpdate && newQuantity > itemToUpdate.max_quantity) {
        toast({ title: "Stock limit", description: `Only ${itemToUpdate.max_quantity} available.`, variant: "default"}); // Changed "warning" to "default"
        return Promise.reject(new Error("Exceeds stock limit"));
      }
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', cartItemId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartItems', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['cartSummary', user?.id] });
    },
    onError: (error: any) => {
      if (error.message !== "Exceeds stock limit") { // Avoid double toast for stock limit
        toast({ title: "Error", description: `Failed to update quantity: ${error.message}`, variant: "destructive" });
      }
    }
  });

  const removeItemMutation = useMutation({
    mutationFn: async (cartItemId: string) => {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Item removed", description: "Item has been removed from your cart." });
      queryClient.invalidateQueries({ queryKey: ['cartItems', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['cartSummary', user?.id] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: `Failed to remove item: ${error.message}`, variant: "destructive" });
    }
  });

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantityMutation.mutate({ cartItemId: id, newQuantity });
  };

  const handleRemoveItem = (id: string) => {
    removeItemMutation.mutate(id);
  };
  
  const subtotal = cartItems?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const shipping = subtotal > 0 ? 50 : 0; // Example shipping cost
  const discount = isPromoApplied ? subtotal * 0.05 : 0; // 5% discount
  const total = subtotal + shipping - discount;
  
  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "save5") {
      setIsPromoApplied(true);
      toast({ title: "Promo code applied", description: "5% discount has been applied." });
    } else {
      toast({ title: "Invalid promo code", variant: "destructive" });
    }
  };
  
  const handleCheckout = () => {
    if (!cartItems || cartItems.length === 0) {
      toast({ title: "Cart is empty", description: "Please add items to your cart before checkout.", variant: "default" }); // Changed "warning" to "default"
      return;
    }
    navigate("/marketplace/checkout", { state: { cartItems, total } });
  };

  if (!user) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-6 text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Please Log In</h2>
          <p className="text-muted-foreground mb-4">Log in to view your cart items.</p>
          <Button asChild>
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-6 pb-20">
          <Skeleton className="h-8 w-1/4 mb-4" />
          <Skeleton className="h-10 w-1/3 mb-6" />
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="flex gap-4 p-4 border rounded-lg bg-white">
                  <Skeleton className="w-20 h-20 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-8 w-1/4" />
                  </div>
                  <Skeleton className="h-6 w-1/5" />
                </div>
              ))}
            </div>
            <div className="bg-white border rounded-lg p-4 space-y-3">
              <Skeleton className="h-6 w-1/2 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-8 w-full mt-2" />
              <Skeleton className="h-10 w-full mt-4" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (cartError) {
    return (
       <Layout>
        <div className="max-w-4xl mx-auto px-4 py-6 text-center">
          <h2 className="text-xl font-semibold text-red-500 mb-2">Error Loading Cart</h2>
          <p className="text-muted-foreground mb-4">Could not fetch your cart items. Please try again later.</p>
          <pre className="text-xs text-left bg-red-50 p-2 rounded">{cartError.message}</pre>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6 pb-20">
        <div className="flex items-center mb-4">
          <Link to="/marketplace" className="flex items-center text-sm text-muted-foreground hover:text-primary">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Shopping
          </Link>
        </div>
        
        <h1 className="text-2xl font-bold mb-6">Your Cart ({cartItems?.length || 0})</h1>
        
        {cartItems && cartItems.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.cart_item_id} className="flex gap-4 p-4 border rounded-lg bg-white">
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
                      <p className="text-sm text-muted-foreground truncate">Sold by: {item.seller}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center">
                          <Button 
                            variant="outline" size="icon"
                            className="w-8 h-8"
                            onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || updateQuantityMutation.isPending}
                          >
                            <Minus className="h-4 w-4"/>
                          </Button>
                          <div className="w-10 h-8 flex items-center justify-center border-t border-b">
                            {updateQuantityMutation.isPending && updateQuantityMutation.variables?.cartItemId === item.cart_item_id 
                              ? <Loader2 className="h-4 w-4 animate-spin" /> 
                              : item.quantity
                            }
                          </div>
                          <Button
                            variant="outline" size="icon"
                            className="w-8 h-8"
                            onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity + 1)}
                            disabled={item.quantity >= item.max_quantity || updateQuantityMutation.isPending}
                          >
                            <Plus className="h-4 w-4"/>
                          </Button>
                        </div>
                        {item.quantity > item.max_quantity && <p className="text-xs text-red-500 ml-2">Max {item.max_quantity} in stock</p>}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoveItem(item.cart_item_id)}
                          disabled={removeItemMutation.isPending && removeItemMutation.variables === item.cart_item_id}
                        >
                          {removeItemMutation.isPending && removeItemMutation.variables === item.cart_item_id 
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <Trash2 className="h-4 w-4" />
                          }
                        </Button>
                      </div>
                    </div>
                    
                    <div className="font-semibold text-right">
                      {formatCurrency(item.price * item.quantity, 'NGN')}
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
                    <span>{formatCurrency(subtotal, 'NGN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{formatCurrency(shipping, 'NGN')}</span>
                  </div>
                  {isPromoApplied && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount (5%)</span>
                      <span>- {formatCurrency(discount, 'NGN')}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 mt-2 font-bold flex justify-between text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(total, 'NGN')}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-4" 
                  onClick={handleCheckout}
                  size="lg"
                  disabled={cartItems.length === 0 || updateQuantityMutation.isPending || removeItemMutation.isPending}
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
            <p className="text-muted-foreground mb-4">Looks like you haven't added any items yet.</p>
            <Button asChild>
              <Link to="/marketplace">Start Shopping</Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
