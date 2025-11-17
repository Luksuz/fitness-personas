import { NextRequest, NextResponse } from 'next/server';
import { queryFoods } from '@/lib/pinecone-setup';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { fdcIds } = await req.json();

    if (!fdcIds || !Array.isArray(fdcIds)) {
      return NextResponse.json(
        { error: 'fdcIds array required' },
        { status: 400 }
      );
    }

    const foods = [];

    // Query each food by ID
    for (const fdcId of fdcIds) {
      try {
        // Query Pinecone for this specific food
        const results = await queryFoods(`fdc_${fdcId}`, 1, {
          fdcId: { $eq: fdcId }
        });
        
        if (results.length > 0 && results[0].metadata) {
          const metadata = results[0].metadata as any;
          
          foods.push({
            fdcId,
            description: metadata.description || 'Unknown food',
            servingSize: metadata.servingSize || 100,
            calories: metadata.calories || 0,
            protein: metadata.protein || 0,
            carbs: metadata.carbs || 0,
            fat: metadata.fat || 0,
          });
        }
      } catch (error) {
        console.error(`Error fetching food ${fdcId}:`, error);
      }
    }

    return NextResponse.json({
      foods,
      success: true,
    });
  } catch (error: any) {
    console.error('Food fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch foods' },
      { status: 500 }
    );
  }
}


