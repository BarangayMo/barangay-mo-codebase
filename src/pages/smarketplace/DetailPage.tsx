import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { 
  Package, 
  User, 
  ShoppingBag, 
  ArrowLeft, 
  ExternalLink, 
  Users, 
  Calendar, 
  FileText, 
  Clock, 
  Settings,
  ShoppingCart,
  DollarSign,
  Star
} from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ModernTabs, TabItem } from "@/components/dashboard/ModernTabs";
import { DashboardBreadcrumb } from "@/components/dashboard/Breadcrumb";
import { StatsCard } from "@/components/dashboard/StatsCard";

const mockProductData = {
  id: "prod-12345",
  name: "Organic Farm Fresh Eggs",
  category: "Food",
  price: 120,
  description: "Farm-fresh organic eggs from free-range chickens. Sold in packs of 12.",
  stock: 23,
  status: "Active",
  sku: "EGG-ORG-12",
  vendor: "Green Farms Co-op",
  dateAdded: "2025-03-15",
  lastUpdated: "2025-04-20",
  images: ["https://via.placeholder.com/300?text=Egg+Product", "https://via.placeholder.com/300?text=Package"],
  rating: 4.8,
  reviews: 24,
  sales: {
    monthly: 145,
    weekly: 36,
    daily: 5
  },
  specifications: [
    { key: "Weight", value: "600g" },
    { key: "Dimensions", value: "12cm x 12cm x 6cm" },
    { key: "Source", value: "Local Farm" },
    { key: "Organic", value: "Yes" },
  ]
};

const mockOrderData = {
  id: "ORD-67890",
  customer: "Sofia Lopez",
  date: "2025-04-22",
  status: "Processing",
  total: 750,
  items: [
    { id: 1, name: "Organic Farm Fresh Eggs", quantity: 2, price: 120, total: 240 },
    { id: 2, name: "Coconut Oil Soap", quantity: 3, price: 85, total: 255 },
    { id: 3, name: "Hand-woven Basket", quantity: 1, price: 255, total: 255 }
  ],
  shippingAddress: {
    street: "123 Maharlika St.",
    city: "Quezon City",
    province: "Metro Manila",
    postal: "1103",
    country: "Philippines"
  },
  paymentMethod: "GCash",
  shippingMethod: "Standard Delivery",
  notes: "Please leave at the doorstep",
  timeline: [
    { status: "Order Placed", date: "2025-04-22 09:15:00", note: "Order received" },
    { status: "Payment Verified", date: "2025-04-22 09:20:00", note: "GCash payment verified" },
    { status: "Processing", date: "2025-04-22 10:30:00", note: "Order sent to vendor for processing" },
  ]
};

const mockVendorData = {
  id: "VEN-54321",
  name: "Green Farms Co-op",
  contactPerson: "Miguel Santos",
  email: "contact@greenfarmscoop.ph",
  phone: "+63 912 345 6789",
  joinDate: "2024-11-15",
  status: "Active",
  productsListed: 32,
  totalSales: 325650,
  commission: 10,
  rating: 4.7,
  address: {
    street: "456 Rizal Avenue",
    city: "Antipolo",
    province: "Rizal",
    postal: "1870",
    country: "Philippines"
  },
  bankDetails: {
    bankName: "BDO",
    accountName: "Green Farms Cooperative",
    accountNumber: "XXXX-XXXX-1234"
  },
  categories: ["Food", "Organic", "Farm Products"],
  recentOrders: [
    { id: "ORD-67890", date: "2025-04-22", amount: 750, status: "Processing" },
    { id: "ORD-67880", date: "2025-04-21", amount: 450, status: "Completed" },
    { id: "ORD-67870", date: "2025-04-19", amount: 1250, status: "Completed" }
  ]
};

