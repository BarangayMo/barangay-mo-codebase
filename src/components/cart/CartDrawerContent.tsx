
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SheetHeader, SheetTitle, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { X, Minus, Plus, Trash2, Loader2, ShoppingBag } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

const DEFAULT_PRODUCT_IMAGE = "/lovable-uploads/fde1e978-0d35-49ec-9f4b-1f03b096b981.png";

interface CartProductDetails {
  id: string;
  name: string;
  price: number;
  main_image_url?: string | null;
  stock_quantity: number;
  vendors?: { shop_name: string } | null;
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
  max_quantity: number;
}

const fetchCartItemsForDrawer = async (userId: string): Promise<CartItemDisplay[]> => {
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
    console.error("Error fetching cart items for drawer:", cartError);
    throw cartError;
  }
  if (!cartData) return [];

  return cartData
    .filter(item => item.products !== null)
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

export const CartDrawerContent = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [specialInstructions, setSpecialInstructions] = useState("");

  const { data: cartItems, isLoading, error: cartError } = useQuery<CartItemDisplay[]>({
    queryKey: ['cartDrawerItems', user?.id],
    queryFn: () => fetchCartItemsForDrawer(user!.id),
    enabled: !!user,
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ cartItemId, newQuantity }: { cartItemId: string, newQuantity: number }) => {
      const itemToUpdate = cartItems?.find(item => item.cart_item_id === cartItemId);
      if (itemToUpdate && newQuantity > itemToUpdate.max_quantity) {
        toast({ title: "Stock limit", description: `Only ${itemToUpdate.max_quantity} available.`, variant: "default" });
        return Promise.reject(new Error("Exceeds stock limit"));
      }
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', cartItemId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartDrawerItems', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['cartSummary', user?.id] });
    },
    onError: (error: any) => {
      if (error.message !== "Exceeds stock limit") {
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
      queryClient.invalidateQueries({ queryKey: ['cartDrawerItems', user?.id] });
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
  // Shipping and discount logic can be simplified or omitted for drawer, full calculation at checkout.
  const total = subtotal; 

  const handleCheckout = () => {
    if (!cartItems || cartItems.length === 0) {
      toast({ title: "Cart is empty", description: "Please add items to your cart before checkout.", variant: "default" });
      return;
    }
    // Close the sheet before navigating
    const closeButton = document.getElementById('cart-drawer-close-button');
    if (closeButton) closeButton.click();
    
    navigate("/marketplace/checkout", { state: { cartItems, total, specialInstructions } });
  };

  if (!user) {
    // This case should ideally not be reached if drawer is only shown for authenticated users
    return <div className="p-6 text-center">Please log in to view your cart.</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="p-4 border-b">
        <SheetTitle className="text-xl font-semibold">Your cart</SheetTitle>
        <SheetClose asChild id="cart-drawer-close-button">
          <Button variant="ghost" size="icon" className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </Button>
        </SheetClose>
      </SheetHeader>

      {isLoading && (
        <div className="flex-1 p-4 space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="flex gap-3 items-center">
              <Skeleton className="w-16 h-16 rounded" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-6 w-1/4" />
              </div>
              <Skeleton className="h-5 w-12" />
            </div>
          ))}
        </div>
      )}

      {cartError && (
        <div className="flex-1 p-6 text-center text-red-500">
          <p>Error loading cart items.</p>
        </div>
      )}

      {!isLoading && !cartError && (!cartItems || cartItems.length === 0) && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium">Your cart is empty</h3>
          <p className="text-sm text-muted-foreground mb-4">Add some products to get started.</p>
          <SheetClose asChild>
             <Button asChild variant="outline">
                <Link to="/marketplace">Continue Shopping</Link>
            </Button>
          </SheetClose>
        </div>
      )}

      {!isLoading && !cartError && cartItems && cartItems.length > 0 && (
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-1">
            <div className="grid grid-cols-[auto_1fr_auto] items-center text-xs text-muted-foreground uppercase mb-2 px-1">
              <span>Product</span>
              <span></span> {/* Empty cell for alignment */}
              <span className="text-right">Total</span>
            </div>
            <div className="space-y-4">
            {cartItems.map(item => (
              <div key={item.cart_item_id} className="flex gap-3 items-start p-1 border-b pb-3 last:border-b-0">
                <SheetClose asChild>
                  <Link to={`/marketplace/product/${item.product_id}`} className="flex-shrink-0">
                    <img
                      src={item.image || DEFAULT_PRODUCT_IMAGE}
                      alt={item.name}
                      className="w-16 h-16 object-contain border rounded"
                      onError={(e) => (e.currentTarget.src = DEFAULT_PRODUCT_IMAGE)}
                    />
                  </Link>
                </SheetClose>
                <div className="flex-1 min-w-0">
                  <SheetClose asChild>
                    <Link to={`/marketplace/product/${item.product_id}`} className="hover:underline">
                      <h4 className="text-sm font-medium truncate">{item.name}</h4>
                    </Link>
                  </SheetClose>
                  <p className="text-xs text-muted-foreground">₱{item.price.toFixed(2)}</p>
                  {/* Quantity Controls */}
                  <div className="flex items-center mt-1.5">
                    <Button
                      variant="outline" size="icon" className="w-7 h-7"
                      onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity - 1)}
                      disabled={item.quantity <= 1 || updateQuantityMutation.isPending && updateQuantityMutation.variables?.cartItemId === item.cart_item_id}
                    >
                      <Minus className="h-3.5 w-3.5"/>
                    </Button>
                    <div className="w-8 h-7 flex items-center justify-center text-sm">
                      {updateQuantityMutation.isPending && updateQuantityMutation.variables?.cartItemId === item.cart_item_id
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : item.quantity}
                    </div>
                    <Button
                      variant="outline" size="icon" className="w-7 h-7"
                      onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity + 1)}
                      disabled={item.quantity >= item.max_quantity || updateQuantityMutation.isPending && updateQuantityMutation.variables?.cartItemId === item.cart_item_id}
                    >
                      <Plus className="h-3.5 w-3.5"/>
                    </Button>
                    <Button
                      variant="ghost" size="icon" className="w-7 h-7 ml-auto text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveItem(item.cart_item_id)}
                      disabled={removeItemMutation.isPending && removeItemMutation.variables === item.cart_item_id}
                    >
                      {removeItemMutation.isPending && removeItemMutation.variables === item.cart_item_id
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : <Trash2 className="h-3.5 w-3.5" />}
                    </Button>
                  </div>
                  {item.quantity > item.max_quantity && <p className="text-xs text-red-500 mt-1">Max {item.max_quantity} in stock</p>}
                </div>
                <div className="text-sm font-medium text-right">
                  ₱{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
            </div>
          </div>
        </ScrollArea>
      )}

      {cartItems && cartItems.length > 0 && (
        <SheetFooter className="p-4 border-t bg-background flex-col gap-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="instructions">
              <AccordionTrigger className="text-sm">Order special instructions</AccordionTrigger>
              <AccordionContent>
                <Textarea
                  placeholder="Add a note for the seller..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="min-h-[80px]"
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="w-full space-y-1">
            <div className="flex justify-between text-lg font-semibold">
              <span>Estimated total</span>
              <span>₱{total.toFixed(2)}</span>
            </div>
            <p className="text-xs text-muted-foreground">Taxes, discounts and shipping calculated at checkout.</p>
          </div>
          <Button
            size="lg"
            className="w-full"
            onClick={handleCheckout}
            disabled={isLoading || !cartItems || cartItems.length === 0 || updateQuantityMutation.isPending || removeItemMutation.isPending}
          >
            Check out
          </Button>
        </SheetFooter>
      )}
    </div>
  );
};
