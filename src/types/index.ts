export interface PersonalInfo {
  name: string;
  timezone: string;
  status: StatusType;
  workHours: string;
  sleepHours: string;
  autoStatus: boolean;
  avatar?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  timezone: string;
  status: StatusType;
  workHours: string;
  sleepHours: string;
  autoStatus: boolean;
  avatar?: string;
  lastUpdated: number;
}

export type StatusType = 'vibing' | 'deepwork' | 'afk' | 'sleep' | 'pair' | 'voice';

export interface AppData {
  personalInfo: PersonalInfo;
  teamMembers: TeamMember[];
  theme: 'dark' | 'light';
  showHelp: boolean;
}

export interface StatusConfig {
  icon: string;
  label: string;
  description: string;
  color: string;
  flavorTexts: string[];
}

export interface CollaborationWindow {
  startHour: number;
  endHour: number;
  availableMembers: string[];
  period: 'early-morning' | 'morning' | 'afternoon' | 'evening' | 'late-night';
}

export interface SchedulePreset {
  name: string;
  workHours: string;
  sleepHours: string;
  description: string;
  emoji: string;
}