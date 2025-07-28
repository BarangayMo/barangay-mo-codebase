"use client"

import { MapPin } from "lucide-react"
import { GoogleMap } from "./google-map"

interface JobMapProps {
  location: string
  className?: string
  isMapsReady: boolean // New prop to indicate if maps API is loaded
}

export const JobMap = ({ location, className, isMapsReady }: JobMapProps) => {
  // Display loading message if maps API is not ready
  if (!isMapsReady) {
    return (
      <div className={`relative h-64 border border-border rounded-lg overflow-hidden ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-center space-y-2">
            <div className="text-sm text-muted-foreground">
              Loading map...
              <br />
              <small>(Map is loading with the page)</small>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If maps are ready but no location is provided, show the "No location specified" fallback
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
