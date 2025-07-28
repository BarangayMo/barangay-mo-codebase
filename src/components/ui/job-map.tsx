"use client"

import { useEffect, useState } from "react"
import { MapPin } from "lucide-react"
import { GoogleMap } from "./google-map"
import { loadGoogleMaps } from "@/services/googleMaps" // Assuming this path is correct

interface JobMapProps {
  location: string
  className?: string
}

export const JobMap = ({ location, className }: JobMapProps) => {
  const [isMapsReady, setIsMapsReady] = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        // loadGoogleMaps handles fetching the API key internally and ensures the script is loaded once.
        await loadGoogleMaps()
        // After loadGoogleMaps resolves, explicitly check if window.google.maps is available
        if (typeof window.google !== "undefined" && typeof window.google.maps !== "undefined") {
          setIsMapsReady(true)
        } else {
          console.error("❌ JobMap: Google Maps API not globally available after loadGoogleMaps resolved.")
          setIsMapsReady(false)
        }
      } catch (err) {
        console.error("❌ JobMap: Google Maps failed to load:", err)
        setIsMapsReady(false)
      }
    }
    init()
    // This effect should only run once on mount to load the script.
  }, []) // Empty dependency array to run only once on mount

  // Display loading message while maps API is not ready
  if (!isMapsReady) {
    return (
      <div className={`relative h-64 border border-border rounded-lg overflow-hidden ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-center space-y-2">
            <div className="text-sm text-muted-foreground">
              Loading map...
              <br />
              <small>(If this message stays, check console logs for Google Maps errors)</small>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If maps are ready but no location is provided, show the "No location specified" fallback
  // Note: The outer JSX `selectedJob.location &&` already ensures `location` is truthy when JobMap is mounted.
  // This check primarily handles cases where `location` might become falsy after initial render,
  // or if the outer check allows empty strings that `GoogleMap` itself cannot process.
  if (!location) {
    return (
      <div className={`relative h-64 border border-border rounded-lg overflow-hidden ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-center space-y-2">
            <MapPin className="h-8 w-8 mx-auto text-muted-foreground" />
            <div className="text-sm text-muted-foreground">No location specified</div>
          </div>
        </div>
      </div>
    )
  }

  // If maps are ready and location is provided, render the GoogleMap
  return <GoogleMap location={location} className={className} height="256px" zoom={14} showInfoWindow={true} />
}
