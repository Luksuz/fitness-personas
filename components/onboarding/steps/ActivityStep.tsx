'use client';

import { motion } from 'framer-motion';
import SelectionCard from '../SelectionCard';
import { UserProfile } from '@/lib/types';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/animations';

interface ActivityStepProps {
  profile: Partial<UserProfile>;
  onChange: (updates: Partial<UserProfile>) => void;
}

export default function ActivityStep({ profile, onChange }: ActivityStepProps) {
  return (
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
      className="space-y-8"
      >
        {/* Activity Level */}
        <motion.div variants={staggerItemVariants}>
        <label className="block text-sm font-semibold mb-4 text-[#8FABD4]">
            How active are you?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SelectionCard
            icon="🛋️"
            title="Sedentary"
            subtitle="Little to no exercise"
            selected={profile.activityLevel === 'sedentary'}
            onClick={() => onChange({ activityLevel: 'sedentary' })}
          />
          
          <SelectionCard
            icon="🚶"
            title="Light"
            subtitle="Exercise 1-3 days/week"
            selected={profile.activityLevel === 'light'}
            onClick={() => onChange({ activityLevel: 'light' })}
          />
          
          <SelectionCard
            icon="🏃"
            title="Moderate"
            subtitle="Exercise 3-5 days/week"
            selected={profile.activityLevel === 'moderate'}
            onClick={() => onChange({ activityLevel: 'moderate' })}
          />
          
          <SelectionCard
            icon="💪"
            title="Active"
            subtitle="Exercise 6-7 days/week"
            selected={profile.activityLevel === 'active'}
            onClick={() => onChange({ activityLevel: 'active' })}
          />
          
              <SelectionCard
            icon="🏋️"
            title="Very Active"
            subtitle="Physical job + exercise"
            selected={profile.activityLevel === 'very_active'}
            onClick={() => onChange({ activityLevel: 'very_active' })}
            className="sm:col-span-2"
              />
          </div>
        </motion.div>

        {/* Experience Level */}
        <motion.div variants={staggerItemVariants}>
        <label className="block text-sm font-semibold mb-4 text-[#8FABD4]">
          What's your training experience?
        </label>
        <div className="grid grid-cols-1 gap-3">
          <SelectionCard
            icon="🌱"
            title="Beginner"
            subtitle="Less than 1 year of training"
            selected={profile.experienceLevel === 'beginner'}
            onClick={() => onChange({ experienceLevel: 'beginner' })}
          />
          
          <SelectionCard
            icon="💪"
            title="Intermediate"
            subtitle="1-3 years of training"
            selected={profile.experienceLevel === 'intermediate'}
            onClick={() => onChange({ experienceLevel: 'intermediate' })}
          />
          
              <SelectionCard
            icon="🏆"
            title="Advanced"
            subtitle="3+ years of consistent training"
            selected={profile.experienceLevel === 'advanced'}
            onClick={() => onChange({ experienceLevel: 'advanced' })}
              />
          </div>
        </motion.div>
      </motion.div>
  );
}
