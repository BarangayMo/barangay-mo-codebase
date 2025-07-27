import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GoogleMapLocationPicker } from "@/components/ui/google-map-location-picker";
import { toast } from "sonner";
import { getGoogleMapsApiKey } from "@/services/apiKeys"; // Ensure this import is correct
import { loadGoogleMaps } from "@/lib/load-google-maps"; // Ensure this helper exists

interface MapLocationModalProps {
  children: React.ReactNode;
  onLocationSelected: (location: {
    barangay: string;
    coordinates: { lat: number; lng: number };
  }) => void;
}

export function MapLocationModal({ children, onLocationSelected }: MapLocationModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMapsReady, setIsMapsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const apiKey = await getGoogleMapsApiKey();
        await loadGoogleMaps(apiKey);
        setIsMapsReady(true);
      } catch (err) {
        console.error("❌ Google Maps failed to load:", err);
      }
    };

    init();

    const timeout = setTimeout(() => {
      if (!isMapsReady) {
        console.error("⏰ Google Maps failed to load in expected time.");
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [isMapsReady]);

  const handleLocationSelected = (location: {
    barangay: string;
    coordinates: { lat: number; lng: number };
    address: string;
  }) => {
    console.log("📍 MapLocationModal: Location selected:", location);

    onLocationSelected({
      barangay: location.barangay,
      coordinates: location.coordinates,
    });

    toast.success(`Location selected: ${location.barangay}`, {
      description: location.address,
      duration: 3000,
    });

    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Select Your Location</DialogTitle>
          <DialogDescription>
            Click on the map or search for a location to select your barangay. You can drag the marker to fine-tune your selection.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {isMapsReady ? (
            <GoogleMapLocationPicker
              onLocationSelected={handleLocationSelected}
              height="500px"
              className="w-full"
            />
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
  );
}
