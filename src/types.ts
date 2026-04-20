export type Screen = 'DASHBOARD' | 'ADD_PLANT' | 'TOMATO_CARE' | 'SETTINGS';

export interface User {
  name: string;
  email: string;
  avatar: string;
}

export interface GrowthEntry {
  date: string;
  value: number;
}

export interface ScheduledTask {
  id: string;
  type: string;
  date: string;
  time: string;
  completed: boolean;
  completedAt?: string;
  notified?: boolean;
}

export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  location?: string;
  emoji: string;
  image: string;
  growth: number;
  growthHistory: GrowthEntry[];
  hydration: number;
  lastHydrationUpdate: string;
  lightIntake: number;
  lastLightUpdate?: string;
  requiredLight: number;
  minTemp: number;
  maxTemp: number;
  wateringHistory: string[];
  status: 'Thriving' | 'Attention' | 'Thirsty' | 'Low Humidity' | 'Nutrient Alert' | 'Harvest Ready';
  type: 'Houseplant' | 'Plant';
  wateringNeed: 'Low' | 'Medium' | 'High';
  careAlert?: string;
  careAction?: string;
  tasks: ScheduledTask[];
}
