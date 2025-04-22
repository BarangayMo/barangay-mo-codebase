
import { useState, useEffect } from "react";
import { MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useBarangayData } from "@/hooks/use-barangay-data";

export function LocationDropdown() {
  const [location, setLocation] = useState("Select Barangay");
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { barangays, isLoading, error } = useBarangayData();

  const filtered = barangays?.filter(brgy => 
    brgy?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-2 min-w-[150px]"
        >
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="truncate max-w-[100px]">{location}</span>
          <ChevronDown className="h-3 w-3 opacity-50 ml-auto" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[280px]">
        <div className="p-2">
          <Input
            placeholder="Search barangay..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="mb-2"
          />
          <div className="max-h-[300px] overflow-y-auto">
            {isLoading ? (
              <div className="p-2 text-center text-sm text-muted-foreground">Loading barangays...</div>
            ) : error ? (
              <div className="p-2 text-center text-sm text-red-500">{error}</div>
            ) : filtered.length > 0 ? (
              filtered.map(brgy => (
                <DropdownMenuItem
                  key={brgy}
                  onClick={() => {
                    setLocation(brgy);
                    setDropdownOpen(false);
                    setSearch("");
                  }}
                >
                  {brgy}
                </DropdownMenuItem>
              ))
            ) : (
              <div className="p-2 text-center text-sm text-muted-foreground">
                {search ? "No matching barangay found" : "No barangays available"}
              </div>
            )}
          </div>
          {!isLoading && barangays.length > 0 && (
            <div className="mt-2 text-xs text-muted-foreground text-center border-t pt-2">
              {barangays.length} barangays available
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
