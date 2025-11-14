/**
 * Script to ingest food data from raw_details into Pinecone
 * Handles both SR Legacy and Branded food formats
 * Run with: npm run ingest-pinecone
 */

import * as fs from 'fs';
import * as path from 'path';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const RAW_DETAILS_DIR = path.join(process.cwd(), '..', 'data', 'raw_details');
const BATCH_SIZE = 100;
const EMBEDDING_MODEL = 'text-embedding-3-small';
const EMBEDDING_DIMENSION = 1536;

interface FoodData {
  fdcId: number;
  description: string;
  dataType: string;
  foodCategory?: string;
  brandedFoodCategory?: string;
  brandName?: string;
  brandOwner?: string;
  ingredients?: string;
  foodNutrients: any[];
  servingSize?: number;
  servingSizeUnit?: string;
  packageWeight?: string;
  householdServingFullText?: string;
}

interface ProcessedFood {
  id: string;
  embedding: number[];
  metadata: {
    fdcId: number;
    description: string;
    dataType: string;
    category: string;
    brandName?: string;
    brandOwner?: string;
    ingredients?: string;
    
    // Nutritional info
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
    cholesterol?: number;
    saturatedFat?: number;
    
    // Serving info
    servingSize?: number;
    servingSizeUnit?: string;
    packageWeight?: string;
    householdServing?: string;
    
    // Search text (for reference)
    searchText: string;
  };
}

/**
 * Extract nutrient value from food nutrients array
 */
function getNutrientValue(nutrients: any[] | undefined, nutrientName: string): number | undefined {
  // Handle missing or invalid nutrients array
  if (!nutrients || !Array.isArray(nutrients) || nutrients.length === 0) {
    return undefined;
  }
  
  const nutrient = nutrients.find((n: any) => {
    const name = n.nutrient?.name || n.nutrientName || '';
    return name.toLowerCase().includes(nutrientName.toLowerCase());
  });
  
  return nutrient?.amount || nutrient?.value;
}

/**
 * Build semantic search text from food data
 */
function buildSearchText(food: FoodData): string {
  const parts: string[] = [];
  
  // Core identification
  parts.push(food.description || '');
  
  // Category
  const category = food.foodCategory || food.brandedFoodCategory || '';
  if (category) parts.push(category);
  
  // Brand info
  if (food.brandName) parts.push(food.brandName);
  if (food.brandOwner) parts.push(food.brandOwner);
  
  // Ingredients (important for dietary restrictions)
  if (food.ingredients) {
    parts.push(food.ingredients);
  }
  
  // Data type context
  parts.push(food.dataType || '');
  
  // Add nutritional characteristics for better semantic search (if nutrients exist)
  if (food.foodNutrients && Array.isArray(food.foodNutrients)) {
    const calories = getNutrientValue(food.foodNutrients, 'energy');
    const protein = getNutrientValue(food.foodNutrients, 'protein');
    const carbs = getNutrientValue(food.foodNutrients, 'carbohydrate');
    const fat = getNutrientValue(food.foodNutrients, 'total lipid');
    const fiber = getNutrientValue(food.foodNutrients, 'fiber');
  
    // Add descriptive tags based on nutritional profile
    if (protein && protein > 20) parts.push('high protein');
    if (fat && fat < 3) parts.push('low fat');
    if (carbs && carbs < 10) parts.push('low carb');
    if (fiber && fiber > 5) parts.push('high fiber');
    if (calories && calories < 100) parts.push('low calorie');
  }
  
  // Check for common dietary categories in ingredients
  const ingredientsLower = (food.ingredients || '').toLowerCase();
  if (!ingredientsLower.includes('meat') && 
      !ingredientsLower.includes('chicken') && 
      !ingredientsLower.includes('beef') &&
      !ingredientsLower.includes('fish') &&
      !ingredientsLower.includes('dairy') &&
      !ingredientsLower.includes('egg')) {
    const desc = (food.description || '').toLowerCase();
    if (desc.includes('vegetable') || desc.includes('fruit') || desc.includes('bean') || desc.includes('lentil')) {
      parts.push('plant-based vegan-friendly');
    }
  }
  
  return parts.filter(Boolean).join(' ').toLowerCase();
}

/**
 * Process food data into format ready for Pinecone
 */
function processFood(food: FoodData): Omit<ProcessedFood, 'embedding'> {
  const searchText = buildSearchText(food);
  
  // Extract key nutrients (handle missing foodNutrients)
  const nutrients = food.foodNutrients || [];
  const calories = getNutrientValue(nutrients, 'energy');
  const protein = getNutrientValue(nutrients, 'protein');
  const carbs = getNutrientValue(nutrients, 'carbohydrate');
  const fat = getNutrientValue(nutrients, 'total lipid');
  const fiber = getNutrientValue(nutrients, 'fiber');
  const sugar = getNutrientValue(nutrients, 'total sugars');
  const sodium = getNutrientValue(nutrients, 'sodium');
  const cholesterol = getNutrientValue(nutrients, 'cholesterol');
  const saturatedFat = getNutrientValue(nutrients, 'fatty acids, total saturated');
  
  // Helper function to safely extract string from possibly nested object
  const extractString = (value: any): string => {
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value !== null) {
      return value.description || value.name || JSON.stringify(value);
    }
    return String(value || '');
  };

  return {
    id: `fdc_${food.fdcId}`,
    metadata: {
      fdcId: food.fdcId,
      description: extractString(food.description),
      dataType: extractString(food.dataType),
      category: extractString(food.foodCategory || food.brandedFoodCategory || 'Uncategorized'),
      brandName: extractString(food.brandName || ''),
      brandOwner: extractString(food.brandOwner || ''),
      ingredients: extractString(food.ingredients || ''),
      
      // Nutrients (ensure numbers)
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
      fiber: Number(fiber) || 0,
      sugar: Number(sugar) || 0,
      sodium: Number(sodium) || 0,
      cholesterol: Number(cholesterol) || 0,
      saturatedFat: Number(saturatedFat) || 0,
      
      // Serving info (ensure proper types)
      servingSize: Number(food.servingSize) || 0,
      servingSizeUnit: extractString(food.servingSizeUnit || ''),
      packageWeight: extractString(food.packageWeight || ''),
      householdServing: extractString(food.householdServingFullText || ''),
      
      searchText,
    },
  };
}

