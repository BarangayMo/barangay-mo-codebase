
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft,
  Edit,
  Trash,
  ExternalLink,
  Pencil,
  Check,
  X,
  ChevronRight
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface DetailPageProps {
  type: 'product' | 'order' | 'vendor' | 'customer' | 'review' | 'generic';
}

const DetailPage: React.FC<DetailPageProps> = ({ type = 'generic' }) => {
  const { id } = useParams<{ id: string }>();
  
  // Mock data based on type and ID
  const getData = () => {
    switch (type) {
      case 'product':
        return {
          name: 'Organic Rice (5kg)',
          category: 'Groceries',
          price: '₱350',
          status: 'Active',
          vendor: 'Green Farms',
          stock: 125,
          description: 'Organically grown rice from local farmers. Pesticide-free and sustainably harvested.',
          sku: 'RICE-ORG-5KG',
          dateAdded: '2025-03-15',
          variants: ['2kg', '5kg', '10kg'],
          images: ['rice1.jpg', 'rice2.jpg', 'rice3.jpg'],
          attributes: {
            'Origin': 'Ifugao, Philippines',
            'Type': 'White Rice',
            'Organic': 'Yes',
            'Weight': '5kg'
          }
        };
      case 'order':
        return {
          orderNumber: 'ORD-2521',
          customer: 'Maria Santos',
          date: '2025-04-20',
          status: 'Delivered',
          total: '₱1,250',
          items: [
            { name: 'Organic Rice (5kg)', quantity: 2, price: '₱350', subtotal: '₱700' },
            { name: 'Coconut Soap', quantity: 3, price: '₱85', subtotal: '₱255' },
            { name: 'Dried Mango', quantity: 1, price: '₱220', subtotal: '₱220' }
          ],
          shipping: {
            method: 'Standard Delivery',
            address: '123 Main St, Quezon City, Metro Manila',
            cost: '₱75'
          },
          payment: {
            method: 'GCash',
            status: 'Paid',
            reference: 'GC-87654321'
          },
          timeline: [
            { date: '2025-04-20 15:30', status: 'Delivered', note: 'Package received by customer' },
            { date: '2025-04-19 10:15', status: 'Out for Delivery', note: 'With courier (J. Reyes)' },
            { date: '2025-04-18 14:20', status: 'Shipped', note: 'Package left warehouse' },
            { date: '2025-04-17 09:45', status: 'Processing', note: 'Order verified and packed' },
            { date: '2025-04-16 16:30', status: 'Payment Received', note: 'Via GCash' },
            { date: '2025-04-16 16:28', status: 'Order Placed', note: 'Online via mobile app' }
          ]
        };
      case 'vendor':
        return {
          name: 'Green Farms Co-op',
          products: 32,
          status: 'Verified',
          rating: '4.8',
          sales: '₱325,650',
          contact: {
            name: 'Juan Dela Cruz',
            email: 'greenfarmsph@example.com',
            phone: '+63 912 345 6789'
          },
          address: 'Barangay Mapagkawanggawa, San Mateo, Rizal',
          joined: '2024-08-15',
          commission: '10%',
          categories: ['Groceries', 'Fresh Produce', 'Organic'],
          products: [
            { id: 'P001', name: 'Organic Rice (5kg)', stock: 125, price: '₱350', sales: 58 },
            { id: 'P012', name: 'Organic Brown Rice (5kg)', stock: 89, price: '₱380', sales: 42 },
            { id: 'P024', name: 'Fresh Vegetables Bundle', stock: 15, price: '₱450', sales: 37 }
          ],
          payments: {
            method: 'Bank Transfer',
            account: 'Banco de Oro',
            schedule: 'Weekly (Monday)'
          }
        };
      case 'customer':
        return {
          name: 'Maria Santos',
          email: 'mariasantos@example.com',
          phone: '+63 917 123 4567',
          joined: '2024-10-15',
          status: 'Active',
          orders: 12,
          spending: '₱25,350',
          address: '456 Mabini St., Makati City, Metro Manila',
          birthdate: '1985-06-12',
          loyaltyPoints: 256,
          recentOrders: [
            { id: 'ORD-2521', date: '2025-04-20', status: 'Delivered', total: '₱1,250' },
            { id: 'ORD-2489', date: '2025-04-05', status: 'Delivered', total: '₱3,450' },
            { id: 'ORD-2435', date: '2025-03-22', status: 'Delivered', total: '₱780' }
          ],
          wishlist: [
            { id: 'P045', name: 'Handcrafted Bamboo Chair', price: '₱4,500' },
            { id: 'P102', name: 'Filipino Coffee Gift Set', price: '₱1,200' }
          ]
        };
      default:
        return {
          name: `Item ${id}`,
          status: 'Active',
          category: 'General',
          dateAdded: '2025-04-01'
        };
    }
  };
  
  const data = getData();
  const title = getTitle();
  
  function getTitle() {
    if (type === 'product') return 'Product Details';
    if (type === 'order') return 'Order Details';
    if (type === 'vendor') return 'Vendor Details';
    if (type === 'customer') return 'Customer Details';
    if (type === 'review') return 'Review Details';
    return 'Item Details';
  }
  
  const getBreadcrumbs = () => {
    const segments = window.location.pathname.split('/').filter(Boolean);
    const basePath = segments.slice(0, segments.length-1).join('/');
    
    return (
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <Link to={`/${basePath}`} className="flex items-center hover:text-blue-600">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to {type === 'generic' ? 'List' : `${type.charAt(0).toUpperCase() + type.slice(1)}s`}
        </Link>
      </div>
    );
  };

  const renderProductDetail = () => {
    const product = data as any;
    
    return (
      <>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            <Card>
              <CardContent className="p-4">
                <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center mb-4">
                  <span className="text-gray-400">Product Image</span>
                </div>
                <div className="flex gap-2 mt-2">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                      <span className="text-xs text-gray-400">{i+1}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="w-full md:w-2/3">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{product.name}</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Pencil className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="details">
                  <TabsList className="mb-4 border-b w-full rounded-none bg-transparent h-auto p-0">
                    <TabsTrigger 
                      value="details"
                      className="py-3 px-5 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:font-bold"
                    >
                      Details
                    </TabsTrigger>
                    <TabsTrigger 
                      value="variants"
                      className="py-3 px-5 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:font-bold"
                    >
                      Variants
                    </TabsTrigger>
                    <TabsTrigger 
                      value="inventory"
                      className="py-3 px-5 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:font-bold"
                    >
                      Inventory
                    </TabsTrigger>
                    <TabsTrigger 
                      value="reviews"
                      className="py-3 px-5 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:font-bold"
                    >
                      Reviews
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Price</p>
                        <p className="font-medium">{product.price}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Category</p>
                        <p>{product.category}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Vendor</p>
                        <p>{product.vendor}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">SKU</p>
                        <p>{product.sku}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Status</p>
                        <p>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {product.status}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Date Added</p>
                        <p>{product.dateAdded}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm font-medium text-gray-500">Description</p>
                        <p className="mt-1">{product.description}</p>
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div>
                      <h3 className="font-medium mb-3">Attributes</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                        {Object.entries(product.attributes).map(([key, value]) => (
                          <div key={key} className="flex justify-between border-b pb-2">
                            <span className="text-gray-600">{key}</span>
                            <span>{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="variants">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <h3 className="font-medium">Product Variants</h3>
                        <Button size="sm">Add Variant</Button>
                      </div>
                      
                      <div className="border rounded-md">
                        {product.variants.map((variant: string, index: number) => (
                          <div key={index} className={`flex items-center justify-between p-4 ${index !== 0 ? 'border-t' : ''}`}>
                            <div>
                              <p className="font-medium">{variant}</p>
                              <p className="text-sm text-gray-500">SKU: RICE-ORG-{variant.toUpperCase()}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">Edit</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="inventory">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <h3 className="font-medium">Inventory Management</h3>
                        <Button size="sm">Update Stock</Button>
                      </div>
                      
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row justify-between gap-6">
                            <div className="text-center">
                              <p className="text-gray-500">Current Stock</p>
                              <p className="text-2xl font-bold">{product.stock}</p>
                            </div>
                            <Separator orientation="vertical" className="hidden md:block" />
                            <div className="text-center">
                              <p className="text-gray-500">Reserved</p>
                              <p className="text-2xl font-bold">12</p>
                            </div>
                            <Separator orientation="vertical" className="hidden md:block" />
                            <div className="text-center">
                              <p className="text-gray-500">Available</p>
                              <p className="text-2xl font-bold">{product.stock - 12}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <div>
                        <h4 className="font-medium mb-2">Recent Stock Updates</h4>
                        <div className="border rounded-md divide-y">
                          <div className="p-4 flex justify-between">
                            <div>
                              <p className="font-medium">Stock Added</p>
                              <p className="text-sm text-gray-500">2025-04-20</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-green-600">+50 units</p>
                              <p className="text-sm text-gray-500">By: Admin</p>
                            </div>
                          </div>
                          <div className="p-4 flex justify-between">
                            <div>
                              <p className="font-medium">Stock Added</p>
                              <p className="text-sm text-gray-500">2025-04-10</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-green-600">+75 units</p>
                              <p className="text-sm text-gray-500">By: Admin</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="reviews">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">Customer Reviews</h3>
                          <p className="text-sm text-gray-500">Average Rating: 4.5/5 (12 reviews)</p>
                        </div>
                        <Button size="sm" variant="outline">Export Reviews</Button>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="border rounded-md p-4">
                          <div className="flex justify-between mb-2">
                            <div className="flex items-center">
                              <div className="flex">
                                {Array(5).fill(0).map((_, i) => (
                                  <Star key={i} className={`h-4 w-4 ${i < 5 ? 'text-yellow-400' : 'text-gray-200'}`} fill={i < 5 ? 'currentColor' : 'none'} />
                                ))}
                              </div>
                              <span className="ml-2 font-medium">Maria S.</span>
                            </div>
                            <div className="text-sm text-gray-500">2025-04-15</div>
                          </div>
                          <p>Excellent quality rice! Very clean and tastes great. Will definitely buy again.</p>
                          <div className="flex justify-end mt-2 gap-2">
                            <Button size="sm" variant="ghost">Reply</Button>
                            <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50">Remove</Button>
                          </div>
                        </div>
                        
                        <div className="border rounded-md p-4">
                          <div className="flex justify-between mb-2">
                            <div className="flex items-center">
                              <div className="flex">
                                {Array(5).fill(0).map((_, i) => (
                                  <Star key={i} className={`h-4 w-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-200'}`} fill={i < 4 ? 'currentColor' : 'none'} />
                                ))}
                              </div>
                              <span className="ml-2 font-medium">Juan C.</span>
                            </div>
                            <div className="text-sm text-gray-500">2025-04-12</div>
                          </div>
                          <p>Good rice overall, but the packaging could be improved. The rice itself is of high quality though.</p>
                          <div className="flex justify-end mt-2 gap-2">
                            <Button size="sm" variant="ghost">Reply</Button>
                            <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50">Remove</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  };

  const renderOrderDetail = () => {
    const order = data as any;
    
    return (
      <>
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Order #{order.orderNumber}</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Placed on {order.date}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status}
                </span>
                <Button variant="outline">Update Status</Button>
                <Button variant="outline">
                  <Printer className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium mb-2">Customer Information</h3>
                <p>{order.customer}</p>
                <p className="text-sm text-gray-500">Customer since 2024</p>
                <div className="mt-2">
                  <Button variant="link" className="p-0 h-auto text-sm">
                    View Customer Profile
                  </Button>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Shipping Address</h3>
                <p>{order.shipping.address}</p>
                <p className="text-sm text-gray-500 mt-1">Method: {order.shipping.method}</p>
                <p className="text-sm text-gray-500">Cost: {order.shipping.cost}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Payment Information</h3>
                <p>Method: {order.payment.method}</p>
                <p className="text-sm text-gray-500 mt-1">Status: {order.payment.status}</p>
                <p className="text-sm text-gray-500">Reference: {order.payment.reference}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="py-3 px-4 text-left">Item</th>
                        <th className="py-3 px-4 text-left">Quantity</th>
                        <th className="py-3 px-4 text-left">Price</th>
                        <th className="py-3 px-4 text-left">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item: any, index: number) => (
                        <tr key={index} className="border-b">
                          <td className="py-4 px-4">{item.name}</td>
                          <td className="py-4 px-4">{item.quantity}</td>
                          <td className="py-4 px-4">{item.price}</td>
                          <td className="py-4 px-4">{item.subtotal}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <div className="w-full max-w-xs">
                    <div className="flex justify-between py-2">
                      <span>Subtotal:</span>
                      <span>₱1,175</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span>Shipping:</span>
                      <span>{order.shipping.cost}</span>
                    </div>
                    <div className="flex justify-between py-2 border-t border-dashed font-medium">
                      <span>Total:</span>
                      <span>{order.total}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.timeline.map((event: any, index: number) => (
                    <div key={index} className="relative pl-6">
                      {index !== order.timeline.length - 1 && (
                        <div className="absolute left-2 top-4 h-full w-px bg-gray-200"></div>
                      )}
                      <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full bg-blue-500"></div>
                      <div>
                        <p className="font-medium">{event.status}</p>
                        <p className="text-sm text-gray-500">{event.date}</p>
                        {event.note && (
                          <p className="text-sm mt-1">{event.note}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  };

  const renderContent = () => {
    switch (type) {
      case 'product':
        return renderProductDetail();
      case 'order':
        return renderOrderDetail();
      default:
        return (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{data.name || `Item ${id}`}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm">Delete</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p>Detail information for {data.name || `item ${id}`}</p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {Object.entries(data).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-sm font-medium text-gray-500">{key}</p>
                    <p>{String(value)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
    }
  };
  
  // Import the Star icon for products and reviews
  import { Star, Printer } from "lucide-react";

  return (
    <Layout>
      <Helmet>
        <title>{title} - Smarketplace Admin</title>
      </Helmet>
      <div className="container py-8">
        {getBreadcrumbs()}
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{title}</h1>
          <p className="text-gray-600">View and manage detailed information</p>
        </div>
        
        {renderContent()}
      </div>
    </Layout>
  );
};

export default DetailPage;

