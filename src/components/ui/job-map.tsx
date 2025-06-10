
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

interface JobMapProps {
  location: string;
  className?: string;
}

export const JobMap = ({ location, className }: JobMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const initializeMap = async (attempt = 1) => {
    console.log(`🗺️ JobMap: Starting map initialization (attempt ${attempt})`);
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

    try {
      setLoading(true);
      setError(null);

      // Wait for DOM to be ready
      await new Promise(resolve => {
        if (document.readyState === 'complete') {
          resolve(void 0);
        } else {
          window.addEventListener('load', () => resolve(void 0), { once: true });
        }
      });

      // Additional wait for container
      await new Promise(resolve => setTimeout(resolve, 100));

      if (!mapContainer.current) {
        throw new Error('Map container not ready');
      }

      if (!document.contains(mapContainer.current)) {
        throw new Error('Map container not in DOM');
      }

      console.log('✅ JobMap: Container ready, fetching API key...');

      // Get Mapbox API key with timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('API key request timeout')), 10000)
      );

      const apiKeyPromise = supabase.functions.invoke('get-api-key', {
        body: { keyName: 'MAPBOX_PUBLIC_TOKEN' }
      });

      const { data, error: secretError } = await Promise.race([apiKeyPromise, timeoutPromise]) as any;

      console.log('🔑 JobMap: Edge function response:', { data, error: secretError });

      if (secretError) {
        console.error('❌ JobMap: Error fetching Mapbox API key:', secretError);
        throw new Error(`Failed to retrieve Mapbox API key: ${secretError.message}`);
      }

      if (!data?.apiKey) {
        console.error('❌ JobMap: No API key in response:', data);
        throw new Error('Mapbox API key not found in response');
      }

      // Validate API key format
      if (!data.apiKey.startsWith('pk.')) {
        console.error('❌ JobMap: Invalid API key format');
        throw new Error('Invalid Mapbox API key format');
      }

      console.log('✅ JobMap: API key received successfully');

      // Set Mapbox access token
      mapboxgl.accessToken = data.apiKey;

      // Geocode the location with timeout
      console.log('🌍 JobMap: Starting geocoding for:', location);
      const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${data.apiKey}&limit=1`;
      
      const geocodeTimeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Geocoding request timeout')), 8000)
      );

      const geocodePromise = fetch(geocodeUrl);
      const geocodeResponse = await Promise.race([geocodePromise, geocodeTimeoutPromise]) as Response;

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

      // Final container check
      if (!mapContainer.current || !document.contains(mapContainer.current)) {
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

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      // Add marker
      new mapboxgl.Marker({
        color: '#ef4444'
      })
        .setLngLat([lng, lat])
        .addTo(map.current);

      // Add popup
      new mapboxgl.Popup({
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
        setRetryCount(0);
      });

      map.current.on('error', (e) => {
        console.error('❌ JobMap: Map error:', e);
        throw new Error('Map failed to load');
      });

      console.log('🗺️ JobMap: Map initialization completed');

    } catch (err) {
      console.error('❌ JobMap: Map initialization error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load map';
      
      // Retry logic
      if (attempt < maxRetries && retryCount < maxRetries) {
        console.log(`🔄 JobMap: Retrying in 2 seconds (attempt ${attempt + 1}/${maxRetries})`);
        setRetryCount(attempt);
        setTimeout(() => {
          initializeMap(attempt + 1);
        }, 2000);
      } else {
        setError(errorMessage);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (location && !map.current) {
      initializeMap();
    }

    return () => {
      if (map.current) {
        console.log('🗺️ JobMap: Cleaning up map instance');
        map.current.remove();
        map.current = null;
      }
    };
  }, [location]);

  const handleRetry = () => {
    setRetryCount(0);
    setError(null);
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
    initializeMap();
  };

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center h-48 bg-muted rounded-lg`}>
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {retryCount > 0 ? `Loading map... (attempt ${retryCount + 1})` : 'Loading map...'}
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center h-48 bg-muted rounded-lg`}>
        <div className="flex flex-col items-center gap-2 text-center p-4">
          <AlertCircle className="h-6 w-6 text-red-500" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">{location}</p>
            <p className="text-xs text-red-500 mt-1">{error}</p>
            {retryCount < maxRetries && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRetry}
                className="mt-2"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            )}
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
