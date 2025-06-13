export const getGMTOffset = (timezone: string): number => {
  const match = timezone.match(/GMT([+-])(\d+)/);
  if (!match) return 0;
  const sign = match[1] === '+' ? 1 : -1;
  const hours = parseInt(match[2], 10);
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

// Detect user's timezone and convert to GMT format
export const detectUserTimezone = (): string => {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const localTime = new Date(utcTime + (now.getTimezoneOffset() * 60000));
    
    // Create a date in the user's timezone
    const userTime = new Date(now.toLocaleString("en-US", {timeZone}));
    const offset = Math.round((userTime.getTime() - utcTime) / (1000 * 60 * 60));
    
    const sign = offset >= 0 ? '+' : '';
    return `GMT${sign}${offset}`;
  } catch (error) {
    console.error('Failed to detect timezone:', error);
    return 'GMT+0';
  }
};

// Enhanced timezone data with common abbreviations and cities
export const getTimezoneInfo = (gmtOffset: string) => {
  const timezoneMap: Record<string, { abbreviations: string[], cities: string[] }> = {
    'GMT-12': { abbreviations: ['BIT'], cities: ['Baker Island'] },
    'GMT-11': { abbreviations: ['SST'], cities: ['Samoa', 'Midway'] },
    'GMT-10': { abbreviations: ['HST'], cities: ['Hawaii', 'Honolulu'] },
    'GMT-9': { abbreviations: ['AKST'], cities: ['Alaska', 'Anchorage'] },
    'GMT-8': { abbreviations: ['PST', 'PT'], cities: ['Los Angeles', 'Seattle', 'Vancouver'] },
    'GMT-7': { abbreviations: ['MST', 'PDT'], cities: ['Denver', 'Phoenix', 'Calgary'] },
    'GMT-6': { abbreviations: ['CST', 'MDT'], cities: ['Chicago', 'Dallas', 'Mexico City'] },
    'GMT-5': { abbreviations: ['EST', 'CDT'], cities: ['New York', 'Toronto', 'Miami'] },
    'GMT-4': { abbreviations: ['AST', 'EDT'], cities: ['Halifax', 'Caracas', 'Santiago'] },
    'GMT-3': { abbreviations: ['ART', 'BRT'], cities: ['Buenos Aires', 'São Paulo', 'Montevideo'] },
    'GMT-2': { abbreviations: ['GST'], cities: ['South Georgia'] },
    'GMT-1': { abbreviations: ['CVT'], cities: ['Cape Verde', 'Azores'] },
    'GMT+0': { abbreviations: ['GMT', 'UTC'], cities: ['London', 'Dublin', 'Lisbon'] },
    'GMT+1': { abbreviations: ['CET'], cities: ['Berlin', 'Paris', 'Rome', 'Madrid'] },
    'GMT+2': { abbreviations: ['EET'], cities: ['Cairo', 'Helsinki', 'Athens', 'Kiev'] },
    'GMT+3': { abbreviations: ['MSK'], cities: ['Moscow', 'Istanbul', 'Riyadh'] },
    'GMT+4': { abbreviations: ['GST'], cities: ['Dubai', 'Baku', 'Tbilisi'] },
    'GMT+5': { abbreviations: ['PKT'], cities: ['Karachi', 'Tashkent', 'Yekaterinburg'] },
    'GMT+6': { abbreviations: ['BST'], cities: ['Dhaka', 'Almaty', 'Omsk'] },
    'GMT+7': { abbreviations: ['ICT'], cities: ['Bangkok', 'Jakarta', 'Ho Chi Minh'] },
    'GMT+8': { abbreviations: ['CST', 'SGT'], cities: ['Beijing', 'Singapore', 'Manila', 'Perth'] },
    'GMT+9': { abbreviations: ['JST', 'KST'], cities: ['Tokyo', 'Seoul', 'Pyongyang'] },
    'GMT+10': { abbreviations: ['AEST'], cities: ['Sydney', 'Melbourne', 'Brisbane'] },
    'GMT+11': { abbreviations: ['NCT'], cities: ['New Caledonia', 'Solomon Islands'] },
    'GMT+12': { abbreviations: ['NZST'], cities: ['Auckland', 'Wellington', 'Fiji'] },
    'GMT+13': { abbreviations: ['NZDT'], cities: ['Auckland (DST)', 'Samoa'] },
    'GMT+14': { abbreviations: ['LINT'], cities: ['Line Islands', 'Kiribati'] },
  };
  
  return timezoneMap[gmtOffset] || { abbreviations: [], cities: [] };
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
  const timezones: string[] = [];
  for (let i = -12; i <= 14; i++) {
    const sign = i >= 0 ? '+' : '';
    const gmtOffset = `GMT${sign}${i}`;
    timezones.push(gmtOffset);
  }
  return timezones;
}