/**
 * Generate embeddings using OpenAI
 */
async function generateEmbeddings(texts: string[], openai: OpenAI): Promise<number[][]> {
  try {
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: texts,
    });
    
    return response.data.map(item => item.embedding);
  } catch (error) {
    console.error('Error generating embeddings:', error);
    throw error;
  }
}

/**
 * Initialize Pinecone index
 */
async function initializePinecone(): Promise<any> {
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });

  const indexName = process.env.PINECONE_INDEX_NAME || 'fitness-foods';

  try {
    const indexes = await pinecone.listIndexes();
    const indexExists = indexes.indexes?.some(idx => idx.name === indexName);

    if (!indexExists) {
      console.log(`Creating index: ${indexName}`);
      await pinecone.createIndex({
        name: indexName,
        dimension: EMBEDDING_DIMENSION,
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-east-1',
          },
        },
      });
      console.log('Index created successfully, waiting for it to be ready...');
      await new Promise(resolve => setTimeout(resolve, 20000));
    } else {
      console.log(`Index ${indexName} already exists`);
    }

    return pinecone.index(indexName);
  } catch (error) {
    console.error('Error initializing Pinecone:', error);
    throw error;
  }
}

/**
 * Main ingestion function
 */
async function main() {
  console.log('🚀 Starting food data ingestion to Pinecone...\n');
  
  // Check environment variables
  if (!process.env.PINECONE_API_KEY) {
    throw new Error('PINECONE_API_KEY not set in environment');
  }
  
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not set in environment. Add it to .env.local');
  }
  
  // Initialize clients
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const index = await initializePinecone();
  
  console.log(`📁 Reading from: ${RAW_DETAILS_DIR}\n`);
  
  // Read all JSON files
  const files = fs.readdirSync(RAW_DETAILS_DIR).filter(f => f.endsWith('.json'));
  console.log(`📊 Found ${files.length} JSON files\n`);
  
  let processed = 0;
  let errors = 0;
  let uploaded = 0;
  
  // Process in batches
  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batchFiles = files.slice(i, i + BATCH_SIZE);
    const batchFoods: Omit<ProcessedFood, 'embedding'>[] = [];
    
    // Read and process batch
    for (const file of batchFiles) {
      try {
        const filePath = path.join(RAW_DETAILS_DIR, file);
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const foodData: FoodData = JSON.parse(rawData);
        
        // Basic validation
        if (!foodData.description || !foodData.fdcId) {
          continue; // Skip foods without basic identification
        }
        
        // Skip if no calories (incomplete data)
        const nutrients = foodData.foodNutrients || [];
        const calories = getNutrientValue(nutrients, 'energy');
        if (!calories || calories === 0) {
          continue;
        }
        
        const processedFood = processFood(foodData);
        batchFoods.push(processedFood);
        processed++;
      } catch (error) {
        errors++;
        if (errors <= 10) {
          console.error(`Error processing ${file}:`, error instanceof Error ? error.message : error);
        }
      }
    }
    
    if (batchFoods.length === 0) {
      continue;
    }
    
    // Generate embeddings for batch
    console.log(`⚡ Generating embeddings for batch ${Math.floor(i / BATCH_SIZE) + 1}...`);
    const searchTexts = batchFoods.map(f => f.metadata.searchText);
    
    try {
      const embeddings = await generateEmbeddings(searchTexts, openai);
      
      // Prepare vectors for Pinecone - metadata is already properly formatted
      const vectors = batchFoods.map((food, idx) => ({
        id: food.id,
        values: embeddings[idx],
        metadata: food.metadata, // Already properly formatted in processFood()
      }));
      
      // Upload to Pinecone
      await index.upsert(vectors);
      uploaded += vectors.length;
      
      console.log(`✅ Uploaded ${uploaded}/${processed} foods (${Math.round(uploaded/files.length*100)}%)`);
      
      // Rate limiting - wait a bit between batches
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error in batch upload:', error);
      errors += batchFoods.length;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 Ingestion Summary:');
  console.log('='.repeat(50));
  console.log(`Total files: ${files.length}`);
  console.log(`Processed: ${processed}`);
  console.log(`Uploaded to Pinecone: ${uploaded}`);
  console.log(`Errors: ${errors}`);
  console.log('='.repeat(50));
  console.log('\n✨ Ingestion complete!\n');
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

