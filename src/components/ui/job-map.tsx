
import React, { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

interface JobMapProps {
  location: string;
  className?: string;
}

export const JobMap = ({ location, className }: JobMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simple mock map implementation
    // In a real app, you'd integrate with Leaflet.js or similar
    if (mapRef.current) {
      // Clear any existing content
      mapRef.current.innerHTML = '';
      
      // Create mock map visualization
      const mapContainer = document.createElement('div');
      mapContainer.className = 'relative w-full h-full bg-gradient-to-br from-blue-100 via-blue-50 to-green-50 rounded-lg overflow-hidden';
      
      // Add grid pattern
      const grid = document.createElement('div');
      grid.className = 'absolute inset-0 opacity-10';
      grid.style.backgroundImage = `
        linear-gradient(#ccc 1px, transparent 1px),
        linear-gradient(90deg, #ccc 1px, transparent 1px)
      `;
      grid.style.backgroundSize = '20px 20px';
      mapContainer.appendChild(grid);
      
      // Add location marker
      const marker = document.createElement('div');
      marker.className = 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border';
      marker.innerHTML = `
        <div class="flex items-center gap-2 text-sm font-medium">
          <div class="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <div class="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <span>${location}</span>
        </div>
      `;
      mapContainer.appendChild(marker);
      
      // Add some decorative elements
      const decorations = [
        { top: '20%', left: '15%', color: 'bg-red-400' },
        { top: '70%', left: '80%', color: 'bg-blue-400' },
        { top: '30%', left: '75%', color: 'bg-green-400' },
        { top: '80%', left: '25%', color: 'bg-orange-400' }
      ];
      
      decorations.forEach(({ top, left, color }) => {
        const dot = document.createElement('div');
        dot.className = `absolute w-2 h-2 ${color} rounded-full opacity-60`;
        dot.style.top = top;
        dot.style.left = left;
        mapContainer.appendChild(dot);
      });
      
      mapRef.current.appendChild(mapContainer);
    }
  }, [location]);

  return (
    <div className={className}>
      <div ref={mapRef} className="w-full h-48" />
    </div>
  );
};
