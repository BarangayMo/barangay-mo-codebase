
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  BarChart,
  Users,
  Package,
  ShoppingBag,
  User,
  Truck,
  Gift,
  ChartBar,
  Star,
  Cog,
  Puzzle,
  Settings,
  MessageSquare,
  Bell,
  FileText,
  Home,
  Building,
  CreditCard,
  Calendar,
  Search,
  UserPlus,
} from "lucide-react";

interface CommandItem {
  id: string;
  title: string;
  description?: string;
  icon: React.ComponentType<any>;
  path: string;
  group: string;
}

const commandItems: CommandItem[] = [
  // Dashboard
  { id: "dashboard", title: "Dashboard", description: "Main dashboard overview", icon: Home, path: "/admin", group: "Dashboard" },
  
  // Smarketplace
  { id: "smarketplace", title: "Smarketplace", description: "Marketplace management", icon: ShoppingBag, path: "/admin/smarketplace", group: "Smarketplace" },
  { id: "products", title: "Products", description: "Manage products and inventory", icon: Package, path: "/admin/smarketplace/products", group: "Smarketplace" },
  { id: "orders", title: "Orders", description: "View and manage orders", icon: ShoppingBag, path: "/admin/smarketplace/orders", group: "Smarketplace" },
  { id: "vendors", title: "Vendors", description: "Manage marketplace vendors", icon: Users, path: "/admin/smarketplace/vendors", group: "Smarketplace" },
  { id: "customers", title: "Customers", description: "Customer management", icon: User, path: "/admin/smarketplace/customers", group: "Smarketplace" },
  { id: "shipping", title: "Shipping", description: "Shipping and fulfillment", icon: Truck, path: "/admin/smarketplace/shipping", group: "Smarketplace" },
  { id: "promotions", title: "Promotions", description: "Discounts and rewards", icon: Gift, path: "/admin/smarketplace/promotions", group: "Smarketplace" },
  { id: "financials", title: "Financials", description: "Reports and revenue", icon: ChartBar, path: "/admin/smarketplace/financials", group: "Smarketplace" },
  { id: "reviews", title: "Reviews", description: "Moderate reviews", icon: Star, path: "/admin/smarketplace/reviews", group: "Smarketplace" },
  
  // Users
  { id: "residents", title: "Residents", description: "Manage resident users", icon: Users, path: "/admin/users/residents", group: "Users" },
  { id: "officials", title: "Officials", description: "Manage official users", icon: Building, path: "/admin/users/officials", group: "Users" },
  
  // Reports
  { id: "activity-logs", title: "Activity Logs", description: "View system activity", icon: FileText, path: "/admin/reports/activity-logs", group: "Reports" },
  { id: "financial-reports", title: "Financial Reports", description: "Financial analytics", icon: CreditCard, path: "/admin/reports/financial-reports", group: "Reports" },
  
  // System
  { id: "media-library", title: "Media Library", description: "Manage uploaded files", icon: FileText, path: "/admin/media-library", group: "System" },
  { id: "messages", title: "Messages", description: "System messages", icon: MessageSquare, path: "/admin/messages", group: "System" },
  { id: "settings", title: "Settings", description: "System configuration", icon: Settings, path: "/admin/settings", group: "System" },
];

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelect = (path: string) => {
    navigate(path);
    onOpenChange(false);
    setSearchTerm("");
  };

  const filteredItems = commandItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.group]) {
      acc[item.group] = [];
    }
    acc[item.group].push(item);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Search dashboard..." 
        value={searchTerm}
        onValueChange={setSearchTerm}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {Object.entries(groupedItems).map(([group, items], index) => (
          <div key={group}>
            {index > 0 && <CommandSeparator />}
            <CommandGroup heading={group}>
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => handleSelect(item.path)}
                  className="flex items-center gap-2 px-2 py-2"
                >
                  <item.icon className="h-4 w-4" />
                  <div className="flex flex-col">
                    <span>{item.title}</span>
                    {item.description && (
                      <span className="text-sm text-muted-foreground">{item.description}</span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
