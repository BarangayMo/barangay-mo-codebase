
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Package, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

// Mock order data
const orders = [
  {
    id: "SMB-2023-04001",
    date: "April 23, 2025",
    items: 3,
    total: 696.00,
    status: "Delivered",
    trackingId: "SB-TRK-78901",
    products: [
      {
        name: "Rice 5kg Premium Quality",
        quantity: 2,
        price: 250.00,
        image: "/lovable-uploads/bf986c64-ee34-427c-90ad-0512f2e7f353.png",
      },
      {
        name: "Shangri-La Bamboo Fresh Hotel Shampoo 500ml",
        quantity: 1,
        price: 180.00,
        image: "/lovable-uploads/3ee20358-a5dd-4933-a21d-71d3f13d0047.png",
      }
    ]
  },
  {
    id: "SMB-2023-03995",
    date: "April 20, 2025",
    items: 1,
    total: 288.53,
    status: "Processing",
    trackingId: "SB-TRK-78890",
    products: [
      {
        name: "Stainless Steel Vegetable Grater",
        quantity: 1,
        price: 288.53,
        image: "/lovable-uploads/f1fa3bc1-5d74-4b1d-99de-f56d89e4b510.png",
      }
    ]
  }
];

export default function MyOrders() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto pb-20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link to="/marketplace" className="flex items-center text-sm text-muted-foreground hover:text-primary mr-4">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Shop
            </Link>
            <h1 className="text-2xl font-bold">My Orders</h1>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-start mb-4">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {orders.length > 0 ? (
              orders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg border overflow-hidden">
                  <div className="p-4 border-b flex justify-between items-center">
                    <div>
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm px-2 py-1 rounded ${
                        order.status === "Delivered" 
                          ? "bg-green-100 text-green-800"
                          : order.status === "Processing"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {order.status}
                      </span>
                      <Link 
                        to={`/marketplace/orders/${order.id}`} 
                        className="text-sm text-primary hover:underline flex items-center"
                      >
                        Details
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex overflow-auto gap-3 pb-2 no-scrollbar">
                      {order.products.map((product, index) => (
                        <div key={index} className="flex-shrink-0 w-16">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-16 h-16 object-contain bg-gray-50"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-100 flex items-center justify-center">
                              <Package className="text-gray-400 w-6 h-6" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center mt-3">
                      <div className="text-sm">
                        <span className="text-muted-foreground">{order.items} items</span>
                        <span className="mx-2">•</span>
                        <span className="font-medium">₱{order.total.toFixed(2)}</span>
                      </div>
                      
                      {order.status === "Delivered" && (
                        <Button size="sm" variant="outline">
                          Buy Again
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <ShoppingBag className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
                <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                <Button asChild>
                  <Link to="/marketplace">Start Shopping</Link>
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="processing">
            {orders.filter(o => o.status === "Processing").length > 0 ? (
              orders.filter(o => o.status === "Processing").map((order) => (
                <div key={order.id} className="bg-white rounded-lg border overflow-hidden mb-4">
                  {/* Same content as above */}
                  <div className="p-4 border-b flex justify-between items-center">
                    <div>
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm px-2 py-1 rounded bg-blue-100 text-blue-800">
                        {order.status}
                      </span>
                      <Link 
                        to={`/marketplace/orders/${order.id}`} 
                        className="text-sm text-primary hover:underline flex items-center"
                      >
                        Details
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    {/* Same content as above */}
                    <div className="flex overflow-auto gap-3 pb-2 no-scrollbar">
                      {order.products.map((product, index) => (
                        <div key={index} className="flex-shrink-0 w-16">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-16 h-16 object-contain bg-gray-50"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-100 flex items-center justify-center">
                              <Package className="text-gray-400 w-6 h-6" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center mt-3">
                      <div className="text-sm">
                        <span className="text-muted-foreground">{order.items} items</span>
                        <span className="mx-2">•</span>
                        <span className="font-medium">₱{order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No orders are currently being processed.</p>
              </div>
            )}
          </TabsContent>
          
          {/* Add similar content for Shipped and Delivered tabs */}
          <TabsContent value="shipped">
            <div className="text-center py-8">
              <p className="text-muted-foreground">No orders are currently being shipped.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="delivered">
            {orders.filter(o => o.status === "Delivered").length > 0 ? (
              orders.filter(o => o.status === "Delivered").map((order) => (
                <div key={order.id} className="bg-white rounded-lg border overflow-hidden mb-4">
                  {/* Similar structure as above */}
                  <div className="p-4 border-b flex justify-between items-center">
                    <div>
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm px-2 py-1 rounded bg-green-100 text-green-800">
                        {order.status}
                      </span>
                      <Link 
                        to={`/marketplace/orders/${order.id}`} 
                        className="text-sm text-primary hover:underline flex items-center"
                      >
                        Details
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex overflow-auto gap-3 pb-2 no-scrollbar">
                      {order.products.map((product, index) => (
                        <div key={index} className="flex-shrink-0 w-16">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-16 h-16 object-contain bg-gray-50"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-100 flex items-center justify-center">
                              <Package className="text-gray-400 w-6 h-6" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center mt-3">
                      <div className="text-sm">
                        <span className="text-muted-foreground">{order.items} items</span>
                        <span className="mx-2">•</span>
                        <span className="font-medium">₱{order.total.toFixed(2)}</span>
                      </div>
                      
                      <Button size="sm" variant="outline">
                        Buy Again
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">You don't have any delivered orders yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
