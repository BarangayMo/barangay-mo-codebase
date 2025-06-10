
import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

interface LocationMapProps {
  location?: string;
  className?: string;
}

const LocationMap: React.FC<LocationMapProps> = ({ location, className = "" }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // For now, we'll create a simple styled map placeholder
    // In a real implementation, you would use react-leaflet or similar
    setMapLoaded(true);
  }, []);

  const getLocationCoords = (location?: string) => {
    // Mock coordinates for different locations
    const coords: { [key: string]: [number, number] } = {
      'Bangkok': [13.7563, 100.5018],
      'Chiang Mai': [18.7883, 98.9853],
      'Phuket': [7.8804, 98.3923],
      'Pattaya': [12.9236, 100.8825],
    };
    
    const locationKey = Object.keys(coords).find(key => 
      location?.toLowerCase().includes(key.toLowerCase())
    );
    
    return locationKey ? coords[locationKey] : [13.7563, 100.5018]; // Default to Bangkok
  };

  const [lat, lng] = getLocationCoords(location);

  return (
    <div className={`relative overflow-hidden rounded-lg border ${className}`}>
      <div 
        ref={mapRef}
        className="h-48 bg-gradient-to-br from-blue-100 via-blue-50 to-green-50 relative"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
            linear-gradient(45deg, transparent 0%, rgba(59, 130, 246, 0.05) 50%, transparent 100%)
          `
        }}
      >
        {/* Grid pattern for map effect */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, #ccc 1px, transparent 1px),
              linear-gradient(to bottom, #ccc 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />
        
        {/* Location markers */}
        <div className="absolute top-4 left-4 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        <div className="absolute top-8 right-8 w-2 h-2 bg-blue-500 rounded-full"></div>
        <div className="absolute bottom-6 left-12 w-2 h-2 bg-green-500 rounded-full"></div>
        <div className="absolute bottom-4 right-6 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
        
        {/* Main location pin */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
            <div className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4 text-red-500" />
              <span>{location || "Location"}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {lat.toFixed(4)}, {lng.toFixed(4)}
            </div>
          </div>
        </div>

        {/* Simulated roads/paths */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <path
            d="M 0,50 Q 100,30 200,60 T 400,40"
            stroke="#666"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M 100,0 Q 120,100 140,200"
            stroke="#666"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>
      
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export { LocationMap };
