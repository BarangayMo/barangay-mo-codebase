
import React, { useEffect, useRef, useState } from 'react';
import { Search, MapPin, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface MapboxLocationPickerProps {
  onLocationSelected: (location: { 
    barangay: string; 
    coordinates: { lat: number; lng: number }; 
    address: string;
  }) => void;
  height?: string;
  className?: string;
  initialLocation?: string;
}

export const MapboxLocationPicker = ({ 
  onLocationSelected, 
  height = '400px',
  className = '',
  initialLocation = 'Philippines'
}: MapboxLocationPickerProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    coordinates: { lat: number; lng: number };
    address: string;
    barangay: string;
  } | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [mapboxLoaded, setMapboxLoaded] = useState(false);

  const MAPBOX_TOKEN = 'pk.eyJ1IjoiYmFyYW5nYXltbyIsImEiOiJjbWJxZHBzenAwMmdrMmtzZmloemphb284In0.U22j37ppYT1IMyC2lXVBzw';

  const loadMapboxResources = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.mapboxgl) {
        setMapboxLoaded(true);
        resolve();
        return;
      }

      // Add CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
      document.head.appendChild(link);

      // Add JS
      const script = document.createElement('script');
      script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
      script.onload = () => {
        setMapboxLoaded(true);
        resolve();
      };
      script.onerror = () => {
        reject(new Error('Failed to load Mapbox GL JS'));
      };
      document.head.appendChild(script);
    });
  };

  const initializeMap = async () => {
    if (!mapContainer.current) return;

    try {
      setLoading(true);
      setError(null);

      console.log('🗺️ Loading Mapbox resources...');
      await loadMapboxResources();

      console.log('🗺️ Initializing map...');
      
      // Set access token
      (window as any).mapboxgl.accessToken = MAPBOX_TOKEN;

      // Default center to Philippines
      const center: [number, number] = [121.0244, 14.5547];

      // Create map
      const map = new window.mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center,
        zoom: 6,
        attributionControl: false,
      });

      // Add navigation controls
      map.addControl(new window.mapboxgl.NavigationControl(), 'top-right');

      mapInstance.current = map;

      map.on('load', () => {
        console.log('✅ Map loaded successfully');
        setLoading(false);
      });

      map.on('error', (e) => {
        console.error('❌ Map error:', e);
        setError('Map failed to load properly');
        setLoading(false);
      });

      map.on('click', (e) => {
        const { lng, lat } = e.lngLat;
        handleMapClick(lng, lat);
      });

    } catch (err) {
      console.error('❌ Failed to initialize map:', err);
      setError(err instanceof Error ? err.message : 'Failed to load map');
      setLoading(false);
    }
  };

  const handleMapClick = async (lng: number, lat: number) => {
    if (!mapInstance.current) return;

    try {
      // Remove existing marker
      if (markerInstance.current) {
        markerInstance.current.remove();
      }

      // Create new marker
      const marker = new window.mapboxgl.Marker({
        color: '#ef4444',
        draggable: true,
      })
        .setLngLat([lng, lat])
        .addTo(mapInstance.current);

      markerInstance.current = marker;

      // Handle marker drag
      marker.on('dragend', () => {
        const lngLat = marker.getLngLat();
        updateLocation(lngLat.lng, lngLat.lat);
      });

      // Update location
      await updateLocation(lng, lat);

      // Zoom to location
      mapInstance.current.flyTo({
        center: [lng, lat],
        zoom: 15,
        duration: 1000
      });

    } catch (error) {
      console.error('❌ Error handling map click:', error);
      toast.error('Failed to set location', {
        description: 'Please try clicking on the map again.'
      });
    }
  };

  const updateLocation = async (lng: number, lat: number) => {
    try {
      console.log('🔄 Updating location:', { lng, lat });
      
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}`
      );

      if (!response.ok) {
        throw new Error('Geocoding request failed');
      }

      const data = await response.json();

      if (data?.features?.length) {
        const feature = data.features[0];
        const address = feature.place_name;

        // Extract barangay from context
        let barangay = 'Unknown Barangay';
        if (feature.context) {
          for (const context of feature.context) {
            if (context.id.includes('neighborhood') || context.id.includes('locality')) {
              barangay = context.text.replace(/^(Brgy\.?|Barangay)\s*/i, '');
              break;
            }
          }
        }

        const locationData = {
          coordinates: { lat, lng },
          address,
          barangay
        };

        setSelectedLocation(locationData);
        console.log('📍 Location updated:', locationData);
      } else {
        throw new Error('No address found for this location');
      }
    } catch (error) {
      console.error('❌ Error updating location:', error);
      toast.error('Failed to get location information', {
        description: 'Please try selecting a different location.'
      });
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() || !mapInstance.current) return;

    try {
      setSearching(true);
      console.log('🔍 Searching for:', searchQuery);

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${MAPBOX_TOKEN}`
      );

      if (!response.ok) {
        throw new Error('Search request failed');
      }

      const data = await response.json();

      if (data?.features?.length) {
        const feature = data.features[0];
        const { center, place_name } = feature;
        const [lng, lat] = center;

        console.log('📍 Search result:', { lng, lat, place_name });

        mapInstance.current.flyTo({
          center: [lng, lat],
          zoom: 15,
          duration: 2000
        });

        await handleMapClick(lng, lat);

        toast.success('Location found!', {
          description: place_name
        });
      } else {
        toast.error('Location not found', {
          description: 'Try a different search term.'
        });
      }
    } catch (error) {
      console.error('❌ Search error:', error);
      toast.error('Search failed', {
        description: 'Please try again.'
      });
    } finally {
      setSearching(false);
    }
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      console.log('✅ Confirming location:', selectedLocation);
      onLocationSelected(selectedLocation);
      toast.success('Location confirmed!', {
        description: `Selected: ${selectedLocation.barangay}`
      });
    } else {
      toast.error('Please select a location first');
    }
  };

  const handleRetry = () => {
    console.log('🔄 Retrying map initialization...');
    setRetryCount(prev => prev + 1);
    setError(null);
    initializeMap();
  };

  useEffect(() => {
    if (mapContainer.current) {
      initializeMap();
    }

    return () => {
      console.log('🧹 Cleaning up map...');
      if (markerInstance.current) {
        markerInstance.current.remove();
      }
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, []);

  if (loading) {
    return (
      <div className={`relative border border-border rounded-lg overflow-hidden ${className}`} style={{ height }}>
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
            <div className="text-sm text-muted-foreground">Loading map...</div>
            {retryCount > 0 && (
              <div className="text-xs text-muted-foreground">
                Attempt {retryCount + 1}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`relative border border-destructive/20 bg-destructive/5 rounded-lg overflow-hidden ${className}`} style={{ height }}>
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="text-center space-y-3 max-w-sm">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
            <div className="space-y-2">
              <div className="text-sm font-medium text-destructive">Failed to load map</div>
              <div className="text-xs text-muted-foreground">{error}</div>
            </div>
            <Button onClick={handleRetry} size="sm" variant="outline">
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
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for a location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10"
          />
        </div>
        <Button 
          onClick={handleSearch} 
          disabled={!searchQuery.trim() || searching}
          size="default"
        >
          {searching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="relative border border-border rounded-lg overflow-hidden" style={{ height }}>
        <div ref={mapContainer} className="w-full h-full" />
        
        <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm border border-border rounded-lg p-3 max-w-xs">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-xs text-muted-foreground">
              Click on the map or search for a location. Drag the marker to adjust.
            </div>
          </div>
        </div>

        {selectedLocation && (
          <div className="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur-sm border border-border rounded-lg p-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <div className="font-medium text-sm">Selected Location</div>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div><strong>Barangay:</strong> {selectedLocation.barangay}</div>
                <div><strong>Address:</strong> {selectedLocation.address}</div>
                <div><strong>Coordinates:</strong> {selectedLocation.coordinates.lat.toFixed(6)}, {selectedLocation.coordinates.lng.toFixed(6)}</div>
              </div>
              <Button 
                onClick={handleConfirmLocation}
                size="sm" 
                className="w-full mt-2"
              >
                Confirm Location
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapboxLocationPicker;
