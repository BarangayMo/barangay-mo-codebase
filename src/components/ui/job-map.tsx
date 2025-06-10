
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface JobMapProps {
  location: string;
  className?: string;
}

// You can set your Mapbox public token here directly
// Get it from: https://account.mapbox.com/access-tokens/
const MAPBOX_PUBLIC_TOKEN = 'YOUR_MAPBOX_PUBLIC_TOKEN_HERE';

export const JobMap = ({ location, className }: JobMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [apiKey, setApiKey] = useState(MAPBOX_PUBLIC_TOKEN);
  const [showApiKeyInput, setShowApiKeyInput] = useState(!MAPBOX_PUBLIC_TOKEN || MAPBOX_PUBLIC_TOKEN === 'YOUR_MAPBOX_PUBLIC_TOKEN_HERE');
  const maxRetries = 3;

  const waitForContainer = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const checkContainer = () => {
        if (mapContainer.current && document.contains(mapContainer.current)) {
          const rect = mapContainer.current.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            resolve();
            return;
          }
        }
        
        setTimeout(checkContainer, 100);
      };
      
      checkContainer();
      setTimeout(() => reject(new Error('Container timeout')), 5000);
    });
  };

  const initializeMap = async (attempt = 1) => {
    console.log(`🗺️ JobMap: Starting map initialization (attempt ${attempt})`);
    console.log('🗺️ JobMap: Location:', location);

    if (!location) {
      console.log('❌ JobMap: No location provided');
      setError('No location provided');
      setLoading(false);
      return;
    }

    if (!apiKey || apiKey === 'YOUR_MAPBOX_PUBLIC_TOKEN_HERE') {
      console.log('❌ JobMap: No valid API key provided');
      setError('Please enter your Mapbox public token');
      setLoading(false);
      setShowApiKeyInput(true);
      return;
    }

    if (map.current) {
      console.log('🗺️ JobMap: Map already exists, cleaning up first');
      map.current.remove();
      map.current = null;
    }

    try {
      setLoading(true);
      setError(null);

      // Wait for container to be ready
      console.log('🗺️ JobMap: Waiting for container...');
      await waitForContainer();
      console.log('✅ JobMap: Container ready');

      // Validate API key format
      if (!apiKey.startsWith('pk.')) {
        console.error('❌ JobMap: Invalid API key format:', apiKey.substring(0, 10));
        throw new Error('Invalid Mapbox API key format - should start with pk.');
      }

      console.log('✅ JobMap: Valid API key provided, length:', apiKey.length);

      // Set Mapbox access token
      mapboxgl.accessToken = apiKey;

      // Geocode the location
      console.log('🌍 JobMap: Starting geocoding for:', location);
      const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${apiKey}&limit=1`;
      
      const geocodeTimeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Geocoding request timeout after 10 seconds')), 10000)
      );

      const geocodePromise = fetch(geocodeUrl);
      const geocodeResponse = await Promise.race([geocodePromise, geocodeTimeoutPromise]) as Response;

      console.log('🌍 JobMap: Geocode response status:', geocodeResponse.status);

      if (!geocodeResponse.ok) {
        const errorText = await geocodeResponse.text();
        console.error('❌ JobMap: Geocoding failed:', geocodeResponse.status, errorText);
        throw new Error(`Geocoding failed: ${geocodeResponse.status} - ${errorText}`);
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
        setShowApiKeyInput(false);
      });

      map.current.on('error', (e) => {
        console.error('❌ JobMap: Map error:', e);
        throw new Error(`Map failed to load: ${e.error?.message || 'Unknown error'}`);
      });

      console.log('🗺️ JobMap: Map initialization completed');

    } catch (err) {
      console.error('❌ JobMap: Map initialization error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load map';
      
      // Retry logic
      if (attempt < maxRetries && retryCount < maxRetries) {
        console.log(`🔄 JobMap: Retrying in 3 seconds (attempt ${attempt + 1}/${maxRetries})`);
        setRetryCount(attempt);
        setTimeout(() => {
          initializeMap(attempt + 1);
        }, 3000);
      } else {
        setError(errorMessage);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (location && !map.current && apiKey && apiKey !== 'YOUR_MAPBOX_PUBLIC_TOKEN_HERE') {
      const timer = setTimeout(() => {
        initializeMap();
      }, 100);
      
      return () => clearTimeout(timer);
    }

    return () => {
      if (map.current) {
        console.log('🗺️ JobMap: Cleaning up map instance');
        map.current.remove();
        map.current = null;
      }
    };
  }, [location, apiKey]);

  const handleRetry = () => {
    setRetryCount(0);
    setError(null);
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
    initializeMap();
  };

  const handleApiKeySubmit = () => {
    if (apiKey && apiKey.trim() && apiKey !== 'YOUR_MAPBOX_PUBLIC_TOKEN_HERE') {
      setShowApiKeyInput(false);
      initializeMap();
    }
  };

  if (showApiKeyInput) {
    return (
      <div className={`${className} flex items-center justify-center h-48 bg-muted rounded-lg`}>
        <div className="flex flex-col items-center gap-4 text-center p-4 max-w-sm">
          <MapPin className="h-8 w-8 text-muted-foreground" />
          <div className="space-y-2">
            <h3 className="font-medium">Mapbox Token Required</h3>
            <p className="text-sm text-muted-foreground">
              Enter your Mapbox public token to display the map
            </p>
          </div>
          <div className="w-full space-y-2">
            <Label htmlFor="mapbox-token" className="text-sm">Mapbox Public Token</Label>
            <Input
              id="mapbox-token"
              type="text"
              placeholder="pk.xxxxxxxx..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="font-mono text-xs"
            />
            <Button 
              onClick={handleApiKeySubmit}
              className="w-full"
              disabled={!apiKey || apiKey === 'YOUR_MAPBOX_PUBLIC_TOKEN_HERE'}
            >
              Load Map
            </Button>
            <p className="text-xs text-muted-foreground">
              Get your token from{' '}
              <a 
                href="https://account.mapbox.com/access-tokens/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                account.mapbox.com
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

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
            <div className="flex gap-2 mt-2">
              {retryCount < maxRetries && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRetry}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowApiKeyInput(true)}
              >
                Change Token
              </Button>
            </div>
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
