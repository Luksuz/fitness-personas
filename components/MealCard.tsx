'use client';

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

interface MealCardProps {
  meal: Meal;
  onClick: () => void;
}

export default function MealCard({ meal, onClick }: MealCardProps) {
  const foods = meal.foods || [];
  
  return (
    <div
      onClick={onClick}
      className="bg-black/50 rounded-xl p-4 border border-[#4A70A9]/50 cursor-pointer transition-all duration-300 hover:border-[#8FABD4]/50 hover:bg-black/70 hover:shadow-lg hover:shadow-[#8FABD4]/20 hover:scale-[1.02] active:scale-[0.98] my-3"
    >
      <h5 className="font-semibold mb-3 bg-gradient-to-r from-[#8FABD4] to-[#4A70A9] bg-clip-text text-transparent text-sm">
        {meal.name}
      </h5>
      
      <div className="mb-3">
        <div className="text-xs text-[#8FABD4]/70 mb-2">
          {foods.length} {foods.length === 1 ? 'item' : 'items'}
        </div>
        <div className="space-y-1">
          {foods.slice(0, 2).map((food, foodIdx) => (
            <div key={foodIdx} className="text-[#EFECE3]/80 text-xs truncate">
              • {food.description}
            </div>
          ))}
          {foods.length > 2 && (
            <div className="text-[#8FABD4]/70 text-xs">
              +{foods.length - 2} more...
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
  );
}

