/**
 * Script to process raw food data and prepare it for Pinecone vector database
 * This reads all JSON files from data/raw_details and creates embeddings
 */

import * as fs from 'fs';
import * as path from 'path';
import { FoodItem } from '../lib/types';

const RAW_DETAILS_DIR = path.join(process.cwd(), '..', 'data', 'raw_details');
const OUTPUT_FILE = path.join(process.cwd(), 'data', 'processed-foods.json');

interface ProcessedFood {
  id: string;
  fdcId: number;
  description: string;
  category: string;
  dataType: string;
  searchText: string; // Combined text for embedding
  nutrients: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
    cholesterol?: number;
    saturatedFat?: number;
    [key: string]: number | undefined;
  };
  servingSize?: number;
  servingSizeUnit?: string;
  ingredients?: string;
  brandName?: string;
}

function getNutrientValue(nutrients: any[], nutrientName: string): number | undefined {
  const nutrient = nutrients.find((n: any) => 
    n.nutrientName?.toLowerCase().includes(nutrientName.toLowerCase()) ||
    n.nutrient?.name?.toLowerCase().includes(nutrientName.toLowerCase())
  );
  return nutrient?.value || nutrient?.amount;
}

function processFood(foodData: any): ProcessedFood {
  const nutrients = foodData.foodNutrients || [];
  
  // Extract key nutrients
  const processedNutrients = {
    calories: getNutrientValue(nutrients, 'energy'),
    protein: getNutrientValue(nutrients, 'protein'),
    carbs: getNutrientValue(nutrients, 'carbohydrate'),
    fat: getNutrientValue(nutrients, 'total lipid'),
    fiber: getNutrientValue(nutrients, 'fiber'),
    sugar: getNutrientValue(nutrients, 'total sugars'),
    sodium: getNutrientValue(nutrients, 'sodium'),
    cholesterol: getNutrientValue(nutrients, 'cholesterol'),
    saturatedFat: getNutrientValue(nutrients, 'fatty acids, total saturated'),
  };

  // Create search text for embedding
  const searchParts = [
    foodData.description,
    foodData.foodCategory || foodData.brandedFoodCategory || '',
    foodData.brandName || '',
    foodData.ingredients || '',
    foodData.commonNames || '',
    foodData.additionalDescriptions || '',
  ];

  // Add nutritional characteristics to search text
  if (processedNutrients.protein && processedNutrients.protein > 20) {
    searchParts.push('high protein');
  }
  if (processedNutrients.fat && processedNutrients.fat < 5) {
    searchParts.push('low fat');
  }
  if (processedNutrients.carbs && processedNutrients.carbs < 10) {
    searchParts.push('low carb');
  }
  if (processedNutrients.fiber && processedNutrients.fiber > 5) {
    searchParts.push('high fiber');
  }

  const searchText = searchParts.filter(Boolean).join(' ').toLowerCase();

  return {
    id: `fdc_${foodData.fdcId}`,
    fdcId: foodData.fdcId,
    description: foodData.description || 'Unknown',
    category: foodData.foodCategory || foodData.brandedFoodCategory || 'Uncategorized',
    dataType: foodData.dataType || 'Unknown',
    searchText,
    nutrients: processedNutrients,
    servingSize: foodData.servingSize,
    servingSizeUnit: foodData.servingSizeUnit,
    ingredients: foodData.ingredients,
    brandName: foodData.brandName,
  };
}

async function main() {
  console.log('Starting food data processing...');
  console.log(`Reading from: ${RAW_DETAILS_DIR}`);

  const files = fs.readdirSync(RAW_DETAILS_DIR).filter(f => f.endsWith('.json'));
  console.log(`Found ${files.length} JSON files`);

  const processedFoods: ProcessedFood[] = [];
  let errorCount = 0;

  for (const file of files) {
    try {
      const filePath = path.join(RAW_DETAILS_DIR, file);
      const rawData = fs.readFileSync(filePath, 'utf-8');
      const foodData = JSON.parse(rawData);
      
      const processed = processFood(foodData);
      
      // Only include foods with at least calorie information
      if (processed.nutrients.calories) {
        processedFoods.push(processed);
      }
    } catch (error) {
      errorCount++;
      if (errorCount <= 10) {
        console.error(`Error processing ${file}:`, error);
      }
    }
  }

  console.log(`\nProcessed ${processedFoods.length} foods successfully`);
  console.log(`Errors: ${errorCount}`);

  // Create output directory if it doesn't exist
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write processed data
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(processedFoods, null, 2));
  console.log(`\nProcessed data saved to: ${OUTPUT_FILE}`);

  // Print some statistics
  const stats = {
    totalFoods: processedFoods.length,
    byDataType: {} as Record<string, number>,
    avgCalories: 0,
    avgProtein: 0,
  };

  processedFoods.forEach(food => {
    stats.byDataType[food.dataType] = (stats.byDataType[food.dataType] || 0) + 1;
    stats.avgCalories += food.nutrients.calories || 0;
    stats.avgProtein += food.nutrients.protein || 0;
  });

  stats.avgCalories /= processedFoods.length;
  stats.avgProtein /= processedFoods.length;

  console.log('\nStatistics:');
  console.log(JSON.stringify(stats, null, 2));
}

main().catch(console.error);

