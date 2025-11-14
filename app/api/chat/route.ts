import { NextRequest } from 'next/server';
import { ChatAnthropic } from '@langchain/anthropic';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { getPersonaPrompt } from '@/lib/personas';
import { TrainerPersona } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { messages, persona, userProfile } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Anthropic API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const model = new ChatAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: 'claude-haiku-4-5',
      temperature: 0.8,
      maxTokens: 4000,
    });

    // Build the message history
    const systemPrompt = getPersonaPrompt(persona as TrainerPersona);
    
    let fullSystemPrompt = systemPrompt;
    
    // Add user profile context if available
    if (userProfile) {
      fullSystemPrompt += `\n\nUser Profile:
- Height: ${userProfile.height}cm
- Weight: ${userProfile.weight}kg
- Age: ${userProfile.age}
- Gender: ${userProfile.gender}
- Goal: ${userProfile.goal}
- Activity Level: ${userProfile.activityLevel}
- Experience Level: ${userProfile.experienceLevel}
- Training Focus: ${userProfile.focusArea || 'general'}
${userProfile.dietaryRestrictions ? `- Dietary Restrictions: ${userProfile.dietaryRestrictions.join(', ')}` : ''}
${userProfile.healthIssues ? `- Health Issues: ${userProfile.healthIssues.join(', ')}` : ''}
${userProfile.targetMuscles ? `- Target Muscles: ${userProfile.targetMuscles.join(', ')}` : ''}

Use this information to personalize your advice and recommendations.
${userProfile.experienceLevel === 'advanced' && userProfile.focusArea === 'strength' ? '\nNote: This user is advanced and strength-focused. Use technical terminology and advanced concepts when appropriate. Mention RPE if discussing training intensity.' : ''}`;
    }

    const chatMessages = [
      new SystemMessage(fullSystemPrompt),
      ...messages.map((msg: any) => {
        if (msg.role === 'user') {
          return new HumanMessage(msg.content);
        } else {
          return new AIMessage(msg.content);
        }
      }),
    ];

    // Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let fullContent = '';
          
          // Stream the LLM response
          const streamResponse = await model.stream(chatMessages);
          
          for await (const chunk of streamResponse) {
            if (chunk.content) {
              const content = chunk.content;
              fullContent += content;
              
              // Send each chunk as it arrives
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'chunk', content })}\n\n`)
              );
            }
          }
          
          // Send completion event
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`)
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
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to process chat' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
