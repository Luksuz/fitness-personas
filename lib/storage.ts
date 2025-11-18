import { UserProfile, Message, TrainerPersona, WorkoutCard, MealCardData } from './types';

const STORAGE_KEY = 'fitness-demo-user-profile';
const CONVERSATIONS_KEY = 'fitness-demo-conversations';
const PLANS_KEY = 'fitness-demo-plans';

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Failed to save user profile to localStorage:', error);
  }
}

export function loadUserProfile(): UserProfile | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as UserProfile;
    }
  } catch (error) {
    console.error('Failed to load user profile from localStorage:', error);
  }
  return null;
}

export function clearUserProfile(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear user profile from localStorage:', error);
  }
}

// Conversation storage functions
interface ConversationData {
  messages: Message[];
  lastUpdated: number;
}

interface ConversationsStorage {
  [trainerId: string]: ConversationData;
}

export function saveConversation(trainerId: TrainerPersona, messages: Message[]): void {
  try {
    const stored = localStorage.getItem(CONVERSATIONS_KEY);
    const conversations: ConversationsStorage = stored ? JSON.parse(stored) : {};
    
    conversations[trainerId] = {
      messages,
      lastUpdated: Date.now(),
    };
    
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
  } catch (error) {
    console.error('Failed to save conversation to localStorage:', error);
  }
}

export function loadConversation(trainerId: TrainerPersona): Message[] | null {
  try {
    const stored = localStorage.getItem(CONVERSATIONS_KEY);
    if (stored) {
      const conversations: ConversationsStorage = JSON.parse(stored);
      const conversation = conversations[trainerId];
      
      if (conversation) {
        return conversation.messages;
      }
    }
  } catch (error) {
    console.error('Failed to load conversation from localStorage:', error);
  }
  return null;
}

export function clearConversation(trainerId: TrainerPersona): void {
  try {
    const stored = localStorage.getItem(CONVERSATIONS_KEY);
    if (stored) {
      const conversations: ConversationsStorage = JSON.parse(stored);
      delete conversations[trainerId];
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
    }
  } catch (error) {
    console.error('Failed to clear conversation from localStorage:', error);
  }
}

export function clearAllConversations(): void {
  try {
    localStorage.removeItem(CONVERSATIONS_KEY);
  } catch (error) {
    console.error('Failed to clear all conversations from localStorage:', error);
  }
}

// Plans storage functions
interface PlanData {
  workoutPlan: WorkoutCard[] | null;
  nutritionPlan: MealCardData[] | null;
  dailyTargets: any | null;
  lastUpdated: number;
}

interface PlansStorage {
  [trainerId: string]: PlanData;
}

export function savePlans(
  trainerId: TrainerPersona, 
  workoutPlan: WorkoutCard[] | null, 
  nutritionPlan: MealCardData[] | null,
  dailyTargets: any | null
): void {
  try {
    const stored = localStorage.getItem(PLANS_KEY);
    const plans: PlansStorage = stored ? JSON.parse(stored) : {};
    
    plans[trainerId] = {
      workoutPlan,
      nutritionPlan,
      dailyTargets,
      lastUpdated: Date.now(),
    };
    
    localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
  } catch (error) {
    console.error('Failed to save plans to localStorage:', error);
  }
}

export function loadPlans(trainerId: TrainerPersona): PlanData | null {
  try {
    const stored = localStorage.getItem(PLANS_KEY);
    if (stored) {
      const plans: PlansStorage = JSON.parse(stored);
      const plan = plans[trainerId];
      
      if (plan) {
        return plan;
      }
    }
  } catch (error) {
    console.error('Failed to load plans from localStorage:', error);
  }
  return null;
}

export function clearPlans(trainerId: TrainerPersona): void {
  try {
    const stored = localStorage.getItem(PLANS_KEY);
    if (stored) {
      const plans: PlansStorage = JSON.parse(stored);
      delete plans[trainerId];
      localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
    }
  } catch (error) {
    console.error('Failed to clear plans from localStorage:', error);
  }
}

export function clearAllPlans(): void {
  try {
    localStorage.removeItem(PLANS_KEY);
  } catch (error) {
    console.error('Failed to clear all plans from localStorage:', error);
  }
}


