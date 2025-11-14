'use client';

import { WorkoutCard as WorkoutCardType } from '@/lib/types';

interface WorkoutCardProps {
  workout: WorkoutCardType;
  onClick: () => void;
}

export default function WorkoutCard({ workout, onClick }: WorkoutCardProps) {
  const exercises = workout.exercises || [];
  
  return (
    <div
      onClick={onClick}
      className="bg-gradient-to-br from-black/80 to-[#1a1f2e]/80 border border-[#4A70A9]/40 rounded-xl p-4 cursor-pointer hover:border-[#8FABD4] hover:shadow-lg hover:shadow-[#8FABD4]/20 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-[#EFECE3] group-hover:text-[#8FABD4] transition-colors">
            {workout.day}
          </h3>
          <p className="text-sm text-[#8FABD4]/80 mt-1">{workout.focus}</p>
        </div>
        <span className="text-2xl">🏋️</span>
      </div>

      <div className="space-y-2">
        {exercises.slice(0, 3).map((exercise, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm">
            <span className="text-[#8FABD4]">•</span>
            <span className="text-[#EFECE3]/90">
              {exercise.name}
            </span>
            <span className="text-[#8FABD4]/60 text-xs">
              {exercise.sets}×{exercise.reps}
            </span>
          </div>
        ))}
        {exercises.length > 3 && (
          <div className="text-xs text-[#8FABD4]/60 mt-2">
            + {exercises.length - 3} more exercises
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-[#4A70A9]/30">
        <p className="text-xs text-[#8FABD4]/60">Click for details</p>
      </div>
    </div>
  );
}

