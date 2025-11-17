'use client';

import { motion } from 'framer-motion';
import SelectionCard from '../SelectionCard';
import { UserProfile } from '@/lib/types';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/animations';

interface GoalStepProps {
  profile: Partial<UserProfile>;
  onChange: (updates: Partial<UserProfile>) => void;
}

export default function GoalStep({ profile, onChange }: GoalStepProps) {
  const handleGoalSelect = (goal: UserProfile['goal']) => {
    onChange({ goal });
  };

  return (
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
      className="space-y-6"
      >
      {/* Goal Cards */}
      <motion.div variants={staggerItemVariants} className="grid grid-cols-1 gap-4">
        <SelectionCard
          icon="🔥"
          title="Lose Weight"
          subtitle="Calorie deficit to burn fat and get lean"
          selected={profile.goal === 'deficit'}
          onClick={() => handleGoalSelect('deficit')}
        />
        
        <SelectionCard
          icon="⚖️"
          title="Maintain"
          subtitle="Stay fit and healthy at your current weight"
          selected={profile.goal === 'maintenance'}
          onClick={() => handleGoalSelect('maintenance')}
        />
        
              <SelectionCard
          icon="💪"
          title="Build Muscle"
          subtitle="Calorie surplus to gain strength and size"
          selected={profile.goal === 'bulking'}
          onClick={() => handleGoalSelect('bulking')}
              />
            </motion.div>

      {/* Conditional: Target Weight Change */}
        {profile.goal && profile.goal !== 'maintenance' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
            className="pt-4"
          >
            <label className="block text-sm font-semibold mb-2 text-[#8FABD4]">
              Target Weight Change (kg per week)
            </label>
            <input
              type="number"
              step="0.1"
            min="0.1"
            max="1.5"
              value={profile.targetWeightChange || 0.5}
              onChange={(e) => onChange({ targetWeightChange: Number(e.target.value) })}
            className="w-full bg-black/50 border border-[#4A70A9]/50 rounded-xl px-4 py-3 text-[#EFECE3] text-lg focus:ring-2 focus:ring-[#8FABD4]/50 focus:border-[#8FABD4]/50 outline-none transition-all"
            />
            <p className="text-xs text-[#8FABD4]/70 mt-2">
            ✨ Recommended: 0.5-1.0 kg per week for sustainable results
            </p>
          </motion.div>
        )}
      </motion.div>
  );
}
