'use client';

import { WorkoutCard } from '@/lib/types';

interface WorkoutModalProps {
  workout: WorkoutCard | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function WorkoutModal({ workout, isOpen, onClose }: WorkoutModalProps) {
  if (!isOpen || !workout) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-[#1a1f2e] to-black border border-[#4A70A9]/50 rounded-none sm:rounded-2xl max-w-full sm:max-w-4xl w-full h-full sm:h-auto sm:max-h-[85vh] overflow-hidden shadow-2xl shadow-[#8FABD4]/20 animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4A70A9] to-[#8FABD4] p-4 sm:p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-[#EFECE3] mb-2">
                {workout.day}
              </h2>
              <p className="text-[#EFECE3]/90 text-sm sm:text-base">{workout.focus}</p>
            </div>
            <button
              onClick={onClose}
              className="text-[#EFECE3] hover:text-white text-2xl sm:text-3xl leading-none transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation active:scale-95"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-200px)] sm:max-h-[calc(85vh-140px)]">
          {/* Warm-up */}
          {workout.warmup && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#8FABD4] mb-3 flex items-center gap-2">
                🔥 Warm-up
              </h3>
              <p className="text-[#EFECE3]/80 text-sm leading-relaxed">
                {workout.warmup}
              </p>
            </div>
          )}

          {/* Exercises */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#8FABD4] mb-4 flex items-center gap-2">
              💪 Exercises
            </h3>
            <div className="space-y-4">
              {workout.exercises.map((exercise, idx) => (
                <div
                  key={idx}
                  className="bg-black/40 border border-[#4A70A9]/30 rounded-xl p-4 hover:border-[#8FABD4]/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-[#EFECE3]">
                      {idx + 1}. {exercise.name}
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                    <div className="bg-[#4A70A9]/20 rounded-lg p-2">
                      <p className="text-xs text-[#8FABD4]/70 mb-1">Sets</p>
                      <p className="text-[#EFECE3] font-semibold">{exercise.sets}</p>
                    </div>
                    <div className="bg-[#4A70A9]/20 rounded-lg p-2">
                      <p className="text-xs text-[#8FABD4]/70 mb-1">Reps</p>
                      <p className="text-[#EFECE3] font-semibold">{exercise.reps}</p>
                    </div>
                    <div className="bg-[#4A70A9]/20 rounded-lg p-2">
                      <p className="text-xs text-[#8FABD4]/70 mb-1">Rest</p>
                      <p className="text-[#EFECE3] font-semibold">{exercise.rest}</p>
                    </div>
                    {exercise.rpe && (
                      <div className="bg-[#4A70A9]/20 rounded-lg p-2">
                        <p className="text-xs text-[#8FABD4]/70 mb-1">RPE</p>
                        <p className="text-[#EFECE3] font-semibold">{exercise.rpe}</p>
                      </div>
                    )}
                  </div>

                  {exercise.notes && (
                    <div className="mt-3 pt-3 border-t border-[#4A70A9]/20">
                      <p className="text-sm text-[#EFECE3]/70 italic">
                        💡 {exercise.notes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Cool-down */}
          {workout.cooldown && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#8FABD4] mb-3 flex items-center gap-2">
                🧘 Cool-down
              </h3>
              <p className="text-[#EFECE3]/80 text-sm leading-relaxed">
                {workout.cooldown}
              </p>
            </div>
          )}

          {/* Additional Notes */}
          {workout.notes && (
            <div className="bg-[#4A70A9]/10 border border-[#4A70A9]/30 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-[#8FABD4] mb-2 flex items-center gap-2">
                📝 Notes
              </h3>
              <p className="text-[#EFECE3]/80 text-sm leading-relaxed">
                {workout.notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-black/40 border-t border-[#4A70A9]/30 p-3 sm:p-4">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-[#4A70A9] to-[#8FABD4] hover:from-[#8FABD4] hover:to-[#4A70A9] rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base text-[#EFECE3] transition-all duration-300 active:scale-95 min-h-[44px] touch-manipulation"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

