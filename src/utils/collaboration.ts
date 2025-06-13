import { TeamMember, PersonalInfo, CollaborationWindow } from '../types';
import { getCurrentTimeInTimezone, isInTimeRange } from './timezone';

export const findCollaborationWindows = (
  personalInfo: PersonalInfo,
  teamMembers: TeamMember[]
): CollaborationWindow[] => {
  const allMembers = [
    { 
      name: personalInfo.name, 
      timezone: personalInfo.timezone, 
      workHours: personalInfo.workHours,
      sleepHours: personalInfo.sleepHours 
    },
    ...teamMembers.map(m => ({ 
      name: m.name, 
      timezone: m.timezone, 
      workHours: m.workHours,
      sleepHours: m.sleepHours 
    }))
  ];

  const windows: CollaborationWindow[] = [];
  
  // Check each hour of the day (0-23)
  for (let hour = 0; hour < 24; hour++) {
    const availableMembers: string[] = [];
    
    allMembers.forEach(member => {
      const memberTime = new Date();
      const offset = getGMTOffset(member.timezone);
      const memberHour = (hour + offset + 24) % 24;
      
      const isWorkTime = isInHourRange(memberHour, member.workHours);
      const isSleepTime = isInHourRange(memberHour, member.sleepHours);
      
      // Available if not sleeping and either working or free time
      if (!isSleepTime) {
        availableMembers.push(member.name);
      }
    });
    
    // Only create window if at least 2 people are available
    if (availableMembers.length >= 2) {
      const period = getPeriodFromHour(hour);
      windows.push({
        startHour: hour,
        endHour: (hour + 1) % 24,
        availableMembers,
        period
      });
    }
  }
  
  // Merge consecutive hours into longer windows
  return mergeConsecutiveWindows(windows);
};

const getGMTOffset = (timezone: string): number => {
  const match = timezone.match(/GMT([+-])(\d+)/);
  if (!match) return 0;
  const sign = match[1] === '+' ? 1 : -1;
  const hours = parseInt(match[2], 10);
  return sign * hours;
};

const isInHourRange = (hour: number, timeRange: string): boolean => {
  if (!timeRange || timeRange === '') return false;
  
  const [startStr, endStr] = timeRange.split('-');
  const start = parseInt(startStr, 10);
  const end = parseInt(endStr, 10);
  
  if (start <= end) {
    return hour >= start && hour < end;
  } else {
    // Crosses midnight (e.g., 23-7)
    return hour >= start || hour < end;
  }
};

const getPeriodFromHour = (hour: number): CollaborationWindow['period'] => {
  if (hour >= 5 && hour < 9) return 'early-morning';
  if (hour >= 9 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 22) return 'evening';
  return 'late-night';
};

const mergeConsecutiveWindows = (windows: CollaborationWindow[]): CollaborationWindow[] => {
  if (windows.length === 0) return [];
  
  const merged: CollaborationWindow[] = [];
  let current = { ...windows[0] };
  
  for (let i = 1; i < windows.length; i++) {
    const next = windows[i];
    
    // Check if windows are consecutive and have same members
    if (
      current.endHour === next.startHour &&
      current.period === next.period &&
      arraysEqual(current.availableMembers, next.availableMembers)
    ) {
      current.endHour = next.endHour;
    } else {
      merged.push(current);
      current = { ...next };
    }
  }
  
  merged.push(current);
  return merged.filter(w => w.availableMembers.length >= 2);
};

const arraysEqual = (a: string[], b: string[]): boolean => {
  return a.length === b.length && a.every((val, i) => val === b[i]);
};

export const formatCollaborationTime = (window: CollaborationWindow): string => {
  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };
  
  return `${formatHour(window.startHour)} - ${formatHour(window.endHour)}`;
};

export const getPeriodEmoji = (period: CollaborationWindow['period']): string => {
  const emojis = {
    'early-morning': '🌅',
    'morning': '☀️',
    'afternoon': '🌞',
    'evening': '🌆',
    'late-night': '🌙'
  };
  return emojis[period];
};