import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { initializeMapbox, geocodeAddress, createMap, createMarker, createPopup } from '@/services/mapbox';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapboxMapProps {
  location: string;
  className?: string;
  height?: string;
  zoom?: number;
  showPopup?: boolean;
  onLocationClick?: (lng: number, lat: number) => void;
}

export const MapboxMap = ({ 
  location, 
  className = '', 
  height = '300px',
  zoom = 15,
  showPopup = true,
  onLocationClick
}: MapboxMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markerInstance = useRef<mapboxgl.Marker | null>(null);
  const popupInstance = useRef<mapboxgl.Popup | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const initializeMapInstance = async (attempt: number = 1): Promise<void> => {
    if (!mapContainer.current) {
      throw new Error('Map container not found');
    }

    try {
      setLoading(true);
      setError(null);
      console.log(`🗺️ MapboxMap: Initializing map (attempt ${attempt}) for location:`, location);

      // Initialize Mapbox with fallback API key
      await initializeMapbox();
      console.log('🗺️ MapboxMap: Mapbox initialized successfully');

      // Geocode the location
      console.log('🌍 MapboxMap: Starting geocoding for:', location);
      const geocodeResult = await geocodeAddress(location);
      
      if (!geocodeResult) {
        throw new Error(`Location "${location}" not found`);
      }

      console.log('📍 MapboxMap: Coordinates found:', geocodeResult);

      // Create map with proper cleanup
      console.log('🗺️ MapboxMap: Creating map instance...');
      const map = await createMap(mapContainer.current, {
        center: [geocodeResult.lng, geocodeResult.lat],
        zoom,
        style: 'mapbox://styles/mapbox/streets-v11'
      });

      mapInstance.current = map;

      // Ensure map loads properly
      map.on('load', () => {
        console.log('✅ Map loaded and ready');
        map.resize(); // Ensure proper sizing
        setLoading(false);
      });

      map.on('error', (e) => {
        console.error('❌ Map error:', e);
        throw new Error('Map failed to load properly');
      });

      // Create marker
      const marker = createMarker(map, [geocodeResult.lng, geocodeResult.lat], {
        color: '#3b82f6'
      });

      markerInstance.current = marker;

      // Create popup if enabled
      if (showPopup) {
        const popup = createPopup(`
          <div class="p-3">
            <div class="font-semibold text-sm text-gray-800 mb-1">${location}</div>
            <div class="text-xs text-gray-600">${geocodeResult.place_name}</div>
          </div>
        `);

        popupInstance.current = popup;
        marker.setPopup(popup);
        popup.addTo(map);
      }

      // Add click listener if callback provided
      if (onLocationClick) {
        marker.getElement().addEventListener('click', () => {
          onLocationClick(geocodeResult.lng, geocodeResult.lat);
        });

        map.on('click', (e) => {
          onLocationClick(e.lngLat.lng, e.lngLat.lat);
        });
      }

      console.log('✅ MapboxMap: Map initialization completed successfully');
      setError(null);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error(`❌ MapboxMap: Initialization failed (attempt ${attempt}):`, error);
      
      if (attempt < maxRetries) {
        console.log(`🔄 MapboxMap: Retrying in 2 seconds... (attempt ${attempt + 1}/${maxRetries})`);
        setTimeout(() => {
          setRetryCount(attempt);
          initializeMapInstance(attempt + 1);
        }, 2000);
      } else {
        setError(errorMessage);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (location && mapContainer.current) {
      initializeMapInstance();
    }

    // Cleanup function
    return () => {
      if (popupInstance.current) {
        popupInstance.current.remove();
      }
      if (markerInstance.current) {
        markerInstance.current.remove();
      }
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, [location]);

  const handleRetry = () => {
    setRetryCount(0);
    initializeMapInstance();
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
      className={`relative border border-border rounded-lg overflow-hidden shadow-sm ${className}`}
      style={{ height }}
    >
      <div 
        ref={mapContainer} 
        className="w-full h-full rounded-lg"
        style={{ minHeight: height }}
      />
      {/* Map overlay for better styling */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-transparent via-transparent to-primary/5 rounded-lg" />
    </div>
  );
};

export default MapboxMap;