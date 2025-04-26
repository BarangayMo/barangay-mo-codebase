import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ShoppingBag, 
  Package, 
  Users, 
  User, 
  Truck, 
  Gift, 
  ChartBar, 
  Star, 
  Cog, 
  Puzzle,
  BarChart,
  Clock,
  Calendar,
  Search
} from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

const SmarketplaceIndex = () => {
  const marketplaceModules = [
    { 
      title: "Product Management", 
      description: "Manage products, categories, variants and media", 
      icon: ShoppingBag,
      path: "/admin/smarketplace/products"
    },
    { 
      title: "Orders Management", 
      description: "View and manage orders, statuses and invoices", 
      icon: Package,
      path: "/admin/smarketplace/orders"
    },
    { 
      title: "Vendor Management", 
      description: "Manage vendors, payouts and commissions", 
      icon: Users,
      path: "/admin/smarketplace/vendors"
    },
    { 
      title: "Customer Management", 
      description: "View customers, purchase history and support", 
      icon: User,
      path: "/admin/smarketplace/customers" 
    },
    { 
      title: "Shipping & Fulfillment", 
      description: "Configure shipping zones and delivery options", 
      icon: Truck,
      path: "/admin/smarketplace/shipping"
    },
    { 
      title: "Promotions & Rewards", 
      description: "Create discount codes, gift cards and loyalty programs", 
      icon: Gift,
      path: "/admin/smarketplace/promotions"
    },
    { 
      title: "Financials & Reports", 
      description: "View sales reports, revenue and tax settings", 
      icon: ChartBar,
      path: "/admin/smarketplace/financials"
    },
    { 
      title: "Reviews & Moderation", 
      description: "Moderate product and vendor reviews", 
      icon: Star,
      path: "/admin/smarketplace/reviews"
    },
    { 
      title: "System Settings", 
      description: "Configure payment gateways, roles and permissions", 
      icon: Cog,
      path: "/admin/smarketplace/settings"
    },
    { 
      title: "Optional Add-Ons", 
      description: "Manage additional marketplace features", 
      icon: Puzzle,
      path: "/admin/smarketplace/addons"
    }
  ];

  return (
    <Layout>
      <Helmet>
        <title>Smarketplace Admin - Barangay Mo</title>
      </Helmet>
      <div className="container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Smarketplace Admin</h1>
          <p className="text-gray-600">
            Manage your multivendor marketplace platform from one central location
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <h2 className="text-xl font-semibold">Marketplace Overview</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input className="pl-10 md:w-[200px]" placeholder="Search marketplace" />
                </div>
                <Button variant="dashboard">Export Report</Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <Card className="bg-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Products</p>
                      <p className="text-2xl font-bold">437</p>
                    </div>
                    <div className="p-3 rounded-full bg-blue-50">
                      <ShoppingBag className="h-5 w-5 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Orders (Today)</p>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                    <div className="p-3 rounded-full bg-green-50">
                      <Package className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Active Vendors</p>
                      <p className="text-2xl font-bold">58</p>
                    </div>
                    <div className="p-3 rounded-full bg-purple-50">
                      <Users className="h-5 w-5 text-purple-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Revenue (MTD)</p>
                      <p className="text-2xl font-bold">₱125K</p>
                    </div>
                    <div className="p-3 rounded-full bg-amber-50">
                      <BarChart className="h-5 w-5 text-amber-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8">
              <Tabs defaultValue="overview">
                <TabsList className="mb-4 border-b w-full rounded-none bg-transparent h-auto p-0">
                  <TabsTrigger 
                    value="overview"
                    className="py-3 px-5 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:font-bold"
                  >
                    <div className="flex items-center gap-2">
                      <BarChart className="h-4 w-4" />
                      <span>Overview</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="recent"
                    className="py-3 px-5 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:font-bold"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Recent Activity</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="upcoming"
                    className="py-3 px-5 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:font-bold"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Upcoming</span>
                    </div>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview">
                  <div className="flex flex-col md:flex-row gap-6">
                    <Card className="w-full md:w-1/2">
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-4">Top Selling Products</h3>
                        <div className="space-y-3">
                          {[
                            { name: 'Organic Rice (5kg)', sold: 58, value: '₱20,300' },
                            { name: 'Hand-woven Basket', sold: 42, value: '₱31,500' },
                            { name: 'Coconut Soap', sold: 37, value: '₱3,145' },
                            { name: 'Dried Mango', sold: 29, value: '₱6,380' }
                          ].map((product, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <div>
                                <p>{product.name}</p>
                                <p className="text-sm text-gray-500">{product.sold} sold</p>
                              </div>
                              <p className="font-medium">{product.value}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="w-full md:w-1/2">
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-4">Top Vendors</h3>
                        <div className="space-y-3">
                          {[
                            { name: 'Green Farms Co-op', products: 32, value: '₱325,650' },
                            { name: 'Local Crafts Association', products: 56, value: '₱215,470' },
                            { name: 'Tropical Treats Foods', products: 24, value: '₱189,320' },
                            { name: 'Eco Friends Philippines', products: 12, value: '₱97,850' }
                          ].map((vendor, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <div>
                                <p>{vendor.name}</p>
                                <p className="text-sm text-gray-500">{vendor.products} products</p>
                              </div>
                              <p className="font-medium">{vendor.value}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="recent">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-4">Recent Activity</h3>
                      <div className="space-y-4">
                        {[
                          { action: 'New order received', details: 'Order #ORD-2525 from Sofia Lopez', time: '20 minutes ago' },
                          { action: 'Product updated', details: 'Bamboo Toothbrush price changed', time: '45 minutes ago' },
                          { action: 'New vendor application', details: 'Natural Products Inc. submitted application', time: '1 hour ago' },
                          { action: 'Order status changed', details: 'Order #ORD-2523 is now Shipped', time: '2 hours ago' },
                          { action: 'New review posted', details: '5-star review for Organic Rice (5kg)', time: '3 hours ago' }
                        ].map((activity, index) => (
                          <div key={index} className="flex items-start gap-4">
                            <div className="h-2 w-2 mt-2 rounded-full bg-blue-500"></div>
                            <div>
                              <p className="font-medium">{activity.action}</p>
                              <p className="text-sm">{activity.details}</p>
                              <p className="text-xs text-gray-500">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="upcoming">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-4">Upcoming Tasks</h3>
                      <div className="space-y-4">
                        {[
                          { task: 'Review pending vendor applications (3)', date: 'Today' },
                          { task: 'Process refund requests (2)', date: 'Today' },
                          { task: 'Approve product listings (7)', date: 'Tomorrow' },
                          { task: 'Update shipping rates', date: 'Apr 26, 2025' },
                          { task: 'Verify vendor payouts', date: 'Apr 28, 2025' }
                        ].map((task, index) => (
                          <div key={index} className="flex justify-between items-center border-b pb-3">
                            <p>{task.task}</p>
                            <p className="text-sm text-gray-500">{task.date}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {marketplaceModules.map((module) => (
            <Card key={module.title} className="overflow-hidden border-2 hover:border-primary/20 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <module.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{module.title}</h3>
                    <p className="text-gray-500 mb-4">{module.description}</p>
                    <Button asChild variant="outline" size="sm">
                      <Link to={module.path}>Manage</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default SmarketplaceIndex;
