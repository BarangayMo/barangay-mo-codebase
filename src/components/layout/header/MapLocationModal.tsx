
import { useEffect, useRef, useState } from 'react';
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, MapPin, Search, X, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { RoleButton } from "@/components/ui/role-button";
// We will dynamically import Leaflet and its CSS below

// Define types for our location data
interface MapLocationModalProps {
  children: React.ReactNode;
  onLocationSelected: (location: { barangay: string; coordinates: { lat: number; lng: number } }) => void;
}

export function MapLocationModal({ children, onLocationSelected }: MapLocationModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [map, setMap] = useState<any | null>(null);
  const [marker, setMarker] = useState<any | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ barangay: string; coordinates: { lat: number; lng: number } } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // Load the map when the modal is opened
  useEffect(() => {
    if (!isOpen || !mapRef.current) return;
    
    // Dynamically import Leaflet to avoid SSR issues
    const initLeaflet = async () => {
      try {
        // Add Leaflet CSS
        const linkEl = document.createElement('link');
        linkEl.rel = 'stylesheet';
        linkEl.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        linkEl.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        linkEl.crossOrigin = '';
        document.head.appendChild(linkEl);
        
        // Dynamic import of Leaflet
        const L = await import('leaflet');
        
        // Fix for Leaflet icon issue in webpack/vite
        const fixLeafletIcon = () => {
          // @ts-ignore - Leaflet typings issue
          delete L.Icon.Default.prototype._getIconUrl;
          
          L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          });
        };

        fixLeafletIcon();
        initializeMap(L);
      } catch (error) {
        console.error('Failed to load Leaflet:', error);
        toast.error('Failed to load map. Please try again later.');
        setIsLoading(false);
      }
    };
    
    initLeaflet();
    
    return () => {
      // Cleanup function
      if (map) {
        map.remove();
        setMap(null);
      }
    };
  }, [isOpen]);

  const initializeMap = async (L: any) => {
    if (!mapRef.current) return;
    
    setIsLoading(true);
    
    // Default to Metro Manila, Philippines
    const defaultPosition = { lat: 14.5995, lng: 120.9842 };
    
    // Create map instance
    const mapInstance = L.map(mapRef.current, {
      center: [defaultPosition.lat, defaultPosition.lng],
      zoom: 13,
      layers: [
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        })
      ]
    });

    setMap(mapInstance);
    
    // Try to get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          mapInstance.setView([userPosition.lat, userPosition.lng], 15);
          placeMarker(userPosition, mapInstance, L);
          reverseGeocode(userPosition);
        },
        () => {
          // Fallback if user denies location permission
          placeMarker(defaultPosition, mapInstance, L);
          reverseGeocode(defaultPosition);
        }
      );
    } else {
      // Fallback for browsers that don't support geolocation
      placeMarker(defaultPosition, mapInstance, L);
      reverseGeocode(defaultPosition);
    }

    // Add click event listener to the map
    mapInstance.on('click', (event: any) => {
      const position = {
        lat: event.latlng.lat,
        lng: event.latlng.lng
      };
      placeMarker(position, mapInstance, L);
      reverseGeocode(position);
    });

    setIsLoading(false);
  };

  const placeMarker = (position: { lat: number; lng: number }, mapInstance: any, L: any) => {
    if (marker) {
      mapInstance.removeLayer(marker);
    }

    const newMarker = L.marker([position.lat, position.lng], {
      draggable: true
    }).addTo(mapInstance);

    newMarker.on('dragend', () => {
      const newPosition = newMarker.getLatLng();
      const position = {
        lat: newPosition.lat,
        lng: newPosition.lng
      };
      reverseGeocode(position);
    });

    setMarker(newMarker);
  };

  const reverseGeocode = async (position: { lat: number; lng: number }) => {
    try {
      // Use Nominatim API for reverse geocoding (OpenStreetMap's geocoding service)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch location data');
      }
      
      const data = await response.json();
      
      // Extract location details
      let barangay = '';
      
      // Try to find the most specific location name
      if (data.address) {
        // First try to find the suburb/district/neighborhood (which is often the barangay in Philippines)
        barangay = data.address.suburb || 
                   data.address.neighbourhood || 
                   data.address.district ||
                   data.address.village ||
                   data.address.town ||
                   data.address.city ||
                   data.display_name.split(',')[0];
      }
      
      // If we couldn't find any location data, use a generic placeholder
      if (!barangay) {
        barangay = 'Selected Location';
      }
      
      setSelectedLocation({
        barangay,
        coordinates: position
      });
    } catch (error) {
      console.error('Error during reverse geocoding:', error);
      toast.error("Error fetching location data");
      
      // Set a fallback location name
      setSelectedLocation({
        barangay: 'Selected Location',
        coordinates: position
      });
    }
  };

  const handleSearch = async () => {
    if (!map || !searchQuery.trim()) return;

    setIsSearching(true);
    
    try {
      // Use Nominatim API for forward geocoding (search)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=ph&limit=1`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        const position = {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon)
        };
        
        map.setView([position.lat, position.lng], 15);
        
        // Dynamically import Leaflet for marker placement
        const L = await import('leaflet');
        placeMarker(position, map, L.default);
        reverseGeocode(position);
      } else {
        toast.error("Couldn't find that location. Please try a different search.");
      }
    } catch (error) {
      console.error('Error during search:', error);
      toast.error("Search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (!map) return;
    
    const currentZoom = map.getZoom();
    if (direction === 'in') {
      map.setZoom(currentZoom + 1);
    } else {
      map.setZoom(Math.max(currentZoom - 1, 1));
    }
  };

  const handleConfirm = () => {
    if (!selectedLocation) {
      toast.error("Please select a location on the map first");
      return;
    }
    
    onLocationSelected(selectedLocation);
    setIsOpen(false);
  };

  const handleCurrentLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          if (map) {
            map.setView([pos.lat, pos.lng], 15);
            // Dynamically import Leaflet for marker placement
            const L = await import('leaflet');
            placeMarker(pos, map, L.default);
            reverseGeocode(pos);
          }
        },
        () => {
          toast.error("Error getting your location");
        }
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[500px] p-0 gap-0 max-h-[90vh] overflow-hidden rounded-xl shadow-lg border border-muted/30">
        <div className="relative h-[70vh] md:h-[450px]">
          {/* Map container */}
          {isLoading ? (
            <div className="h-full w-full flex items-center justify-center bg-muted/30">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {/* Search bar overlay */}
              <div className="absolute top-4 left-0 right-0 z-10 px-4">
                <div className="relative w-full">
                  <div className="relative bg-white rounded-full shadow-lg">
                    <button 
                      onClick={() => setIsOpen(false)} 
                      className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full bg-white border border-gray-100 shadow-sm"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                    <Input
                      placeholder="Search address"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="pl-12 pr-10 h-12 py-3 rounded-full border-transparent focus-visible:ring-primary/30"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full"
                      onClick={handleSearch}
                      disabled={isSearching}
                    >
                      {isSearching ? (
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      ) : (
                        <Search className="h-5 w-5 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div ref={mapRef} className="h-full w-full" />
              
              {/* Current location button */}
              <button 
                onClick={handleCurrentLocation}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white py-2 px-4 rounded-full shadow-lg border border-gray-100"
              >
                <MapPin className="h-5 w-5 text-red-500" />
                <span className="font-medium text-sm text-gray-700">Use my current location</span>
              </button>
            </>
          )}
        </div>

        {/* Location selection box */}
        <div className="px-4 py-4 bg-white border-t border-gray-100">
          <div className="flex flex-col gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Choose delivery address</h2>
              <p className="text-sm text-gray-500">Move the map pin to your exact location.</p>
            </div>

            {selectedLocation && (
              <div className="bg-gray-50 p-3 rounded-lg flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-500 shrink-0 mt-1" />
                <p className="text-gray-700 text-sm break-words">
                  {selectedLocation.barangay}
                </p>
              </div>
            )}

            <RoleButton 
              onClick={handleConfirm} 
              disabled={!selectedLocation}
              className="w-full flex items-center justify-center gap-2 h-12 rounded-lg text-white font-medium"
            >
              Confirm
              <ChevronRight className="h-5 w-5" />
            </RoleButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
