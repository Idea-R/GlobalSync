import { useState, useEffect } from 'react';

export interface TimezoneData {
  id: string;
  name: string;
  offset: number; // UTC offset in hours
  time: Date;
  position: { x: number; y: number }; // Position around globe
}

// Major timezone data with positions around the globe
const TIMEZONE_CONFIG: Omit<TimezoneData, 'time'>[] = [
  { id: 'UTC-12', name: 'Baker Island', offset: -12, position: { x: 5, y: 50 } },
  { id: 'UTC-11', name: 'Samoa', offset: -11, position: { x: 10, y: 65 } },
  { id: 'UTC-10', name: 'Hawaii', offset: -10, position: { x: 15, y: 35 } },
  { id: 'UTC-9', name: 'Alaska', offset: -9, position: { x: 20, y: 20 } },
  { id: 'UTC-8', name: 'Los Angeles', offset: -8, position: { x: 25, y: 40 } },
  { id: 'UTC-7', name: 'Denver', offset: -7, position: { x: 30, y: 35 } },
  { id: 'UTC-6', name: 'Chicago', offset: -6, position: { x: 35, y: 30 } },
  { id: 'UTC-5', name: 'New York', offset: -5, position: { x: 40, y: 32 } },
  { id: 'UTC-4', name: 'Santiago', offset: -4, position: { x: 42, y: 70 } },
  { id: 'UTC-3', name: 'São Paulo', offset: -3, position: { x: 45, y: 65 } },
  { id: 'UTC-2', name: 'Mid-Atlantic', offset: -2, position: { x: 48, y: 50 } },
  { id: 'UTC-1', name: 'Azores', offset: -1, position: { x: 50, y: 40 } },
  { id: 'UTC+0', name: 'London', offset: 0, position: { x: 52, y: 25 } },
  { id: 'UTC+1', name: 'Paris', offset: 1, position: { x: 55, y: 28 } },
  { id: 'UTC+2', name: 'Cairo', offset: 2, position: { x: 58, y: 45 } },
  { id: 'UTC+3', name: 'Moscow', offset: 3, position: { x: 60, y: 20 } },
  { id: 'UTC+4', name: 'Dubai', offset: 4, position: { x: 63, y: 40 } },
  { id: 'UTC+5', name: 'Karachi', offset: 5, position: { x: 66, y: 42 } },
  { id: 'UTC+6', name: 'Dhaka', offset: 6, position: { x: 70, y: 38 } },
  { id: 'UTC+7', name: 'Bangkok', offset: 7, position: { x: 73, y: 55 } },
  { id: 'UTC+8', name: 'Beijing', offset: 8, position: { x: 76, y: 30 } },
  { id: 'UTC+9', name: 'Tokyo', offset: 9, position: { x: 80, y: 35 } },
  { id: 'UTC+10', name: 'Sydney', offset: 10, position: { x: 85, y: 70 } },
  { id: 'UTC+11', name: 'Solomon Is.', offset: 11, position: { x: 90, y: 60 } },
  { id: 'UTC+12', name: 'Auckland', offset: 12, position: { x: 95, y: 75 } },
];

interface UseWorldTimeOptions {
  userTimezoneOverride?: number; // Manual UTC offset override for VPN users
}

export const useWorldTime = (options: UseWorldTimeOptions = {}) => {
  const [timezones, setTimezones] = useState<TimezoneData[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [detectedTimezone, setDetectedTimezone] = useState<number>(0);
  const [isUsingOverride, setIsUsingOverride] = useState(false);

  // Detect user's actual timezone
  useEffect(() => {
    const detected = -new Date().getTimezoneOffset() / 60; // Convert minutes to hours
    setDetectedTimezone(detected);
  }, []);

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now);
      
      // Use override timezone if provided, otherwise use detected timezone
      const userOffset = options.userTimezoneOverride !== undefined 
        ? options.userTimezoneOverride 
        : detectedTimezone;
      
      setIsUsingOverride(options.userTimezoneOverride !== undefined);
      
      const updatedTimezones = TIMEZONE_CONFIG.map(tz => ({
        ...tz,
        time: new Date(now.getTime() + (tz.offset * 60 * 60 * 1000))
      }));
      
      setTimezones(updatedTimezones);
    };

    // Initial update
    updateTime();

    // Set up interval for real-time updates
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [options.userTimezoneOverride, detectedTimezone]);

  // Helper function to format time
  const formatTime = (date: Date, format: '12h' | '24h' = '12h') => {
    if (format === '24h') {
      return date.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    
    return date.toLocaleTimeString('en-US', { 
      hour12: true, 
      hour: 'numeric', 
      minute: '2-digit' 
    });
  };

  // Get clock hand angles for analog display
  const getClockAngles = (date: Date) => {
    const hours = date.getHours() % 12;
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return {
      hour: (hours * 30) + (minutes * 0.5), // 30 degrees per hour + minute adjustment
      minute: minutes * 6, // 6 degrees per minute
      second: seconds * 6, // 6 degrees per second
    };
  };

  // Get user's local time (with override support)
  const getUserLocalTime = () => {
    const userOffset = options.userTimezoneOverride !== undefined 
      ? options.userTimezoneOverride 
      : detectedTimezone;
    
    return new Date(currentTime.getTime() + (userOffset * 60 * 60 * 1000));
  };

  return {
    timezones,
    currentTime,
    userLocalTime: getUserLocalTime(),
    detectedTimezone,
    isUsingOverride,
    formatTime,
    getClockAngles,
  };
}; 