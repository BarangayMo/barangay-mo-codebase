
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  search: string;
  setSearch: (value: string) => void;
}

export function SearchBar({ search, setSearch }: SearchBarProps) {
  const { userRole } = useAuth();
  
  // Default to blue if userRole is undefined
  const bgColor = !userRole || userRole === "resident" ? "bg-blue-600" : "bg-red-600";
  
  return (
    <div className={cn("sticky top-16 z-40 md:hidden", bgColor)}>
      <div className="flex items-center gap-3 p-4">
        <div className="flex-1 relative">
          <Input
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white/90 rounded-full"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        </div>
        <Link to="/marketplace/cart">
          <div className="relative">
            <ShoppingCart className="w-10 h-10 text-white" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              2
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