const mockCustomerData = {
  id: "CUST-98765",
  name: "Sofia Lopez",
  email: "sofia.lopez@email.com",
  phone: "+63 917 123 4567",
  registrationDate: "2024-12-05",
  status: "Active",
  totalOrders: 15,
  totalSpent: 12750,
  lastPurchase: "2025-04-22",
  address: {
    street: "123 Maharlika St.",
    city: "Quezon City",
    province: "Metro Manila",
    postal: "1103",
    country: "Philippines"
  },
  wishlist: [
    { id: "prod-12345", name: "Organic Farm Fresh Eggs", price: 120 },
    { id: "prod-12346", name: "Handmade Bamboo Basket", price: 450 }
  ],
  recentOrders: [
    { id: "ORD-67890", date: "2025-04-22", amount: 750, status: "Processing" },
    { id: "ORD-67850", date: "2025-04-10", amount: 1200, status: "Completed" },
    { id: "ORD-67820", date: "2025-03-28", amount: 575, status: "Completed" }
  ]
};

const productTabItems: TabItem[] = [
  { value: "details", label: "Details", icon: <FileText className="h-4 w-4" /> },
  { value: "inventory", label: "Inventory", icon: <Package className="h-4 w-4" /> },
  { value: "images", label: "Images", icon: <ExternalLink className="h-4 w-4" /> },
  { value: "reviews", label: "Reviews", icon: <Users className="h-4 w-4" /> }
];

const orderTabItems: TabItem[] = [
  { value: "overview", label: "Overview", icon: <FileText className="h-4 w-4" /> },
  { value: "items", label: "Order Items", icon: <ShoppingBag className="h-4 w-4" /> },
  { value: "timeline", label: "Timeline", icon: <Clock className="h-4 w-4" /> },
  { value: "customer", label: "Customer", icon: <User className="h-4 w-4" /> }
];

const vendorTabItems: TabItem[] = [
  { value: "overview", label: "Overview", icon: <FileText className="h-4 w-4" /> },
  { value: "products", label: "Products", icon: <ShoppingBag className="h-4 w-4" /> },
  { value: "orders", label: "Orders", icon: <Package className="h-4 w-4" /> },
  { value: "settings", label: "Settings", icon: <Settings className="h-4 w-4" /> }
];

const customerTabItems: TabItem[] = [
  { value: "overview", label: "Overview", icon: <FileText className="h-4 w-4" /> },
  { value: "orders", label: "Order History", icon: <Package className="h-4 w-4" /> },
  { value: "wishlist", label: "Wishlist", icon: <ShoppingBag className="h-4 w-4" /> },
  { value: "settings", label: "Settings", icon: <Settings className="h-4 w-4" /> }
];

const StatusBadge = ({ status }: { status: string }) => {
  let color = "";
  
  switch (status.toLowerCase()) {
    case "active":
    case "completed":
    case "approved":
      color = "bg-green-100 text-green-800";
      break;
    case "processing":
    case "pending":
    case "in review":
      color = "bg-amber-100 text-amber-800";
      break;
    case "inactive":
    case "cancelled":
    case "rejected":
      color = "bg-red-100 text-red-800";
      break;
    default:
      color = "bg-gray-100 text-gray-800";
  }
  
  return (
    <Badge variant="outline" className={`${color} font-medium`}>
      {status}
    </Badge>
  );
};

