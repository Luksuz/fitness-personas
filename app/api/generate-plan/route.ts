import { NextRequest } from 'next/server';
import { ChatAnthropic } from '@langchain/anthropic';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import { getPersonaPrompt } from '@/lib/personas';
import { retrieveFoodsForProfile, calculateDailyCalories, calculateMacros } from '@/lib/rag';
import { TrainerPersona, UserProfile } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { userProfile, persona, planType, systemPrompt: providedSystemPrompt } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Anthropic API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const model = new ChatAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: 'claude-haiku-4-5',
      temperature: 0.7,
      maxTokens: 8000,
    });

    if (planType === 'workout') {
      return await generateWorkoutPlanStreaming(model, userProfile, persona, providedSystemPrompt);
    } else if (planType === 'nutrition') {
      return await generateNutritionPlanStreaming(model, userProfile, persona, providedSystemPrompt);
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid plan type' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error: any) {
    console.error('Generate Plan API Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate plan' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

async function generateWorkoutPlanStreaming(
  model: ChatAnthropic,
  userProfile: UserProfile,
  persona: TrainerPersona,
  providedSystemPrompt?: string,
) {
  // Use provided system prompt (for custom trainers) or get from personas
  const systemPrompt = providedSystemPrompt || getPersonaPrompt(persona);
  
  const isAdvancedStrength = userProfile.experienceLevel === 'advanced' && userProfile.focusArea === 'strength';
  
  let programGuidance = '';
  if (isAdvancedStrength) {
    programGuidance = `
IMPORTANT: This is an ADVANCED strength-focused athlete. Use a proven strength program structure:
- 5x5 (Starting Strength style): 5 sets of 5 reps for main lifts
- 5/3/1 (Wendler): Percentage-based with different rep schemes per week
- 3x5: Classic strength building
- Texas Method: Volume day, recovery day, intensity day
- Conjugate Method: Max effort and dynamic effort days

Use RPE (Rate of Perceived Exertion) scale for working sets:
- RPE 7-8 for volume work
- RPE 9-10 for intensity/max effort sets
- Always include RPE guidance for main compound lifts

Main lifts should be: Squat, Bench Press, Deadlift, Overhead Press
Include assistance work but keep it secondary to the main lifts.`;
  }
  
  const userPrompt = `Create a detailed workout plan for this user:

Profile:
- Height: ${userProfile.height}cm
- Weight: ${userProfile.weight}kg
- Age: ${userProfile.age}
- Gender: ${userProfile.gender}
- Goal: ${userProfile.goal}
- Activity Level: ${userProfile.activityLevel}
- Experience Level: ${userProfile.experienceLevel}
- Training Focus: ${userProfile.focusArea}
${userProfile.targetMuscles ? `- Target Muscles: ${userProfile.targetMuscles.join(', ')}` : ''}
${userProfile.healthIssues ? `- Health Issues: ${userProfile.healthIssues.join(', ')}` : ''}

${programGuidance}

CRITICAL: Return your response as a JSON object with this EXACT structure:
{
  "introMessage": "Your persona-based introduction message addressing their goals. Be motivational and stay in character. For example, if you're Goggins: 'Alright motherfucker, I'm gonna give you the exact plan to [their goal], and you better stick the fuck up to it!'",
  "cards": [
    {
      "day": "Day 1: Push",
      "focus": "Chest, Shoulders, Triceps",
      "warmup": "5 minutes dynamic stretching, arm circles...",
      "exercises": [
        {
          "name": "Bench Press",
          "sets": 5,
          "reps": "5",
          "rest": "3 min",
          "rpe": "RPE 8",
          "notes": "Keep elbows at 45 degrees, drive through heels"
        }
      ],
      "cooldown": "Light stretching for chest and shoulders...",
      "notes": "Focus on progressive overload each week"
    }
  ],
  "outroMessage": "Your persona-based closing message. Stay in character. For example: 'Here you go motherfucker, stay hard! Now get to work and stop being a little bitch.'"
}

${isAdvancedStrength ? 'IMPORTANT: If you include RPE in the workout, explain what RPE means and how to use it IN YOUR OUTRO MESSAGE in your persona style. Don\'t use technical language - explain it like you would naturally speak.' : ''}

Requirements:
1. Create 3-6 workout day cards depending on experience level and goals
2. Each card should be a complete training day with specific exercises
3. Include sets, reps, rest periods for each exercise
${isAdvancedStrength ? '4. Include RPE for main compound lifts and explain it in your outro' : ''}
4. Add warmup and cooldown recommendations
5. Include form tips and important notes
6. Stay completely in character for intro and outro messages
7. Use your authentic speaking style - if you're Goggins, use explicit language naturally

IMPORTANT: Return ONLY valid JSON, no other text. Do not wrap it in markdown code blocks.`;

  const messages = [
    new SystemMessage(systemPrompt),
    new HumanMessage(userPrompt),
  ];

  // Create streaming response
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        let fullContent = '';
        let introMessageSoFar = '';
        
        // Stream the LLM response character-by-character
        const streamResponse = await model.stream(messages);
        
        for await (const chunk of streamResponse) {
          if (chunk.content) {
            const content = chunk.content;
            fullContent += content;
            
            // Try to extract introMessage value from partial JSON
            // Look for "introMessage": "..." pattern (handles escaped quotes and newlines)
            const introMatch = fullContent.match(/"introMessage"\s*:\s*"((?:[^"\\]|\\.|\\n)*?)"/);
            if (introMatch && introMatch[1]) {
              // Decode JSON string escapes
              let currentIntro = introMatch[1]
                .replace(/\\"/g, '"')
                .replace(/\\n/g, '\n')
                .replace(/\\r/g, '\r')
                .replace(/\\t/g, '\t')
                .replace(/\\\\/g, '\\');
              
              // Only stream new content
              if (currentIntro.length > introMessageSoFar.length) {
                const newContent = currentIntro.slice(introMessageSoFar.length);
                introMessageSoFar = currentIntro;
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ type: 'chunk', content: newContent })}\n\n`)
                );
              }
            }
          }
        }
        
        // Clean up markdown code blocks if present
        fullContent = fullContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        
        // Parse the complete JSON
        const planData = JSON.parse(fullContent);
        
        // Signal that streaming is complete and we're parsing
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'parsing' })}\n\n`)
        );
        
        // Stream workout cards progressively
        if (planData.cards && Array.isArray(planData.cards)) {
          for (let i = 0; i < planData.cards.length; i++) {
            const workout = planData.cards[i];
            
            // Send workout header
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ 
                type: 'workout_header', 
                content: {
                  day: workout.day,
                  focus: workout.focus,
                  warmup: workout.warmup,
                  cooldown: workout.cooldown,
                  notes: workout.notes,
                  index: i
                }
              })}\n\n`)
            );
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Stream each exercise individually
            if (workout.exercises && Array.isArray(workout.exercises)) {
              for (let j = 0; j < workout.exercises.length; j++) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ 
                    type: 'workout_exercise', 
                    content: workout.exercises[j],
                    workoutIndex: i,
                    exerciseIndex: j
                  })}\n\n`)
                );
                await new Promise(resolve => setTimeout(resolve, 150));
              }
            }
            
            // Signal workout complete
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ 
                type: 'workout_complete', 
                content: { index: i }
              })}\n\n`)
            );
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
        
        // Stream outro message
        if (planData.outroMessage) {
          await new Promise(resolve => setTimeout(resolve, 300));
          // Stream outro character-by-character
          for (let i = 0; i < planData.outroMessage.length; i++) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'outro_chunk', content: planData.outroMessage[i] })}\n\n`)
            );
            await new Promise(resolve => setTimeout(resolve, 20));
          }
        }
        
        // Send completion event
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'done', planType: 'workout' })}\n\n`)
        );
        
        controller.close();
      } catch (error: any) {
        console.error('Streaming error:', error);
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'error', content: error.message })}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

async function generateNutritionPlanStreaming(
  model: ChatAnthropic,
  userProfile: UserProfile,
  persona: TrainerPersona,
  providedSystemPrompt?: string,
) {
  // First, retrieve relevant foods from Pinecone
  console.log('Retrieving foods for profile...');
  const foods = await retrieveFoodsForProfile(userProfile, 30);
  
  // Calculate nutritional targets
  const dailyCalories = calculateDailyCalories(userProfile);
  const macros = calculateMacros(dailyCalories, userProfile);
  
  console.log(`Targets: ${dailyCalories} cal, ${macros.protein}g protein, ${macros.carbs}g carbs, ${macros.fat}g fat`);
  
  // Use provided system prompt (for custom trainers) or get from personas
  const systemPrompt = providedSystemPrompt || getPersonaPrompt(persona);
  
  const foodsJson = JSON.stringify(foods.slice(0, 150), null, 2);
  
  const userPrompt = `Create a detailed nutrition and meal plan for this user:

