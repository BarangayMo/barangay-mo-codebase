
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Truck } from "lucide-react";
import { Link } from "react-router-dom";

// Mock order details
const order = {
  id: "SMB-2023-04001",
  date: "April 23, 2025",
  total: 696.00,
  items: [
    {
      id: 1,
      name: "Rice 5kg Premium Quality",
      quantity: 2,
      price: 250.00
    },
    {
      id: 7,
      name: "Shangri-La Bamboo Fresh Hotel Shampoo 500ml",
      quantity: 1,
      price: 180.00
    }
  ],
  shipping: {
    method: "Standard Delivery",
    cost: 50.00,
    address: "123 Sample St., Commonwealth, Quezon City"
  },
  payment: {
    method: "Cash on Delivery",
    discount: 34.00
  }
};

export default function OrderConfirmation() {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto pb-20 pt-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold">Thank You for Your Order!</h1>
          <p className="text-muted-foreground mt-2">
            Your order has been placed successfully. We'll send you shipping confirmation soon.
          </p>
        </div>
        
        <div className="bg-white border rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold">Order #{order.id}</h2>
            <span className="text-sm text-muted-foreground">{order.date}</span>
          </div>
          
          <div className="space-y-4">
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between">
                <div>
                  <p>{item.name}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <div className="font-medium">
                  ₱{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Subtotal</span>
              <span>₱{(order.total - order.shipping.cost + order.payment.discount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>Shipping</span>
              <span>₱{order.shipping.cost.toFixed(2)}</span>
            </div>
            {order.payment.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600 mb-1">
                <span>Discount</span>
                <span>- ₱{order.payment.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold mt-2">
              <span>Total</span>
              <span>₱{order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white border rounded-lg p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Truck className="h-5 w-5" />
                <h3 className="font-semibold">Shipping Information</h3>
              </div>
              <p className="text-sm">{order.shipping.address}</p>
              <p className="text-sm mt-1">{order.shipping.method}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-5 w-5" />
                <h3 className="font-semibold">Payment Method</h3>
              </div>
              <p className="text-sm">{order.payment.method}</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 justify-center">
          <Button asChild variant="outline">
            <Link to="/marketplace/orders">View My Orders</Link>
          </Button>
          <Button asChild>
            <Link to="/marketplace">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
}
