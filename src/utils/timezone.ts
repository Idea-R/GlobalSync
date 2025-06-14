export const getGMTOffset = (timezone: string): number => {
  // Support both GMT and UTC prefixes for backward compatibility
  const match = timezone.match(/(GMT|UTC)([+-])(\d+(?:\.\d+)?)/);
  if (!match) return 0;
  const sign = match[2] === '+' ? 1 : -1;
  const hours = parseFloat(match[3]);
  return sign * hours;
};

export const getCurrentTimeInTimezone = (timezone: string): Date => {
  const offset = getGMTOffset(timezone);
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  return new Date(utc + (offset * 3600000));
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

export const formatTimeWithAMPM = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const isInTimeRange = (currentTime: Date, timeRange: string): boolean => {
  if (!timeRange || timeRange === '') return false;
  
  const [startStr, endStr] = timeRange.split('-');
  const start = parseInt(startStr, 10);
  const end = parseInt(endStr, 10);
  const currentHour = currentTime.getHours();
  
  if (start <= end) {
    return currentHour >= start && currentHour < end;
  } else {
    // Crosses midnight (e.g., 23-7)
    return currentHour >= start || currentHour < end;
  }
};

export const suggestStatusByTime = (currentTime: Date, workHours: string, sleepHours: string): string => {
  if (isInTimeRange(currentTime, sleepHours)) {
    return 'sleep';
  }
  if (isInTimeRange(currentTime, workHours)) {
    return 'deepwork';
  }
  return 'vibing';
};

export const updateStatusBasedOnSchedule = (
  currentTime: Date, 
  workHours: string, 
  sleepHours: string, 
  autoStatus: boolean
): string | null => {
  if (!autoStatus) return null;
  
  if (isInTimeRange(currentTime, sleepHours)) {
    return 'sleep';
  }
  if (isInTimeRange(currentTime, workHours)) {
    return 'deepwork';
  }
  return 'vibing';
};

export const getSchedulePeriod = (currentTime: Date, workHours: string, sleepHours: string): 'work' | 'sleep' | 'available' => {
  if (isInTimeRange(currentTime, sleepHours)) return 'sleep';
  if (isInTimeRange(currentTime, workHours)) return 'work';
  return 'available';
};

// Detect user's timezone and convert to UTC format
export const detectUserTimezone = (): string => {
  try {
    // Get the timezone offset in minutes (negative for west of UTC, positive for east)
    const offsetMinutes = new Date().getTimezoneOffset();
    
    // Convert to hours and invert the sign (JavaScript gives opposite of what we need)
    const offsetHours = -(offsetMinutes / 60);
    
    // Format as UTC string
    const sign = offsetHours >= 0 ? '+' : '';
    return `UTC${sign}${offsetHours}`;
  } catch (error) {
    console.error('Failed to detect timezone:', error);
    return 'UTC+0';
  }
};

// Enhanced timezone data with common abbreviations and cities
export const getTimezoneInfo = (gmtOffset: string) => {
  // Support both GMT and UTC prefixes
  const normalizedOffset = gmtOffset.replace('GMT', 'UTC');
  
  const timezoneMap: Record<string, { abbreviations: string[], cities: string[] }> = {
    'UTC-12': { abbreviations: ['BIT'], cities: ['Baker Island'] },
    'UTC-11': { abbreviations: ['SST'], cities: ['Samoa', 'Midway'] },
    'UTC-10': { abbreviations: ['HST'], cities: ['Hawaii', 'Honolulu'] },
    'UTC-9': { abbreviations: ['AKST'], cities: ['Alaska', 'Anchorage'] },
    'UTC-8': { abbreviations: ['PST', 'PT'], cities: ['Los Angeles', 'Seattle', 'Vancouver'] },
    'UTC-7': { abbreviations: ['MST', 'PDT'], cities: ['Denver', 'Phoenix', 'Calgary'] },
    'UTC-6': { abbreviations: ['CST', 'MDT'], cities: ['Chicago', 'Dallas', 'Mexico City'] },
    'UTC-5': { abbreviations: ['EST', 'CDT'], cities: ['New York', 'Toronto', 'Miami'] },
    'UTC-4.5': { abbreviations: ['VET'], cities: ['Caracas'] },
    'UTC-4': { abbreviations: ['AST', 'EDT'], cities: ['Halifax', 'Santiago', 'La Paz'] },
    'UTC-3.5': { abbreviations: ['NST'], cities: ['Newfoundland'] },
    'UTC-3': { abbreviations: ['ART', 'BRT'], cities: ['Buenos Aires', 'São Paulo', 'Montevideo'] },
    'UTC-2': { abbreviations: ['GST'], cities: ['South Georgia'] },
    'UTC-1': { abbreviations: ['CVT'], cities: ['Cape Verde', 'Azores'] },
    'UTC+0': { abbreviations: ['GMT', 'UTC'], cities: ['London', 'Dublin', 'Lisbon'] },
    'UTC+1': { abbreviations: ['CET'], cities: ['Berlin', 'Paris', 'Rome', 'Madrid'] },
    'UTC+2': { abbreviations: ['EET'], cities: ['Cairo', 'Helsinki', 'Athens', 'Kiev'] },
    'UTC+3': { abbreviations: ['MSK'], cities: ['Moscow', 'Istanbul', 'Riyadh', 'Nairobi'] },
    'UTC+3.5': { abbreviations: ['IRST'], cities: ['Tehran'] },
    'UTC+4': { abbreviations: ['GST'], cities: ['Dubai', 'Baku', 'Tbilisi'] },
    'UTC+4.5': { abbreviations: ['AFT'], cities: ['Kabul'] },
    'UTC+5': { abbreviations: ['PKT'], cities: ['Karachi', 'Tashkent', 'Yekaterinburg'] },
    'UTC+5.5': { abbreviations: ['IST'], cities: ['Mumbai', 'Delhi', 'Kolkata', 'Bangalore'] },
    'UTC+5.75': { abbreviations: ['NPT'], cities: ['Kathmandu'] },
    'UTC+6': { abbreviations: ['BST'], cities: ['Dhaka', 'Almaty', 'Omsk'] },
    'UTC+6.5': { abbreviations: ['MMT'], cities: ['Yangon'] },
    'UTC+7': { abbreviations: ['ICT'], cities: ['Bangkok', 'Jakarta', 'Ho Chi Minh'] },
    'UTC+8': { abbreviations: ['CST', 'SGT'], cities: ['Beijing', 'Singapore', 'Manila', 'Perth'] },
    'UTC+9': { abbreviations: ['JST', 'KST'], cities: ['Tokyo', 'Seoul', 'Pyongyang'] },
    'UTC+9.5': { abbreviations: ['ACST'], cities: ['Adelaide', 'Darwin'] },
    'UTC+10': { abbreviations: ['AEST'], cities: ['Sydney', 'Melbourne', 'Brisbane'] },
    'UTC+11': { abbreviations: ['NCT'], cities: ['New Caledonia', 'Solomon Islands'] },
    'UTC+12': { abbreviations: ['NZST'], cities: ['Auckland', 'Wellington', 'Fiji'] },
    'UTC+13': { abbreviations: ['NZDT'], cities: ['Auckland (DST)', 'Samoa'] },
    'UTC+14': { abbreviations: ['LINT'], cities: ['Line Islands', 'Kiribati'] },
  };
  
  // Also check with GMT prefix for backward compatibility
  return timezoneMap[normalizedOffset] || timezoneMap[gmtOffset] || { abbreviations: [], cities: [] };
};

export const formatTimezoneDisplay = (gmtOffset: string): string => {
  const info = getTimezoneInfo(gmtOffset);
  const abbreviation = info.abbreviations[0] || '';
  const city = info.cities[0] || '';
  
  if (abbreviation && city) {
    return `${gmtOffset} (${abbreviation}/${city})`;
  } else if (abbreviation) {
    return `${gmtOffset} (${abbreviation})`;
  } else {
    return gmtOffset;
  }
};

export const getAllTimezones = (): string[] => {
  const timezones: string[] = [
    'UTC-12', 'UTC-11', 'UTC-10', 'UTC-9', 'UTC-8', 'UTC-7', 'UTC-6', 'UTC-5',
    'UTC-4.5', 'UTC-4', 'UTC-3.5', 'UTC-3', 'UTC-2', 'UTC-1', 'UTC+0',
    'UTC+1', 'UTC+2', 'UTC+3', 'UTC+3.5', 'UTC+4', 'UTC+4.5', 'UTC+5',
    'UTC+5.5', 'UTC+5.75', 'UTC+6', 'UTC+6.5', 'UTC+7', 'UTC+8', 'UTC+9',
    'UTC+9.5', 'UTC+10', 'UTC+11', 'UTC+12', 'UTC+13', 'UTC+14'
  ];
  return timezones;
}