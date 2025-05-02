
import { useState, useEffect } from "react";
import { MapPin, ChevronDown, Loader, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useBarangayData } from "@/hooks/use-barangay-data";
import { Skeleton } from "@/components/ui/skeleton";
import { MapLocationModal } from "./MapLocationModal";
import { toast } from "sonner";

export function LocationDropdown() {
  const [location, setLocation] = useState("Select Barangay");
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { barangays, isLoading, error, refetch } = useBarangayData();
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  const filtered = barangays?.filter(brgy => 
    brgy?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const handleLocationSelected = (selectedLocation: { 
    barangay: string; 
    coordinates: { lat: number; lng: number } 
  }) => {
    setLocation(selectedLocation.barangay);
    setCoordinates(selectedLocation.coordinates);
    toast.success(`Location set to ${selectedLocation.barangay}`);
  };

  // For showing the dropdown content on large screens
  const renderDropdownContent = () => (
    <>
      <div className="p-2">
        <Input
          placeholder="Search barangay..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mb-2"
        />
        <div className="max-h-[300px] overflow-y-auto">
          {isLoading ? (
            <div className="space-y-1 p-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="p-4 flex flex-col items-center justify-center gap-2 text-center">
              <MapPin className="h-8 w-8 text-red-500" />
              <p className="text-sm text-red-500">{error}</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => refetch()}
                className="mt-2"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
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
            <div className="p-4 flex flex-col items-center justify-center gap-2 text-center">
              <MapPin className="h-8 w-8 text-gray-400" />
              <p className="text-sm text-muted-foreground">
                {search ? "No matching barangay found" : "No barangays available"}
              </p>
              {!search && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => refetch()}
                  className="mt-2"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh List
                </Button>
              )}
            </div>
          )}
        </div>
        {!isLoading && barangays.length > 0 && (
          <div className="mt-2 text-xs text-muted-foreground text-center border-t pt-2">
            {barangays.length} barangays available
          </div>
        )}
      </div>
      
      <div className="border-t p-3 flex justify-center">
        <MapLocationModal onLocationSelected={handleLocationSelected}>
          <Button size="sm" className="w-full" variant="outline">
            <MapPin className="h-4 w-4 mr-2" />
            Select on Map
          </Button>
        </MapLocationModal>
      </div>
    </>
  );

  return (
    <div className="flex items-center">
      <MapLocationModal onLocationSelected={handleLocationSelected}>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-2 min-w-[150px]"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader className="h-4 w-4 shrink-0 animate-spin" />
              <span className="truncate max-w-[100px]">Loading...</span>
            </>
          ) : (
            <>
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate max-w-[100px]">{location}</span>
            </>
          )}
          <ChevronDown className="h-3 w-3 opacity-50 ml-auto" />
        </Button>
      </MapLocationModal>
      
      {/* Legacy dropdown - only shown for text-based search */}
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger className="hidden">
          <span className="sr-only">Open barangay menu</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[280px]">
          {renderDropdownContent()}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
