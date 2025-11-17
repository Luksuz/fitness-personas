'use client';

import { motion } from 'framer-motion';
import SelectionCard from '../SelectionCard';
import { UserProfile } from '@/lib/types';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/animations';

interface NameLanguageStepProps {
  profile: Partial<UserProfile>;
  onChange: (updates: Partial<UserProfile>) => void;
}

export default function NameLanguageStep({ profile, onChange }: NameLanguageStepProps) {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Name Input */}
      <motion.div variants={staggerItemVariants}>
        <label className="block text-sm font-semibold mb-2 text-[#8FABD4]">
          What's your name?
        </label>
        <input
          type="text"
          value={profile.name || ''}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Enter your name"
          className="w-full bg-black/50 border border-[#4A70A9]/50 rounded-xl px-4 py-3 text-[#EFECE3] text-lg placeholder-[#8FABD4]/50 focus:ring-2 focus:ring-[#8FABD4]/50 focus:border-[#8FABD4]/50 outline-none transition-all"
          required
        />
      </motion.div>

      {/* Language Selection */}
      <motion.div variants={staggerItemVariants}>
        <label className="block text-sm font-semibold mb-3 text-[#8FABD4]">
          Preferred Language / Preferirani Jezik
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SelectionCard
            icon="🇬🇧"
            title="English"
            subtitle="I prefer English"
            selected={profile.language === 'en'}
            onClick={() => onChange({ language: 'en' })}
          />
          <SelectionCard
            icon="🇭🇷"
            title="Hrvatski"
            subtitle="Preferiram Hrvatski"
            selected={profile.language === 'hr'}
            onClick={() => onChange({ language: 'hr' })}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}


