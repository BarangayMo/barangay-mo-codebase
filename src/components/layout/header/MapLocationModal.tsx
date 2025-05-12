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
import { Loader2, MapPin, Search, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getGoogleMapsApiKey } from "@/services/apiKeys";

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
  const [apiKey, setApiKey] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // Load Google Maps API script
  useEffect(() => {
    if (!isOpen) return;
    
    const fetchApiKeyAndLoadMap = async () => {
      try {
        // Get API key using the service
        const key = await getGoogleMapsApiKey();
        
        if (!key) {
          console.error("Error fetching Google Maps API key");
          toast.error("Failed to load map. API key not configured.");
          setIsLoading(false);
          return;
        }
        
        // Save API key to state
        setApiKey(key);
        loadGoogleMaps(key);
      } catch (error) {
        console.error("Error fetching API key:", error);
        toast.error("Failed to load map configuration");
        setIsLoading(false);
      }
    };
    
    const loadGoogleMaps = (key: string) => {
      if (window.google?.maps) {
        initializeMap();
        return;
      }
      
      // Define callback for when Maps API loads
      window.initGoogleMapsModal = () => {
        initializeMap();
      };
      
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&callback=initGoogleMapsModal`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    };
    
    fetchApiKeyAndLoadMap();
    
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
      <DialogContent className="sm:max-w-[90vw] md:max-w-[500px] p-0 gap-0 max-h-[90vh] overflow-hidden rounded-xl shadow-lg border border-muted/30">
        <div className="relative h-[75vh] md:h-[500px]">
          {/* Map container */}
          {isLoading ? (
            <div className="h-full w-full flex items-center justify-center bg-muted/30">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !apiKey ? (
            <div className="h-full w-full flex items-center justify-center bg-muted/30">
              <div className="text-center p-6">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">API Key Not Configured</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Please ask an administrator to configure the Google Maps API key.
                </p>
              </div>
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
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        const pos = {
                          lat: position.coords.latitude,
                          lng: position.coords.longitude
                        };
                        if (map) {
                          map.setCenter(pos);
                          map.setZoom(15);
                          placeMarker(pos, map);
                          reverseGeocode(pos);
                        }
                      },
                      () => {
                        toast.error("Error getting your location");
                      }
                    );
                  }
                }}
                className="absolute bottom-32 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white py-3 px-5 rounded-full shadow-lg border border-gray-100"
              >
                <MapPin className="h-5 w-5 text-red-500" />
                <span className="font-medium text-red-500">Use my current location</span>
              </button>
            </>
          )}
        </div>

        {/* Location selection box */}
        <div className="px-4 py-5 bg-white">
          <h2 className="text-xl font-bold text-gray-800 mb-1">Choose delivery address</h2>
          <p className="text-gray-500 mb-4">Move the map pin to your exact location.</p>

          {selectedLocation && (
            <div className="bg-gray-50 p-4 rounded-lg flex items-start gap-3 mb-4">
              <MapPin className="h-6 w-6 text-gray-500 shrink-0 mt-1" />
              <p className="text-gray-700 text-base font-medium break-words">
                {selectedLocation.barangay}
              </p>
            </div>
          )}

          <Button 
            onClick={handleConfirm} 
            disabled={!selectedLocation}
            className="w-full h-14 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold text-lg shadow-sm"
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
