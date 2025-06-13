import { SchedulePreset } from '../types';

export const schedulePresets: SchedulePreset[] = [
  {
    name: 'Standard 9-5',
    workHours: '9-17',
    sleepHours: '23-7',
    description: 'Traditional office hours with evening sleep',
    emoji: '🏢'
  },
  {
    name: 'Night Owl',
    workHours: '14-22',
    sleepHours: '3-11',
    description: 'Late starter, productive evenings',
    emoji: '🦉'
  },
  {
    name: 'Early Bird',
    workHours: '6-14',
    sleepHours: '21-5',
    description: 'Early riser, morning productivity',
    emoji: '🐦'
  },
  {
    name: 'Freelancer Flex',
    workHours: '10-18',
    sleepHours: '1-8',
    description: 'Flexible schedule with late nights',
    emoji: '💻'
  },
  {
    name: 'Global Remote',
    workHours: '8-16',
    sleepHours: '22-6',
    description: 'Optimized for international collaboration',
    emoji: '🌍'
  },
  {
    name: 'Student Schedule',
    workHours: '13-21',
    sleepHours: '2-9',
    description: 'Late nights, late mornings',
    emoji: '🎓'
  },
  {
    name: 'Shift Worker',
    workHours: '22-6',
    sleepHours: '8-16',
    description: 'Night shift schedule',
    emoji: '🌙'
  },
  {
    name: 'Always Available',
    workHours: '0-24',
    sleepHours: '',
    description: 'No fixed schedule (not recommended!)',
    emoji: '⚡'
  }
];

export const getPresetBySchedule = (workHours: string, sleepHours: string): SchedulePreset | null => {
  return schedulePresets.find(preset => 
    preset.workHours === workHours && preset.sleepHours === sleepHours
  ) || null;
};