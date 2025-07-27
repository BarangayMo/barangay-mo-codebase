//mychanges

import { getGoogleMapsApiKey } from './apiKeys';

// Global variable to track if Google Maps is loaded

let googleMapsPromise: Promise<void> | null = null;

/**
 * Loads Google Maps JavaScript API with Places and Geometry libraries
 */
let isGoogleMapsLoaded = false;

export function loadGoogleMaps(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (isGoogleMapsLoaded && typeof window.google !== "undefined") {
      console.log("✅ Google Maps already loaded");
      return resolve();
    }

    // Already loaded or loading
    if (typeof window.google !== "undefined" && window.google.maps) {
      console.log("✅ window.google is already defined");
      isGoogleMapsLoaded = true;
      return resolve();
    }

    const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
    if (existingScript) {
      console.log("⏳ Waiting for existing Google Maps script to finish loading...");
      existingScript.addEventListener("load", () => {
        (window as any).google = window.google;
        isGoogleMapsLoaded = true;
        console.log("✅ Google Maps loaded from existing script");
        resolve();
      });
      existingScript.addEventListener("error", () => {
        console.error("❌ Failed to load existing Google Maps script");
        reject(new Error("Google Maps script failed"));
      });
      return;
    }

    try {
      console.log("📦 Injecting Google Maps script...");

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places&callback=initGoogleMaps`;
      script.async = true;
      script.defer = true;

      // Attach global callback
      (window as any).initGoogleMaps = () => {
        console.log("✅ initGoogleMaps callback called");
        (window as any).google = window.google; // Ensure global reference
        isGoogleMapsLoaded = true;
        resolve();
      };

      script.onerror = () => {
        console.error("❌ Google Maps script failed to load");
        reject(new Error("Google Maps script error"));
      };

      document.head.appendChild(script);
    } catch (error) {
      console.error("❌ Exception during script injection", error);
      reject(error);
    }
  });
}


/**
 * Geocodes an address using Google Maps Geocoding API
 */
export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number; formatted_address: string } | null> {
  await loadGoogleMaps();
  
  return new Promise((resolve) => {
    const geocoder = new google.maps.Geocoder();
    
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location;
        resolve({
          lat: location.lat(),
          lng: location.lng(),
          formatted_address: results[0].formatted_address
        });
      } else {
        console.error('Geocoding failed:', status);
        resolve(null);
      }
    });
  });
}

/**
 * Reverse geocodes coordinates to get address information
 */
export async function reverseGeocode(lat: number, lng: number): Promise<{ address: string; barangay?: string } | null> {
  await loadGoogleMaps();
  
  return new Promise((resolve) => {
    const geocoder = new google.maps.Geocoder();
    const latlng = { lat, lng };
    
    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const address = results[0].formatted_address;
        
        // Try to extract barangay from address components
        let barangay = '';
        for (const component of results[0].address_components) {
          if (component.types.includes('sublocality_level_1') || 
              component.types.includes('neighborhood') ||
              component.long_name.toLowerCase().includes('barangay')) {
            barangay = component.long_name.replace(/^(Brgy\.?|Barangay)\s*/i, '');
            break;
          }
        }
        
        resolve({
          address,
          barangay: barangay || undefined
        });
      } else {
        console.error('Reverse geocoding failed:', status);
        resolve(null);
      }
    });
  });
}

/**
 * Creates a map instance with default styling
 */
export async function createMap(
  container: HTMLElement,
  options: {
    center: { lat: number; lng: number };
    zoom?: number;
    disableDefaultUI?: boolean;
    zoomControl?: boolean;
    streetViewControl?: boolean;
    fullscreenControl?: boolean;
  }
): Promise<google.maps.Map> {
  await loadGoogleMaps();
  
  const mapOptions: google.maps.MapOptions = {
    center: options.center,
    zoom: options.zoom || 15,
    disableDefaultUI: options.disableDefaultUI || false,
    zoomControl: options.zoomControl !== false,
    streetViewControl: options.streetViewControl !== false,
    fullscreenControl: options.fullscreenControl !== false,
    mapTypeControl: false,
    styles: [
      {
        featureType: 'poi.business',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'poi.medical',
        stylers: [{ visibility: 'off' }]
      }
    ]
  };
  
  return new google.maps.Map(container, mapOptions);
}

/**
 * Creates a marker on the map
 */
export function createMarker(
  map: google.maps.Map,
  position: { lat: number; lng: number },
  options?: {
    title?: string;
    draggable?: boolean;
    icon?: string | google.maps.Icon | google.maps.Symbol;
  }
): google.maps.Marker {
  return new google.maps.Marker({
    position,
    map,
    title: options?.title,
    draggable: options?.draggable || false,
    icon: options?.icon
  });
}

/**
 * Creates an info window
 */
export function createInfoWindow(
  content: string,
  options?: {
    maxWidth?: number;
    pixelOffset?: google.maps.Size;
  }
): google.maps.InfoWindow {
  return new google.maps.InfoWindow({
    content,
    maxWidth: options?.maxWidth || 300,
    pixelOffset: options?.pixelOffset
  });
}

// Type declarations for Google Maps
declare global {
  interface Window {
    google: typeof google;
    initGoogleMaps: () => void;
  }
}
