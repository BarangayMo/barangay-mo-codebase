import React, { useEffect, useRef, useState } from 'react';
import { Search, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { initializeMapbox, geocodeAddress, reverseGeocode, createMap, createMarker } from '@/services/mapbox';
import { toast } from 'sonner';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markerInstance = useRef<mapboxgl.Marker | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    coordinates: { lat: number; lng: number };
    address: string;
    barangay: string;
  } | null>(null);

  const initializeMap = async () => {
    if (!mapContainer.current) {
      console.error('⚠️ Map container not found');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('🗺️ Initializing Mapbox...');
      await initializeMapbox();

      const initialCoords = await geocodeAddress(initialLocation);
      const center: [number, number] = initialCoords 
        ? [initialCoords.lng, initialCoords.lat]
        : [121.0244, 14.5547];

      console.log('📍 Initial map center:', center);

      const map = await createMap(mapContainer.current, {
        center,
        zoom: 6
      });

      mapInstance.current = map;

      map.on('load', () => {
        console.log('✅ Map loaded and ready');
        map.resize();
        setLoading(false);
      });

      map.on('error', (e) => {
        console.error('❌ Map load error:', e);
        setError('Failed to load map');
        setLoading(false);
      });

      map.on('click', async (e) => {
        console.log('🗺️ Map clicked:', e.lngLat);
        await handleMapClick(e.lngLat.lng, e.lngLat.lat);
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
      if (markerInstance.current) {
        markerInstance.current.remove();
      }

      const marker = createMarker(mapInstance.current, [lng, lat], {
        color: '#ef4444',
        draggable: true
      });

      markerInstance.current = marker;

      marker.on('dragend', async () => {
        const lngLat = marker.getLngLat();
        await updateLocation(lngLat.lng, lngLat.lat);
      });

      await updateLocation(lng, lat);
    } catch (error) {
      console.error('❌ Error on map click:', error);
      toast.error('Failed to get location information');
    }
  };

  const updateLocation = async (lng: number, lat: number) => {
    console.log('🔄 Updating location:', lng, lat);
    try {
      const result = await reverseGeocode(lng, lat);

      if (result) {
        const locationData = {
          coordinates: { lat, lng },
          address: result.address,
          barangay: result.barangay || 'Unknown Barangay'
        };

        setSelectedLocation(locationData);
        console.log('📍 Location updated:', locationData);
      } else {
        toast.error('Could not get address for this location');
      }
    } catch (error) {
      console.error('❌ Error updating location:', error);
      toast.error('Failed to get location information');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() || !mapInstance.current) return;

    try {
      setSearching(true);
      console.log('🔍 Searching for:', searchQuery);

      const result = await geocodeAddress(searchQuery.trim());

      if (result) {
        console.log('📍 Search result:', result);

        mapInstance.current.flyTo({
          center: [result.lng, result.lat],
          zoom: 15,
          duration: 2000
        });

        await handleMapClick(result.lng, result.lat);

        toast.success('Location found!');
      } else {
        toast.error('Location not found. Try a different search.');
      }
    } catch (error) {
      console.error('❌ Search error:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      console.log('✅ Confirming location:', selectedLocation);
      onLocationSelected(selectedLocation);
    } else {
      toast.error('Please select a location first');
    }
  };

  useEffect(() => {
    initializeMap();

    return () => {
      console.log('🧹 Cleaning up MapboxLocationPicker...');
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
            <Button onClick={initializeMap} size="sm" variant="outline">
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
