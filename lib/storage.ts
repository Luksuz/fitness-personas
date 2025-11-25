import { UserProfile, Message, TrainerPersona, WorkoutCard, MealCardData } from './types';

const STORAGE_KEY = 'fitness-demo-user-profile';
const CONVERSATIONS_KEY = 'fitness-demo-conversations';
const CHAT_HISTORY_KEY = 'fitness-demo-chat-history';
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

// Chat session type for history
export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  lastUpdated: number;
}

// Chat history storage per trainer
interface ChatHistoryStorage {
  [trainerId: string]: {
    sessions: ChatSession[];
    activeSessionId: string | null;
  };
}

// Generate unique ID for chat sessions
function generateSessionId(): string {
  return `chat-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Generate title from first user message or default
function generateSessionTitle(messages: Message[]): string {
  const firstUserMessage = messages.find(m => m.role === 'user');
  if (firstUserMessage) {
    const content = firstUserMessage.content;
    // Truncate to 40 chars
    return content.length > 40 ? content.substring(0, 40) + '...' : content;
  }
  return `Chat ${new Date().toLocaleDateString()}`;
}

// Save current chat session
export function saveChatSession(trainerId: TrainerPersona, sessionId: string, messages: Message[]): void {
  try {
    const stored = localStorage.getItem(CHAT_HISTORY_KEY);
    const history: ChatHistoryStorage = stored ? JSON.parse(stored) : {};
    
    if (!history[trainerId]) {
      history[trainerId] = { sessions: [], activeSessionId: null };
    }
    
    const existingIndex = history[trainerId].sessions.findIndex(s => s.id === sessionId);
    const sessionData: ChatSession = {
      id: sessionId,
      title: generateSessionTitle(messages),
      messages,
      createdAt: existingIndex >= 0 ? history[trainerId].sessions[existingIndex].createdAt : Date.now(),
      lastUpdated: Date.now(),
    };
    
    if (existingIndex >= 0) {
      history[trainerId].sessions[existingIndex] = sessionData;
    } else {
      history[trainerId].sessions.unshift(sessionData); // Add to beginning
    }
    
    // Keep only last 20 sessions per trainer
    if (history[trainerId].sessions.length > 20) {
      history[trainerId].sessions = history[trainerId].sessions.slice(0, 20);
    }
    
    history[trainerId].activeSessionId = sessionId;
    
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save chat session:', error);
  }
}

// Create new chat session
export function createNewChatSession(trainerId: TrainerPersona): string {
  const sessionId = generateSessionId();
  try {
    const stored = localStorage.getItem(CHAT_HISTORY_KEY);
    const history: ChatHistoryStorage = stored ? JSON.parse(stored) : {};
    
    if (!history[trainerId]) {
      history[trainerId] = { sessions: [], activeSessionId: null };
    }
    
    history[trainerId].activeSessionId = sessionId;
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to create new chat session:', error);
  }
  return sessionId;
}

// Load chat session by ID
export function loadChatSession(trainerId: TrainerPersona, sessionId: string): ChatSession | null {
  try {
    const stored = localStorage.getItem(CHAT_HISTORY_KEY);
    if (stored) {
      const history: ChatHistoryStorage = JSON.parse(stored);
      const session = history[trainerId]?.sessions.find(s => s.id === sessionId);
      return session || null;
    }
  } catch (error) {
    console.error('Failed to load chat session:', error);
  }
  return null;
}

// Load all chat sessions for a trainer
export function loadChatHistory(trainerId: TrainerPersona): ChatSession[] {
  try {
    const stored = localStorage.getItem(CHAT_HISTORY_KEY);
    if (stored) {
      const history: ChatHistoryStorage = JSON.parse(stored);
      return history[trainerId]?.sessions || [];
    }
  } catch (error) {
    console.error('Failed to load chat history:', error);
  }
  return [];
}

// Get active session ID for a trainer
export function getActiveSessionId(trainerId: TrainerPersona): string | null {
  try {
    const stored = localStorage.getItem(CHAT_HISTORY_KEY);
    if (stored) {
      const history: ChatHistoryStorage = JSON.parse(stored);
      return history[trainerId]?.activeSessionId || null;
    }
  } catch (error) {
    console.error('Failed to get active session:', error);
  }
  return null;
}

// Set active session
export function setActiveSession(trainerId: TrainerPersona, sessionId: string): void {
  try {
    const stored = localStorage.getItem(CHAT_HISTORY_KEY);
    const history: ChatHistoryStorage = stored ? JSON.parse(stored) : {};
    
    if (!history[trainerId]) {
      history[trainerId] = { sessions: [], activeSessionId: null };
    }
    
    history[trainerId].activeSessionId = sessionId;
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to set active session:', error);
  }
}

// Delete a chat session
export function deleteChatSession(trainerId: TrainerPersona, sessionId: string): void {
  try {
    const stored = localStorage.getItem(CHAT_HISTORY_KEY);
    if (stored) {
      const history: ChatHistoryStorage = JSON.parse(stored);
      if (history[trainerId]) {
        history[trainerId].sessions = history[trainerId].sessions.filter(s => s.id !== sessionId);
        if (history[trainerId].activeSessionId === sessionId) {
          history[trainerId].activeSessionId = history[trainerId].sessions[0]?.id || null;
        }
        localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history));
      }
    }
  } catch (error) {
    console.error('Failed to delete chat session:', error);
  }
}

// Clear all chat history for a trainer
export function clearTrainerChatHistory(trainerId: TrainerPersona): void {
  try {
    const stored = localStorage.getItem(CHAT_HISTORY_KEY);
    if (stored) {
      const history: ChatHistoryStorage = JSON.parse(stored);
      delete history[trainerId];
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history));
    }
  } catch (error) {
    console.error('Failed to clear trainer chat history:', error);
  }
}

// Legacy conversation storage functions (keep for backward compatibility)
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


