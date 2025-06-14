import React from 'react';
import './globe-styles.css';

interface GlobeGridProps {
  size?: number;
  opacity?: number;
}

export const GlobeGrid: React.FC<GlobeGridProps> = ({ 
  size = 800, 
  opacity = 0.12 
}) => {
  const centerX = size / 2;
  const centerY = size / 2;
  const globeRadius = size / 2 * 0.8;
  
  // Generate latitude lines (parallels) - horizontal circles
  const latitudeLines = [];
  for (let lat = -80; lat <= 80; lat += 20) {
    const y = centerY - (lat / 90) * globeRadius;
    const radius = Math.cos((lat * Math.PI) / 180) * globeRadius;
    
    if (radius > 0) {
      latitudeLines.push(
        <ellipse
          key={`lat-${lat}`}
          cx={centerX}
          cy={y}
          rx={radius}
          ry={radius * 0.3} // Perspective flattening
          fill="none"
          stroke={lat === 0 ? "#00ff00" : "#00aa00"} // Green colors
          strokeWidth={lat === 0 ? "2" : "1"} // Emphasize equator
          opacity={lat === 0 ? 0.5 : 0.3}
        />
      );
    }
  }

  // Generate longitude lines (meridians) - vertical ellipses
  const longitudeLines = [];
  for (let lng = 0; lng < 180; lng += 20) {
    const angle = (lng * Math.PI) / 180;
    
    // Create elliptical paths for 3D effect
    const path = `
      M ${centerX} ${centerY - globeRadius}
      A ${globeRadius * Math.sin(angle)} ${globeRadius}
        0 0 1
        ${centerX} ${centerY + globeRadius}
      A ${globeRadius * Math.sin(angle)} ${globeRadius}
        0 0 1
        ${centerX} ${centerY - globeRadius}
    `.trim();
    
    // Only show visible meridians (front half of globe)
    if (lng <= 90) {
      longitudeLines.push(
        <path
          key={`lng-${lng}`}
          d={path}
          fill="none"
          stroke={lng === 0 || lng === 90 ? "#00ffff" : "#00aaaa"} // Cyan colors
          strokeWidth={lng === 0 || lng === 90 ? "2" : "1"} // Emphasize prime meridian
          opacity={lng === 0 || lng === 90 ? 0.5 : 0.3}
        />
      );
    }
  }

  // Add tropics and polar circles for Earth-like appearance
  const specialLatitudes = [
    { lat: 66.5, name: 'arctic', opacity: 0.2 },    // Arctic Circle
    { lat: 23.5, name: 'tropic-n', opacity: 0.25 }, // Tropic of Cancer
    { lat: -23.5, name: 'tropic-s', opacity: 0.25 }, // Tropic of Capricorn
    { lat: -66.5, name: 'antarctic', opacity: 0.2 }, // Antarctic Circle
  ];

  const specialLines = specialLatitudes.map(({ lat, name, opacity: lineOpacity }) => {
    const y = centerY - (lat / 90) * globeRadius;
    const radius = Math.cos((lat * Math.PI) / 180) * globeRadius;
    
    return (
      <ellipse
        key={name}
        cx={centerX}
        cy={y}
        rx={radius}
        ry={radius * 0.3}
        fill="none"
        stroke="#00cc00"
        strokeWidth="1"
        strokeDasharray="5,5"
        opacity={lineOpacity}
      />
    );
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="globe-grid"
    >
      {/* Outer circle (globe boundary) */}
      <circle
        cx={centerX}
        cy={centerY}
        r={globeRadius}
        fill="none"
        stroke="#0088ff"
        strokeWidth="2"
        opacity="0.4"
      />
      
      {/* Latitude lines */}
      {latitudeLines}
      
      {/* Special latitude lines (tropics, polar circles) */}
      {specialLines}
      
      {/* Longitude lines */}
      {longitudeLines}
      
      {/* Prime meridian (vertical center line) */}
      <line
        x1={centerX}
        y1={centerY - globeRadius}
        x2={centerX}
        y2={centerY + globeRadius}
        stroke="#00ffff"
        strokeWidth="2"
        opacity="0.5"
      />
      
      {/* Equator (horizontal center line) */}
      <ellipse
        cx={centerX}
        cy={centerY}
        rx={globeRadius}
        ry={globeRadius * 0.3}
        fill="none"
        stroke="#00ff00"
        strokeWidth="2"
        opacity="0.5"
      />
    </svg>
  );
}; 