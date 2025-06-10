
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface JobMapProps {
  location: string;
  className?: string;
}

export const JobMap = ({ location, className }: JobMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeMap = async () => {
      console.log('🗺️ JobMap: Starting map initialization');
      console.log('🗺️ JobMap: Location:', location);

      if (!location) {
        console.log('❌ JobMap: No location provided');
        setError('No location provided');
        setLoading(false);
        return;
      }

      if (map.current) {
        console.log('🗺️ JobMap: Map already exists, skipping initialization');
        return;
      }

      // Wait longer for container to be ready and check multiple times
      let attempts = 0;
      const maxAttempts = 10;
      
      while (!mapContainer.current && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
        console.log(`🗺️ JobMap: Waiting for container, attempt ${attempts}/${maxAttempts}`);
      }

      if (!mapContainer.current) {
        console.log('❌ JobMap: Map container not available after waiting');
        setError('Map container not available');
        setLoading(false);
        return;
      }

      console.log('✅ JobMap: Container ready, proceeding with initialization');

      try {
        setLoading(true);
        setError(null);

        console.log('🔑 JobMap: Calling edge function for API key...');

        // Get Mapbox API key from Supabase secrets
        const { data, error: secretError } = await supabase.functions.invoke('get-api-key', {
          body: { keyName: 'MAPBOX_PUBLIC_TOKEN' }
        });

        console.log('🔑 JobMap: Edge function response:', { data, error: secretError });

        if (secretError) {
          console.error('❌ JobMap: Error fetching Mapbox API key:', secretError);
          throw new Error(`Failed to retrieve Mapbox API key: ${secretError.message}`);
        }

        if (!data?.apiKey) {
          console.error('❌ JobMap: No API key in response:', data);
          throw new Error('Mapbox API key not found in response');
        }

        console.log('✅ JobMap: API key received successfully');

        // Set Mapbox access token
        mapboxgl.accessToken = data.apiKey;
        console.log('🔑 JobMap: Mapbox access token set');

        // Geocode the location to get coordinates
        console.log('🌍 JobMap: Starting geocoding for:', location);
        const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${data.apiKey}&limit=1`;
        
        const geocodeResponse = await fetch(geocodeUrl);
        console.log('🌍 JobMap: Geocode response status:', geocodeResponse.status);

        if (!geocodeResponse.ok) {
          const errorText = await geocodeResponse.text();
          console.error('❌ JobMap: Geocoding failed:', geocodeResponse.status, errorText);
          throw new Error(`Geocoding failed: ${geocodeResponse.status}`);
        }

        const geocodeData = await geocodeResponse.json();
        console.log('🌍 JobMap: Geocode data received:', geocodeData);
        
        if (!geocodeData.features || geocodeData.features.length === 0) {
          console.error('❌ JobMap: No geocoding results for location:', location);
          throw new Error(`Location "${location}" not found`);
        }

        const [lng, lat] = geocodeData.features[0].center;
        console.log('📍 JobMap: Coordinates found:', { lng, lat });

        // Final check that container is still available
        if (!mapContainer.current) {
          console.error('❌ JobMap: Map container disappeared during initialization');
          throw new Error('Map container no longer available');
        }

        // Initialize map
        console.log('🗺️ JobMap: Creating Mapbox map instance...');
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [lng, lat],
          zoom: 14,
          attributionControl: false
        });

        console.log('🗺️ JobMap: Map instance created successfully');

        // Add navigation controls
        map.current.addControl(
          new mapboxgl.NavigationControl({
            visualizePitch: true,
          }),
          'top-right'
        );

        // Add marker
        const marker = new mapboxgl.Marker({
          color: '#ef4444'
        })
          .setLngLat([lng, lat])
          .addTo(map.current);

        // Add popup
        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: false,
          closeOnClick: false
        })
          .setLngLat([lng, lat])
          .setHTML(`
            <div class="p-2 font-medium text-sm">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>${location}</span>
              </div>
            </div>
          `)
          .addTo(map.current);

        map.current.on('load', () => {
          console.log('✅ JobMap: Map loaded successfully');
          setLoading(false);
        });

        map.current.on('error', (e) => {
          console.error('❌ JobMap: Map error:', e);
          setError('Map failed to load');
          setLoading(false);
        });

        console.log('🗺️ JobMap: Map initialization completed');

      } catch (err) {
        console.error('❌ JobMap: Map initialization error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load map';
        setError(errorMessage);
        setLoading(false);
      }
    };

    // Only initialize if we have a location and no existing map
    if (location && !map.current) {
      initializeMap();
    }

    // Cleanup
    return () => {
      if (map.current) {
        console.log('🗺️ JobMap: Cleaning up map instance');
        map.current.remove();
        map.current = null;
      }
    };
  }, [location]);

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center h-48 bg-muted rounded-lg`}>
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Loading map...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center h-48 bg-muted rounded-lg`}>
        <div className="flex flex-col items-center gap-2 text-center p-4">
          <MapPin className="h-6 w-6 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">{location}</p>
            <p className="text-xs text-muted-foreground mt-1">Map unavailable</p>
            <p className="text-xs text-red-500 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div ref={mapContainer} className="w-full h-48 rounded-lg shadow-sm" />
    </div>
  );
};
