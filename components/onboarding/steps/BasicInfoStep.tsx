'use client';

import { useState } from 'react';
import SelectionCard from '../SelectionCard';
import { UserProfile } from '@/lib/types';

interface BasicInfoStepProps {
  profile: Partial<UserProfile>;
  onChange: (updates: Partial<UserProfile>) => void;
}

export default function BasicInfoStep({ profile, onChange }: BasicInfoStepProps) {
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>(
    profile.unitPreferences?.height || 'cm'
  );
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>(
    profile.unitPreferences?.weight || 'kg'
  );

  // Conversion functions
  const cmToFeet = (cm: number) => Math.round((cm / 30.48) * 10) / 10;
  const feetToCm = (feet: number) => Math.round(feet * 30.48);
  const kgToLbs = (kg: number) => Math.round(kg * 2.20462);
  const lbsToKg = (lbs: number) => Math.round(lbs / 2.20462);

  const handleHeightChange = (value: number) => {
    const cmValue = heightUnit === 'ft' ? feetToCm(value) : value;
    onChange({ 
      height: cmValue,
      unitPreferences: { ...profile.unitPreferences, height: heightUnit }
    });
  };

  const handleWeightChange = (value: number) => {
    const kgValue = weightUnit === 'lbs' ? lbsToKg(value) : value;
    onChange({ 
      weight: kgValue,
      unitPreferences: { ...profile.unitPreferences, weight: weightUnit }
    });
  };

  const handleHeightUnitToggle = () => {
    const newUnit = heightUnit === 'cm' ? 'ft' : 'cm';
    setHeightUnit(newUnit);
    onChange({ 
      unitPreferences: { ...profile.unitPreferences, height: newUnit }
    });
  };

  const handleWeightUnitToggle = () => {
    const newUnit = weightUnit === 'kg' ? 'lbs' : 'kg';
    setWeightUnit(newUnit);
    onChange({ 
      unitPreferences: { ...profile.unitPreferences, weight: newUnit }
    });
  };

  const displayHeight = profile.height
    ? heightUnit === 'ft'
      ? cmToFeet(profile.height)
      : profile.height
    : heightUnit === 'ft'
    ? 5.7
    : 175;

  const displayWeight = profile.weight
    ? weightUnit === 'lbs'
      ? kgToLbs(profile.weight)
      : profile.weight
    : weightUnit === 'lbs'
    ? 165
    : 75;

  return (
    <div className="space-y-6">
      {/* Height and Weight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Height */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-[#8FABD4]">
              Height
            </label>
            <button
              type="button"
              onClick={handleHeightUnitToggle}
              className="text-xs px-3 py-1 rounded-full bg-black/50 border border-[#4A70A9]/50 text-[#8FABD4] hover:border-[#8FABD4]/70 transition-all touch-manipulation"
            >
              {heightUnit === 'cm' ? 'Switch to ft' : 'Switch to cm'}
            </button>
          </div>
          <div className="relative">
            <input
              type="number"
              step={heightUnit === 'ft' ? '0.1' : '1'}
              value={displayHeight}
              onChange={(e) => handleHeightChange(Number(e.target.value))}
              className="w-full bg-black/50 border border-[#4A70A9]/50 rounded-xl px-4 py-3 pr-16 text-[#EFECE3] text-lg focus:ring-2 focus:ring-[#8FABD4]/50 focus:border-[#8FABD4]/50 outline-none transition-all"
              required
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8FABD4]/70 font-semibold">
              {heightUnit}
            </span>
          </div>
        </div>

        {/* Weight */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-[#8FABD4]">
              Weight
            </label>
            <button
              type="button"
              onClick={handleWeightUnitToggle}
              className="text-xs px-3 py-1 rounded-full bg-black/50 border border-[#4A70A9]/50 text-[#8FABD4] hover:border-[#8FABD4]/70 transition-all touch-manipulation"
            >
              {weightUnit === 'kg' ? 'Switch to lbs' : 'Switch to kg'}
            </button>
          </div>
          <div className="relative">
            <input
              type="number"
              value={displayWeight}
              onChange={(e) => handleWeightChange(Number(e.target.value))}
              className="w-full bg-black/50 border border-[#4A70A9]/50 rounded-xl px-4 py-3 pr-16 text-[#EFECE3] text-lg focus:ring-2 focus:ring-[#8FABD4]/50 focus:border-[#8FABD4]/50 outline-none transition-all"
              required
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8FABD4]/70 font-semibold">
              {weightUnit}
            </span>
          </div>
        </div>
      </div>

      {/* Age */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-[#8FABD4]">
          Age
        </label>
        <input
          type="number"
          value={profile.age || 30}
          onChange={(e) => onChange({ age: Number(e.target.value) })}
          className="w-full bg-black/50 border border-[#4A70A9]/50 rounded-xl px-4 py-3 text-[#EFECE3] text-lg focus:ring-2 focus:ring-[#8FABD4]/50 focus:border-[#8FABD4]/50 outline-none transition-all"
          required
        />
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-semibold mb-3 text-[#8FABD4]">
          Gender
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <SelectionCard
            icon="👨"
            title="Male"
            selected={profile.gender === 'male'}
            onClick={() => onChange({ gender: 'male' })}
          />
          <SelectionCard
            icon="👩"
            title="Female"
            selected={profile.gender === 'female'}
            onClick={() => onChange({ gender: 'female' })}
          />
          <SelectionCard
            icon="⚧️"
            title="Other"
            selected={profile.gender === 'other'}
            onClick={() => onChange({ gender: 'other' })}
          />
        </div>
      </div>
    </div>
  );
}
