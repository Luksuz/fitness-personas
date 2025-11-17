'use client';

import { motion } from 'framer-motion';
import { progressBarVariants, pulseVariants } from '@/lib/animations';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="w-full mb-6 sm:mb-8">
      {/* Step indicator text */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm sm:text-base text-[#8FABD4] font-semibold">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm sm:text-base text-[#8FABD4]/70">
          {Math.round(progress)}% Complete
        </span>
      </div>

      {/* Progress bar track */}
      <div className="relative h-2 bg-black/50 rounded-full overflow-hidden border border-[#4A70A9]/30">
        {/* Progress bar fill */}
        <motion.div
          custom={progress}
          variants={progressBarVariants}
          initial="initial"
          animate="animate"
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#8FABD4] via-[#6B9BC7] to-[#4A70A9] rounded-full"
        />
      </div>

      {/* Step dots */}
      <div className="flex justify-between mt-3">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div
              key={stepNumber}
              className="flex flex-col items-center gap-1"
            >
              <motion.div
                className={`
                  w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                  border-2 transition-all duration-300 text-xs sm:text-sm font-bold
                  ${
                    isCompleted
                      ? 'bg-gradient-to-br from-[#8FABD4] to-[#4A70A9] border-[#8FABD4] text-white'
                      : isCurrent
                      ? 'border-[#8FABD4] text-[#8FABD4] bg-black/50'
                      : 'border-[#4A70A9]/50 text-[#4A70A9]/50 bg-black/30'
                  }
                `}
                animate={isCurrent ? 'pulse' : 'idle'}
                variants={isCurrent ? pulseVariants : {}}
              >
                {isCompleted ? (
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : (
                  stepNumber
                )}
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
