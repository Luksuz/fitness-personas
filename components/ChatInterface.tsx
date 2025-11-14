'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TrainerPersona, UserProfile, Message, WorkoutCard as WorkoutCardType, MealCardData } from '@/lib/types';
import { TRAINER_PERSONAS } from '@/lib/personas';
import NutritionSummary from './NutritionSummary';
import MealCard from './MealCard';
import MealModal from './MealModal';
import WorkoutCard from './WorkoutCard';
import WorkoutModal from './WorkoutModal';

interface ChatInterfaceProps {
  trainer: TrainerPersona;
  userProfile: UserProfile;
  onReset: () => void;
}

export default function ChatInterface({ trainer, userProfile, onReset }: ChatInterfaceProps) {
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasGeneratedGreeting = useRef(false);

  const trainerConfig = TRAINER_PERSONAS[trainer];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Generate initial greeting message
  useEffect(() => {
    // Prevent duplicate greetings (React Strict Mode runs effects twice)
    if (hasGeneratedGreeting.current) return;
    hasGeneratedGreeting.current = true;

    const generateGreeting = async () => {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{
              role: 'user',
              content: `Greet me and introduce yourself based on my profile. Let me know you can help with workout and nutrition plans.`,
            }],
            persona: trainer,
            userProfile,
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
        let greetingContent = '';

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
                  greetingContent += data.content;
                  // Update the message with accumulated content
                  setMessages([{
                    role: 'assistant' as const,
                    content: greetingContent,
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
        setMessages([{
          role: 'assistant' as const,
          content: 'Hey! Ready to get started? Click the buttons above to generate your workout or nutrition plan!',
        }]);
      }
    };

    generateGreeting();
  }, [trainer, userProfile]);

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
          userProfile,
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
          userProfile,
          persona: trainer,
          planType,
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
      
      {/* Nutrition Summary Panel */}
      {nutritionData && dailyTargets && (
        <NutritionSummary
          meals={nutritionData}
          dailyTargets={{
            calories: dailyTargets.calories,
            protein: dailyTargets.macros.protein,
            carbs: dailyTargets.macros.carbs,
            fat: dailyTargets.macros.fat,
          }}
        />
      )}
      
      {/* Full Viewport Chat Interface */}
      <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-black via-[#1a1f2e] to-[#000000]">
        {/* Header */}
        <div className="bg-black/80 backdrop-blur-xl border-b border-[#4A70A9]/50 px-6 py-4 shadow-lg">
          <div className="flex items-center justify-between w-[70%] mx-auto">
            <div className="flex items-center gap-4 animate-fade-in">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#8FABD4] shadow-lg">
                <Image
                  src={trainerConfig.image}
                  alt={trainerConfig.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#8FABD4] to-[#4A70A9] bg-clip-text text-transparent">
                  {trainerConfig.name}
                </h2>
                <p className="text-[#8FABD4] text-sm">{trainerConfig.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => generatePlan('workout')}
                disabled={generatingPlan !== null}
                className="px-5 py-2.5 bg-gradient-to-r from-[#4A70A9] to-[#8FABD4] hover:from-[#8FABD4] hover:to-[#4A70A9] disabled:from-black disabled:to-black disabled:opacity-50 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#8FABD4]/50 disabled:scale-100 disabled:shadow-none text-[#EFECE3]"
              >
                {generatingPlan === 'workout' ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⚙️</span> Generating...
                  </span>
                ) : (
                  '🏋️ Workout Plan'
                )}
              </button>
              <button
                onClick={() => generatePlan('nutrition')}
                disabled={generatingPlan !== null}
                className="px-5 py-2.5 bg-gradient-to-r from-[#8FABD4] to-[#4A70A9] hover:from-[#4A70A9] hover:to-[#8FABD4] disabled:from-black disabled:to-black disabled:opacity-50 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#8FABD4]/50 disabled:scale-100 disabled:shadow-none text-[#EFECE3]"
              >
                {generatingPlan === 'nutrition' ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⚙️</span> Generating...
                  </span>
                ) : (
                  '🥗 Nutrition Plan'
                )}
              </button>
              <button
                onClick={onReset}
                className="px-4 py-2.5 bg-black/50 hover:bg-black border border-[#4A70A9]/50 hover:border-[#8FABD4] rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 text-[#EFECE3]"
              >
                Change Trainer
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area - Full Height */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="w-[70%] mx-auto space-y-6">
          {messages.map((message, idx) => {
            // Special handling for meal cards
            if (message.content === '__MEAL_CARDS__' && nutritionData) {
              return (
                <div 
                  key={idx} 
                  className="flex justify-start animate-slide-in-left"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="max-w-[80%] w-full">
                    <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-5 border border-[#4A70A9]/50">
                      <h4 className="font-semibold mb-4 bg-gradient-to-r from-[#8FABD4] to-[#4A70A9] bg-clip-text text-transparent">Your Meals</h4>
                      <div className="space-y-3">
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
                </div>
              );
            }
            
            // Special handling for workout cards
            if (message.content === '__WORKOUT_CARDS__' && workoutData) {
              return (
                <div 
                  key={idx} 
                  className="flex justify-start animate-slide-in-left"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="max-w-[80%] w-full">
                    <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-5 border border-[#4A70A9]/50">
                      <h4 className="font-semibold mb-4 bg-gradient-to-r from-[#8FABD4] to-[#4A70A9] bg-clip-text text-transparent">Your Workout Plan</h4>
                      <div className="space-y-3">
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
                </div>
              );
            }
            
            return (
                <div
                  key={idx}
                  className={`flex ${message.role === 'user' ? 'justify-end animate-slide-in-right' : 'justify-start animate-slide-in-left'}`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-5 shadow-lg transition-all duration-300 hover:shadow-xl ${
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
            
            {(isLoading || generatingPlan) && (
              <div className="flex justify-start animate-slide-in-left">
                <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-5 border border-[#4A70A9]/50 shadow-lg">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-[#8FABD4] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-3 h-3 bg-[#4A70A9] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-3 h-3 bg-[#8FABD4] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-black/80 backdrop-blur-xl border-t border-[#4A70A9]/50 px-4 py-5 shadow-2xl">
          <div className="w-[70%] mx-auto flex gap-4">
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
              className="flex-1 bg-black/50 border border-[#4A70A9]/50 rounded-xl px-5 py-4 text-[#EFECE3] placeholder-[#8FABD4]/50 focus:ring-2 focus:ring-[#8FABD4]/50 focus:border-[#8FABD4]/50 outline-none transition-all duration-300 disabled:opacity-50 hover:border-[#8FABD4]"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="px-8 py-4 bg-gradient-to-r from-[#4A70A9] via-[#8FABD4] to-[#4A70A9] hover:from-[#8FABD4] hover:via-[#4A70A9] hover:to-[#8FABD4] disabled:from-black disabled:via-black disabled:to-black disabled:opacity-50 rounded-xl font-semibold text-[#EFECE3] transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#8FABD4]/50 disabled:scale-100 disabled:shadow-none"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
