import { PersonaConfig } from './personas';

export interface CustomTrainer extends PersonaConfig {
  id: string;
  createdAt: number;
}

const STORAGE_KEY = 'fitness-demo-custom-trainers';

// Check if we're in a browser environment
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

export function saveCustomTrainer(trainer: CustomTrainer): void {
  if (!isBrowser()) return;
  
  try {
    const trainers = loadCustomTrainers();
    const existingIndex = trainers.findIndex(t => t.id === trainer.id);
    
    if (existingIndex >= 0) {
      trainers[existingIndex] = trainer;
    } else {
      trainers.push(trainer);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trainers));
  } catch (error) {
    console.error('Failed to save custom trainer to localStorage:', error);
  }
}

export function loadCustomTrainers(): CustomTrainer[] {
  if (!isBrowser()) return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as CustomTrainer[];
    }
  } catch (error) {
    console.error('Failed to load custom trainers from localStorage:', error);
  }
  return [];
}

export function deleteCustomTrainer(id: string): void {
  if (!isBrowser()) return;
  
  try {
    const trainers = loadCustomTrainers();
    const filtered = trainers.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete custom trainer from localStorage:', error);
  }
}

export function getCustomTrainer(id: string): CustomTrainer | null {
  if (!isBrowser()) return null;
  
  const trainers = loadCustomTrainers();
  return trainers.find(t => t.id === id) || null;
}

export function generateCustomTrainerId(): string {
  return `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

