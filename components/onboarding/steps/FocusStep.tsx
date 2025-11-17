'use client';

import { motion } from 'framer-motion';
import SelectionCard from '../SelectionCard';
import { UserProfile } from '@/lib/types';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/animations';

interface FocusStepProps {
  profile: Partial<UserProfile>;
  onChange: (updates: Partial<UserProfile>) => void;
}

export default function FocusStep({ profile, onChange }: FocusStepProps) {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <motion.div variants={staggerItemVariants} className="grid grid-cols-1 gap-4">
        <SelectionCard
          icon="⚡"
          title="General Fitness"
          subtitle="Overall health, wellness, and mobility"
          selected={profile.focusArea === 'general'}
          onClick={() => onChange({ focusArea: 'general' })}
        />
        
        <SelectionCard
          icon="🏋️"
          title="Strength & Power"
          subtitle="Build maximum strength and explosive power"
          selected={profile.focusArea === 'strength'}
          onClick={() => onChange({ focusArea: 'strength' })}
        />
        
        <SelectionCard
          icon="💪"
          title="Muscle Building"
          subtitle="Hypertrophy focus for size and definition"
          selected={profile.focusArea === 'hypertrophy'}
          onClick={() => onChange({ focusArea: 'hypertrophy' })}
        />
        
        <SelectionCard
          icon="🏃"
          title="Endurance & Conditioning"
          subtitle="Cardio fitness and stamina"
          selected={profile.focusArea === 'endurance'}
          onClick={() => onChange({ focusArea: 'endurance' })}
        />
      </motion.div>

      <motion.p
        variants={staggerItemVariants}
        className="text-xs text-center text-[#8FABD4]/60 pt-2"
      >
        Don't worry, you can always adjust this later! 💪
      </motion.p>
    </motion.div>
  );
}