Profile:
- Height: ${userProfile.height}cm
- Weight: ${userProfile.weight}kg
- Age: ${userProfile.age}
- Gender: ${userProfile.gender}
- Goal: ${userProfile.goal}
${userProfile.dietaryRestrictions ? `- Dietary Restrictions: ${userProfile.dietaryRestrictions.join(', ')}` : ''}
${userProfile.healthIssues ? `- Health Issues: ${userProfile.healthIssues.join(', ')}` : ''}

Nutritional Targets:
- Daily Calories: ${dailyCalories}
- Protein: ${macros.protein}g
- Carbs: ${macros.carbs}g
- Fat: ${macros.fat}g

Available Foods Database (use ONLY these foods):
${foodsJson}

CRITICAL: Return your response as a JSON object with this EXACT structure:
{
  "introMessage": "Your persona-based introduction message addressing their nutrition goals. Be motivational and stay in character. For example, if you're Goggins: 'Listen up motherfucker, here's the exact nutrition plan for [their goal]. This is war, and food is your ammunition. Don't fuck this up!'",
  "cards": [
    {
      "name": "Meal 1: Breakfast",
      "time": "7:00 AM",
      "foods": [
        {
          "fdcId": 171477,
          "description": "Chicken breast, grilled",
          "servingSize": 150,
          "calories": 165,
          "protein": 31,
          "carbs": 0,
          "fat": 3.6
        }
      ],
      "totalCalories": 500,
      "totalProtein": 40,
      "totalCarbs": 50,
      "totalFat": 15
    }
  ],
  "outroMessage": "Your persona-based closing message about sticking to the nutrition plan. Stay in character. For example: 'Here you go motherfucker, stay hard! Meal prep every Sunday like your life depends on it. No excuses.'"
}

