/**
 * Parse nutrition plan from LLM response and extract food IDs
 */

interface ParsedFood {
  fdcId: number;
  description: string;
  servingSize: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface ParsedMeal {
  name: string;
  foods: ParsedFood[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

/**
 * Extract quotes and motivational text from nutrition plan
 * Removes meal details but keeps quotes, tips, and motivational content
 */
export function extractQuotesFromPlan(markdown: string): string {
  // Split by meal headers
  const mealPattern = /###\s+(Meal\s+\d+|Breakfast|Lunch|Dinner|Snack\s*\d*)[:\s]+/gi;
  const parts = markdown.split(mealPattern);
  
  // First part usually contains intro, quotes, tips
  let quotes = parts[0] || '';
  
  // Look for blockquotes
  const blockquotePattern = /(?:^|\n)>\s*(.+?)(?=\n|$)/gm;
  const blockquotes = markdown.match(blockquotePattern);
  if (blockquotes) {
    quotes += '\n\n' + blockquotes.join('\n');
  }
  
  // Look for sections before meals (tips, guidelines, etc.)
  const sectionsBeforeMeals = markdown.match(/##\s+([^\n]+)\n([^#]+?)(?=###|$)/g);
  if (sectionsBeforeMeals) {
    sectionsBeforeMeals.forEach(section => {
      // Skip if it's a meal section
      if (!section.match(/Meal\s+\d+|Breakfast|Lunch|Dinner|Snack/i)) {
        quotes += '\n\n' + section;
      }
    });
  }
  
  // Clean up: remove meal-specific content but keep general advice
  quotes = quotes
    .replace(/###\s+Meal\s+\d+[:\s]+[^\n]+[\s\S]*?(?=###|$)/gi, '')
    .replace(/###\s+(Breakfast|Lunch|Dinner|Snack)[:\s]+[^\n]+[\s\S]*?(?=###|$)/gi, '')
    .replace(/fdcId[:\s]+\d+/gi, '')
    .replace(/\*\*[^*]+\*\*\s*-\s*\d+g\s*\(fdcId[^)]+\)/gi, '')
    .trim();
  
  return quotes || 'Here\'s your personalized nutrition plan!';
}

/**
 * Extract FDC IDs from markdown text
 * Looks for patterns like: fdcId: 123456 or (FDC: 123456)
 */
export function extractFdcIds(text: string): number[] {
  const patterns = [
    /fdcId[:\s]+(\d+)/gi,
    /\(FDC[:\s]+(\d+)\)/gi,
    /FDC[:\s]+(\d+)/gi,
    /fdc_(\d+)/gi,
  ];

  const ids = new Set<number>();

  patterns.forEach(pattern => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      const id = parseInt(match[1]);
      if (id) ids.add(id);
    }
  });

  return Array.from(ids);
}

/**
 * Parse meal structure from markdown
 * Looks for meal headers and associated food items
 */
export function parseMealsFromMarkdown(markdown: string): { name: string; fdcIds: number[] }[] {
  const meals: { name: string; fdcIds: number[] }[] = [];
  
  // Split by meal headers (### Meal X: or ### Breakfast, etc.)
  const mealPattern = /###\s+(Meal\s+\d+|Breakfast|Lunch|Dinner|Snack\s*\d*)[:\s]+([^\n]+)/gi;
  const matches = markdown.matchAll(mealPattern);
  
  let lastIndex = 0;
  const mealSections: { name: string; text: string }[] = [];
  
  for (const match of matches) {
    if (lastIndex > 0) {
      const sectionText = markdown.substring(lastIndex, match.index);
      mealSections[mealSections.length - 1].text = sectionText;
    }
    
    mealSections.push({
      name: `${match[1]}: ${match[2]}`,
      text: '',
    });
    
    lastIndex = match.index! + match[0].length;
  }
  
  if (mealSections.length > 0 && lastIndex > 0) {
    mealSections[mealSections.length - 1].text = markdown.substring(lastIndex);
  }
  
  // Extract FDC IDs from each meal section
  mealSections.forEach(section => {
    const fdcIds = extractFdcIds(section.text);
    if (fdcIds.length > 0) {
      meals.push({
        name: section.name,
        fdcIds,
      });
    }
  });
  
  return meals;
}

/**
 * Fetch food details from API and calculate nutritional values
 */
export async function calculateMealNutrition(
  fdcIds: number[],
  servingSizes: Record<number, number> = {}
): Promise<ParsedFood[]> {
  try {
    // Call API route to fetch food data
    const response = await fetch('/api/nutrition/fetch-foods', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fdcIds }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch foods: ${response.statusText}`);
    }

    const data = await response.json();
    const foods: ParsedFood[] = [];

    // Process each food and apply serving size multiplier
    for (const foodData of data.foods) {
      const servingSize = servingSizes[foodData.fdcId] || foodData.servingSize || 100;
      const multiplier = servingSize / 100; // Normalize to per 100g

      foods.push({
        fdcId: foodData.fdcId,
        description: foodData.description,
        servingSize,
        calories: foodData.calories * multiplier,
        protein: foodData.protein * multiplier,
        carbs: foodData.carbs * multiplier,
        fat: foodData.fat * multiplier,
      });
    }

    return foods;
  } catch (error) {
    console.error('Error calculating meal nutrition:', error);
    return [];
  }
}

/**
 * Parse complete nutrition plan and calculate all meal totals
 */
export async function parseNutritionPlan(markdown: string): Promise<ParsedMeal[]> {
  const mealStructures = parseMealsFromMarkdown(markdown);
  const parsedMeals: ParsedMeal[] = [];
  
  for (const mealStructure of mealStructures) {
    const foods = await calculateMealNutrition(mealStructure.fdcIds);
    
    const totalCalories = foods.reduce((sum, f) => sum + f.calories, 0);
    const totalProtein = foods.reduce((sum, f) => sum + f.protein, 0);
    const totalCarbs = foods.reduce((sum, f) => sum + f.carbs, 0);
    const totalFat = foods.reduce((sum, f) => sum + f.fat, 0);
    
    parsedMeals.push({
      name: mealStructure.name,
      foods,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
    });
  }
  
  return parsedMeals;
}

/**
 * Extract serving size from text near fdcId
 * Looks for patterns like: "150g" or "1 cup (240g)"
 */
export function extractServingSizes(text: string, fdcIds: number[]): Record<number, number> {
  const servingSizes: Record<number, number> = {};
  
  fdcIds.forEach(fdcId => {
    // Find text around this FDC ID
    const fdcPattern = new RegExp(`fdcId[:\\s]+${fdcId}[^\\n]*`, 'i');
    const match = text.match(fdcPattern);
    
    if (match) {
      const line = match[0];
      // Look for serving size pattern: number followed by 'g' or 'ml'
      const sizePattern = /(\d+(?:\.\d+)?)\s*(g|ml)/i;
      const sizeMatch = line.match(sizePattern);
      
      if (sizeMatch) {
        servingSizes[fdcId] = parseFloat(sizeMatch[1]);
      }
    }
  });
  
  return servingSizes;
}
