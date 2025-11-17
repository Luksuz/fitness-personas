import { NextRequest, NextResponse } from 'next/server';
import { parseNutritionPlan } from '@/lib/nutrition-parser';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { markdown } = await req.json();

    if (!markdown) {
      return NextResponse.json(
        { error: 'Markdown content required' },
        { status: 400 }
      );
    }

    const parsedMeals = await parseNutritionPlan(markdown);

    return NextResponse.json({
      meals: parsedMeals,
      success: true,
    });
  } catch (error: any) {
    console.error('Nutrition calculation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to calculate nutrition' },
      { status: 500 }
    );
  }
}


