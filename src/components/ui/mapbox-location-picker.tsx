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
      console.error('❌ Map container not found');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log(`🗺️ MapboxMap: Initializing map (attempt ${attempt}) for location: ${location}`);

      await initializeMapbox();
      console.log('🗺️ MapboxMap: Mapbox initialized');

      // Try geocoding with timeout fallback
      let geocodeResult = null;

      try {
        geocodeResult = await geocodeAddress(location);
        if (!geocodeResult) {
          console.warn(`⚠️ Geocode failed for "${location}", using fallback coordinates`);
        }
      } catch (err) {
        console.warn(`⚠️ Geocoding threw an error, using fallback`, err);
      }

      const center: [number, number] = geocodeResult
        ? [geocodeResult.lng, geocodeResult.lat]
        : [121.0244, 14.5547]; // fallback to Manila

      console.log('📍 MapboxMap: Using center:', center);

      const map = await createMap(mapContainer.current, {
        center,
        zoom,
        style: 'mapbox://styles/mapbox/streets-v11'
      });

      mapInstance.current = map;

      map.on('load', () => {
        console.log('✅ Map loaded');
        map.resize();
        setLoading(false);
      });

      map.on('error', (e) => {
        console.error('❌ Map load error:', e);
        throw new Error('Map failed to load properly');
      });

      const marker = createMarker(map, center, {
        color: '#3b82f6'
      });
      markerInstance.current = marker;

      if (showPopup) {
        const popup = createPopup(`
          <div class="p-3">
            <div class="font-semibold text-sm text-gray-800 mb-1">${location}</div>
            <div class="text-xs text-gray-600">${geocodeResult?.place_name || 'Unknown address'}</div>
          </div>
        `);
        popupInstance.current = popup;
        marker.setPopup(popup);
        popup.addTo(map);
      }

      if (onLocationClick) {
        marker.getElement().addEventListener('click', () => {
          onLocationClick(center[0], center[1]);
        });
        map.on('click', (e) => {
          onLocationClick(e.lngLat.lng, e.lngLat.lat);
        });
      }

      console.log('✅ MapboxMap: Finished');
      setError(null);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error(`❌ MapboxMap: Initialization failed (attempt ${attempt}):`, errorMessage);

      if (attempt < maxRetries) {
        console.log(`🔄 Retrying in 2s (attempt ${attempt + 1}/${maxRetries})`);
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

    return () => {
      popupInstance.current?.remove();
      markerInstance.current?.remove();
      mapInstance.current?.remove();
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

export default MapboxMap;
