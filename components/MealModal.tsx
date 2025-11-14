'use client';

import { useEffect } from 'react';

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

interface MealModalProps {
  meal: Meal | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MealModal({ meal, isOpen, onClose }: MealModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !meal) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-black rounded-2xl shadow-2xl border border-[#4A70A9]/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-in-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-black/95 backdrop-blur-xl border-b border-[#4A70A9]/50 px-6 py-4 flex items-center justify-between">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-[#8FABD4] to-[#4A70A9] bg-clip-text text-transparent">
            {meal.name}
          </h3>
          <button
            onClick={onClose}
            className="text-[#8FABD4] hover:text-[#EFECE3] transition-colors text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Meal Totals */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-[#4A70A9]/20 rounded-xl p-4 border border-[#4A70A9]/50">
              <div className="text-[#8FABD4]/70 text-sm mb-1">Calories</div>
              <div className="text-2xl font-bold text-[#8FABD4]">
                {Math.round(meal.totalCalories)}
              </div>
            </div>
            <div className="bg-[#4A70A9]/20 rounded-xl p-4 border border-[#4A70A9]/50">
              <div className="text-[#8FABD4]/70 text-sm mb-1">Protein</div>
              <div className="text-2xl font-bold text-[#8FABD4]">
                {Math.round(meal.totalProtein)}g
              </div>
            </div>
            <div className="bg-[#4A70A9]/20 rounded-xl p-4 border border-[#4A70A9]/50">
              <div className="text-[#8FABD4]/70 text-sm mb-1">Carbs</div>
              <div className="text-2xl font-bold text-[#8FABD4]">
                {Math.round(meal.totalCarbs)}g
              </div>
            </div>
            <div className="bg-[#4A70A9]/20 rounded-xl p-4 border border-[#4A70A9]/50">
              <div className="text-[#8FABD4]/70 text-sm mb-1">Fat</div>
              <div className="text-2xl font-bold text-[#8FABD4]">
                {Math.round(meal.totalFat)}g
              </div>
            </div>
          </div>

          {/* Food Items */}
          <div>
            <h4 className="text-lg font-semibold mb-4 bg-gradient-to-r from-[#8FABD4] to-[#4A70A9] bg-clip-text text-transparent">Food Items</h4>
            <div className="space-y-3">
              {meal.foods.map((food, idx) => (
                <div
                  key={idx}
                  className="bg-black/50 rounded-xl p-4 border border-[#4A70A9]/50 hover:border-[#8FABD4]/50 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h5 className="font-semibold text-[#EFECE3] mb-1">
                        {food.description}
                      </h5>
                      <div className="text-sm text-[#8FABD4]/70">
                        Serving: {food.servingSize}g
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-3 mt-3 pt-3 border-t border-[#4A70A9]/50">
                    <div>
                      <div className="text-xs text-[#8FABD4]/70 mb-1">Calories</div>
                      <div className="text-sm font-semibold text-[#8FABD4]">
                        {Math.round(food.calories)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-[#8FABD4]/70 mb-1">Protein</div>
                      <div className="text-sm font-semibold text-[#8FABD4]">
                        {Math.round(food.protein)}g
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-[#8FABD4]/70 mb-1">Carbs</div>
                      <div className="text-sm font-semibold text-[#8FABD4]">
                        {Math.round(food.carbs)}g
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-[#8FABD4]/70 mb-1">Fat</div>
                      <div className="text-sm font-semibold text-[#8FABD4]">
                        {Math.round(food.fat)}g
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

