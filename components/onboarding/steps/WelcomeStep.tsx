'use client';

import { motion } from 'framer-motion';
import { fadeInVariants, staggerContainerVariants, staggerItemVariants, buttonVariants } from '@/lib/animations';

interface WelcomeStepProps {
  onNext: () => void;
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center space-y-6 sm:space-y-8 py-8 sm:py-12"
    >
      {/* Main icon */}
      <motion.div
        variants={staggerItemVariants}
        className="text-6xl sm:text-7xl md:text-8xl"
      >
        💪
      </motion.div>

      {/* Welcome text */}
      <motion.div variants={staggerItemVariants} className="text-center space-y-3 sm:space-y-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#8FABD4] via-[#6B9BC7] to-[#4A70A9] bg-clip-text text-transparent">
          Welcome to Your Fitness Journey!
        </h1>
        <p className="text-[#8FABD4] text-base sm:text-lg md:text-xl max-w-2xl mx-auto px-4">
          Let's personalize your experience in just a few quick steps.
          This will help us create the perfect workout and nutrition plan for you.
        </p>
      </motion.div>

      {/* Feature highlights */}
      <motion.div
        variants={staggerItemVariants}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full max-w-4xl px-4"
      >
        <div className="flex flex-col items-center text-center p-4 bg-black/30 rounded-xl border border-[#4A70A9]/30">
          <div className="text-3xl sm:text-4xl mb-2">🎯</div>
          <h3 className="font-semibold text-[#EFECE3] mb-1">Personalized Plans</h3>
          <p className="text-sm text-[#8FABD4]/70">
            Workouts tailored to your goals
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-4 bg-black/30 rounded-xl border border-[#4A70A9]/30">
          <div className="text-3xl sm:text-4xl mb-2">🍎</div>
          <h3 className="font-semibold text-[#EFECE3] mb-1">Smart Nutrition</h3>
          <p className="text-sm text-[#8FABD4]/70">
            Meal plans that fit your lifestyle
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-4 bg-black/30 rounded-xl border border-[#4A70A9]/30">
          <div className="text-3xl sm:text-4xl mb-2">🤖</div>
          <h3 className="font-semibold text-[#EFECE3] mb-1">AI Coach</h3>
          <p className="text-sm text-[#8FABD4]/70">
            Expert guidance 24/7
          </p>
        </div>
      </motion.div>

      {/* CTA Button */}
      <motion.button
        variants={buttonVariants}
        initial="idle"
        whileHover="hover"
        whileTap="tap"
        onClick={onNext}
        className="mt-4 sm:mt-6 px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-[#8FABD4] via-[#6B9BC7] to-[#8FABD4] hover:from-[#A8C5E0] hover:via-[#8FABD4] hover:to-[#A8C5E0] text-[#EFECE3] font-bold text-lg sm:text-xl rounded-xl shadow-lg shadow-[#8FABD4]/50 hover:shadow-xl hover:shadow-[#8FABD4]/70 transition-all duration-300 min-h-[60px] touch-manipulation"
      >
        Let's Begin! 🚀
      </motion.button>

      {/* Quick note */}
      <motion.p
        variants={staggerItemVariants}
        className="text-xs sm:text-sm text-[#8FABD4]/60 text-center max-w-md px-4"
      >
        Takes less than 2 minutes • You can edit anytime
      </motion.p>
    </motion.div>
  );
}
