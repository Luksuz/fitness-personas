'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { pillVariants } from '@/lib/animations';

interface PillSelectorProps {
  presets: readonly string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  label: string;
  placeholder?: string;
  allowCustom?: boolean;
}

export default function PillSelector({
  presets,
  selected,
  onChange,
  label,
  placeholder = 'Add custom...',
  allowCustom = true,
}: PillSelectorProps) {
  const [customInput, setCustomInput] = useState('');

  const togglePreset = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const addCustom = () => {
    const trimmed = customInput.trim();
    if (trimmed && !selected.includes(trimmed)) {
      onChange([...selected, trimmed]);
      setCustomInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustom();
    }
  };

  const removeItem = (value: string) => {
    onChange(selected.filter((item) => item !== value));
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-[#8FABD4]">
        {label}
      </label>

      {/* Preset pills */}
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => {
          const isSelected = selected.includes(preset);
          return (
            <motion.button
              key={preset}
              type="button"
              onClick={() => togglePreset(preset)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium
                transition-all duration-200 touch-manipulation
                ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#8FABD4] to-[#4A70A9] text-[#EFECE3] shadow-lg shadow-[#8FABD4]/30'
                    : 'bg-black/50 border border-[#4A70A9]/50 text-[#8FABD4] hover:border-[#8FABD4]/70'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {preset}
            </motion.button>
          );
        })}
      </div>

      {/* Custom input */}
      {allowCustom && (
        <div className="flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="flex-1 bg-black/50 border border-[#4A70A9]/50 rounded-xl px-4 py-2 text-[#EFECE3] placeholder-[#8FABD4]/50 focus:ring-2 focus:ring-[#8FABD4]/50 focus:border-[#8FABD4]/50 outline-none transition-all"
          />
          <button
            type="button"
            onClick={addCustom}
            className="bg-gradient-to-r from-[#8FABD4] to-[#4A70A9] hover:from-[#A8C5E0] hover:to-[#8FABD4] text-[#EFECE3] px-4 py-2 rounded-xl transition-all duration-300 shadow-lg shadow-[#8FABD4]/30 touch-manipulation active:scale-95"
          >
            Add
          </button>
        </div>
      )}

      {/* Selected items (custom ones and selected presets) */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          <AnimatePresence>
            {selected.map((item) => (
              <motion.span
                key={item}
                variants={pillVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-gradient-to-r from-[#8FABD4] to-[#4A70A9] px-3 py-1 rounded-full text-sm flex items-center gap-2 text-[#EFECE3] shadow-md"
              >
                {item}
                <button
                  type="button"
                  onClick={() => removeItem(item)}
                  className="text-white hover:text-red-300 transition-colors touch-manipulation"
                >
                  ×
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
