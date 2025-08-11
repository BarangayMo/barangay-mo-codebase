"use client"

import type React from "react"
import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { GoogleMapLocationPicker } from "@/components/ui/google-map-location-picker"
import { toast } from "sonner"
import { loadGoogleMaps } from "@/services/googleMaps" // Ensure this helper exists

interface MapLocationModalProps {
  children: React.ReactNode
  onLocationSelected: (location: {
    barangay: string
    coordinates: { lat: number; lng: number }
  }) => void
}

export function MapLocationModal({ children, onLocationSelected }: MapLocationModalProps) {
  const [isOpen, setIsOpen] = useState(false)
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
          console.error("❌ MapLocationModal: Google Maps API not globally available after loadGoogleMaps resolved.")
          setIsMapsReady(false)
        }
      } catch (err) {
        console.error("❌ MapLocationModal: Google Maps failed to load:", err)
        setIsMapsReady(false)
      }
    }
    init()
    // This effect should only run once on mount to load the script.
    // The timeout check is removed as the promise-based loading and error handling are more robust.
  }, []) // Empty dependency array to run only once on mount

  const handleLocationSelected = (location: {
    barangay: string
    coordinates: { lat: number; lng: number }
    address: string
  }) => {
    console.log("📍 MapLocationModal: Location selected:", location)
    onLocationSelected({
      barangay: location.barangay,
      coordinates: location.coordinates,
    })
    toast.success(`Location selected: ${location.barangay}`, {
      description: location.address,
      duration: 3000,
    })
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Select Your Location</DialogTitle>
          <DialogDescription>
            Click on the map or search for a location to select your barangay. You can drag the marker to fine-tune your
            selection.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          {isMapsReady ? (
            <GoogleMapLocationPicker onLocationSelected={handleLocationSelected} height="500px" className="w-full" />
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              Loading map...
              <br />
              <small>(If this message stays, check console logs for Google Maps errors)</small>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
