import { getGoogleMapsApiKey } from "./apiKeys"


let isGoogleMapsLoaded = false

export function loadGoogleMaps(): Promise<void> {
  return new Promise(async (resolve, reject) => {
    if (isGoogleMapsLoaded && typeof window.google !== "undefined" && typeof window.google.maps !== "undefined") {
      console.log("✅ Google Maps already loaded (from cache)")
      return resolve()
    }

    // Check for existing script to prevent duplicate injection
    const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`)
    if (existingScript) {
      console.log("⏳ Waiting for existing Google Maps script to finish loading...")
      existingScript.addEventListener("load", () => {
        isGoogleMapsLoaded = true
        console.log("✅ Google Maps loaded from existing script")
        resolve()
      })
      existingScript.addEventListener("error", () => {
        console.error("❌ Failed to load existing Google Maps script")
        reject(new Error("Google Maps script failed"))
      })
      return
    }

    try {
      console.log("📦 Injecting Google Maps script...")
      const apiKey = await getGoogleMapsApiKey()

      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`
      script.async = true
      script.defer = true

      // Attach global callback
      ;(window as any).initGoogleMaps = () => {
        console.log("✅ initGoogleMaps callback called")
        isGoogleMapsLoaded = true
        resolve()
      }

      script.onerror = () => {
        console.error("❌ Google Maps script failed to load")
        reject(new Error("Google Maps script error"))
      }

      document.head.appendChild(script)
    } catch (error) {
      console.error("❌ Exception during script injection", error)
      reject(error)
    }
  })
}

export async function geocodeAddress(
  address: string,
): Promise<{ lat: number; lng: number; formatted_address: string } | null> {
  await loadGoogleMaps()

  return new Promise((resolve, reject) => {
    // Use window.google.maps.Geocoder
    const geocoder = new google.maps.Geocoder()
    console.log(`🌍 Geocoding address: "${address}"`)
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location
        console.log("✅ Geocoding successful:", results[0].formatted_address)
        resolve({
          lat: location.lat(),
          lng: location.lng(),
          formatted_address: results[0].formatted_address,
        })
      } else {
        console.error("❌ Geocoding failed:", status)
        reject(new Error(`Geocoding failed with status: ${status}`))
      }
    })
  })
}

export async function reverseGeocode(lat: number, lng: number): Promise<{ address: string; barangay?: string } | null> {
  await loadGoogleMaps()

  return new Promise((resolve, reject) => {
    // Use window.google.maps.Geocoder
    const geocoder = new google.maps.Geocoder()
    const latlng = { lat, lng }
    console.log(`🌍 Reverse geocoding coordinates: ${lat}, ${lng}`)
    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const address = results[0].formatted_address

        let barangay = ""
        for (const component of results[0].address_components) {
          if (
            component.types.includes("sublocality_level_1") ||
            component.types.includes("neighborhood") ||
            component.long_name.toLowerCase().includes("barangay")
          ) {
            barangay = component.long_name.replace(/^(Brgy\.?|Barangay)\s*/i, "")
            break
          }
        }
        console.log("✅ Reverse geocoding successful:", address)
        resolve({
          address,
          barangay: barangay || undefined,
        })
      } else {
        console.error("❌ Reverse geocoding failed:", status)
        reject(new Error(`Reverse geocoding failed with status: ${status}`))
      }
    })
  })
}

export async function createMap(
  container: HTMLElement,
  options: {
    center: { lat: number; lng: number }
    zoom?: number
    disableDefaultUI?: boolean
    zoomControl?: boolean
    streetViewControl?: boolean
    fullscreenControl?: boolean
  },
): Promise<google.maps.Map> {
  await loadGoogleMaps()
  console.log("🗺️ Attempting to create map instance...")
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
        featureType: "poi.business",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "poi.medical",
        stylers: [{ visibility: "off" }],
      },
    ],
  }
  try {
    // Use window.google.maps.Map
    const map = new google.maps.Map(container, mapOptions)
    console.log("✅ Map instance created successfully.")
    return map
  } catch (e) {
    console.error("❌ Error creating map instance:", e)
    throw e
  }
}

export function createMarker(
  map: google.maps.Map,
  position: { lat: number; lng: number },
  options?: {
    title?: string
    draggable?: boolean
    icon?: string | google.maps.Icon | google.maps.Symbol
  },
): google.maps.Marker {
  console.log("📍 Creating marker...")
  // Use window.google.maps.Marker
  return new google.maps.Marker({
    position,
    map,
    title: options?.title,
    draggable: options?.draggable || false,
    icon: options?.icon,
  })
}

export function createInfoWindow(
  content: string,
  options?: {
    maxWidth?: number
    pixelOffset?: google.maps.Size
  },
): google.maps.InfoWindow {
  console.log("💬 Creating info window...")
  // Use window.google.maps.InfoWindow
  return new google.maps.InfoWindow({
    content,
    maxWidth: options?.maxWidth || 300,
    pixelOffset: options?.pixelOffset,
  })
}

// This declare global block is crucial for TypeScript to recognize window.google
// We use 'any' for simplicity to avoid complex type imports from @types/google.maps
// if they are not explicitly installed or configured.
declare global {
  interface Window {
    google: any // This will allow access to window.google.maps, window.google.maps.Geocoder, etc.
    initGoogleMaps: () => void
  }
}
