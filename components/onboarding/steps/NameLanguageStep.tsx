'use client';

import { motion } from 'framer-motion';
import SelectionCard from '../SelectionCard';
import { UserProfile } from '@/lib/types';
import { Language, LANGUAGE_CONFIG } from '@/lib/translations';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/animations';

interface NameLanguageStepProps {
  profile: Partial<UserProfile>;
  onChange: (updates: Partial<UserProfile>) => void;
}

// Languages to show (all supported)
const AVAILABLE_LANGUAGES: Language[] = ['en', 'hr', 'de', 'es', 'fr', 'it', 'pt', 'nl', 'pl', 'ru'];

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
          What's your name? / Wie heißt du? / ¿Cómo te llamas?
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
          Preferred Language / Bevorzugte Sprache / Idioma Preferido
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
          {AVAILABLE_LANGUAGES.map((lang) => {
            const config = LANGUAGE_CONFIG[lang];
            return (
              <SelectionCard
                key={lang}
                icon={config.flag}
                title={config.nativeName}
                subtitle={config.name !== config.nativeName ? config.name : undefined}
                selected={profile.language === lang}
                onClick={() => onChange({ language: lang })}
                compact
              />
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
