'use client';

import { motion } from 'framer-motion';
import { UserProfile, TrainerPersona } from '@/lib/types';
import { getRecommendedTrainers } from '@/lib/recommendations';
import { getPersonaConfig } from '@/lib/personas';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/animations';

interface RecommendedTrainersProps {
  profile: UserProfile;
  onSelect: (trainer: TrainerPersona) => void;
}

export default function RecommendedTrainers({ profile, onSelect }: RecommendedTrainersProps) {
  const recommendations = getRecommendedTrainers(profile);
  const topRecommendation = recommendations[0];

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Greeting */}
      <motion.div variants={staggerItemVariants} className="text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-[#8FABD4] to-[#4A70A9] bg-clip-text text-transparent">
          {profile.language === 'hr' ? `Dobrodošli, ${profile.name}!` : `Welcome, ${profile.name}!`}
        </h2>
        <p className="text-[#8FABD4] text-sm sm:text-base">
          {profile.language === 'hr' 
            ? 'Na temelju vašeg profila, preporučujemo vam ove trenere:'
            : 'Based on your profile, we recommend these coaches:'}
        </p>
      </motion.div>

      {/* Top Recommendation Badge */}
      {topRecommendation && (
        <motion.div
          variants={staggerItemVariants}
          className="bg-gradient-to-r from-[#4A70A9]/30 to-[#8FABD4]/30 border border-[#8FABD4]/50 rounded-xl p-4 text-center"
        >
          <p className="text-xs font-semibold text-[#8FABD4] mb-1">
            {profile.language === 'hr' ? '⭐ NAJBOLJA PREPORUKA' : '⭐ TOP RECOMMENDATION'}
          </p>
          <p className="text-lg font-bold text-[#EFECE3]">
            {getPersonaConfig(topRecommendation.persona)?.name}
          </p>
        </motion.div>
      )}

      {/* Trainer Grid */}
      <motion.div
        variants={staggerContainerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {recommendations.map((rec, index) => {
          const config = getPersonaConfig(rec.persona);
          if (!config) return null;

          const isTopPick = index === 0;

          return (
            <motion.button
              key={rec.persona}
              variants={staggerItemVariants}
              onClick={() => onSelect(rec.persona)}
              className={`
                relative p-4 sm:p-6 rounded-xl text-left
                bg-gradient-to-br from-black/50 to-black/30
                border-2 transition-all duration-300
                hover:scale-105 hover:shadow-xl hover:shadow-[#8FABD4]/30
                ${
                  isTopPick
                    ? 'border-[#8FABD4] shadow-lg shadow-[#8FABD4]/50'
                    : 'border-[#4A70A9]/50 hover:border-[#8FABD4]/70'
                }
                touch-manipulation active:scale-95
              `}
            >
              {/* Top Pick Badge */}
              {isTopPick && (
                <div className="absolute top-2 right-2 bg-gradient-to-r from-[#8FABD4] to-[#4A70A9] px-2 py-1 rounded-full text-xs font-bold text-white">
                  ⭐ {profile.language === 'hr' ? 'TOP' : 'TOP'}
                </div>
              )}

              {/* Avatar/Icon */}
              <div className="text-4xl sm:text-5xl mb-3">{config.avatar}</div>

              {/* Name */}
              <h3 className="text-lg sm:text-xl font-bold text-[#EFECE3] mb-2">
                {config.name}
              </h3>

              {/* Style */}
              <p className="text-sm text-[#8FABD4]/80 mb-3">{config.style}</p>

              {/* Reasons */}
              <div className="space-y-1">
                {rec.reasons.slice(0, 3).map((reason, idx) => (
                  <p key={idx} className="text-xs text-[#EFECE3]/70 flex items-start gap-1">
                    <span className="text-[#8FABD4]">✓</span>
                    <span>{reason}</span>
                  </p>
                ))}
              </div>

              {/* Match Score (subtle) */}
              <div className="mt-3 pt-3 border-t border-[#4A70A9]/30">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#8FABD4]/60">
                    {profile.language === 'hr' ? 'Podudaranje' : 'Match'}
                  </span>
                  <span className="font-semibold text-[#8FABD4]">{Math.min(rec.score, 100)}%</span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Show All Trainers Button */}
      <motion.div variants={staggerItemVariants} className="text-center pt-4">
        <button
          onClick={() => {
            // This will be handled by parent to show all trainers
            const allTrainersSection = document.getElementById('all-trainers');
            if (allTrainersSection) {
              allTrainersSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="text-sm text-[#8FABD4] hover:text-[#EFECE3] transition-colors underline decoration-dashed underline-offset-4"
        >
          {profile.language === 'hr' ? 'Prikaži sve trenere →' : 'Browse all trainers →'}
        </button>
      </motion.div>
    </motion.div>
  );
}


