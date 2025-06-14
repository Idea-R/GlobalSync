import { AppData, PersonalInfo, TeamMember } from '../types';
import { detectUserTimezone } from './timezone';

const STORAGE_KEY = 'globalsync-data';

// Migration function to convert GMT to UTC
const migrateTimezone = (timezone: string): string => {
  if (timezone.startsWith('GMT')) {
    return timezone.replace('GMT', 'UTC');
  }
  return timezone;
};

const getDefaultPersonalInfo = (): PersonalInfo => ({
  name: '',
  timezone: detectUserTimezone(),
  status: 'vibing',
  workHours: '9-17',
  sleepHours: '23-7',
  autoStatus: true,
});

const getDefaultData = (): AppData => ({
  personalInfo: getDefaultPersonalInfo(),
  teamMembers: [],
  theme: 'dark',
  showHelp: false,
});

export const loadData = (): AppData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return getDefaultData();
    }
    
    const parsed = JSON.parse(stored);
    
    // Migrate timezones from GMT to UTC
    if (parsed.personalInfo && parsed.personalInfo.timezone) {
      parsed.personalInfo.timezone = migrateTimezone(parsed.personalInfo.timezone);
    }
    
    if (parsed.teamMembers) {
      parsed.teamMembers = parsed.teamMembers.map((member: TeamMember) => ({
        ...member,
        timezone: migrateTimezone(member.timezone),
      }));
    }
    
    return {
      ...getDefaultData(),
      ...parsed,
      personalInfo: {
        ...getDefaultPersonalInfo(),
        ...parsed.personalInfo,
      },
    };
  } catch (error) {
    console.error('Failed to load data from localStorage:', error);
    return getDefaultData();
  }
};

export const saveData = (data: AppData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save data to localStorage:', error);
  }
};

export const addTeamMember = (data: AppData, member: Omit<TeamMember, 'id' | 'lastUpdated'>): AppData => {
  const newMember: TeamMember = {
    ...member,
    id: crypto.randomUUID(),
    lastUpdated: Date.now(),
  };
  
  return {
    ...data,
    teamMembers: [...data.teamMembers, newMember],
  };
};

export const updateTeamMember = (data: AppData, id: string, updates: Partial<TeamMember>): AppData => {
  return {
    ...data,
    teamMembers: data.teamMembers.map(member =>
      member.id === id
        ? { ...member, ...updates, lastUpdated: Date.now() }
        : member
    ),
  };
};

export const removeTeamMember = (data: AppData, id: string): AppData => {
  return {
    ...data,
    teamMembers: data.teamMembers.filter(member => member.id !== id),
  };
};