'use client';

import { useState, useEffect } from 'react';
import MealModal from './MealModal';

interface FoodItem {
  fdcId: number;
  description: string;
  servingSize: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface Meal {
  name: string;
  foods: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

interface NutritionSummaryProps {
  meals: Meal[];
  dailyTargets: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export default function NutritionSummary({ meals, dailyTargets }: NutritionSummaryProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate daily totals
  const dailyTotals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.totalCalories,
      protein: acc.protein + meal.totalProtein,
      carbs: acc.carbs + meal.totalCarbs,
      fat: acc.fat + meal.totalFat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage < 90) return 'bg-[#8FABD4]';
    if (percentage > 110) return 'bg-[#4A70A9]';
    return 'bg-[#8FABD4]';
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const handleMealClick = (meal: Meal) => {
    setSelectedMeal(meal);
    setIsModalOpen(true);
  };

  if (meals.length === 0) return null;

  return (
    <>
      <MealModal
        meal={selectedMeal}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      
      <div className="fixed right-4 top-20 w-80 bg-black/95 backdrop-blur-xl rounded-xl shadow-2xl border border-[#4A70A9]/50 z-50 animate-slide-in-right">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 border-b border-[#4A70A9]/50 cursor-pointer hover:bg-black/70 transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3 className="font-bold text-lg flex items-center gap-2 bg-gradient-to-r from-[#8FABD4] to-[#4A70A9] bg-clip-text text-transparent">
          📊 Nutrition Tracker
        </h3>
        <button className="text-2xl text-[#8FABD4] hover:text-[#EFECE3] transition-colors">
          {isCollapsed ? '▼' : '▲'}
        </button>
      </div>

      {!isCollapsed && (
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {/* Daily Totals */}
          <div className="mb-6 p-4 bg-black/50 rounded-xl border border-[#4A70A9]/50">
            <h4 className="font-semibold mb-3 bg-gradient-to-r from-[#8FABD4] to-[#4A70A9] bg-clip-text text-transparent">Daily Totals</h4>
            
            {/* Calories */}
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[#EFECE3]">Calories</span>
                <span className="font-semibold text-[#EFECE3]">
                  {Math.round(dailyTotals.calories)} / {dailyTargets.calories}
                </span>
              </div>
              <div className="w-full bg-[#4A70A9]/30 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full transition-all ${getProgressColor(
                    dailyTotals.calories,
                    dailyTargets.calories
                  )}`}
                  style={{ width: `${getProgressPercentage(dailyTotals.calories, dailyTargets.calories)}%` }}
                />
              </div>
            </div>

            {/* Protein */}
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[#EFECE3]">Protein</span>
                <span className="font-semibold text-[#EFECE3]">
                  {Math.round(dailyTotals.protein)}g / {dailyTargets.protein}g
                </span>
              </div>
              <div className="w-full bg-[#4A70A9]/30 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full transition-all ${getProgressColor(
                    dailyTotals.protein,
                    dailyTargets.protein
                  )}`}
                  style={{ width: `${getProgressPercentage(dailyTotals.protein, dailyTargets.protein)}%` }}
                />
              </div>
            </div>

            {/* Carbs */}
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[#EFECE3]">Carbs</span>
                <span className="font-semibold text-[#EFECE3]">
                  {Math.round(dailyTotals.carbs)}g / {dailyTargets.carbs}g
                </span>
              </div>
              <div className="w-full bg-[#4A70A9]/30 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full transition-all ${getProgressColor(
                    dailyTotals.carbs,
                    dailyTargets.carbs
                  )}`}
                  style={{ width: `${getProgressPercentage(dailyTotals.carbs, dailyTargets.carbs)}%` }}
                />
              </div>
            </div>

            {/* Fat */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[#EFECE3]">Fat</span>
                <span className="font-semibold text-[#EFECE3]">
                  {Math.round(dailyTotals.fat)}g / {dailyTargets.fat}g
                </span>
              </div>
              <div className="w-full bg-[#4A70A9]/30 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full transition-all ${getProgressColor(
                    dailyTotals.fat,
                    dailyTargets.fat
                  )}`}
                  style={{ width: `${getProgressPercentage(dailyTotals.fat, dailyTargets.fat)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Individual Meals */}
          <div className="space-y-3">
            <h4 className="font-semibold bg-gradient-to-r from-[#8FABD4] to-[#4A70A9] bg-clip-text text-transparent mb-3">Meals Breakdown</h4>
            {meals.map((meal, idx) => (
              <div
                key={idx}
                onClick={() => handleMealClick(meal)}
                className="bg-black/50 rounded-xl p-4 border border-[#4A70A9]/50 cursor-pointer transition-all duration-300 hover:border-[#8FABD4]/50 hover:bg-black/70 hover:shadow-lg hover:shadow-[#8FABD4]/20 hover:scale-[1.02] active:scale-[0.98]"
              >
                <h5 className="font-semibold mb-3 bg-gradient-to-r from-[#8FABD4] to-[#4A70A9] bg-clip-text text-transparent text-sm">
                  {meal.name}
                </h5>
                
                <div className="mb-3">
                  <div className="text-xs text-[#8FABD4]/70 mb-2">
                    {meal.foods.length} {meal.foods.length === 1 ? 'item' : 'items'}
                  </div>
                  <div className="space-y-1">
                    {meal.foods.slice(0, 2).map((food, foodIdx) => (
                      <div key={foodIdx} className="text-[#EFECE3]/80 text-xs truncate">
                        • {food.description}
                      </div>
                    ))}
                    {meal.foods.length > 2 && (
                      <div className="text-[#8FABD4]/70 text-xs">
                        +{meal.foods.length - 2} more...
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-[#4A70A9]/20 p-2 rounded-lg border border-[#4A70A9]/30">
                    <div className="text-[#8FABD4]/70 text-[10px] mb-1">Cal</div>
                    <div className="font-semibold text-[#8FABD4] text-xs">
                      {Math.round(meal.totalCalories)}
                    </div>
                  </div>
                  <div className="bg-[#4A70A9]/20 p-2 rounded-lg border border-[#4A70A9]/30">
                    <div className="text-[#8FABD4]/70 text-[10px] mb-1">Pro</div>
                    <div className="font-semibold text-[#8FABD4] text-xs">
                      {Math.round(meal.totalProtein)}g
                    </div>
                  </div>
                  <div className="bg-[#4A70A9]/20 p-2 rounded-lg border border-[#4A70A9]/30">
                    <div className="text-[#8FABD4]/70 text-[10px] mb-1">Carb</div>
                    <div className="font-semibold text-[#8FABD4] text-xs">
                      {Math.round(meal.totalCarbs)}g
                    </div>
                  </div>
                  <div className="bg-[#4A70A9]/20 p-2 rounded-lg border border-[#4A70A9]/30">
                    <div className="text-[#8FABD4]/70 text-[10px] mb-1">Fat</div>
                    <div className="font-semibold text-[#8FABD4] text-xs">
                      {Math.round(meal.totalFat)}g
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </>
  );
}

