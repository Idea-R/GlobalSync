import React from 'react';
import { useWorldTime, TimezoneData } from './useWorldTime';

interface TimezoneClockProps {
  timezone: TimezoneData;
  size?: number;
  showLabel?: boolean;
  userTimezoneOverride?: number;
}

const TimezoneClock: React.FC<TimezoneClockProps> = ({ 
  timezone, 
  size = 40, 
  showLabel = true,
  userTimezoneOverride
}) => {
  const { getClockAngles } = useWorldTime({ userTimezoneOverride });
  const angles = getClockAngles(timezone.time);
  
  // INNOVATION: Simplified positioning and sizing
  const center = size / 2;
  const clockRadius = center - 4; // More padding for visibility
  
  return (
    <div 
      className="timezone-clock"
      style={{
        left: `${timezone.position.x}%`,
        top: `${timezone.position.y}%`,
      }}
    >
      {/* INNOVATION: Add background for better visibility */}
      <svg width={size} height={size} className="clock-face">
        {/* Clock circle */}
        <circle
          cx={center}
          cy={center}
          r={clockRadius}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.3"
        />
        
        {/* Hour markers */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30) - 90; // Start from 12 o'clock
          const radian = (angle * Math.PI) / 180;
          const innerRadius = clockRadius - 4;
          const outerRadius = clockRadius - 1;
          
          const x1 = center + innerRadius * Math.cos(radian);
          const y1 = center + innerRadius * Math.sin(radian);
          const x2 = center + outerRadius * Math.cos(radian);
          const y2 = center + outerRadius * Math.sin(radian);
          
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.3"
            />
          );
        })}
        
        {/* Hour hand */}
        <line
          x1={center}
          y1={center}
          x2={center + (clockRadius * 0.5) * Math.cos((angles.hour - 90) * Math.PI / 180)}
          y2={center + (clockRadius * 0.5) * Math.sin((angles.hour - 90) * Math.PI / 180)}
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.6"
          className="hour-hand"
        />
        
        {/* Minute hand */}
        <line
          x1={center}
          y1={center}
          x2={center + (clockRadius * 0.7) * Math.cos((angles.minute - 90) * Math.PI / 180)}
          y2={center + (clockRadius * 0.7) * Math.sin((angles.minute - 90) * Math.PI / 180)}
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.5"
          className="minute-hand"
        />
        
        {/* Second hand */}
        <line
          x1={center}
          y1={center}
          x2={center + (clockRadius * 0.8) * Math.cos((angles.second - 90) * Math.PI / 180)}
          y2={center + (clockRadius * 0.8) * Math.sin((angles.second - 90) * Math.PI / 180)}
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.4"
          className="second-hand"
        />
        
        {/* Center dot */}
        <circle
          cx={center}
          cy={center}
          r="1.5"
          fill="currentColor"
          opacity="0.5"
        />
      </svg>
      
      {showLabel && (
        <div className="clock-label">
          <div className="timezone-name">{timezone.name}</div>
          <div className="timezone-id">{timezone.id}</div>
        </div>
      )}
    </div>
  );
};

interface TimezoneClocksProp {
  globeSize?: number;
  clockSize?: number;
  showLabels?: boolean;
  userTimezoneOverride?: number;
}

export const TimezoneClocks: React.FC<TimezoneClocksProp> = ({ 
  globeSize = 800,
  clockSize = 40,
  showLabels = true,
  userTimezoneOverride
}) => {
  const { timezones } = useWorldTime({ userTimezoneOverride });

  
  return (
    <div className="timezone-clocks-container">
      {timezones.map((timezone) => (
        <TimezoneClock
          key={timezone.id}
          timezone={timezone}
          size={clockSize}
          showLabel={showLabels}
          userTimezoneOverride={userTimezoneOverride}
        />
      ))}
    </div>
  );
}; 