# AI Fitness Coach

An AI-powered fitness coaching application featuring three distinct personal trainer personas: Mike Thurston (modern aesthetic coach), David Goggins (hardcore), and Arnold Schwarzenegger (classic bodybuilding). The app uses LangChain, Anthropic Claude, and Pinecone for RAG-based nutrition planning.

## Features

- **Three Unique Trainer Personas**
  - Mike Thurston: Modern aesthetic coach with science-based approach
  - David Goggins: Intense, mental toughness focused
  - Arnold Schwarzenegger: Classic bodybuilding, motivational

- **Personalized Workout Plans**
  - Generated dynamically based on user profile
  - Customized for goals (deficit, maintenance, bulking)
  - Interactive workout cards with detailed exercise information
  - Considers target muscle groups and health issues
  - RPE-based training for advanced athletes (explained by persona)

- **RAG-Based Nutrition Planning**
  - Retrieves from 3000+ food items via Pinecone
  - Personalized based on dietary restrictions
  - Interactive meal cards with nutritional breakdowns
  - Calculates macro targets automatically
  - Uses real USDA food database with FDC IDs

- **Interactive Chat Interface**
  - Natural conversations with AI trainers
  - Persona-specific responses with authentic language
  - Context-aware recommendations
  - Single LLM call generates complete plans with intro/outro messages
  - Progressive card rendering for smooth UX

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **AI**: LangChain, Anthropic Claude (Sonnet 3.5)
- **Vector Database**: Pinecone
- **Data**: USDA FoodData Central

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the app directory:

```env
ANTHROPIC_API_KEY=your_anthropic_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=fitness-foods
```

### 3. Process Food Data

Process the raw food data from the parent directory:

```bash
cd app
npm run process-foods
```

This will read all JSON files from `../data/raw_details/` and create `data/processed-foods.json`.

### 4. Populate Pinecone

Upload the processed food data to Pinecone:

```bash
npm run setup-pinecone
```

This will:
- Create a Pinecone index if it doesn't exist
- Generate embeddings for all foods
- Upload vectors to Pinecone

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Usage

1. **Choose Your Trainer**: Select from Mike Thurston, David Goggins, or Arnold Schwarzenegger
2. **Fill Out Your Profile**: Enter your stats, goals, and preferences
3. **Chat with Your Trainer**: Ask questions, get advice in their unique style
4. **Generate Plans**: Click buttons to generate streaming workout and nutrition plans with persona-based messages

## Project Structure

```
app/
├── app/
│   ├── api/
│   │   ├── chat/route.ts              # Chat endpoint
│   │   ├── generate-plan/route.ts     # Plan generation (JSON structure)
│   │   └── nutrition/
│   │       ├── calculate/route.ts     # Macro calculations
│   │       └── fetch-foods/route.ts   # Food data retrieval
│   └── page.tsx                       # Main page
├── components/
│   ├── TrainerSelection.tsx           # Trainer selection UI
│   ├── UserProfileForm.tsx            # User intake form
│   ├── ChatInterface.tsx              # Chat UI with card rendering
│   ├── MealCard.tsx                   # Meal card component
│   ├── MealModal.tsx                  # Meal details modal
│   ├── WorkoutCard.tsx                # Workout card component
│   ├── WorkoutModal.tsx               # Workout details modal
│   └── NutritionSummary.tsx           # Nutrition tracking panel
├── lib/
│   ├── types.ts                       # TypeScript types
│   ├── personas.ts                    # Trainer persona configs
│   ├── pinecone-setup.ts              # Pinecone utilities
│   ├── rag.ts                         # RAG pipeline
│   ├── embeddings.ts                  # Embedding generation
│   └── nutrition-parser.ts            # Nutrition plan parsing
└── scripts/
    ├── process-food-data.ts           # Food data processor
    ├── setup-pinecone.ts              # Pinecone setup script
    └── ingest-to-pinecone.ts          # Pinecone data ingestion
```

## API Keys

### Anthropic
Get your API key from: https://console.anthropic.com/

### Pinecone
1. Sign up at: https://www.pinecone.io/
2. Create a serverless index
3. Get your API key from the dashboard

## Food Data

The app uses the USDA FoodData Central database. The raw data is in `../data/raw_details/` with 3000+ food items including:
- Nutritional information (calories, protein, carbs, fat, etc.)
- Ingredients
- Serving sizes
- Categories

## Architecture

### Plan Generation Flow

The app uses a single LLM call with **streaming** to generate and render plans progressively:

1. **User clicks "Workout Plan" or "Nutrition Plan"**
2. **API streams LLM response** using Server-Sent Events (SSE):
   - LLM generates complete JSON structure
   - API parses and emits events: `intro`, `card`, `outro`, `done`
3. **Frontend streams and renders in real-time**:
   - Intro message appears first as it's streamed
   - Cards fade in one-by-one as they're streamed
   - Outro message concludes the plan
   - Smooth, progressive UX that feels responsive

**SSE Event Types:**
- `targets`: Nutrition macro targets (nutrition only)
- `intro`: Persona-based motivational intro message
- `card`: Individual workout/meal card (streamed one at a time)
- `outro`: Persona-based closing message
- `done`: Plan generation complete
- `error`: Error occurred during generation

### Card-Based UI

- **Workout Cards**: Day, focus, exercises with sets/reps/RPE
- **Meal Cards**: Meal name, time, foods with macros
- **Modals**: Detailed view when clicking cards

### Persona Integration

Each trainer's personality is deeply integrated:
- Authentic language (Goggins uses explicit language naturally)
- Context-aware intro/outro messages
- RPE explanations in persona's voice (not generic info boxes)

## Development

### Adding New Trainers

1. Add persona to `lib/personas.ts` (include name, avatar, image, description, catchphrases, systemPrompt)
2. Add type to `lib/types.ts` (TrainerPersona union type)
3. Add trainer image to `/public` folder
4. Update trainer selection array in `TrainerSelection.tsx`
5. Ensure system prompt includes authentic language guidelines and persona-specific communication style

### Modifying RAG

The RAG pipeline in `lib/rag.ts`:
- `generateFoodSearchQueries()`: Creates search queries based on profile
- `retrieveFoodsForProfile()`: Fetches and filters foods from Pinecone
- `calculateDailyCalories()`: Uses Mifflin-St Jeor equation
- `calculateMacros()`: Computes protein/carb/fat targets

### Improving Embeddings

The current implementation uses a simple pseudo-embedding for demo purposes. For production:
- Use OpenAI's `text-embedding-ada-002`
- Or Anthropic's upcoming embedding models
- Or open-source alternatives like `sentence-transformers`

## Notes

- The app requires the food data to be processed and uploaded to Pinecone before use
- Each trainer has a distinct personality encoded in their system prompt
- Plans are generated using Claude's reasoning capabilities with retrieved context
- The UI is responsive and works on mobile devices

## License

MIT