const DetailPage = ({ type }: { type: "product" | "order" | "vendor" | "customer" }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      let entityData;
      switch (type) {
        case "product":
          entityData = mockProductData;
          break;
        case "order":
          entityData = mockOrderData;
          break;
        case "vendor":
          entityData = mockVendorData;
          break;
        case "customer":
          entityData = mockCustomerData;
          break;
        default:
          entityData = null;
      }
      setData(entityData);
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timeout);
  }, [type]);
  
  const getTabItems = () => {
    switch (type) {
      case "product":
        return productTabItems;
      case "order":
        return orderTabItems;
      case "vendor":
        return vendorTabItems;
      case "customer":
        return customerTabItems;
      default:
        return [];
    }
  };
  
  const getEntityName = () => {
    if (!data) return '';
    
    switch (type) {
      case "product":
        return data.name;
      case "order":
        return `Order #${data.id}`;
      case "vendor":
        return data.name;
      case "customer":
        return data.name;
      default:
        return '';
    }
  };
  
  const getEntityStatus = () => {
    if (!data) return '';
    return data.status;
  };
  
  const getEntityIcon = () => {
    switch (type) {
      case "product":
        return <ShoppingBag className="h-5 w-5 text-primary" />;
      case "order":
        return <Package className="h-5 w-5 text-primary" />;
      case "vendor":
        return <Users className="h-5 w-5 text-primary" />;
      case "customer":
        return <User className="h-5 w-5 text-primary" />;
      default:
        return null;
    }
  };
  
  const getBreadcrumbItems = () => {
    const parentLabel = 
      type === "product" ? "Products" :
      type === "order" ? "Orders" :
      type === "vendor" ? "Vendors" :
      type === "customer" ? "Customers" : "";
    
    const parentHref = 
      type === "product" ? "/admin/smarketplace/products/all" :
      type === "order" ? "/admin/smarketplace/orders/all" :
      type === "vendor" ? "/admin/smarketplace/vendors/directory" :
      type === "customer" ? "/admin/smarketplace/customers/all" : "";
    
    return [
      { 
        label: "Smarketplace",
        href: "/admin/smarketplace"
      },
      {
        label: parentLabel,
        href: parentHref
      },
      {
        label: getEntityName() || `${type.charAt(0).toUpperCase() + type.slice(1)} Details`
      }
    ];
  };
  
  const getPageTitle = () => {
    switch (type) {
      case "product":
        return "Product Details";
      case "order":
        return "Order Details";
      case "vendor":
        return "Vendor Details";
      case "customer":
        return "Customer Details";
      default:
        return "Details";
    }
  };

  const handleBack = () => {
    switch (type) {
      case "product":
        navigate("/admin/smarketplace/products/all");
        break;
      case "order":
        navigate("/admin/smarketplace/orders/all");
        break;
      case "vendor": 
        navigate("/admin/smarketplace/vendors/directory");
        break;
      case "customer":
        navigate("/admin/smarketplace/customers/all");
        break;
      default:
        navigate(-1);
    }
  };
  
  if (loading) {
    return (
      <div className="container py-8">
        <Helmet>
          <title>{getPageTitle()} - Smarketplace Admin</title>
        </Helmet>
        <div className="flex items-center justify-center h-64">
          <div className="h-8 w-8 rounded-full border-4 border-t-blue-500 border-b-blue-700 border-l-blue-300 border-r-blue-300 animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Helmet>
        <title>{getPageTitle()} - Smarketplace Admin</title>
      </Helmet>

      <div className="mb-6">
        <DashboardBreadcrumb items={getBreadcrumbItems()} />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {getEntityIcon()}
            <h1 className="text-2xl font-bold">{getEntityName()}</h1>
            <StatusBadge status={getEntityStatus()} />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button size="sm">Edit</Button>
          </div>
        </div>
      </div>

      <ModernTabs defaultValue={getTabItems()[0].value} items={getTabItems()}>
        {type === "product" && (
          <>
            <TabsContent value="details">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Product Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Product Name</p>
                        <p className="text-base">{data.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Category</p>
                        <p className="text-base">{data.category}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">SKU</p>
                        <p className="text-base">{data.sku}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Vendor</p>
                        <p className="text-base">{data.vendor}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Date Added</p>
                        <p className="text-base">{data.dateAdded}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Last Updated</p>
                        <p className="text-base">{data.lastUpdated}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <p className="text-sm font-medium text-gray-500">Description</p>
                      <p className="text-base mt-1">{data.description}</p>
                    </div>
                    
                    <div className="mt-6">
                      <p className="text-sm font-medium text-gray-500 mb-3">Specifications</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {data.specifications.map((spec: any, index: number) => (
                          <div key={index} className="flex justify-between border-b pb-2">
                            <span className="text-gray-600">{spec.key}</span>
                            <span className="font-medium">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex flex-col gap-4">
                  <StatsCard 
                    title="Total Sales"
                    value="485"
                    icon={<ShoppingCart className="h-5 w-5 text-blue-500" />}
                    iconColor="bg-blue-50"
                  />
                  
                  <StatsCard 
                    title="Revenue"
                    value={`₱${data.price * 485}`}
                    icon={<DollarSign className="h-5 w-5 text-green-500" />}
                    iconColor="bg-green-50"
                  />
                  
                  <StatsCard 
                    title="Rating"
                    value={`${data.rating}/5`}
                    icon={<Star className="h-5 w-5 text-amber-500" />}
                    iconColor="bg-amber-50"
                    change={{ value: 12, isPositive: true }}
                  />
                  
                  <StatsCard 
                    title="Stock"
                    value={data.stock}
                    icon={<Package className="h-5 w-5 text-purple-500" />}
                    iconColor="bg-purple-50"
                    change={{ value: 8, isPositive: false }}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="inventory">
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Current Stock</p>
                      <p className="text-3xl font-bold mt-1">{data.stock}</p>
                      <Button className="mt-4" size="sm">Update Stock</Button>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Stock Status</p>
                      <StatusBadge status={data.stock > 10 ? "In Stock" : "Low Stock"} />
                      <p className="text-sm mt-2 text-gray-500">
                        {data.stock > 10 
                          ? "Stock levels are healthy" 
                          : "Consider restocking soon"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">SKU</p>
                      <p className="text-base mt-1">{data.sku}</p>
                      <p className="text-sm mt-2 text-gray-500">
                        Product identifier used for inventory tracking
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="images">
              <Card>
                <CardHeader>
                  <CardTitle>Product Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {data.images.map((image: string, index: number) => (
                      <div key={index} className="border rounded-md overflow-hidden">
                        <img src={image} alt={`Product ${index + 1}`} className="w-full h-auto" />
                      </div>
                    ))}
                    <div className="border rounded-md overflow-hidden border-dashed flex items-center justify-center h-64">
                      <Button variant="ghost">+ Add Image</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>Product Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-8 text-gray-500">
                    This product has {data.reviews} reviews with an average rating of {data.rating}/5.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}

        {type === "order" && (
          <>
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Order Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Order ID</p>
                        <p className="text-base">{data.id}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Customer</p>
                        <p className="text-base">{data.customer}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Date</p>
                        <p className="text-base">{data.date}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Status</p>
                        <StatusBadge status={data.status} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total</p>
                        <p className="text-base font-medium">₱{data.total.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Payment Method</p>
                        <p className="text-base">{data.paymentMethod}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <p className="text-sm font-medium text-gray-500 mb-2">Shipping Address</p>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p>{data.shippingAddress.street}</p>
                        <p>{data.shippingAddress.city}, {data.shippingAddress.province} {data.shippingAddress.postal}</p>
                        <p>{data.shippingAddress.country}</p>
                      </div>
                    </div>
                    
                    {data.notes && (
                      <div className="mt-6">
                        <p className="text-sm font-medium text-gray-500">Order Notes</p>
                        <p className="text-base mt-1 bg-gray-50 p-4 rounded-md">{data.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <div className="flex flex-col gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Subtotal</span>
                          <span>₱{data.total.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Shipping</span>
                          <span>₱0</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Tax</span>
                          <span>₱0</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between font-bold">
                          <span>Total</span>
                          <span>₱{data.total.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <Button variant="outline">Update Status</Button>
                        <Button>Print Invoice</Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-2">Shipping</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Method</span>
                          <span>{data.shippingMethod}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Tracking</span>
                          <span>Not available</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="items">
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left p-3 border-b">Item</th>
                          <th className="text-center p-3 border-b">Quantity</th>
                          <th className="text-right p-3 border-b">Price</th>
                          <th className="text-right p-3 border-b">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.items.map((item: any) => (
                          <tr key={item.id} className="border-b">
                            <td className="p-3">{item.name}</td>
                            <td className="p-3 text-center">{item.quantity}</td>
                            <td className="p-3 text-right">₱{item.price.toLocaleString()}</td>
                            <td className="p-3 text-right font-medium">₱{item.total.toLocaleString()}</td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50">
                          <td colSpan={2} className="p-3"></td>
                          <td className="p-3 text-right font-medium">Total</td>
                          <td className="p-3 text-right font-bold">₱{data.total.toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="timeline">
              <Card>
                <CardHeader>
                  <CardTitle>Order Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {data.timeline.map((event: any, index: number) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <div className="h-3 w-3 rounded-full bg-blue-500" />
                          </div>
                          {index < data.timeline.length - 1 && (
                            <div className="h-full w-0.5 bg-gray-200" />
                          )}
                        </div>
                        <div>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                            <p className="font-medium">{event.status}</p>
                            <p className="text-sm text-gray-500">{event.date}</p>
                          </div>
                          {event.note && <p className="text-sm mt-1">{event.note}</p>}
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="h-8 w-8 rounded-full border border-dashed border-gray-300 flex items-center justify-center">
                          <div className="h-3 w-3 rounded-full bg-gray-200" />
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Button variant="outline" size="sm">Update Status</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="customer">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-8 w-8 text-gray-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium">{data.customer}</h3>
                          <p className="text-sm text-gray-500">Customer since Dec 2024</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Email</p>
                          <p>sofia.lopez@email.com</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Phone</p>
                          <p>+63 917 123 4567</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Address</p>
                          <div className="mt-1">
                            <p>{data.shippingAddress.street}</p>
                            <p>{data.shippingAddress.city}, {data.shippingAddress.province} {data.shippingAddress.postal}</p>
                            <p>{data.shippingAddress.country}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Previous Orders</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                          <div>
                            <p className="font-medium">#ORD-67850</p>
                            <p className="text-sm text-gray-500">April 10, 2025</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₱1,200</p>
                            <StatusBadge status="Completed" />
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                          <div>
                            <p className="font-medium">#ORD-67820</p>
                            <p className="text-sm text-gray-500">March 28, 2025</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₱575</p>
                            <StatusBadge status="Completed" />
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button variant="outline">View All Orders</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}

        {type === "vendor" && (
          <>
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Vendor Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                        <Users className="h-8 w-8 text-green-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">{data.name}</h3>
                        <p className="text-sm text-gray-500">Joined {data.joinDate}</p>
                        <StatusBadge status={data.status} />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Contact Person</p>
                        <p className="text-base">{data.contactPerson}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="text-base">{data.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Phone</p>
                        <p className="text-base">{data.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Categories</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {data.categories.map((category: string, index: number) => (
                            <Badge key={index} variant="secondary">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <p className="text-sm font-medium text-gray-500 mb-2">Address</p>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p>{data.address.street}</p>
                        <p>{data.address.city}, {data.address.province} {data.address.postal}</p>
                        <p>{data.address.country}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <p className="text-sm font-medium text-gray-500 mb-2">Bank Details</p>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p><span className="font-medium">Bank:</span> {data.bankDetails.bankName}</p>
                        <p><span className="font-medium">Account Name:</span> {data.bankDetails.accountName}</p>
                        <p><span className="font-medium">Account Number:</span> {data.bankDetails.accountNumber}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex flex-col gap-4">
                  <StatsCard 
                    title="Total Products"
                    value={data.productsListed}
                    icon={<Package className="h-5 w-5 text-blue-500" />}
                    iconColor="bg-blue-50"
                  />
                  
                  <StatsCard 
                    title="Total Revenue"
                    value={data.totalSales}
                    icon={<DollarSign className="h-5 w-5 text-green-500" />}
                    iconColor="bg-green-50"
                    trend={{ value: 8.2, isPositive: true }}
                  />
                  
                  <StatsCard 
                    title="Commission Rate"
                    value={`${data.commission}%`}
                    icon={<Clock className="h-5 w-5 text-purple-500" />}
                    iconColor="bg-purple-50"
                  />
                  
                  <StatsCard 
                    title="Rating"
                    value={`${data.rating}/5`}
                    icon={<User className="h-5 w-5 text-amber-500" />}
                    iconColor="bg-amber-50"
                  />
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y">
                        {data.recentOrders.map((order: any, index: number) => (
                          <div key={index} className="flex justify-between items-center p-4">
                            <div>
                              <p className="font-medium">{order.id}</p>
                              <p className="text-sm text-gray-500">{order.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">₱{order.amount}</p>
                              <StatusBadge status={order.status} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <CardTitle>Vendor Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-8 text-gray-500">
                    This vendor has {data.productsListed} products listed in the marketplace.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Vendor Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-8 text-gray-500">
                    Order details for this vendor will be displayed here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Vendor Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-8 text-gray-500">
                    Vendor-specific settings and configuration options.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
        
        {type === "customer" && (
          <>
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-8 w-8 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">{data.name}</h3>
                        <p className="text-sm text-gray-500">Member since {data.registrationDate}</p>
                        <StatusBadge status={data.status} />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="text-base">{data.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Phone</p>
                        <p className="text-base">{data.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Orders</p>
                        <p className="text-base">{data.totalOrders}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Spent</p>
                        <p className="text-base font-medium">₱{data.totalSpent.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Last Purchase</p>
                        <p className="text-base">{data.lastPurchase}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <p className="text-sm font-medium text-gray-500 mb-2">Address</p>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p>{data.address.street}</p>
                        <p>{data.address.city}, {data.address.province} {data.address.postal}</p>
                        <p>{data.address.country}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex flex-col gap-4">
                  <StatsCard 
                    title="Total Spent"
                    value={`₱${data.totalSpent.toLocaleString()}`}
                    icon={<ShoppingBag className="h-5 w-5 text-green-500" />}
                    iconColor="bg-green-50"
                  />
                  
                  <StatsCard 
                    title="Total Orders"
                    value={data.totalOrders}
                    icon={<Package className="h-5 w-5 text-blue-500" />}
                    iconColor="bg-blue-50"
                  />
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y">
                        {data.recentOrders.map((order: any, index: number) => (
                          <div key={index} className="flex justify-between items-center p-4">
                            <div>
                              <p className="font-medium">{order.id}</p>
                              <p className="text-sm text-gray-500">{order.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">₱{order.amount.toLocaleString()}</p>
                              <StatusBadge status={order.status} />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-4">
                        <Button variant="outline" size="sm" className="w-full">View All Orders</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="orders">
              <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <CardTitle>Order History</CardTitle>
                  <Button variant="outline" size="sm">Export Orders</Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left p-3 border-b">Order ID</th>
                          <th className="text-left p-3 border-b">Date</th>
                          <th className="text-right p-3 border-b">Amount</th>
                          <th className="text-center p-3 border-b">Status</th>
                          <th className="text-right p-3 border-b">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.recentOrders.map((order: any, index: number) => (
                          <tr key={index} className="border-b">
                            <td className="p-3 font-medium">{order.id}</td>
                            <td className="p-3">{order.date}</td>
                            <td className="p-3 text-right">₱{order.amount.toLocaleString()}</td>
                            <td className="p-3 text-center">
                              <StatusBadge status={order.status} />
                            </td>
                            <td className="p-3 text-right">
                              <Button variant="ghost" size="sm">View</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="wishlist">
              <Card>
                <CardHeader>
                  <CardTitle>Wishlist Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.wishlist.map((item: any) => (
                      <Card key={item.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-500 mt-1">₱{item.price}</p>
                            </div>
                            <Button variant="ghost" size="sm">View</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-8 text-gray-500">
                    Customer account settings and preferences.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
      </ModernTabs>
    </div>
  );
};

export default DetailPage;
