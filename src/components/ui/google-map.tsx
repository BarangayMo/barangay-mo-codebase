import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { loadGoogleMaps, geocodeAddress, createMap, createMarker, createInfoWindow } from '@/services/googleMaps';

interface GoogleMapProps {
  location: string;
  className?: string;
  height?: string;
  zoom?: number;
  showInfoWindow?: boolean;
  onLocationClick?: (lat: number, lng: number) => void;
}

export const GoogleMap = ({ 
  location, 
  className = '', 
  height = '300px',
  zoom = 15,
  showInfoWindow = true,
  onLocationClick
}: GoogleMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markerInstance = useRef<google.maps.Marker | null>(null);
  const infoWindowInstance = useRef<google.maps.InfoWindow | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const initializeMap = async (attempt: number = 1): Promise<void> => {
    if (!mapContainer.current) {
      throw new Error('Map container not found');
    }

    try {
      setLoading(true);
      setError(null);
      console.log(`🗺️ GoogleMap: Initializing map (attempt ${attempt}) for location:`, location);

      // Load Google Maps API
      await loadGoogleMaps();
      console.log('🗺️ GoogleMap: Google Maps API loaded successfully');

      // Geocode the location
      console.log('🌍 GoogleMap: Starting geocoding for:', location);
      const geocodeResult = await geocodeAddress(location);
      
      if (!geocodeResult) {
        throw new Error(`Location "${location}" not found`);
      }

      console.log('📍 GoogleMap: Coordinates found:', geocodeResult);

      // Create map
      console.log('🗺️ GoogleMap: Creating map instance...');
      const map = await createMap(mapContainer.current, {
        center: { lat: geocodeResult.lat, lng: geocodeResult.lng },
        zoom,
        zoomControl: true,
        streetViewControl: true,
        fullscreenControl: true
      });

      mapInstance.current = map;

      // Create marker
      const marker = createMarker(map, 
        { lat: geocodeResult.lat, lng: geocodeResult.lng },
        { 
          title: location,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ef4444" width="32" height="32">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(32, 32),
            anchor: new google.maps.Point(16, 32)
          }
        }
      );

      markerInstance.current = marker;

      // Create info window if enabled
      if (showInfoWindow) {
        const infoWindow = createInfoWindow(`
          <div style="padding: 8px; font-family: system-ui, -apple-system, sans-serif;">
            <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">${location}</div>
            <div style="font-size: 12px; color: #666;">${geocodeResult.formatted_address}</div>
          </div>
        `);

        infoWindowInstance.current = infoWindow;
        infoWindow.open(map, marker);
      }

      // Add click listener if callback provided
      if (onLocationClick) {
        marker.addListener('click', () => {
          onLocationClick(geocodeResult.lat, geocodeResult.lng);
        });

        map.addListener('click', (event: google.maps.MapMouseEvent) => {
          if (event.latLng) {
            onLocationClick(event.latLng.lat(), event.latLng.lng());
          }
        });
      }

      console.log('✅ GoogleMap: Map initialization completed successfully');
      setLoading(false);
      setError(null);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error(`❌ GoogleMap: Initialization failed (attempt ${attempt}):`, error);
      
      if (attempt < maxRetries) {
        console.log(`🔄 GoogleMap: Retrying in 2 seconds... (attempt ${attempt + 1}/${maxRetries})`);
        setTimeout(() => {
          setRetryCount(attempt);
          initializeMap(attempt + 1);
        }, 2000);
      } else {
        setError(errorMessage);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (location && mapContainer.current) {
      initializeMap();
    }

    // Cleanup function
    return () => {
      if (infoWindowInstance.current) {
        infoWindowInstance.current.close();
      }
      if (markerInstance.current) {
        markerInstance.current.setMap(null);
      }
      mapInstance.current = null;
    };
  }, [location]);

  const handleRetry = () => {
    setRetryCount(0);
    initializeMap();
  };

  if (loading) {
    return (
      <div 
        className={`relative border border-border rounded-lg overflow-hidden ${className}`}
        style={{ height }}
      >
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
            <div className="text-sm text-muted-foreground">
              Loading map...
              {retryCount > 0 && (
                <div className="text-xs mt-1">
                  Attempt {retryCount + 1} of {maxRetries}
                </div>
              )}
            </div>
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
              onClick={handleRetry}
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
    <div 
      className={`relative border border-border rounded-lg overflow-hidden ${className}`}
      style={{ height }}
    >
      <div 
        ref={mapContainer} 
        className="w-full h-full"
        style={{ minHeight: height }}
      />
    </div>
  );
};

export default GoogleMap;
