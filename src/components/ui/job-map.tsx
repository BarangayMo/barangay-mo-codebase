import React from 'react';
import { MapPin } from 'lucide-react';
import  MapboxMap  from './mapbox-map';

interface JobMapProps {
  location: string;
  className?: string;
}

export const JobMap = ({ location, className }: JobMapProps) => {
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
    );
  }

  return (
    <MapboxMap 
      location={location}
      className={className}
      height="256px"
      zoom={14}
      showPopup={true}
    />
  );
};