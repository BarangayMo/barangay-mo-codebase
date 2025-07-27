import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Loader2, AlertCircle, RefreshCw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loadGoogleMaps, geocodeAddress, reverseGeocode, createMap, createMarker } from '@/services/googleMaps';

interface GoogleMapLocationPickerProps {
  onLocationSelected: (location: { 
    barangay: string; 
    coordinates: { lat: number; lng: number }; 
    address: string;
  }) => void;
  initialLocation?: { lat: number; lng: number };
  className?: string;
  height?: string;
}

export const GoogleMapLocationPicker = ({ 
  onLocationSelected,
  initialLocation,
  className = '',
  height = '400px'
}: GoogleMapLocationPickerProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markerInstance = useRef<google.maps.Marker | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<{
    barangay: string;
    coordinates: { lat: number; lng: number };
    address: string;
  } | null>(null);

  // Default to Manila, Philippines
  const defaultCenter = initialLocation || { lat: 14.5995, lng: 120.9842 };

  const initializeMap = async (): Promise<void> => {
    if (!mapContainer.current) return;

    try {
      setLoading(true);
      setError(null);
      console.log('🗺️ GoogleMapLocationPicker: Initializing map...');

      // Load Google Maps API
      await loadGoogleMaps();

      // Create map
      const map = await createMap(mapContainer.current, {
        center: defaultCenter,
        zoom: 13,
        zoomControl: true,
        streetViewControl: false,
        fullscreenControl: true
      });

      mapInstance.current = map;

      // Get user's current location if available
      if (navigator.geolocation && !initialLocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            map.setCenter(userLocation);
            map.setZoom(15);
            placeMarker(userLocation);
          },
          (error) => {
            console.log('Geolocation not available:', error);
            // Place default marker
            placeMarker(defaultCenter);
          }
        );
      } else {
        placeMarker(defaultCenter);
      }

      // Add click listener to map
      map.addListener('click', (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          const position = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          };
          placeMarker(position);
        }
      });

      setLoading(false);
    } catch (error) {
      console.error('❌ GoogleMapLocationPicker: Initialization failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to load map');
      setLoading(false);
    }
  };

  const placeMarker = async (position: { lat: number; lng: number }) => {
    if (!mapInstance.current) return;

    // Remove existing marker
    if (markerInstance.current) {
      markerInstance.current.setMap(null);
    }

    // Create new marker
    const marker = createMarker(mapInstance.current, position, {
      draggable: true,
      title: 'Selected Location',
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6" width="32" height="32">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(32, 32),
        anchor: new google.maps.Point(16, 32)
      }
    });

    markerInstance.current = marker;

    // Add drag listener
    marker.addListener('dragend', () => {
      const newPosition = marker.getPosition();
      if (newPosition) {
        updateLocationInfo({
          lat: newPosition.lat(),
          lng: newPosition.lng()
        });
      }
    });

    // Update location info
    await updateLocationInfo(position);
  };

  const updateLocationInfo = async (position: { lat: number; lng: number }) => {
    try {
      const geocodeResult = await reverseGeocode(position.lat, position.lng);
      
      if (geocodeResult) {
        const locationData = {
          barangay: geocodeResult.barangay || 'Unknown Barangay',
          coordinates: position,
          address: geocodeResult.address
        };
        
        setSelectedLocation(locationData);
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() || !mapInstance.current) return;

    try {
      const result = await geocodeAddress(searchQuery);
      if (result) {
        const position = { lat: result.lat, lng: result.lng };
        mapInstance.current.setCenter(position);
        mapInstance.current.setZoom(16);
        placeMarker(position);
      }
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelected(selectedLocation);
    }
  };

  useEffect(() => {
    initializeMap();

    return () => {
      if (markerInstance.current) {
        markerInstance.current.setMap(null);
      }
      mapInstance.current = null;
    };
  }, []);

  if (loading) {
    return (
      <div 
        className={`relative border border-border rounded-lg overflow-hidden ${className}`}
        style={{ height }}
      >
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
            <div className="text-sm text-muted-foreground">Loading map...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className={`relative border border-destructive/20 bg-destructive/5 rounded-lg overflow-hidden ${className}`}
        style={{ height }}
      >
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="text-center space-y-3 max-w-sm">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
            <div className="space-y-2">
              <div className="text-sm font-medium text-destructive">Failed to load map</div>
              <div className="text-xs text-muted-foreground">{error}</div>
            </div>
            <Button 
              onClick={initializeMap}
              size="sm"
              variant="outline"
              className="mt-3"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="flex gap-2">
        <Input
          placeholder="Search for a location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} size="sm">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Map Container */}
      <div 
        className="relative border border-border rounded-lg overflow-hidden"
        style={{ height }}
      >
        <div 
          ref={mapContainer} 
          className="w-full h-full"
          style={{ minHeight: height }}
        />
      </div>

      {/* Location Info */}
      {selectedLocation && (
        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-1 min-w-0 flex-1">
              <div className="font-medium text-sm">{selectedLocation.barangay}</div>
              <div className="text-xs text-muted-foreground line-clamp-2">
                {selectedLocation.address}
              </div>
              <div className="text-xs text-muted-foreground">
                {selectedLocation.coordinates.lat.toFixed(6)}, {selectedLocation.coordinates.lng.toFixed(6)}
              </div>
            </div>
          </div>
          
          <Button onClick={handleConfirm} className="w-full" size="sm">
            Confirm Location
          </Button>
        </div>
      )}

      <div className="text-xs text-muted-foreground text-center">
        Click on the map or drag the marker to select a location
      </div>
    </div>
  );
};

export default GoogleMapLocationPicker;
