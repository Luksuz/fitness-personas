/**
 * Script to upload processed food data to Pinecone
 * Run with: npm run setup-pinecone
 */

import * as fs from 'fs';
import * as path from 'path';
import { uploadFoodData } from '../lib/pinecone-setup';

async function main() {
  console.log('Starting Pinecone setup...\n');
  
  const foodDataPath = path.join(process.cwd(), 'data', 'processed-foods.json');
  
  console.log(`Food data path: ${foodDataPath}\n`);
  
  try {
    // Read and parse the food data file
    const foodDataJson = fs.readFileSync(foodDataPath, 'utf-8');
    const foodData = JSON.parse(foodDataJson);
    
    const count = await uploadFoodData(foodData);
    console.log(`\n✅ Successfully uploaded ${count} foods to Pinecone!`);
    console.log('\nYou can now run the app with: npm run dev');
  } catch (error) {
    console.error('\n❌ Error setting up Pinecone:', error);
    process.exit(1);
  }
}

main();

