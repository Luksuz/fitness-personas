import { queryFoods } from './pinecone-setup';
import { UserProfile, FoodItem } from './types';

/**
 * Generate search queries based on user profile and dietary preferences
 */
export function generateFoodSearchQueries(profile: UserProfile): string[] {
  const queries: string[] = [];
  
  // Base query based on goal
  if (profile.goal === 'deficit') {
    queries.push('low calorie high protein filling foods');
    queries.push('low fat high fiber vegetables');
  } else if (profile.goal === 'bulking') {
    queries.push('high calorie high protein foods');
    queries.push('complex carbohydrates energy foods');
  } else {
    queries.push('balanced nutritious whole foods');
  }
  
  // Add queries based on dietary restrictions
  if (profile.dietaryRestrictions) {
    profile.dietaryRestrictions.forEach(restriction => {
      const restrictionLower = restriction.toLowerCase();
      
      if (restrictionLower.includes('vegan')) {
        queries.push('vegan plant-based protein sources');
        queries.push('vegan whole foods legumes nuts seeds');
      } else if (restrictionLower.includes('vegetarian')) {
        queries.push('vegetarian protein sources eggs dairy');
      } else if (restrictionLower.includes('keto') || restrictionLower.includes('low carb')) {
        queries.push('low carb high fat keto foods');
        queries.push('fatty fish avocado nuts low carb vegetables');
      } else if (restrictionLower.includes('paleo')) {
        queries.push('paleo meat fish vegetables nuts');
      } else if (restrictionLower.includes('gluten')) {
        queries.push('gluten free grains alternatives');
      } else if (restrictionLower.includes('dairy')) {
        queries.push('dairy free alternatives calcium sources');
      }
    });
  }
  
  // Add protein source query
  queries.push('lean protein chicken fish turkey eggs');
  
  // Add healthy fats query
  queries.push('healthy fats avocado nuts olive oil');
  
  // Limit to 5 unique queries
  return [...new Set(queries)].slice(0, 5);
}

/**
 * Retrieve diverse food options based on user profile
 */
export async function retrieveFoodsForProfile(
  profile: UserProfile,
  itemsPerQuery: number = 30
): Promise<any[]> {
  const queries = generateFoodSearchQueries(profile);
  
  console.log('Generated search queries:', queries);
  
  const allFoods: any[] = [];
  
  // Execute all queries in parallel
  const results = await Promise.all(
    queries.map(query => queryFoods(query, itemsPerQuery))
  );
  
  // Combine and deduplicate results
  const foodMap = new Map();
  
  results.forEach(queryResults => {
    queryResults.forEach(result => {
      if (result.metadata && !foodMap.has(result.id)) {
        foodMap.set(result.id, {
          id: result.id,
          score: result.score,
          ...result.metadata,
        });
      }
    });
  });
  
  const foods = Array.from(foodMap.values());
  
  // Filter based on dietary restrictions
  let filteredFoods = foods;
  
  if (profile.dietaryRestrictions) {
    filteredFoods = foods.filter(food => {
      const searchText = (food.searchText || '').toLowerCase();
      const ingredients = (food.ingredients || '').toLowerCase();
      const description = (food.description || '').toLowerCase();
      const combinedText = `${searchText} ${ingredients} ${description}`;
      
      return profile.dietaryRestrictions!.every(restriction => {
        const restrictionLower = restriction.toLowerCase();
        
        if (restrictionLower.includes('vegan')) {
          // Exclude animal products
          const animalProducts = ['meat', 'chicken', 'beef', 'pork', 'fish', 'egg', 'dairy', 'milk', 'cheese', 'yogurt', 'whey'];
          return !animalProducts.some(product => combinedText.includes(product));
        } else if (restrictionLower.includes('vegetarian')) {
          // Exclude meat but allow dairy and eggs
          const meatProducts = ['meat', 'chicken', 'beef', 'pork', 'fish', 'turkey', 'lamb'];
          return !meatProducts.some(product => combinedText.includes(product));
        } else if (restrictionLower.includes('gluten')) {
          const glutenProducts = ['wheat', 'barley', 'rye', 'bread', 'pasta'];
          return !glutenProducts.some(product => combinedText.includes(product));
        } else if (restrictionLower.includes('dairy')) {
          const dairyProducts = ['milk', 'cheese', 'yogurt', 'cream', 'butter'];
          return !dairyProducts.some(product => combinedText.includes(product));
        }
        
        return true;
      });
    });
  }
  
  console.log(`Retrieved ${filteredFoods.length} foods after filtering`);
  
  return filteredFoods;
}

/**
 * Calculate recommended daily calorie intake
 */
export function calculateDailyCalories(profile: UserProfile): number {
  // Mifflin-St Jeor Equation
  let bmr: number;
  
  if (profile.gender === 'male') {
    bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
  } else {
    bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
  }
  
  // Activity multiplier
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  
  const tdee = bmr * activityMultipliers[profile.activityLevel];
  
  // Adjust based on goal
  if (profile.goal === 'deficit') {
    // 500 calorie deficit for 0.5kg per week loss
    return Math.round(tdee - 500);
  } else if (profile.goal === 'bulking') {
    // 300-500 calorie surplus for controlled bulking
    const surplus = profile.targetWeightChange ? profile.targetWeightChange * 1000 : 300;
    return Math.round(tdee + Math.min(surplus, 500));
  }
  
  return Math.round(tdee);
}

/**
 * Calculate recommended macronutrient distribution
 */
export function calculateMacros(
  calories: number,
  profile: UserProfile
): { protein: number; carbs: number; fat: number } {
  // Protein: 2g per kg body weight for muscle building/maintenance
  const proteinGrams = Math.round(profile.weight * 2);
  const proteinCalories = proteinGrams * 4;
  
  // Fat: 25-30% of total calories
  const fatPercentage = profile.goal === 'deficit' ? 0.25 : 0.3;
  const fatCalories = Math.round(calories * fatPercentage);
  const fatGrams = Math.round(fatCalories / 9);
  
  // Carbs: remaining calories
  const carbCalories = calories - proteinCalories - fatCalories;
  const carbGrams = Math.round(carbCalories / 4);
  
  return {
    protein: proteinGrams,
    carbs: Math.max(carbGrams, 0),
    fat: fatGrams,
  };
}


