import { getGoogleMapsApiKey } from "./apiKeys"

let isGoogleMapsLoaded = false

export function loadGoogleMaps(): Promise<void> {
  return new Promise(async (resolve, reject) => {
    // Added async here
    if (isGoogleMapsLoaded && typeof window.google !== "undefined") {
      console.log("✅ Google Maps already loaded")
      return resolve()
    }

    if (typeof window.google !== "undefined" && window.google.maps) {
      console.log("✅ window.google is already defined")
      isGoogleMapsLoaded = true
      return resolve()
    }

    const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`)
    if (existingScript) {
      console.log("⏳ Waiting for existing Google Maps script to finish loading...")
      existingScript.addEventListener("load", () => {
        ;(window as any).google = window.google
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
      const apiKey = await getGoogleMapsApiKey() // Fetch the API key

      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps` // Use the fetched API key
      script.async = true
      script.defer = true
      ;(window as any).initGoogleMaps = () => {
        console.log("✅ initGoogleMaps callback called")
        ;(window as any).google = window.google
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
