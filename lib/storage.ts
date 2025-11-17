import { UserProfile, Message, TrainerPersona } from './types';

const STORAGE_KEY = 'fitness-demo-user-profile';
const CONVERSATIONS_KEY = 'fitness-demo-conversations';

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