Requirements:
1. Create 4-6 meal cards (breakfast, lunch, dinner, snacks)
2. Use ONLY foods from the provided database with their EXACT fdcId
3. Each food must have: fdcId, description, servingSize (in grams), calories, protein, carbs, fat
4. Calculate accurate totals for each meal
5. Distribute macros across meals to meet daily targets
6. Stay completely in character for intro and outro messages
7. Use your authentic speaking style - if you're Goggins, use explicit language naturally
8. Make the meals practical and realistic

IMPORTANT: Return ONLY valid JSON, no other text. Do not wrap it in markdown code blocks.`;

  const messages = [
    new SystemMessage(systemPrompt),
    new HumanMessage(userPrompt),
  ];

  // Create streaming response
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        let fullContent = '';
        let introMessageSoFar = '';
        
        // Stream the LLM response character-by-character
        const streamResponse = await model.stream(messages);
        
        for await (const chunk of streamResponse) {
          if (chunk.content) {
            const content = chunk.content;
            fullContent += content;
            
            // Try to extract introMessage value from partial JSON
            // Look for "introMessage": "..." pattern (handles escaped quotes and newlines)
            const introMatch = fullContent.match(/"introMessage"\s*:\s*"((?:[^"\\]|\\.|\\n)*?)"/);
            if (introMatch && introMatch[1]) {
              // Decode JSON string escapes
              let currentIntro = introMatch[1]
                .replace(/\\"/g, '"')
                .replace(/\\n/g, '\n')
                .replace(/\\r/g, '\r')
                .replace(/\\t/g, '\t')
                .replace(/\\\\/g, '\\');
              
              // Only stream new content
              if (currentIntro.length > introMessageSoFar.length) {
                const newContent = currentIntro.slice(introMessageSoFar.length);
                introMessageSoFar = currentIntro;
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ type: 'chunk', content: newContent })}\n\n`)
                );
              }
            }
          }
        }
        
        // Clean up markdown code blocks if present
        fullContent = fullContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        
        // Parse the complete JSON
        const planData = JSON.parse(fullContent);
        
        // Send targets first
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ 
            type: 'targets', 
            content: {
              calories: dailyCalories,
              macros
            }
          })}\n\n`)
        );
        
        // Signal that streaming is complete and we're parsing
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'parsing' })}\n\n`)
        );
        
        // Stream meal cards progressively
        if (planData.cards && Array.isArray(planData.cards)) {
          for (let i = 0; i < planData.cards.length; i++) {
            const meal = planData.cards[i];
            
            // Send meal header first
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ 
                type: 'meal_header', 
                content: {
                  name: meal.name,
                  time: meal.time,
                  index: i
                }
              })}\n\n`)
            );
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Stream each food item individually
            if (meal.foods && Array.isArray(meal.foods)) {
              for (let j = 0; j < meal.foods.length; j++) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ 
                    type: 'meal_food', 
                    content: meal.foods[j],
                    mealIndex: i,
                    foodIndex: j
                  })}\n\n`)
                );
                await new Promise(resolve => setTimeout(resolve, 150));
              }
            }
            
            // Send meal totals
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ 
                type: 'meal_complete', 
                content: {
                  index: i,
                  totalCalories: meal.totalCalories,
                  totalProtein: meal.totalProtein,
                  totalCarbs: meal.totalCarbs,
                  totalFat: meal.totalFat
                }
              })}\n\n`)
            );
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
        
        // Stream outro message character-by-character
        if (planData.outroMessage) {
          await new Promise(resolve => setTimeout(resolve, 300));
          for (let i = 0; i < planData.outroMessage.length; i++) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'outro_chunk', content: planData.outroMessage[i] })}\n\n`)
            );
            await new Promise(resolve => setTimeout(resolve, 20));
          }
        }
        
        // Send completion event
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'done', planType: 'nutrition' })}\n\n`)
        );
        
        controller.close();
      } catch (error: any) {
        console.error('Streaming error:', error);
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'error', content: error.message })}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
