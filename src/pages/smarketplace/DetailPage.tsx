import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft,
  MoreHorizontal,
  Download,
  Pencil,
  Check,
  X,
  ChevronRight,
  Star,
  Printer,
  Activity,
  FileText,
  Settings,
  MessageSquare,
  Clock,
  BarChart,
  Tag,
  Truck,
  ShieldCheck,
  Plus,
  User,
  ShoppingBag
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DetailPageProps {
  type: 'product' | 'order' | 'vendor' | 'customer';
}

const DetailPage = ({ type }: DetailPageProps) => {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  
  const getTitle = () => {
    switch (type) {
      case 'product':
        return `Product ${id}`;
      case 'order':
        return `Order ${id}`;
      case 'vendor':
        return `Vendor ${id}`;
      case 'customer':
        return `Customer ${id}`;
      default:
        return `Item ${id}`;
    }
  };

  const getData = () => {
    switch (type) {
      case 'product':
        return {
          id: id || 'P001',
          name: 'Organic Rice (5kg)',
          description: 'Premium organic rice grown without pesticides from local farms.',
          category: 'Groceries',
          subcategory: 'Grains & Rice',
          price: '₱350',
          stock: 125,
          sku: 'RICE-ORG-5KG',
          barcode: '9501234567890',
          vendor: 'Green Farms Co-op',
          status: 'Active',
          dateAdded: '2025-01-15',
          lastUpdated: '2025-04-10',
          ratings: {
            average: 4.8,
            count: 58
          },
          variants: [
            { id: 'V001', name: '2kg Pack', price: '₱150', stock: 87 },
            { id: 'V002', name: '10kg Pack', price: '₱680', stock: 32 }
          ],
          images: [
            '/placeholder.svg',
            '/placeholder.svg',
            '/placeholder.svg'
          ],
          sales: {
            total: '₱20,300',
            units: 58,
            lastMonth: '₱8,750'
          },
          attributes: {
            weight: '5kg',
            color: 'White',
            organic: 'Yes',
            packaging: 'Eco-friendly'
          },
          reviews: [
            { id: 'R001', customer: 'Maria S.', rating: 5, comment: 'Excellent quality rice!', date: '2025-03-28' },
            { id: 'R002', customer: 'Juan C.', rating: 4, comment: 'Good product, but packaging could be better.', date: '2025-03-15' }
          ]
        };
      
      case 'order':
        return {
          id: id || 'ORD-2521',
          customer: {
            name: 'Maria Santos',
            email: 'maria@example.com',
            phone: '+63 912 345 6789',
            avatar: '/placeholder.svg'
          },
          date: '2025-04-20',
          status: 'Delivered',
          paymentStatus: 'Paid',
          paymentMethod: 'Credit Card',
          total: '₱1,250',
          subtotal: '₱1,150',
          shipping: '₱100',
          tax: '₱0',
          items: [
            { id: 'P001', name: 'Organic Rice (5kg)', quantity: 2, price: '₱350', total: '₱700' },
            { id: 'P003', name: 'Coconut Soap', quantity: 3, price: '₱85', total: '₱255' },
            { id: 'P004', name: 'Dried Mango', quantity: 2, price: '₱220', total: '₱440' }
          ],
          timeline: [
            { status: 'Order Placed', date: '2025-04-20 08:23:15', note: 'Customer placed order' },
            { status: 'Payment Confirmed', date: '2025-04-20 08:25:30', note: 'Payment via Credit Card' },
            { status: 'Processing', date: '2025-04-20 09:45:12', note: 'Order sent to vendor' },
            { status: 'Shipped', date: '2025-04-21 14:30:00', note: 'Package in transit via LBC Express #12345' },
            { status: 'Delivered', date: '2025-04-22 15:15:45', note: 'Signed by recipient' }
          ],
          shippingAddress: {
            name: 'Maria Santos',
            line1: '123 Sampaguita St.',
            line2: 'Barangay San Isidro',
            city: 'Makati City',
            province: 'Metro Manila',
            postal: '1234'
          },
          billingAddress: {
            name: 'Maria Santos',
            line1: '123 Sampaguita St.',
            line2: 'Barangay San Isidro',
            city: 'Makati City',
            province: 'Metro Manila',
            postal: '1234'
          }
        };
      
      case 'vendor':
        return {
          id: id || 'V001',
          name: 'Green Farms Co-op',
          email: 'contact@greenfarms.coop',
          phone: '+63 912 345 6789',
          contactPerson: 'Antonio Reyes',
          logo: '/placeholder.svg',
          status: 'Verified',
          rating: 4.8,
          totalSales: '₱325,650',
          address: {
            line1: '456 Rice Field Road',
            line2: 'Barangay Maunlad',
            city: 'San Pablo City',
            province: 'Laguna',
            postal: '4000'
          },
          bankInfo: {
            bank: 'Barangay Bank',
            accountName: 'Green Farms Cooperative',
            accountNumber: '•••• •••• •••• 1234',
            routingCode: '••••••••'
          },
          joined: '2024-08-15',
          commission: '10%',
          categories: ['Groceries', 'Fresh Produce', 'Organic'],
          productItems: [
            { id: 'P001', name: 'Organic Rice (5kg)', stock: 125, price: '₱350', sales: 58 },
            { id: 'P012', name: 'Organic Brown Rice (5kg)', stock: 89, price: '₱380', sales: 42 },
            { id: 'P024', name: 'Fresh Vegetables Bundle', stock: 15, price: '₱450', sales: 37 }
          ],
          payouts: [
            { id: 'PAY001', date: '2025-03-30', amount: '₱45,230', status: 'Completed' },
            { id: 'PAY002', date: '2025-02-28', amount: '₱39,780', status: 'Completed' },
            { id: 'PAY003', date: '2025-01-30', amount: '₱52,450', status: 'Completed' }
          ],
          performance: {
            ordersCompleted: 258,
            ordersCancelled: 12,
            returnsRate: '3.5%',
            averageRating: 4.8,
            responseTime: '1.2 hours'
          }
        };
      
      case 'customer':
        return {
          id: id || 'C001',
          name: 'Maria Santos',
          email: 'maria@example.com',
          phone: '+63 912 345 6789',
          avatar: '/placeholder.svg',
          status: 'Active',
          joined: '2024-10-15',
          orders: 12,
          totalSpending: '₱25,350',
          lastOrder: '2025-04-10',
          address: {
            line1: '123 Sampaguita St.',
            line2: 'Barangay San Isidro',
            city: 'Makati City',
            province: 'Metro Manila',
            postal: '1234'
          },
          preferences: {
            paymentMethod: 'Credit Card',
            notifications: true,
            newsletter: true
          },
          recentActivity: [
            { type: 'order', date: '2025-04-10', description: 'Placed Order #ORD-2521', amount: '₱1,250' },
            { type: 'review', date: '2025-04-08', description: 'Reviewed "Organic Rice (5kg)"', rating: 5 },
            { type: 'order', date: '2025-03-22', description: 'Placed Order #ORD-2498', amount: '₱2,430' }
          ],
          orderHistory: [
            { id: 'ORD-2521', date: '2025-04-10', status: 'Delivered', total: '₱1,250', items: 3 },
            { id: 'ORD-2498', date: '2025-03-22', status: 'Delivered', total: '₱2,430', items: 5 },
            { id: 'ORD-2442', date: '2025-02-15', status: 'Delivered', total: '₱980', items: 2 }
          ]
        };
      default:
        return { id };
    }
  };
  
  const data = getData();
  
  const getBackPath = () => {
    switch (type) {
      case 'product':
        return '/admin/smarketplace/products/all';
      case 'order':
        return '/admin/smarketplace/orders/all';
      case 'vendor':
        return '/admin/smarketplace/vendors/directory';
      case 'customer':
        return '/admin/smarketplace/customers/all';
      default:
        return '/admin/smarketplace';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'delivered':
      case 'completed':
      case 'verified':
      case 'paid':
        return 'bg-green-500';
      case 'pending':
      case 'processing':
      case 'pending review':
      case 'pending payment':
        return 'bg-yellow-500';
      case 'cancelled':
      case 'inactive':
      case 'failed':
        return 'bg-red-500';
      case 'shipped':
      case 'in transit':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const renderContent = () => {
    switch (type) {
      case 'product':
        return (
          <div>
            <div className="flex flex-col-reverse md:flex-row gap-6 mb-6">
              <div className="flex-1">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Product Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Name</p>
                        <p className="text-base">{data.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">SKU</p>
                        <p className="text-base">{data.sku}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Category</p>
                        <p className="text-base">{data.category} / {data.subcategory}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Price</p>
                        <p className="text-base font-semibold">{data.price}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Stock</p>
                        <p className="text-base">{data.stock} units</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Vendor</p>
                        <p className="text-base">{data.vendor}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-500 mb-1">Description</p>
                      <p className="text-sm">{data.description}</p>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-500 mb-1">Attributes</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {Object.entries(data.attributes).map(([key, value]) => (
                          <Badge key={key} variant="outline" className="bg-gray-50">
                            {key}: {value}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Sales Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Total Sales</span>
                          <span className="font-semibold">{data.sales.total}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Units Sold</span>
                          <span>{data.sales.units}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Last Month</span>
                          <span>{data.sales.lastMonth}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Ratings & Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={16}
                                fill={star <= Math.floor(data.ratings.average) ? "gold" : "none"}
                                stroke={star <= Math.floor(data.ratings.average) ? "gold" : "currentColor"}
                              />
                            ))}
                          </div>
                          <span className="font-bold">{data.ratings.average}</span>
                          <span className="text-sm text-gray-500">({data.ratings.count} reviews)</span>
                        </div>
                        
                        <div className="border-t pt-2 mt-2">
                          <p className="text-sm font-medium">Recent Reviews:</p>
                          {data.reviews.map((review) => (
                            <div key={review.id} className="border-b pb-2 pt-2">
                              <div className="flex justify-between">
                                <span className="text-sm font-medium">{review.customer}</span>
                                <div className="flex items-center">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      size={12}
                                      fill={star <= review.rating ? "gold" : "none"}
                                      stroke={star <= review.rating ? "gold" : "currentColor"}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-xs text-gray-500">{review.date}</p>
                              <p className="text-sm mt-1">{review.comment}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="w-full md:w-1/3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Product Images</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4">
                      {data.images.map((image, index) => (
                        <div key={index} className="aspect-square rounded-md border overflow-hidden">
                          <img 
                            src={image} 
                            alt={`${data.name} - Image ${index + 1}`}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Product Variants</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.variants.map((variant) => (
                      <TableRow key={variant.id}>
                        <TableCell>{variant.id}</TableCell>
                        <TableCell>{variant.name}</TableCell>
                        <TableCell>{variant.price}</TableCell>
                        <TableCell>{variant.stock}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );
        
      case 'order':
        return (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={data.customer.avatar} alt={data.customer.name} />
                      <AvatarFallback>{data.customer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{data.customer.name}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <p>{data.customer.email}</p>
                        <span>•</span>
                        <p>{data.customer.phone}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Order Date</p>
                      <p>{data.date}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Payment Method</p>
                      <p>{data.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total</p>
                      <p className="font-bold">{data.total}</p>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-4 mb-6">
                    <p className="font-medium">Order Items</p>
                    {data.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b">
                        <div>
                          <p>{item.name}</p>
                          <p className="text-sm text-gray-500">{item.quantity} x {item.price}</p>
                        </div>
                        <p className="font-medium">{item.total}</p>
                      </div>
                    ))}
                    
                    <div className="pt-4">
                      <div className="flex justify-between">
                        <p className="text-sm text-gray-500">Subtotal</p>
                        <p>{data.subtotal}</p>
                      </div>
                      <div className="flex justify-between py-1">
                        <p className="text-sm text-gray-500">Shipping</p>
                        <p>{data.shipping}</p>
                      </div>
                      <div className="flex justify-between pt-2 border-t mt-2">
                        <p className="font-medium">Total</p>
                        <p className="font-bold">{data.total}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium mb-1">Shipping Address</p>
                      <div className="text-sm">
                        <p>{data.shippingAddress.name}</p>
                        <p>{data.shippingAddress.line1}</p>
                        {data.shippingAddress.line2 && <p>{data.shippingAddress.line2}</p>}
                        <p>{data.shippingAddress.city}, {data.shippingAddress.province}</p>
                        <p>{data.shippingAddress.postal}</p>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Billing Address</p>
                      <div className="text-sm">
                        <p>{data.billingAddress.name}</p>
                        <p>{data.billingAddress.line1}</p>
                        {data.billingAddress.line2 && <p>{data.billingAddress.line2}</p>}
                        <p>{data.billingAddress.city}, {data.billingAddress.province}</p>
                        <p>{data.billingAddress.postal}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Order Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Status</p>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${getStatusColor(data.status)}`}></span>
                          <p className="font-medium">{data.status}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Payment</p>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${getStatusColor(data.paymentStatus)}`}></span>
                          <p>{data.paymentStatus}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Button variant="outline" className="gap-2">
                        <Printer size={16} />
                        Print Invoice
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Download size={16} />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Order Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {data.timeline.map((event, index) => (
                        <div key={index} className="relative pl-6 pb-4">
                          {index < data.timeline.length - 1 && (
                            <div className="absolute top-2 left-[7px] h-full w-[2px] bg-gray-200"></div>
                          )}
                          <div className={`absolute top-1 left-0 w-3.5 h-3.5 rounded-full border-2 border-white ${getStatusColor(event.status)}`}></div>
                          <p className="text-sm font-medium">{event.status}</p>
                          <p className="text-xs text-gray-500">{event.date}</p>
                          <p className="text-xs mt-1">{event.note}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );
        
      case 'vendor':
        return (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-medium">Vendor Profile</CardTitle>
                    <Badge className={`${getStatusColor(data.status)} text-white`}>{data.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={data.logo} alt={data.name} />
                      <AvatarFallback>{data.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-medium">{data.name}</h3>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={14}
                              fill={star <= Math.floor(data.rating) ? "gold" : "none"}
                              stroke={star <= Math.floor(data.rating) ? "gold" : "currentColor"}
                            />
                          ))}
                        </div>
                        <p>{data.rating} rating</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Contact Person</p>
                      <p>{data.contactPerson}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p>{data.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p>{data.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Joined</p>
                      <p>{data.joined}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="font-medium mb-1">Address</p>
                      <div className="text-sm">
                        <p>{data.address.line1}</p>
                        {data.address.line2 && <p>{data.address.line2}</p>}
                        <p>{data.address.city}, {data.address.province}</p>
                        <p>{data.address.postal}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="font-medium mb-1">Categories</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {data.categories.map((category) => (
                          <Badge key={category} variant="secondary">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Vendor Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Sales</p>
                      <p className="text-2xl font-bold">{data.totalSales}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Orders Completed</p>
                        <p className="font-bold">{data.performance.ordersCompleted}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Orders Cancelled</p>
                        <p className="font-bold">{data.performance.ordersCancelled}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Returns Rate</p>
                        <p className="font-bold">{data.performance.returnsRate}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Response Time</p>
                        <p className="font-bold">{data.performance.responseTime}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Commission Rate</p>
                      <p className="font-bold">{data.commission}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-medium">Products</CardTitle>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Plus size={14} />
                    Add Product
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Sales</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.productItems.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.id}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>{product.price}</TableCell>
                        <TableCell>{product.sales}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500 mb-1">Banking Details</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <p className="text-gray-500">Bank</p>
                      <p>{data.bankInfo.bank}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-500">Account Name</p>
                      <p>{data.bankInfo.accountName}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-500">Account Number</p>
                      <p>{data.bankInfo.accountNumber}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-500">Routing Code</p>
                      <p>{data.bankInfo.routingCode}</p>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <p className="text-sm font-medium mb-2">Recent Payouts</p>
                <div className="space-y-2">
                  {data.payouts.map((payout) => (
                    <div key={payout.id} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <p className="font-medium">{payout.date}</p>
                        <p className="text-xs text-gray-500">ID: {payout.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{payout.amount}</p>
                        <Badge variant="outline" className={payout.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'}>
                          {payout.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      case 'customer':
        return (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-medium">Customer Profile</CardTitle>
                    <Badge className={`${getStatusColor(data.status)} text-white`}>{data.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={data.avatar} alt={data.name} />
                      <AvatarFallback>{data.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-medium">{data.name}</h3>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={14}
                              fill={star <= Math.floor(data.rating) ? "gold" : "none"}
                              stroke={star <= Math.floor(data.rating) ? "gold" : "currentColor"}
                            />
                          ))}
                        </div>
                        <p>{data.rating} rating</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Joined</p>
                      <p>{data.joined}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Orders</p>
                      <p>{data.orders}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Spending</p>
                      <p className="font-bold">{data.totalSpending}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Last Order</p>
                      <p>{data.lastOrder}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="font-medium mb-1">Address</p>
                      <div className="text-sm">
                        <p>{data.address.line1}</p>
                        {data.address.line2 && <p>{data.address.line2}</p>}
                        <p>{data.address.city}, {data.address.province}</p>
                        <p>{data.address.postal}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="font-medium mb-1">Preferences</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <Badge variant="outline" className={data.preferences.notifications ? 'text-green-600' : 'text-gray-500'}>
                          Notifications
                        </Badge>
                        <Badge variant="outline" className={data.preferences.newsletter ? 'text-green-600' : 'text-gray-500'}>
                          Newsletter
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.recentActivity.map((activity) => (
                      <div key={activity.type} className="flex justify-between items-center py-2 border-b">
                        <div>
                          <p className="font-medium">{activity.type}</p>
                          <p className="text-sm text-gray-500">{activity.date}</p>
                        </div>
                        <p className="font-bold">{activity.amount}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-medium">Order History</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Items</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.orderHistory.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{order.status}</TableCell>
                        <TableCell>{order.total}</TableCell>
                        <TableCell>{order.items}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );
      
      default:
        return <div>No data found</div>;
    }
  };

  const getDetailTabs = () => {
    switch (type) {
      case 'product':
        return [
          { icon: <Tag size={16} />, label: "Details", value: "details" },
          { icon: <BarChart size={16} />, label: "Analytics", value: "analytics" },
          { icon: <Star size={16} />, label: "Reviews", value: "reviews" },
          { icon: <Settings size={16} />, label: "Settings", value: "settings" },
        ];
      case 'order':
        return [
          { icon: <FileText size={16} />, label: "Details", value: "details" },
          { icon: <Clock size={16} />, label: "Timeline", value: "timeline" },
          { icon: <MessageSquare size={16} />, label: "Messages", value: "messages" },
          { icon: <Settings size={16} />, label: "Settings", value: "settings" },
        ];
      case 'vendor':
        return [
          { icon: <User size={16} />, label: "Profile", value: "details" },
          { icon: <ShoppingBag size={16} />, label: "Products", value: "products" },
          { icon: <Truck size={16} />, label: "Orders", value: "orders" },
          { icon: <Activity size={16} />, label: "Performance", value: "performance" },
          { icon: <ShieldCheck size={16} />, label: "Verification", value: "verification" },
        ];
      case 'customer':
        return [
          { icon: <User size={16} />, label: "Profile", value: "details" },
          { icon: <ShoppingBag size={16} />, label: "Orders", value: "orders" },
          { icon: <MessageSquare size={16} />, label: "Messages", value: "messages" },
          { icon: <Star size={16} />, label: "Reviews", value: "reviews" },
          { icon: <Settings size={16} />, label: "Preferences", value: "preferences" },
        ];
      default:
        return [
          { icon: <FileText size={16} />, label: "Details", value: "details" },
          { icon: <Settings size={16} />, label: "Settings", value: "settings" },
        ];
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>{getTitle()} - Smarketplace Admin - Barangay Mo</title>
      </Helmet>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Button variant="ghost" asChild className="p-1 h-auto">
                <Link to={getBackPath()}>
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <p className="text-sm text-gray-500">
                Back to {type === 'product' ? 'Products' : type === 'order' ? 'Orders' : type === 'vendor' ? 'Vendors' : 'Customers'}
              </p>
            </div>
            <h1 className="text-2xl font-bold">{getTitle()}</h1>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <>
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </>
              ) : (
                <>
                  <Pencil className="h-4 w-4" />
                  <span>Edit</span>
                </>
              )}
            </Button>
            
            {isEditing && (
              <Button className="gap-2">
                <Check className="h-4 w-4" />
                <span>Save Changes</span>
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  <span>Download</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Printer className="mr-2 h-4 w-4" />
                  <span>Print</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <X className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="details" className="w-full">
              <div className="border-b mb-6">
                <TabsList className="w-full justify-start">
                  {getDetailTabs().map((tab) => (
                    <TabsTrigger key={tab.value} value={tab.value}>
                      {tab.icon}
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              <TabsContent value="details">
                {renderContent()}
              </TabsContent>
              
              {getDetailTabs().slice(1).map((tab) => (
                <TabsContent key={tab.value} value={tab.value}>
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="p-4 rounded-full bg-gray-100">
                      {tab.icon}
                    </div>
                    <h3 className="mt-4 text-lg font-medium">
                      {tab.label} Coming Soon
                    </h3>
                    <p className="text-gray-500 text-center max-w-md mt-2">
                      This feature is currently in development and will be available soon.
                    </p>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DetailPage;
