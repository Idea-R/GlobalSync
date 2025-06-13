import { AppData, PersonalInfo, TeamMember } from '../types';

const STORAGE_KEY = 'globalsync-data';

const getDefaultPersonalInfo = (): PersonalInfo => ({
  name: '',
  timezone: 'GMT+0',
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