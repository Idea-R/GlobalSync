import { StatusConfig } from '../types';

export const statusConfig: Record<string, StatusConfig> = {
  vibing: {
    icon: '🎵',
    label: 'Vibing/Shipping',
    description: 'In the flow, shipping code',
    color: 'text-radar-green',
    flavorTexts: [
      'AI-assisted beast mode 🦅',
      'Claude is cooking 🔥',
      'Prompt engineering excellence ✨',
      'Model tokens burning 📡',
      'In the flow state 🎯',
    ],
  },
  deepwork: {
    icon: '💼',
    label: 'Deep Work',
    description: 'Focused coding session',
    color: 'text-steel-blue',
    flavorTexts: [
      'Terminal locked and loaded 🎯',
      'Deep in the code matrix 🧠',
      'Architecture mode engaged 🏗️',
      'Zero distraction protocol 🔒',
      'Algorithm optimization active ⚙️',
    ],
  },
  afk: {
    icon: '🚶',
    label: 'AFK/Grass',
    description: 'Away from keyboard',
    color: 'text-military-green',
    flavorTexts: [
      'Gone for real-world debugging 🎣',
      'Bio break from the matrix 🌱',
      'Coffee++ refill mission ☕',
      'Stepping away from terminal 🧘',
      'Touching grass protocol 🌿',
    ],
  },
  sleep: {
    icon: '😴',
    label: 'Sleep Mode',
    description: 'Offline for rest',
    color: 'text-tactical-gray',
    flavorTexts: [
      'Sleep is for the non-AI-assisted! 💪',
      'Midnight deployment ops 🛢️',
      'GitHub commits never sleep 🧛',
      'Recharging for next sprint 🔋',
      'Dream debugging in progress 💤',
    ],
  },
  pair: {
    icon: '💬',
    label: 'Ready to Pair',
    description: 'Available for collaboration',
    color: 'text-tactical-amber',
    flavorTexts: [
      'Ready for mob programming 👥',
      'Pair debugging protocols ready 🤝',
      'Code review mode standby 👀',
      'Collaboration channels open 📡',
      'Team sync ready to deploy 🚀',
    ],
  },
  voice: {
    icon: '🎙️',
    label: 'Voice/AI Chat',
    description: 'In voice or AI session',
    color: 'text-command-orange',
    flavorTexts: [
      'Feeding the models 🤖',
      'Token budget optimizing 💎',
      'Prompt crafting in progress 🎨',
      'Teaching AI new tricks 🚀',
      'Voice command protocols active 🎙️',
    ],
  },
};

export const getRandomFlavorText = (status: string): string => {
  const config = statusConfig[status];
  if (!config || !config.flavorTexts.length) {
    return 'Ready for action 🎯';
  }
  
  const randomIndex = Math.floor(Math.random() * config.flavorTexts.length);
  return config.flavorTexts[randomIndex];
};