export interface FoodNutrient {
  nutrientId: number;
  nutrientName: string;
  nutrientNumber: string;
  unitName: string;
  value: number;
  rank?: number;
}

export interface FoodItem {
  fdcId: number;
  description: string;
  dataType: string;
  foodCategory?: string;
  foodNutrients: FoodNutrient[];
  ingredients?: string;
  brandName?: string;
  servingSize?: number;
  servingSizeUnit?: string;
}

export interface UserProfile {
  name: string;
  language: 'en' | 'hr';
  height: number; // in cm
  weight: number; // in kg
  age: number;
  gender: 'male' | 'female' | 'other';
  goal: 'deficit' | 'maintenance' | 'bulking';
  targetWeightChange?: number; // kg per week
  healthIssues?: string[];
  dietaryRestrictions?: string[];
  targetMuscles?: string[];
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  focusArea?: 'strength' | 'hypertrophy' | 'endurance' | 'general';
  unitPreferences?: {
    height: 'cm' | 'ft';
    weight: 'kg' | 'lbs';
  };
}

// Preset options for onboarding
export const DIETARY_PRESETS = [
  'Vegan',
  'Vegetarian',
  'Keto',
  'Paleo',
  'Gluten-Free',
  'Dairy-Free',
  'Pescatarian',
  'Low-Carb',
  'High-Protein',
] as const;

export const MUSCLE_PRESETS = [
  'Chest',
  'Back',
  'Legs',
  'Arms',
  'Shoulders',
  'Core',
  'Glutes',
  'Calves',
] as const;

export type TrainerPersona = 'mike' | 'goggins' | 'arnold' | 'kayla' | 'chris' | 'jeff' | 'jen' | 'cassey' | 'marino' | 'josip' | string; // string allows custom trainers like 'custom-{id}'

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface WorkoutPlan {
  days: WorkoutDay[];
  duration: string; // e.g., "8 weeks"
  goals: string[];
}

export interface WorkoutDay {
  day: string;
  exercises: Exercise[];
  focus?: string;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
  rpe?: string;
}

// New card-based structures
export interface WorkoutCard {
  day: string;
  focus: string;
  exercises: Exercise[];
  warmup?: string;
  cooldown?: string;
  notes?: string;
}

export interface MealCardData {
  name: string;
  time?: string;
  foods: ParsedFood[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface ParsedFood {
  fdcId: number;
  description: string;
  servingSize: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// Plan response format
export interface PlanResponse {
  introMessage: string;
  cards: WorkoutCard[] | MealCardData[];
  outroMessage: string;
  type: 'workout' | 'nutrition';
  targets?: {
    calories: number;
    macros: {
      protein: number;
      carbs: number;
      fat: number;
    };
  };
}

export interface MealPlan {
  meals: Meal[];
  totalCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface Meal {
  name: string;
  time: string;
  foods: FoodItem[];
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

