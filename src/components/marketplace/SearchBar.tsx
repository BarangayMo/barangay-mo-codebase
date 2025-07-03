
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}
