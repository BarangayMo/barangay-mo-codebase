import { getMapboxApiKey } from './apiKeys';
import mapboxgl from 'mapbox-gl';

// Global variable to track if Mapbox is initialized
let isMapboxInitialized = false;

/**
 * Initialize Mapbox with API key
 */
export async function initializeMapbox(): Promise<void> {
  if (isMapboxInitialized) {
    return;
  }

  try {
    let apiKey = await getMapboxApiKey();
    
    if (!apiKey) {
      console.warn('⚠️ Mapbox API key not found in database, using fallback key');
      apiKey = 'YOUR_FALLBACK_MAPBOX_TOKEN_HERE';
    }

    console.log('✅ Mapbox API Key:', apiKey);

    mapboxgl.accessToken = apiKey;
    isMapboxInitialized = true;

    console.log('🗺️ Mapbox initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Mapbox:', error);
    throw error;
  }
}

/**
 * Geocode an address using Mapbox Geocoding API
 */
export async function geocodeAddress(address: string): Promise<{ lng: number; lat: number; place_name: string } | null> {
  await initializeMapbox();

  console.log(`📍 Geocoding address: ${address}`);

  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}`
    );

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      return {
        lng: feature.center[0],
        lat: feature.center[1],
        place_name: feature.place_name
      };
    }

    console.warn(`No geocode result for: ${address}`);
    return null;
  } catch (error) {
    console.error('❌ Geocoding failed:', error);
    return null;
  }
}

/**
 * Reverse geocode coordinates to get address information
 */
export async function reverseGeocode(lng: number, lat: number): Promise<{ address: string; barangay?: string } | null> {
  await initializeMapbox();

  console.log(`📍 Reverse geocoding: ${lng}, ${lat}`);

  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
    );

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      const address = feature.place_name;

      let barangay = '';
      if (feature.context) {
        for (const context of feature.context) {
          if (context.id.includes('neighborhood') || context.id.includes('locality')) {
            barangay = context.text.replace(/^(Brgy\.?|Barangay)\s*/i, '');
            break;
          }
        }
      }

      return {
        address,
        barangay: barangay || undefined
      };
    }

    return null;
  } catch (error) {
    console.error('❌ Reverse geocoding failed:', error);
    return null;
  }
}

/**
 * Create a map instance with default styling
 */
export async function createMap(
  container: HTMLElement,
  options: {
    center: [number, number];
    zoom?: number;
    style?: string;
  }
): Promise<mapboxgl.Map> {
  await initializeMapbox();

  const map = new mapboxgl.Map({
    container,
    style: options.style || 'mapbox://styles/mapbox/streets-v11',
    center: options.center,
    zoom: options.zoom || 15,
    attributionControl: false
  });

  map.addControl(new mapboxgl.NavigationControl(), 'top-right');

  return map;
}

/**
 * Create a marker on the map
 */
export function createMarker(
  map: mapboxgl.Map,
  coordinates: [number, number],
  options?: {
    color?: string;
    draggable?: boolean;
    element?: HTMLElement;
  }
): mapboxgl.Marker {
  const marker = new mapboxgl.Marker({
    color: options?.color || '#ef4444',
    draggable: options?.draggable || false,
    element: options?.element
  })
    .setLngLat(coordinates)
    .addTo(map);

  return marker;
}

/**
 * Create a popup
 */
export function createPopup(
  content: string,
  options?: {
    maxWidth?: string;
    offset?: number;
  }
): mapboxgl.Popup {
  return new mapboxgl.Popup({
    maxWidth: options?.maxWidth || '300px',
    offset: options?.offset || 25
  }).setHTML(content);
}
