import React, { useState } from "react";
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

// Define types for our location data
interface MapLocationModalProps {
  children: React.ReactNode;
  onLocationSelected: (location: { barangay: string; coordinates: { lat: number; lng: number } }) => void;
}

export function MapLocationModal({ children, onLocationSelected }: MapLocationModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLocationSelected = (location: { 
    barangay: string; 
    coordinates: { lat: number; lng: number }; 
    address: string;
  }) => {
    console.log('📍 MapLocationModal: Location selected:', location);
    
    // Call the parent callback with the expected format
    onLocationSelected({
      barangay: location.barangay,
      coordinates: location.coordinates
    });
    
    // Show success toast
    toast.success(`Location selected: ${location.barangay}`, {
      description: location.address,
      duration: 3000,
    });
    
    // Close the modal
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Select Your Location</DialogTitle>
          <DialogDescription>
            Click on the map or search for a location to select your barangay. You can drag the marker to fine-tune your selection.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <GoogleMapLocationPicker
            onLocationSelected={handleLocationSelected}
            height="500px"
            className="w-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}