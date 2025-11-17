'use client';

import { motion } from 'framer-motion';
import PillSelector from '../PillSelector';
import { UserProfile, DIETARY_PRESETS, MUSCLE_PRESETS } from '@/lib/types';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/animations';

interface PreferencesStepProps {
  profile: Partial<UserProfile>;
  onChange: (updates: Partial<UserProfile>) => void;
  onSkip: () => void;
}

export default function PreferencesStep({ profile, onChange, onSkip }: PreferencesStepProps) {
  return (
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
      className="space-y-8"
      >
        {/* Skip button */}
      <motion.div variants={staggerItemVariants} className="flex justify-end">
          <button
            type="button"
            onClick={onSkip}
          className="text-sm sm:text-base text-[#8FABD4] hover:text-[#EFECE3] transition-colors font-semibold underline decoration-dashed underline-offset-4 touch-manipulation"
          >
            Skip this step →
          </button>
        </motion.div>

      {/* Info note */}
      <motion.div
        variants={staggerItemVariants}
        className="bg-gradient-to-r from-[#4A70A9]/20 to-[#8FABD4]/20 border border-[#8FABD4]/30 rounded-xl p-4"
      >
        <p className="text-sm text-[#EFECE3]/90 text-center">
          ✨ This is optional but helps us personalize your experience better
        </p>
      </motion.div>

        {/* Dietary Restrictions */}
        <motion.div variants={staggerItemVariants}>
          <PillSelector
            presets={DIETARY_PRESETS}
            selected={profile.dietaryRestrictions || []}
            onChange={(selected) => onChange({ dietaryRestrictions: selected })}
          label="Dietary Preferences (Optional)"
          placeholder="e.g., nut allergy, organic only..."
          allowCustom={true}
          />
        </motion.div>

        {/* Target Muscles */}
        <motion.div variants={staggerItemVariants}>
          <PillSelector
            presets={MUSCLE_PRESETS}
            selected={profile.targetMuscles || []}
            onChange={(selected) => onChange({ targetMuscles: selected })}
          label="Target Muscle Groups (Optional)"
          placeholder="e.g., forearms, traps..."
          allowCustom={true}
          />
        </motion.div>

        {/* Health Issues */}
        <motion.div variants={staggerItemVariants}>
        <label className="block text-sm font-semibold mb-3 text-[#8FABD4]">
          Health Considerations (Optional)
        </label>
        <p className="text-xs text-[#8FABD4]/70 mb-3">
          Let us know about any health conditions we should consider (e.g., diabetes, high blood pressure, injuries)
        </p>
          <PillSelector
            presets={[]}
            selected={profile.healthIssues || []}
            onChange={(selected) => onChange({ healthIssues: selected })}
          label=""
          placeholder="e.g., knee injury, asthma..."
            allowCustom={true}
          />
      </motion.div>

      {/* Privacy note */}
      <motion.p
        variants={staggerItemVariants}
        className="text-xs text-center text-[#8FABD4]/50 pt-2"
      >
        🔒 Your information is private and used only to personalize your experience
      </motion.p>
    </motion.div>
  );
}
