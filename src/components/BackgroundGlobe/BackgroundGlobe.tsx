import React from 'react';
import { GlobeGrid } from './GlobeGrid';
import { TimezoneClocks } from './TimezoneClocks';
import { useGlobeAnimation } from './useGlobeAnimation';
import './globe-styles.css';

interface BackgroundGlobeProps {
  globeSize?: number;
  clockSize?: number;
  rotationSpeed?: number;
  showClockLabels?: boolean;
  pauseOnHover?: boolean;
  opacity?: number;
  userTimezoneOverride?: number;
}

export const BackgroundGlobe: React.FC<BackgroundGlobeProps> = ({
  globeSize = 800,
  clockSize = 40,
  rotationSpeed = 4, // 4 degrees per second = 90 seconds for full rotation
  showClockLabels = true,
  pauseOnHover = true,
  opacity = 0.12,
  userTimezoneOverride,
}) => {
  const { globeStyle, containerProps, prefersReducedMotion } = useGlobeAnimation({
    rotationSpeed,
    pauseOnHover,
    respectMotionPreference: true,
  });
  
  return (
    <div className="background-globe" {...containerProps}>
      <div className="globe-container" style={globeStyle}>
        {/* Globe wireframe grid */}
        <GlobeGrid size={globeSize} opacity={opacity} />
        
        {/* Timezone clocks positioned around the globe */}
        <TimezoneClocks 
          globeSize={globeSize}
          clockSize={clockSize}
          showLabels={showClockLabels}
          userTimezoneOverride={userTimezoneOverride}
        />
      </div>
      
      {/* Accessibility indicator for reduced motion users */}
      {prefersReducedMotion && (
        <div 
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            fontSize: '10px',
            color: 'rgba(99, 102, 241, 0.3)',
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        >
          Globe animation paused (reduced motion)
        </div>
      )}
    </div>
  );
}; 