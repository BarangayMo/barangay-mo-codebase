"use client"

// Fully corrected version of GoogleMapLocationPicker.tsx
import { useEffect, useRef, useState } from "react"
import { Loader2, AlertCircle, RefreshCw, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { loadGoogleMaps, geocodeAddress, reverseGeocode, createMap, createMarker } from "@/services/googleMaps"
import { google } from "googlemaps"

interface GoogleMapLocationPickerProps {
  onLocationSelected: (location: {
    barangay: string
    coordinates: { lat: number; lng: number }
    address: string
  }) => void
  initialLocation?: { lat: number; lng: number }
  className?: string
  height?: string
}

export const GoogleMapLocationPicker = ({
  onLocationSelected,
  initialLocation,
  className = "",
  height = "400px",
}: GoogleMapLocationPickerProps) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<google.maps.Map | null>(null)
  const markerInstance = useRef<google.maps.Marker | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<{
    barangay: string
    coordinates: { lat: number; lng: number }
    address: string
  } | null>(null)
  const [isMapsReady, setIsMapsReady] = useState(false)

  const defaultCenter = initialLocation || { lat: 14.5995, lng: 120.9842 }

  useEffect(() => {
    const loadMaps = async () => {
      try {
        // No need to await getGoogleMapsApiKey here, loadGoogleMaps handles it
        await loadGoogleMaps()
        setIsMapsReady(true)
      } catch (err) {
        console.error("❌ Error loading Google Maps:", err)
        setError("Google Maps failed to load")
      }
    }
    loadMaps()
  }, [])

  useEffect(() => {
    if (isMapsReady) {
      initializeMap()
    }
    return () => {
      if (markerInstance.current) markerInstance.current.setMap(null)
      if (mapInstance.current) mapInstance.current = null
    }
  }, [isMapsReady])

  const initializeMap = async () => {
    if (!mapContainer.current) return
    try {
      setLoading(true)
      setError(null)

      const map = await createMap(mapContainer.current, {
        center: defaultCenter,
        zoom: 13,
        zoomControl: true,
        streetViewControl: false,
        fullscreenControl: true,
      })

      mapInstance.current = map

      const placeMarker = async (position: { lat: number; lng: number }) => {
        if (markerInstance.current) markerInstance.current.setMap(null)
        const marker = createMarker(map, position, {
          draggable: true,
          title: "Selected Location",
          icon: {
            url:
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6" width="32" height="32">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              `),
            scaledSize: new google.maps.Size(32, 32), // Use window.google
            anchor: new google.maps.Point(16, 32), // Use window.google
          },
        })
        markerInstance.current = marker

        marker.addListener("dragend", () => {
          const newPosition = marker.getPosition()
          if (newPosition) updateLocationInfo({ lat: newPosition.lat(), lng: newPosition.lng() })
        })

        await updateLocationInfo(position)
      }

      const updateLocationInfo = async (position: { lat: number; lng: number }) => {
        try {
          const result = await reverseGeocode(position.lat, position.lng)
          if (result) {
            const loc = {
              barangay: result.barangay || "Unknown Barangay",
              coordinates: position,
              address: result.address,
            }
            setSelectedLocation(loc)
          }
        } catch (error) {
          console.error("Reverse geocoding failed:", error)
        }
      }

      if (navigator.geolocation && !initialLocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
            map.setCenter(coords)
            map.setZoom(15)
            placeMarker(coords)
          },
          () => {
            placeMarker(defaultCenter)
          },
        )
      } else {
        placeMarker(defaultCenter)
      }

      map.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          const coords = { lat: e.latLng.lat(), lng: e.latLng.lng() }
          placeMarker(coords)
        }
      })

      setLoading(false)
    } catch (err) {
      console.error("Initialization error:", err)
      setError("Failed to initialize map")
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim() || !mapInstance.current) return
    try {
      const result = await geocodeAddress(searchQuery)
      if (result) {
        const position = { lat: result.lat, lng: result.lng }
        mapInstance.current.setCenter(position)
        mapInstance.current.setZoom(16)
        markerInstance.current?.setMap(null)
        // Re-initialize map to place marker at new location and update info
        await initializeMap()
      }
    } catch (error) {
      console.error("Search failed:", error)
    }
  }

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelected(selectedLocation)
    }
  }

  if (!isMapsReady || loading) {
    return (
      <div className={`relative border border-border rounded-lg overflow-hidden ${className}`} style={{ height }}>
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <div className="text-sm ml-2 text-muted-foreground">
            {!isMapsReady ? "Loading Google Maps..." : "Loading map..."}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`border border-destructive p-4 rounded-lg ${className}`} style={{ height }}>
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
          <Button size="sm" variant="outline" onClick={initializeMap}>
            <RefreshCw className="w-4 h-4 mr-1" /> Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex gap-2">
        <Input
          placeholder="Search for a location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button onClick={handleSearch} size="sm">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <div ref={mapContainer} className="w-full rounded-lg border h-full" style={{ height }} />

      {selectedLocation && (
        <div className="p-4 bg-muted rounded-md space-y-2">
          <div className="text-sm font-medium">{selectedLocation.barangay}</div>
          <div className="text-xs text-muted-foreground">{selectedLocation.address}</div>
          <div className="text-xs text-muted-foreground">
            Lat: {selectedLocation.coordinates.lat.toFixed(6)}, Lng: {selectedLocation.coordinates.lng.toFixed(6)}
          </div>
          <Button size="sm" onClick={handleConfirm} className="w-full">
            Confirm Location
          </Button>
        </div>
      )}

      <div className="text-center text-xs text-muted-foreground">
        Click the map or drag the marker to update your location.
      </div>
    </div>
  )
}

export default GoogleMapLocationPicker
