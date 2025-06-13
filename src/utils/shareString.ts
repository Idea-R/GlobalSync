import { PersonalInfo, TeamMember } from '../types';
import { AppData } from '../types';

export const generateShareString = (info: PersonalInfo): string => {
  const parts = [
    info.name,
    info.timezone,
    info.status,
    info.workHours,
    info.sleepHours,
    info.avatar || '',
    info.autoStatus ? '1' : '0'
  ];
  
  return `GlobalSync://${parts.join('|')}`;
};

// Helper function to encode PersonalInfo or TeamMember to string
const _encodeMemberOrPersonalInfo = (info: PersonalInfo | TeamMember): string => {
  const parts = [
    info.name,
    info.timezone,
    info.status,
    info.workHours,
    info.sleepHours,
    info.avatar || '',
    info.autoStatus ? '1' : '0'
  ];
  return parts.join('^');
};

// Helper function to decode string to PersonalInfo or TeamMember format
const _decodeMemberOrPersonalInfo = (encoded: string): Partial<PersonalInfo | TeamMember> | null => {
  const parts = encoded.split('^');
  if (parts.length < 5) return null;
  
  return {
    name: parts[0],
    timezone: parts[1],
    status: parts[2] as any,
    workHours: parts[3],
    sleepHours: parts[4],
    avatar: parts[5] || undefined,
    autoStatus: parts[6] === '1',
  };
};

export const generateAppShareString = (data: AppData): string => {
  const personalInfoEncoded = _encodeMemberOrPersonalInfo(data.personalInfo);
  const teamMembersEncoded = data.teamMembers.map(member => _encodeMemberOrPersonalInfo(member)).join('|');
  const theme = data.theme;
  
  return `GlobalSyncApp://${personalInfoEncoded}~${teamMembersEncoded}~${theme}`;
};

export const parseAppShareString = (shareString: string): AppData | null => {
  if (!shareString.startsWith('GlobalSyncApp://')) {
    return null;
  }
  
  const data = shareString.replace('GlobalSyncApp://', '');
  const mainParts = data.split('~');
  
  if (mainParts.length < 3) {
    return null;
  }
  
  // Parse personal info
  const personalInfoData = _decodeMemberOrPersonalInfo(mainParts[0]);
  if (!personalInfoData || !personalInfoData.name) {
    return null;
  }
  
  // Parse team members
  const teamMembers: TeamMember[] = [];
  if (mainParts[1] && mainParts[1].trim() !== '') {
    const teamMemberStrings = mainParts[1].split('|');
    for (const memberString of teamMemberStrings) {
      if (memberString.trim() === '') continue;
      const memberData = _decodeMemberOrPersonalInfo(memberString);
      if (memberData && memberData.name) {
        teamMembers.push({
          ...memberData,
          id: crypto.randomUUID(),
          lastUpdated: Date.now(),
        } as TeamMember);
      }
    }
  }
  
  // Parse theme
  const theme = mainParts[2] === 'light' ? 'light' : 'dark';
  
  return {
    personalInfo: personalInfoData as PersonalInfo,
    teamMembers,
    theme,
    showHelp: false,
  };
};

export const parseShareString = (shareString: string): Partial<TeamMember> | null => {
  if (!shareString.startsWith('GlobalSync://')) {
    return null;
  }
  
  const data = shareString.replace('GlobalSync://', '');
  const parts = data.split('|');
  
  if (parts.length < 5) {
    return null;
  }
  
  return {
    name: parts[0],
    timezone: parts[1],
    status: parts[2] as any,
    workHours: parts[3],
    sleepHours: parts[4],
    avatar: parts[5] || undefined,
    autoStatus: parts[6] === '1',
  };
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
};