'use client';

import { motion } from 'framer-motion';
import { UserProfile } from '@/lib/types';
import { celebrationVariants, staggerContainerVariants, staggerItemVariants, buttonVariants } from '@/lib/animations';

interface SuccessStepProps {
  profile: UserProfile;
  onComplete: () => void;
}

export default function SuccessStep({ profile, onComplete }: SuccessStepProps) {
  const getGoalLabel = (goal: string) => {
    switch (goal) {
      case 'deficit': return 'Lose Weight';
      case 'maintenance': return 'Maintain';
      case 'bulking': return 'Build Muscle';
      default: return goal;
    }
  };

  const getFocusLabel = (focus?: string) => {
    switch (focus) {
      case 'general': return 'General Fitness';
      case 'strength': return 'Strength & Power';
      case 'hypertrophy': return 'Muscle Building';
      case 'endurance': return 'Endurance & Conditioning';
      default: return 'General Fitness';
    }
  };

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center space-y-6 sm:space-y-8 py-4 sm:py-8"
    >
      {/* Success Icon */}
      <motion.div
        variants={celebrationVariants}
        className="text-6xl sm:text-7xl md:text-8xl"
      >
        🎉
      </motion.div>

      {/* Success Message */}
      <motion.div variants={staggerItemVariants} className="text-center space-y-2 sm:space-y-3">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#8FABD4] via-[#6B9BC7] to-[#4A70A9] bg-clip-text text-transparent">
          {profile.language === 'hr' ? `Sve je spremno, ${profile.name}!` : `You're All Set, ${profile.name}!`}
        </h1>
        <p className="text-[#8FABD4] text-base sm:text-lg md:text-xl">
          {profile.language === 'hr' 
            ? 'Vaše personalizirano fitness putovanje počinje sad 🚀'
            : 'Your personalized fitness journey starts now 🚀'}
        </p>
      </motion.div>

      {/* Profile Summary Card */}
      <motion.div
        variants={staggerItemVariants}
        className="w-full max-w-2xl bg-gradient-to-br from-black/50 to-black/30 border border-[#4A70A9]/50 rounded-2xl p-6 sm:p-8 space-y-4"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-[#EFECE3] text-center mb-4">
          {profile.language === 'hr' ? 'Vaš Fitness Profil' : 'Your Fitness Profile'}
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {/* Height & Weight */}
          <div className="bg-black/30 rounded-xl p-4">
            <p className="text-xs text-[#8FABD4]/70 mb-1">Height</p>
            <p className="text-lg font-semibold text-[#EFECE3]">{profile.height} cm</p>
          </div>
          
          <div className="bg-black/30 rounded-xl p-4">
            <p className="text-xs text-[#8FABD4]/70 mb-1">Weight</p>
            <p className="text-lg font-semibold text-[#EFECE3]">{profile.weight} kg</p>
          </div>

          {/* Age & Gender */}
          <div className="bg-black/30 rounded-xl p-4">
            <p className="text-xs text-[#8FABD4]/70 mb-1">Age</p>
            <p className="text-lg font-semibold text-[#EFECE3]">{profile.age} years</p>
          </div>
          
          <div className="bg-black/30 rounded-xl p-4">
            <p className="text-xs text-[#8FABD4]/70 mb-1">Gender</p>
            <p className="text-lg font-semibold text-[#EFECE3] capitalize">{profile.gender}</p>
          </div>
        </div>

        {/* Goal */}
        <div className="bg-gradient-to-r from-[#4A70A9]/30 to-[#8FABD4]/30 rounded-xl p-4 border border-[#8FABD4]/30">
          <p className="text-xs text-[#8FABD4]/70 mb-1">Primary Goal</p>
          <p className="text-xl font-bold text-[#EFECE3]">{getGoalLabel(profile.goal)}</p>
        </div>

        {/* Focus Area */}
        <div className="bg-black/30 rounded-xl p-4">
          <p className="text-xs text-[#8FABD4]/70 mb-1">Training Focus</p>
          <p className="text-lg font-semibold text-[#EFECE3]">{getFocusLabel(profile.focusArea)}</p>
        </div>

        {/* Experience Level */}
        <div className="bg-black/30 rounded-xl p-4">
          <p className="text-xs text-[#8FABD4]/70 mb-1">Experience Level</p>
          <p className="text-lg font-semibold text-[#EFECE3] capitalize">{profile.experienceLevel}</p>
        </div>

        {/* Optional: Dietary Restrictions */}
        {profile.dietaryRestrictions && profile.dietaryRestrictions.length > 0 && (
          <div className="bg-black/30 rounded-xl p-4">
            <p className="text-xs text-[#8FABD4]/70 mb-2">Dietary Preferences</p>
            <div className="flex flex-wrap gap-2">
              {profile.dietaryRestrictions.map((item, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gradient-to-r from-[#8FABD4]/20 to-[#4A70A9]/20 border border-[#8FABD4]/30 rounded-full text-xs text-[#EFECE3]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Optional: Target Muscles */}
        {profile.targetMuscles && profile.targetMuscles.length > 0 && (
          <div className="bg-black/30 rounded-xl p-4">
            <p className="text-xs text-[#8FABD4]/70 mb-2">Target Muscles</p>
            <div className="flex flex-wrap gap-2">
              {profile.targetMuscles.map((item, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gradient-to-r from-[#8FABD4]/20 to-[#4A70A9]/20 border border-[#8FABD4]/30 rounded-full text-xs text-[#EFECE3]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* CTA Button */}
      <motion.button
        variants={buttonVariants}
        initial="idle"
        whileHover="hover"
        whileTap="tap"
        onClick={onComplete}
        className="mt-4 sm:mt-6 px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-[#8FABD4] via-[#6B9BC7] to-[#8FABD4] hover:from-[#A8C5E0] hover:via-[#8FABD4] hover:to-[#A8C5E0] text-[#EFECE3] font-bold text-lg sm:text-xl rounded-xl shadow-lg shadow-[#8FABD4]/50 hover:shadow-xl hover:shadow-[#8FABD4]/70 transition-all duration-300 min-h-[60px] touch-manipulation"
      >
        Start My Journey! 💪
      </motion.button>

      {/* Note */}
      <motion.p
        variants={staggerItemVariants}
        className="text-xs sm:text-sm text-[#8FABD4]/60 text-center max-w-md px-4"
      >
        You can edit your profile anytime from the settings
      </motion.p>
    </motion.div>
  );
}
