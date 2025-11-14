import { Pinecone } from '@pinecone-database/pinecone';
import { generateEmbedding } from './embeddings';

const BATCH_SIZE = 100;
const EMBEDDING_DIMENSION = 1536; // Standard for most embedding models

interface ProcessedFood {
  id: string;
  fdcId: number;
  description: string;
  category: string;
  searchText: string;
  nutrients: any;
  servingSize?: number;
  servingSizeUnit?: string;
  ingredients?: string;
  brandName?: string;
}

/**
 * Initialize Pinecone index for food database
 */
export async function initializePineconeIndex() {
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });

  const indexName = process.env.PINECONE_INDEX_NAME || 'fitness-foods';

  try {
    // Check if index exists
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
      console.log('Index created successfully');
      
      // Wait for index to be ready
      await new Promise(resolve => setTimeout(resolve, 10000));
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
 * Upload food data to Pinecone with embeddings
 * NOTE: This function requires Node.js fs module - only use in server-side scripts
 */
export async function uploadFoodData(foodData: ProcessedFood[]) {
  console.log('Starting food data upload to Pinecone...');
  
  const index = await initializePineconeIndex();
  
  console.log(`Loaded ${foodData.length} food items`);
  
  let uploaded = 0;
  
  // Process in batches
  for (let i = 0; i < foodData.length; i += BATCH_SIZE) {
    const batch = foodData.slice(i, i + BATCH_SIZE);
    
    const vectors = await Promise.all(
      batch.map(async (food) => {
        const embedding = await generateEmbedding(food.searchText);
        
        return {
          id: food.id,
          values: embedding,
          metadata: {
            fdcId: food.fdcId,
            description: food.description,
            category: food.category,
            calories: food.nutrients.calories || 0,
            protein: food.nutrients.protein || 0,
            carbs: food.nutrients.carbs || 0,
            fat: food.nutrients.fat || 0,
            fiber: food.nutrients.fiber || 0,
            sugar: food.nutrients.sugar || 0,
            servingSize: food.servingSize || 0,
            servingSizeUnit: food.servingSizeUnit || '',
            ingredients: food.ingredients || '',
            brandName: food.brandName || '',
            searchText: food.searchText,
          },
        };
      })
    );
    
    await index.upsert(vectors);
    uploaded += vectors.length;
    
    console.log(`Uploaded ${uploaded}/${foodData.length} items`);
  }
  
  console.log('Upload complete!');
  return uploaded;
}

/**
 * Query Pinecone for similar foods based on search criteria
 */
export async function queryFoods(
  queryText: string,
  topK: number = 30,
  filter?: Record<string, any>
) {
  try {
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
    
    const indexName = process.env.PINECONE_INDEX_NAME || 'fitness-stipe';
    const index = pinecone.index(indexName);
    
    const queryEmbedding = await generateEmbedding(queryText);
    
    const results = await index.query({
      vector: queryEmbedding,
      topK,
      includeMetadata: true,
      filter,
    });
    
    return results.matches || [];
  } catch (error) {
    console.error('Error querying Pinecone:', error);
    return [];
  }
}

