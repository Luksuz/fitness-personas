'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TrainerPersona, UserProfile, Message, WorkoutCard as WorkoutCardType, MealCardData } from '@/lib/types';
import { getPersonaConfig } from '@/lib/personas';
import { 
  savePlans, 
  loadPlans, 
  clearPlans,
  ChatSession,
  saveChatSession,
  loadChatSession,
  loadChatHistory,
  createNewChatSession,
  getActiveSessionId,
  setActiveSession,
  deleteChatSession,
  clearTrainerChatHistory,
} from '@/lib/storage';
import { Language, t, LANGUAGE_CONFIG } from '@/lib/translations';
import MealCard from './MealCard';
import MealModal from './MealModal';
import WorkoutCard from './WorkoutCard';
import WorkoutModal from './WorkoutModal';
import UserProfileModal from './UserProfileModal';
import ChatHistory from './ChatHistory';

interface ChatInterfaceProps {
  trainer: TrainerPersona;
  userProfile: UserProfile;
  onReset: () => void;
  onProfileUpdate?: (profile: UserProfile) => void;
}

export default function ChatInterface({ trainer, userProfile, onReset, onProfileUpdate }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatingPlan, setGeneratingPlan] = useState<'workout' | 'nutrition' | null>(null);
  const [nutritionData, setNutritionData] = useState<MealCardData[] | null>(null);
  const [workoutData, setWorkoutData] = useState<WorkoutCardType[] | null>(null);
  const [dailyTargets, setDailyTargets] = useState<any>(null);
  const [selectedMeal, setSelectedMeal] = useState<any>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutCardType | null>(null);
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<UserProfile>(userProfile);
  const [voiceRecordingStatus, setVoiceRecordingStatus] = useState<'idle' | 'generating' | 'ready' | 'error'>('idle');
  const [voiceAudioUrl, setVoiceAudioUrl] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>(userProfile.language || 'en');
  const [activeTab, setActiveTab] = useState<'workout' | 'nutrition'>('nutrition');
  const [mobileView, setMobileView] = useState<'chat' | 'workout' | 'nutrition'>('chat');
  // Chat history state
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasGeneratedGreeting = useRef(false);

  const trainerConfig = getPersonaConfig(trainer);
  
  if (!trainerConfig) {
    return <div>Trainer not found</div>;
  }

  // Sync profile and language when prop changes
  useEffect(() => {
    setCurrentProfile(userProfile);
    // Also sync language from profile
    if (userProfile.language) {
      setLanguage(userProfile.language);
    }
  }, [userProfile]);

  // Load chat history and active session on mount
  useEffect(() => {
    // Load chat history
    const history = loadChatHistory(trainer);
    setChatHistory(history);
    
    // Get or create active session
    let sessionId = getActiveSessionId(trainer);
    
    if (sessionId) {
      // Load existing session
      const session = loadChatSession(trainer, sessionId);
      if (session && session.messages.length > 0) {
        setMessages(session.messages);
        setActiveSessionId(sessionId);
        hasGeneratedGreeting.current = true; // Skip greeting generation
      } else {
        // Session not found or empty, create new
        sessionId = createNewChatSession(trainer);
        setActiveSessionId(sessionId);
      }
    } else {
      // No active session, create new
      sessionId = createNewChatSession(trainer);
      setActiveSessionId(sessionId);
    }
    
    // Load plans
    const savedPlans = loadPlans(trainer);
    if (savedPlans) {
      if (savedPlans.workoutPlan) {
        setWorkoutData(savedPlans.workoutPlan);
      }
      if (savedPlans.nutritionPlan) {
        setNutritionData(savedPlans.nutritionPlan);
      }
      if (savedPlans.dailyTargets) {
        setDailyTargets(savedPlans.dailyTargets);
      }
    }
  }, [trainer]);

  // Save conversation to chat history whenever messages change (after streaming is complete)
  useEffect(() => {
    if (messages.length > 0 && !isLoading && generatingPlan === null && activeSessionId) {
      // Save to chat session
      saveChatSession(trainer, activeSessionId, messages);
      // Update local history state
      setChatHistory(loadChatHistory(trainer));
    }
  }, [messages, isLoading, generatingPlan, trainer, activeSessionId]);

  // Save plans to localStorage whenever they change (after generation is complete)
  useEffect(() => {
    if (generatingPlan === null) {
      // Only save when not currently generating
      savePlans(trainer, workoutData, nutritionData, dailyTargets);
    }
  }, [workoutData, nutritionData, dailyTargets, generatingPlan, trainer]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Chat history handlers
  const handleSelectSession = (sessionId: string) => {
    const session = loadChatSession(trainer, sessionId);
    if (session) {
      setMessages(session.messages);
      setActiveSessionId(sessionId);
      setActiveSession(trainer, sessionId);
      hasGeneratedGreeting.current = true;
    }
  };

  const handleNewChat = () => {
    const newSessionId = createNewChatSession(trainer);
    setActiveSessionId(newSessionId);
    setMessages([]);
    hasGeneratedGreeting.current = false;
    // Reset plans for new chat
    setWorkoutData(null);
    setNutritionData(null);
    setDailyTargets(null);
  };

  const handleDeleteSession = (sessionId: string) => {
    deleteChatSession(trainer, sessionId);
    setChatHistory(loadChatHistory(trainer));
    
    // If deleting active session, start new chat
    if (sessionId === activeSessionId) {
      handleNewChat();
    }
  };

  const handleProfileSave = (profile: UserProfile) => {
    setCurrentProfile(profile);
    if (onProfileUpdate) {
      onProfileUpdate(profile);
    }
    // Regenerate greeting with new profile
    hasGeneratedGreeting.current = false;
    setMessages([]);
    // Clear saved conversation and plans when regenerating
    clearTrainerChatHistory(trainer);
    clearPlans(trainer);
    // Reset plan data
    setWorkoutData(null);
    setNutritionData(null);
    setDailyTargets(null);
    // Create new session
    const newSessionId = createNewChatSession(trainer);
    setActiveSessionId(newSessionId);
    setChatHistory([]);
  };

  // Generate initial greeting message
  useEffect(() => {
    // Prevent duplicate greetings (React Strict Mode runs effects twice)
    if (hasGeneratedGreeting.current) return;
    hasGeneratedGreeting.current = true;

    const generateGreeting = async () => {
      try {
        const greetingContent = language === 'hr' 
          ? `Pozdravi me i predstavi se na temelju mog profila na hrvatskom jeziku. Reci mi da možeš pomoći s planovima treninga i prehrane.`
          : `Greet me and introduce yourself based on my profile in English. Let me know you can help with workout and nutrition plans.`;
        
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{
              role: 'user',
              content: greetingContent,
            }],
            persona: trainer,
            userProfile: currentProfile,
            language: language,
            // Send system prompt for custom trainers
            systemPrompt: trainer.startsWith('custom-') ? trainerConfig.systemPrompt : undefined,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate greeting');
        }

        // Handle streaming response
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        
        if (!reader) {
          throw new Error('No response body');
        }

        let buffer = '';
        let content = '';

        // Create initial message for streaming
        setMessages([{
          role: 'assistant' as const,
          content: '',
        }]);

        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          
          // Process complete SSE messages
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                
                if (data.type === 'chunk') {
                  content += data.content;
                  // Update the message with accumulated content
                  setMessages([{
                    role: 'assistant' as const,
                    content: content,
                  }]);
                } else if (data.type === 'error') {
                  throw new Error(data.content);
                }
              } catch (error) {
                console.error('Error parsing SSE data:', error);
              }
            }
          }
        }
      } catch (error) {
        console.error('Failed to generate greeting:', error);
        // Fallback to a simple message
        const fallbackMessage = language === 'hr'
          ? 'Bok! Spremni za početak? Kliknite gumbove iznad da generirate plan treninga ili prehrane!'
          : 'Hey! Ready to get started? Click the buttons above to generate your workout or nutrition plan!';
        
        setMessages([{
          role: 'assistant' as const,
          content: fallbackMessage,
        }]);
      }
    };

    generateGreeting();
  }, [trainer, currentProfile, language]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          persona: trainer,
          userProfile: currentProfile,
          language: language,
          // Send system prompt for custom trainers
          systemPrompt: trainer.startsWith('custom-') ? trainerConfig.systemPrompt : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) {
        throw new Error('No response body');
      }

      let buffer = '';
      let assistantContent = '';

      // Create initial empty assistant message for streaming
      setMessages(prev => [...prev, {
        role: 'assistant' as const,
        content: '',
      }]);

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        // Process complete SSE messages
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'chunk') {
                assistantContent += data.content;
                // Update the last message (assistant message) with accumulated content
                setMessages(prev => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1] = {
                    role: 'assistant' as const,
                    content: assistantContent,
                  };
                  return newMessages;
                });
              } else if (data.type === 'error') {
                throw new Error(data.content);
              }
            } catch (error) {
              console.error('Error parsing SSE data:', error);
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant' as const,
          content: `Error: ${error.message}. Please try again.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const generatePlan = async (planType: 'workout' | 'nutrition') => {
    setGeneratingPlan(planType);
    // Switch to appropriate tab and view
    setActiveTab(planType);
    setMobileView(planType);
    // Reset voice recording status
    setVoiceRecordingStatus('idle');
    setVoiceAudioUrl(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const planMessage: Message = {
      role: 'user',
      content: `Please generate a ${planType} plan for me.`,
    };

    setMessages(prev => [...prev, planMessage]);

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile: currentProfile,
          persona: trainer,
          planType,
          language: language,
          // Send system prompt for custom trainers
          systemPrompt: trainer.startsWith('custom-') ? trainerConfig.systemPrompt : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate plan');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) {
        throw new Error('No response body');
      }

      let buffer = '';
      const tempCards: any[] = [];
      let hasShownCardsContainer = false;
      let introContent = '';
      let outroContent = '';
      let introMessageIndex = -1;
      let outroMessageIndex = -1;

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        // Process complete SSE messages
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              switch (data.type) {
                case 'targets':
                  // Set nutrition targets
                  setDailyTargets(data.content);
                  break;
                  
                case 'chunk':
                  // Stream intro message character-by-character
                  introContent += data.content;
                  
                  // Create intro message if it doesn't exist
                  if (introMessageIndex === -1) {
                    setMessages(prev => {
                      const newMessages: Message[] = [...prev, {
                        role: 'assistant' as const,
                        content: introContent,
                      }];
                      introMessageIndex = newMessages.length - 1;
                      return newMessages;
                    });
                  } else {
                    // Update existing intro message
                    setMessages(prev => {
                      const newMessages = [...prev];
                      newMessages[introMessageIndex] = {
                        role: 'assistant' as const,
                        content: introContent,
                      };
                      return newMessages;
                    });
                  }
                  break;
                  
                case 'parsing':
                  // JSON parsing started, intro streaming is done
                  // Show cards container
                  if (!hasShownCardsContainer) {
                    hasShownCardsContainer = true;
                    setMessages(prev => [...prev, {
                      role: 'assistant' as const,
                      content: planType === 'nutrition' ? '__MEAL_CARDS__' : '__WORKOUT_CARDS__',
                    }]);
                  }
                  break;
                  
                case 'meal_header':
                  // Start a new meal card
                  tempCards[data.content.index] = {
                    name: data.content.name,
                    time: data.content.time,
                    foods: [],
                    totalCalories: 0,
                    totalProtein: 0,
                    totalCarbs: 0,
                    totalFat: 0,
                  };
                  setNutritionData([...tempCards]);
                  break;
                  
                case 'meal_food':
                  // Add food to meal
                  if (tempCards[data.mealIndex]) {
                    tempCards[data.mealIndex].foods.push(data.content);
                    setNutritionData([...tempCards]);
                  }
                  break;
                  
                case 'meal_complete':
                  // Update meal totals
                  if (tempCards[data.content.index]) {
                    tempCards[data.content.index] = {
                      ...tempCards[data.content.index],
                      totalCalories: data.content.totalCalories,
                      totalProtein: data.content.totalProtein,
                      totalCarbs: data.content.totalCarbs,
                      totalFat: data.content.totalFat,
                    };
                    setNutritionData([...tempCards]);
                  }
                  break;
                  
                case 'workout_header':
                  // Start a new workout card
                  tempCards[data.content.index] = {
                    day: data.content.day,
                    focus: data.content.focus,
                    warmup: data.content.warmup,
                    cooldown: data.content.cooldown,
                    notes: data.content.notes,
                    exercises: [],
                  };
                  setWorkoutData([...tempCards]);
                  break;
                  
                case 'workout_exercise':
                  // Add exercise to workout
                  if (tempCards[data.workoutIndex]) {
                    tempCards[data.workoutIndex].exercises.push(data.content);
                    setWorkoutData([...tempCards]);
                  }
                  break;
                  
                case 'workout_complete':
                  // Workout card is complete (no additional updates needed)
                  break;
                  
                case 'card':
                  // Legacy support - full card at once
                  tempCards.push(data.content);
                  if (planType === 'nutrition') {
                    setNutritionData([...tempCards]);
                  } else {
                    setWorkoutData([...tempCards]);
                  }
                  break;
                  
                case 'outro_chunk':
                  // Stream outro message character-by-character
                  outroContent += data.content;
                  
                  // Create outro message if it doesn't exist
                  if (outroMessageIndex === -1) {
                    setMessages(prev => {
                      const newMessages: Message[] = [...prev, {
                        role: 'assistant' as const,
                        content: outroContent,
                      }];
                      outroMessageIndex = newMessages.length - 1;
                      return newMessages;
                    });
                  } else {
                    // Update existing outro message
                    setMessages(prev => {
                      const newMessages = [...prev];
                      newMessages[outroMessageIndex] = {
                        role: 'assistant' as const,
                        content: outroContent,
                      };
                      return newMessages;
                    });
                  }
                  break;
                  
                case 'outro':
                  // Legacy support - complete outro message
                  setMessages(prev => [...prev, {
                    role: 'assistant' as const,
                    content: data.content,
                  }]);
                  break;
                  
                case 'voice_generating':
                  setVoiceRecordingStatus('generating');
                  break;
                  
                case 'voice_ready':
                  setVoiceRecordingStatus('ready');
                  setVoiceAudioUrl(data.audio);
                  break;
                  
                case 'voice_error':
                  setVoiceRecordingStatus('error');
                  console.error('Voice generation error:', data.content);
                  break;
                  
                case 'done':
                  // Plan generation complete
                  console.log('Plan generation complete:', data.planType);
                  break;
                  
                case 'error':
                  throw new Error(data.content);
              }
            } catch (error) {
              console.error('Error parsing SSE data:', error);
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Plan generation error:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant' as const,
          content: `Error generating ${planType} plan: ${error.message}. Please try again.`,
        },
      ]);
    } finally {
      setGeneratingPlan(null);
    }
  };

  return (
    <>
      {/* Meal Modal */}
      <MealModal
        meal={selectedMeal}
        isOpen={isMealModalOpen}
        onClose={() => setIsMealModalOpen(false)}
      />
      
      {/* Workout Modal */}
      <WorkoutModal
        workout={selectedWorkout}
        isOpen={isWorkoutModalOpen}
        onClose={() => setIsWorkoutModalOpen(false)}
      />
      
      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={handleProfileSave}
      />
      
      {/* Chat History Sidebar */}
      <ChatHistory
        sessions={chatHistory}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        language={language}
      />
      
      {/* Full Viewport Chat Interface with Split Layout */}
      <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-black via-[#1a1f2e] to-[#000000]">
        {/* Header - Compact */}
        <div className="bg-black/80 backdrop-blur-xl border-b border-[#4A70A9]/50 px-2 sm:px-3 md:px-4 py-2 shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 lg:gap-0 w-full px-2">
            <div className="flex items-center gap-2 sm:gap-3 animate-fade-in min-w-0">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-[#8FABD4] shadow-lg flex-shrink-0">
                {trainerConfig.image.startsWith('data:') || trainerConfig.image.startsWith('/') ? (
                  trainerConfig.image.startsWith('data:') ? (
                    <img
                      src={trainerConfig.image}
                      alt={trainerConfig.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={trainerConfig.image}
                      alt={trainerConfig.name}
                      fill
                      className="object-cover"
                    />
                  )
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#4A70A9] to-[#8FABD4] flex items-center justify-center text-base sm:text-lg">
                    {trainerConfig.avatar}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm sm:text-base md:text-lg font-bold bg-gradient-to-r from-[#8FABD4] to-[#4A70A9] bg-clip-text text-transparent truncate">
                  {trainerConfig.name}
                </h2>
                <p className="text-[#8FABD4] text-[10px] sm:text-xs truncate">{trainerConfig.description}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {/* Language Selector Dropdown */}
              <select
                value={language}
                onChange={(e) => {
                  const newLang = e.target.value as Language;
                  setLanguage(newLang);
                  // Also update the profile so language persists
                  const updatedProfile = { ...currentProfile, language: newLang };
                  setCurrentProfile(updatedProfile);
                  if (onProfileUpdate) {
                    onProfileUpdate(updatedProfile);
                  }
                }}
                className="px-2 py-1.5 bg-black/50 border border-[#4A70A9]/50 hover:border-[#8FABD4]/50 rounded-lg font-semibold text-xs text-[#EFECE3] transition-all duration-300 touch-manipulation cursor-pointer outline-none focus:ring-2 focus:ring-[#8FABD4]/50"
                title={t(language, 'preferredLanguage')}
              >
                {(Object.keys(LANGUAGE_CONFIG) as Language[]).map((lang) => (
                  <option key={lang} value={lang} className="bg-black text-[#EFECE3]">
                    {LANGUAGE_CONFIG[lang].flag} {LANGUAGE_CONFIG[lang].nativeName}
                  </option>
                ))}
              </select>
              {/* Chat History Button */}
              <button
                onClick={() => setIsHistoryOpen(true)}
                className="px-2 sm:px-3 py-1.5 bg-black/50 border border-[#4A70A9]/50 hover:border-[#8FABD4]/50 rounded-lg font-semibold text-xs transition-all duration-300 text-[#EFECE3] touch-manipulation active:scale-95 relative"
                title={t(language, 'chatHistory')}
              >
                <span className="hidden sm:inline">📜 {t(language, 'history')}</span>
                <span className="sm:hidden">📜</span>
                {chatHistory.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-[#4A70A9] to-[#8FABD4] rounded-full text-[10px] flex items-center justify-center text-[#EFECE3] font-bold">
                    {chatHistory.length > 9 ? '9+' : chatHistory.length}
                  </span>
                )}
              </button>
              {/* New Chat Button */}
              <button
                onClick={handleNewChat}
                className="px-2 sm:px-3 py-1.5 bg-gradient-to-r from-[#4A70A9]/50 to-[#8FABD4]/50 hover:from-[#4A70A9] hover:to-[#8FABD4] border border-[#4A70A9]/50 hover:border-[#8FABD4] rounded-lg font-semibold text-xs transition-all duration-300 text-[#EFECE3] touch-manipulation active:scale-95"
                title={t(language, 'newChat')}
              >
                <span className="hidden sm:inline">✨ {t(language, 'newShort')}</span>
                <span className="sm:hidden">✨</span>
              </button>
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="px-2 sm:px-3 py-1.5 bg-black/50 border border-[#4A70A9]/50 hover:border-[#8FABD4]/50 rounded-lg font-semibold text-xs transition-all duration-300 text-[#EFECE3] touch-manipulation active:scale-95"
                title={t(language, 'profile')}
              >
                <span className="hidden sm:inline">⚙️ {t(language, 'profile')}</span>
                <span className="sm:hidden">⚙️</span>
              </button>
              <button
                onClick={onReset}
                className="px-2 sm:px-3 py-1.5 bg-black/50 hover:bg-black border border-[#4A70A9]/50 hover:border-[#8FABD4] rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 active:scale-95 text-[#EFECE3] touch-manipulation"
              >
                <span className="hidden sm:inline">{t(language, 'changeTrainer')}</span>
                <span className="sm:hidden">{t(language, 'change')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Split Layout: 70% Chat + 30% Plans (Desktop) / Full Width (Mobile) */}
        <div className="flex-1 flex overflow-hidden pb-16 md:pb-0">
          {/* Left Side: Chat Area */}
          <div className={`flex-1 flex flex-col w-full md:w-[70%] ${mobileView !== 'chat' ? 'hidden md:flex' : 'flex'}`}>
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-2 sm:px-3 md:px-4 py-3">
              <div className="w-full max-w-4xl mx-auto space-y-3">
                {messages.map((message, idx) => {
                  // Skip the placeholder messages for cards - they're in the sidebar now
                  if (message.content === '__MEAL_CARDS__' || message.content === '__WORKOUT_CARDS__') {
                    return null;
                  }
            
                  return (
                    <div
                      key={idx}
                      className={`flex ${message.role === 'user' ? 'justify-end animate-slide-in-right' : 'justify-start animate-slide-in-left'}`}
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div
                        className={`max-w-[90%] sm:max-w-[85%] md:max-w-[80%] rounded-lg sm:rounded-xl p-3 sm:p-3.5 shadow-lg transition-all duration-300 hover:shadow-xl ${
                          message.role === 'user'
                            ? 'bg-gradient-to-br from-[#4A70A9] to-[#8FABD4] text-[#EFECE3]'
                            : 'bg-black/90 backdrop-blur-sm text-[#EFECE3] border border-[#4A70A9]/50'
                        }`}
                      >
                        {message.role === 'assistant' ? (
                          <div className="prose prose-invert max-w-none markdown-content">
                            <ReactMarkdown 
                              remarkPlugins={[remarkGfm]}
                              components={{
                                h1: ({node, ...props}) => <h1 {...props} />,
                                h2: ({node, ...props}) => <h2 {...props} />,
                                h3: ({node, ...props}) => <h3 {...props} />,
                                h4: ({node, ...props}) => <h4 {...props} />,
                                p: ({node, ...props}) => <p {...props} />,
                                ul: ({node, ...props}) => <ul {...props} />,
                                ol: ({node, ...props}) => <ol {...props} />,
                                li: ({node, ...props}) => <li {...props} />,
                                strong: ({node, ...props}) => <strong {...props} />,
                                em: ({node, ...props}) => <em {...props} />,
                                code: ({node, inline, ...props}: any) => 
                                  inline ? <code {...props} /> : <code {...props} />,
                                pre: ({node, ...props}) => <pre {...props} />,
                                table: ({node, ...props}) => <table {...props} />,
                                thead: ({node, ...props}) => <thead {...props} />,
                                tbody: ({node, ...props}) => <tbody {...props} />,
                                tr: ({node, ...props}) => <tr {...props} />,
                                th: ({node, ...props}) => <th {...props} />,
                                td: ({node, ...props}) => <td {...props} />,
                                blockquote: ({node, ...props}) => <blockquote {...props} />,
                                a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" />,
                                hr: ({node, ...props}) => <hr {...props} />,
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
            
                {/* Voice Recording UI */}
                {trainerConfig.voiceRecording && voiceRecordingStatus !== 'idle' && (
                  <div className="flex justify-start animate-slide-in-left">
                    <div className="bg-black/90 backdrop-blur-sm rounded-xl p-3 border border-[#4A70A9]/50 shadow-lg max-w-[80%]">
                      <div className="flex items-center gap-3">
                        {voiceRecordingStatus === 'generating' && (
                          <>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#4A70A9] to-[#8FABD4] flex items-center justify-center animate-pulse">
                              <span className="text-xl">🎤</span>
                            </div>
                            <div>
                              <p className="text-[#EFECE3] font-semibold text-sm">Recording voice...</p>
                              <p className="text-[#8FABD4] text-xs">Generating audio summary</p>
                            </div>
                          </>
                        )}
                        {voiceRecordingStatus === 'ready' && voiceAudioUrl && (
                          <>
                            <button
                              onClick={() => {
                                if (audioRef.current) {
                                  if (audioRef.current.paused) {
                                    audioRef.current.play();
                                  } else {
                                    audioRef.current.pause();
                                  }
                                } else {
                                  const audio = new Audio(voiceAudioUrl);
                                  audioRef.current = audio;
                                  audio.play();
                                  audio.onended = () => {
                                    audioRef.current = null;
                                  };
                                }
                              }}
                              className="w-10 h-10 rounded-full bg-gradient-to-r from-[#4A70A9] to-[#8FABD4] hover:from-[#8FABD4] hover:to-[#4A70A9] flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg shadow-[#8FABD4]/30"
                            >
                              <span className="text-xl">▶️</span>
                            </button>
                            <div>
                              <p className="text-[#EFECE3] font-semibold text-sm">Voice Summary</p>
                              <p className="text-[#8FABD4] text-xs">Click to play audio summary</p>
                            </div>
                          </>
                        )}
                        {voiceRecordingStatus === 'error' && (
                          <>
                            <div className="w-10 h-10 rounded-full bg-red-900/50 flex items-center justify-center">
                              <span className="text-xl">⚠️</span>
                            </div>
                            <div>
                              <p className="text-[#EFECE3] font-semibold text-sm">Voice generation failed</p>
                              <p className="text-[#8FABD4] text-xs">Text summary is still available above</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {(isLoading || generatingPlan) && (
                  <div className="flex justify-start animate-slide-in-left">
                    <div className="bg-black/90 backdrop-blur-sm rounded-xl p-3 border border-[#4A70A9]/50 shadow-lg">
                      <div className="flex gap-2">
                        <div className="w-2.5 h-2.5 bg-[#8FABD4] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2.5 h-2.5 bg-[#4A70A9] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2.5 h-2.5 bg-[#8FABD4] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="bg-black/80 backdrop-blur-xl border-t border-[#4A70A9]/50 px-2 sm:px-3 md:px-4 py-2 shadow-2xl">
              <div className="w-full max-w-4xl mx-auto flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Ask your trainer anything..."
                  disabled={isLoading}
                  className="flex-1 bg-black/50 border border-[#4A70A9]/50 rounded-lg px-3 sm:px-4 py-2.5 text-sm text-[#EFECE3] placeholder-[#8FABD4]/50 focus:ring-2 focus:ring-[#8FABD4]/50 focus:border-[#8FABD4]/50 outline-none transition-all duration-300 disabled:opacity-50 hover:border-[#8FABD4]"
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="px-5 sm:px-6 py-2.5 bg-gradient-to-r from-[#4A70A9] via-[#8FABD4] to-[#4A70A9] hover:from-[#8FABD4] hover:via-[#4A70A9] hover:to-[#8FABD4] disabled:from-black disabled:via-black disabled:to-black disabled:opacity-50 rounded-lg font-semibold text-sm text-[#EFECE3] transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-[#8FABD4]/50 disabled:scale-100 disabled:shadow-none touch-manipulation"
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: Plans Display (30%) - Always visible on desktop, controlled by mobileView on mobile */}
          <div 
            className={`
              ${(mobileView === 'workout' || mobileView === 'nutrition') ? 'flex' : 'hidden'} md:flex
              flex-col
              border-l border-[#4A70A9]/50 overflow-hidden bg-black/95 md:bg-black/40
              w-full md:w-[30%]
            `}
          >
            {/* Sidebar Header with Tabs - Desktop Only */}
            <div className="hidden md:flex bg-black/80 backdrop-blur-xl border-b border-[#4A70A9]/50 p-2 items-center gap-2">
              <button
                onClick={() => {
                  setActiveTab('nutrition');
                  setMobileView('nutrition'); // Keep in sync
                }}
                className={`flex-1 px-3 py-1.5 rounded-lg font-semibold text-xs transition-all duration-300 ${
                  activeTab === 'nutrition'
                    ? 'bg-gradient-to-r from-[#8FABD4] to-[#4A70A9] text-[#EFECE3]'
                    : 'text-[#8FABD4] hover:text-[#EFECE3] bg-black/50'
                }`}
              >
                🥗 Nutrition
              </button>
              <button
                onClick={() => {
                  setActiveTab('workout');
                  setMobileView('workout'); // Keep in sync
                }}
                className={`flex-1 px-3 py-1.5 rounded-lg font-semibold text-xs transition-all duration-300 ${
                  activeTab === 'workout'
                    ? 'bg-gradient-to-r from-[#4A70A9] to-[#8FABD4] text-[#EFECE3]'
                    : 'text-[#8FABD4] hover:text-[#EFECE3] bg-black/50'
                }`}
              >
                🏋️ Workout
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-3">
              {/* Nutrition Tab Content */}
              {(mobileView === 'nutrition' || activeTab === 'nutrition') && (
                <>
                  {nutritionData ? (
                    <div className="animate-slide-in-left">
                      <div className="bg-gradient-to-br from-[#4A70A9]/20 via-black/95 to-[#8FABD4]/20 backdrop-blur-sm rounded-xl p-3 border-2 border-[#8FABD4]/70 shadow-xl shadow-[#8FABD4]/30">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xl">🥗</span>
                          <h4 className="text-sm font-bold bg-gradient-to-r from-[#8FABD4] to-[#4A70A9] bg-clip-text text-transparent">Nutrition Plan</h4>
                        </div>
                        <div className="space-y-2">
                          {nutritionData.map((meal: MealCardData, mealIdx: number) => (
                            <div
                              key={mealIdx}
                              className="animate-slide-in-left"
                              style={{ animationDelay: `${mealIdx * 100}ms` }}
                            >
                              <MealCard
                                meal={meal}
                                onClick={() => {
                                  setSelectedMeal(meal);
                                  setIsMealModalOpen(true);
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6">
                      <div className="text-4xl mb-3">🥗</div>
                      <p className="text-[#8FABD4] text-sm mb-4">No nutrition plan yet</p>
                      <button
                        onClick={() => generatePlan('nutrition')}
                        disabled={generatingPlan !== null}
                        className="px-4 py-2 bg-gradient-to-r from-[#8FABD4] to-[#4A70A9] hover:from-[#4A70A9] hover:to-[#8FABD4] disabled:from-black disabled:to-black disabled:opacity-50 rounded-lg font-semibold text-xs transition-all duration-300 text-[#EFECE3]"
                      >
                        Generate Nutrition Plan
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* Workout Tab Content */}
              {(mobileView === 'workout' || activeTab === 'workout') && (
                <>
                  {workoutData ? (
                    <div className="animate-slide-in-left">
                      <div className="bg-gradient-to-br from-[#8FABD4]/20 via-black/95 to-[#4A70A9]/20 backdrop-blur-sm rounded-xl p-3 border-2 border-[#4A70A9]/70 shadow-xl shadow-[#4A70A9]/30">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xl">🏋️</span>
                          <h4 className="text-sm font-bold bg-gradient-to-r from-[#8FABD4] to-[#4A70A9] bg-clip-text text-transparent">Workout Plan</h4>
                        </div>
                        <div className="space-y-2">
                          {workoutData.map((workout: WorkoutCardType, workoutIdx: number) => (
                            <div
                              key={workoutIdx}
                              className="animate-slide-in-left"
                              style={{ animationDelay: `${workoutIdx * 100}ms` }}
                            >
                              <WorkoutCard
                                workout={workout}
                                onClick={() => {
                                  setSelectedWorkout(workout);
                                  setIsWorkoutModalOpen(true);
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6">
                      <div className="text-4xl mb-3">🏋️</div>
                      <p className="text-[#8FABD4] text-sm mb-4">No workout plan yet</p>
                      <button
                        onClick={() => generatePlan('workout')}
                        disabled={generatingPlan !== null}
                        className="px-4 py-2 bg-gradient-to-r from-[#4A70A9] to-[#8FABD4] hover:from-[#8FABD4] hover:to-[#4A70A9] disabled:from-black disabled:to-black disabled:opacity-50 rounded-lg font-semibold text-xs transition-all duration-300 text-[#EFECE3]"
                      >
                        Generate Workout Plan
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-[#4A70A9]/50 px-2 py-2 z-50">
          <div className="flex items-center justify-around gap-2">
            <button
              onClick={() => setMobileView('chat')}
              className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg transition-all duration-300 ${
                mobileView === 'chat'
                  ? 'bg-gradient-to-r from-[#4A70A9] to-[#8FABD4] text-[#EFECE3]'
                  : 'text-[#8FABD4] hover:text-[#EFECE3]'
              }`}
            >
              <span className="text-xl">💬</span>
              <span className="text-xs font-semibold">Chat</span>
            </button>
            <button
              onClick={() => {
                setMobileView('workout');
                setActiveTab('workout');
              }}
              className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg transition-all duration-300 ${
                mobileView === 'workout'
                  ? 'bg-gradient-to-r from-[#4A70A9] to-[#8FABD4] text-[#EFECE3]'
                  : 'text-[#8FABD4] hover:text-[#EFECE3]'
              }`}
            >
              <span className="text-xl">🏋️</span>
              <span className="text-xs font-semibold">Workout</span>
            </button>
            <button
              onClick={() => {
                setMobileView('nutrition');
                setActiveTab('nutrition');
              }}
              className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg transition-all duration-300 ${
                mobileView === 'nutrition'
                  ? 'bg-gradient-to-r from-[#4A70A9] to-[#8FABD4] text-[#EFECE3]'
                  : 'text-[#8FABD4] hover:text-[#EFECE3]'
              }`}
            >
              <span className="text-xl">🥗</span>
              <span className="text-xs font-semibold">Nutrition</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
