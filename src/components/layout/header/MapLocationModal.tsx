
import { useEffect, useRef, useState } from 'react';
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, MapPin, Search, ZoomIn, ZoomOut } from "lucide-react";

// Declare Google Maps types
declare global {
  interface Window {
    initGoogleMapsModal: () => void;
  }
}

interface MapLocationModalProps {
  children: React.ReactNode;
  onLocationSelected: (location: { barangay: string; coordinates: { lat: number; lng: number } }) => void;
}

export function MapLocationModal({ children, onLocationSelected }: MapLocationModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ barangay: string; coordinates: { lat: number; lng: number } } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // Load Google Maps API script
  useEffect(() => {
    if (!isOpen) return;
    
    const loadGoogleMaps = () => {
      if (window.google?.maps) {
        initializeMap();
        return;
      }
      
      // Define callback for when Maps API loads
      window.initGoogleMapsModal = () => {
        initializeMap();
      };
      
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMapsModal`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    };
    
    loadGoogleMaps();
    
    // Cleanup function
    return () => {
      if (window.initGoogleMapsModal) {
        // @ts-ignore - we're intentionally removing the function
        window.initGoogleMapsModal = undefined;
      }
    };
  }, [isOpen]);

  const initializeMap = () => {
    if (!mapRef.current || !window.google?.maps) return;

    // Default to Metro Manila, Philippines
    const defaultPosition = { lat: 14.5995, lng: 120.9842 };
    
    const mapOptions: google.maps.MapOptions = {
      center: defaultPosition,
      zoom: 12,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      styles: [
        {
          featureType: 'administrative.locality',
          elementType: 'labels',
          stylers: [{ visibility: 'on' }]
        }
      ]
    };

    const newMap = new google.maps.Map(mapRef.current, mapOptions);
    setMap(newMap);

    // Try to get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          newMap.setCenter(userPosition);
          placeMarker(userPosition, newMap);
          reverseGeocode(userPosition);
        },
        () => {
          // Fallback if user denies location permission
          placeMarker(defaultPosition, newMap);
          reverseGeocode(defaultPosition);
        }
      );
    } else {
      // Fallback for browsers that don't support geolocation
      placeMarker(defaultPosition, newMap);
      reverseGeocode(defaultPosition);
    }

    // Add click event listener to the map
    newMap.addListener('click', (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const position = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng()
        };
        placeMarker(position, newMap);
        reverseGeocode(position);
      }
    });

    setIsLoading(false);
  };

  const placeMarker = (position: { lat: number; lng: number }, mapInstance: google.maps.Map) => {
    if (marker) {
      marker.setMap(null);
    }

    const newMarker = new google.maps.Marker({
      position,
      map: mapInstance,
      animation: google.maps.Animation.DROP,
      draggable: true
    });

    newMarker.addListener('dragend', () => {
      const position = {
        lat: newMarker.getPosition()?.lat() || 0,
        lng: newMarker.getPosition()?.lng() || 0
      };
      reverseGeocode(position);
    });

    setMarker(newMarker);
  };

  const reverseGeocode = async (position: { lat: number; lng: number }) => {
    if (!window.google?.maps) {
      toast.error("Google Maps API not loaded properly");
      return;
    }

    try {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: position }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          // Extract the barangay name
          let barangay = '';
          
          for (const component of results[0].address_components) {
            if (component.types.includes('sublocality_level_1') || 
                component.types.includes('sublocality') || 
                component.types.includes('neighborhood')) {
              barangay = component.long_name;
              break;
            }
          }

          // If we couldn't find a barangay, use a more general location
          if (!barangay) {
            for (const component of results[0].address_components) {
              if (component.types.includes('locality') || 
                  component.types.includes('administrative_area_level_3')) {
                barangay = component.long_name;
                break;
              }
            }
          }
          
          setSelectedLocation({
            barangay,
            coordinates: position
          });
        } else {
          toast.error("Couldn't determine location. Please try again.");
        }
      });
    } catch (error) {
      console.error('Error during reverse geocoding:', error);
      toast.error("Error fetching location data");
    }
  };

  const handleSearch = () => {
    if (!map || !searchQuery.trim() || !window.google?.maps) return;

    setIsSearching(true);
    
    const geocoder = new google.maps.Geocoder();
    // Focus on Philippines
    const searchWithCountry = `${searchQuery}, Philippines`;
    
    geocoder.geocode({ address: searchWithCountry }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results[0] && results[0].geometry) {
        const position = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        };
        
        map.setCenter(position);
        map.setZoom(15);
        placeMarker(position, map);
        reverseGeocode(position);
      } else {
        toast.error("Couldn't find that location. Please try a different search.");
      }
      setIsSearching(false);
    });
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (!map) return;
    
    const currentZoom = map.getZoom() || 12;
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[700px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Select Your Barangay</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Search location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pr-10"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={handleSearch}
                disabled={isSearching}
              >
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" onClick={() => handleZoom('in')}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleZoom('out')}>
                <ZoomOut className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="h-[400px] w-full flex items-center justify-center bg-gray-100 rounded-md">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="h-[400px] w-full relative">
              <div ref={mapRef} className="h-full w-full rounded-md" />
            </div>
          )}

          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-500 shrink-0" />
            <div className="space-y-1">
              <Label>Selected Location</Label>
              <p className="text-sm text-muted-foreground">
                {selectedLocation?.barangay || 'No location selected'}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={!selectedLocation}>Confirm Location</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
