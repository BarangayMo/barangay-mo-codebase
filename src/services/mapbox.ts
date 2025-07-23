import mapboxgl from 'mapbox-gl';

// Use the provided API key directly
const MAPBOX_API_KEY = 'pk.eyJ1IjoiYmFyYW5nYXltbyIsImEiOiJjbWJxZHBzenAwMmdrMmtzZmloemphb284In0.U22j37ppYT1IMyC2lXVBzw';

let isMapboxInitialized = false;

/**
 * Initialize Mapbox with API key
 */
export function initializeMapbox(): void {
  if (isMapboxInitialized) return;

  mapboxgl.accessToken = MAPBOX_API_KEY;
  isMapboxInitialized = true;
  console.info('🗺️ Mapbox initialized');
}

/**
 * Geocode an address using Mapbox Geocoding API
 */
export async function geocodeAddress(address: string): Promise<{ lng: number; lat: number; place_name: string } | null> {
  initializeMapbox();

  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}`
    );

    const data = await response.json();

    if (data?.features?.length) {
      const feature = data.features[0];
      return {
        lng: feature.center[0],
        lat: feature.center[1],
        place_name: feature.place_name,
      };
    }

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
  initializeMapbox();

  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
    );

    const data = await response.json();

    if (data?.features?.length) {
      const feature = data.features[0];
      const address = feature.place_name;

      let barangay: string | undefined = undefined;

      if (feature.context) {
        for (const context of feature.context) {
          if (context.id.includes('neighborhood') || context.id.includes('locality')) {
            barangay = context.text.replace(/^(Brgy\.?|Barangay)\s*/i, '');
            break;
          }
        }
      }

      return { address, barangay };
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
export function createMap(
  container: HTMLElement,
  options: {
    center: [number, number];
    zoom?: number;
    style?: string;
  }
): mapboxgl.Map {
  initializeMapbox();

  const map = new mapboxgl.Map({
    container,
    style: options.style || 'mapbox://styles/mapbox/streets-v11',
    center: options.center,
    zoom: options.zoom || 15,
    attributionControl: false,
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
  return new mapboxgl.Marker({
    color: options?.color || '#ef4444',
    draggable: options?.draggable || false,
    element: options?.element,
  })
    .setLngLat(coordinates)
    .addTo(map);
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
    offset: options?.offset || 25,
  }).setHTML(content);
}
