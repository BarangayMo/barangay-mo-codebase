
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
      if (!mapContainer.current || !location || map.current) return;

      try {
        setLoading(true);
        setError(null);

        // Get Mapbox API key from Supabase secrets
        const { data, error: secretError } = await supabase.functions.invoke('get-api-key', {
          body: { keyName: 'MAPBOX_PUBLIC_TOKEN' }
        });

        if (secretError) {
          console.error('Error fetching Mapbox API key:', secretError);
          throw new Error('Failed to retrieve Mapbox API key');
        }

        if (!data?.apiKey) {
          throw new Error('Mapbox API key not found');
        }

        // Set Mapbox access token
        mapboxgl.accessToken = data.apiKey;

        // Geocode the location to get coordinates
        const geocodeResponse = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${data.apiKey}&limit=1`
        );
        
        if (!geocodeResponse.ok) {
          throw new Error(`Geocoding failed: ${geocodeResponse.status}`);
        }

        const geocodeData = await geocodeResponse.json();
        
        if (!geocodeData.features || geocodeData.features.length === 0) {
          throw new Error('Location not found');
        }

        const [lng, lat] = geocodeData.features[0].center;

        // Initialize map
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

        // Add popup with location info
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
          setLoading(false);
        });

        map.current.on('error', (e) => {
          console.error('Map error:', e);
          setError('Map failed to load');
          setLoading(false);
        });

      } catch (err) {
        console.error('Map initialization error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load map');
        setLoading(false);
      }
    };

    initializeMap();

    // Cleanup
    return () => {
      if (map.current) {
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
