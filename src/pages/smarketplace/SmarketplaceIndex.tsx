
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
  Puzzle 
} from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Smarketplace Admin</h1>
          <p className="text-gray-600">
            Manage your multivendor marketplace platform from one central location
          </p>
        </div>

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
