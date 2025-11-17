'use client';

import { useState, useEffect } from 'react';
import { UserProfile } from '@/lib/types';
import { saveUserProfile, loadUserProfile } from '@/lib/storage';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: UserProfile) => void;
}

const defaultProfile: Partial<UserProfile> = {
  height: 175,
  weight: 75,
  age: 30,
  gender: 'male',
  goal: 'maintenance',
  activityLevel: 'moderate',
  experienceLevel: 'intermediate',
  focusArea: 'general',
  dietaryRestrictions: [],
  healthIssues: [],
  targetMuscles: [],
};

export default function UserProfileModal({ isOpen, onClose, onSave }: UserProfileModalProps) {
  const [profile, setProfile] = useState<Partial<UserProfile>>(defaultProfile);
  const [dietaryInput, setDietaryInput] = useState('');
  const [healthInput, setHealthInput] = useState('');
  const [muscleInput, setMuscleInput] = useState('');

  // Load from localStorage when modal opens
  useEffect(() => {
    if (isOpen) {
      const savedProfile = loadUserProfile();
      if (savedProfile) {
        setProfile(savedProfile);
      } else {
        setProfile(defaultProfile);
      }
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (profile.height && profile.weight && profile.age && profile.experienceLevel && profile.activityLevel) {
      const fullProfile = profile as UserProfile;
      saveUserProfile(fullProfile);
      onSave(fullProfile);
      onClose();
    }
  };

  const addItem = (field: 'dietaryRestrictions' | 'healthIssues' | 'targetMuscles', value: string) => {
    if (value.trim()) {
      setProfile(prev => ({
        ...prev,
        [field]: [...(prev[field] || []), value.trim()],
      }));
      
      if (field === 'dietaryRestrictions') setDietaryInput('');
      if (field === 'healthIssues') setHealthInput('');
      if (field === 'targetMuscles') setMuscleInput('');
    }
  };

  const removeItem = (field: 'dietaryRestrictions' | 'healthIssues' | 'targetMuscles', index: number) => {
    setProfile(prev => ({
      ...prev,
      [field]: prev[field]?.filter((_, i) => i !== index) || [],
    }));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-[#1a1f2e] to-black border border-[#4A70A9]/50 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl shadow-[#8FABD4]/20 animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4A70A9] to-[#8FABD4] p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-[#EFECE3] mb-2">
                Edit Your Profile
              </h2>
              <p className="text-[#EFECE3]/90 text-sm">Update your fitness information</p>
            </div>
            <button
              onClick={onClose}
              className="text-[#EFECE3] hover:text-white text-3xl leading-none transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#8FABD4]">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={profile.height}
                  onChange={(e) => setProfile({ ...profile, height: Number(e.target.value) })}
                  className="w-full bg-black/50 border border-[#4A70A9]/50 rounded-xl px-4 py-2 text-[#EFECE3] focus:ring-2 focus:ring-[#8FABD4]/50 focus:border-[#8FABD4]/50 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-[#8FABD4]">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={profile.weight}
                  onChange={(e) => setProfile({ ...profile, weight: Number(e.target.value) })}
                  className="w-full bg-black/50 border border-[#4A70A9]/50 rounded-xl px-4 py-2 text-[#EFECE3] focus:ring-2 focus:ring-[#8FABD4]/50 focus:border-[#8FABD4]/50 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-[#8FABD4]">Age</label>
                <input
                  type="number"
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
                  className="w-full bg-black/50 border border-[#4A70A9]/50 rounded-xl px-4 py-2 text-[#EFECE3] focus:ring-2 focus:ring-[#8FABD4]/50 focus:border-[#8FABD4]/50 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-[#8FABD4]">Gender</label>
                <select
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value as any })}
                  className="w-full bg-black/50 border border-[#4A70A9]/50 rounded-xl px-4 py-2 text-[#EFECE3] focus:ring-2 focus:ring-[#8FABD4]/50 focus:border-[#8FABD4]/50 outline-none transition-all"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Goals, Activity, Experience, Focus - 2x2 Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#8FABD4]">
                  Primary Goal
                </label>
                <select
                  value={profile.goal}
                  onChange={(e) => setProfile({ ...profile, goal: e.target.value as any })}
                  className="w-full bg-black/50 border border-[#4A70A9]/50 rounded-xl px-4 py-2 text-[#EFECE3] focus:ring-2 focus:ring-[#8FABD4]/50 focus:border-[#8FABD4]/50 outline-none transition-all"
                >
                  <option value="deficit">Weight Loss (Calorie Deficit)</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="bulking">Muscle Gain (Bulking)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-[#8FABD4]">
                  Activity Level
                </label>
                <select
                  value={profile.activityLevel}
                  onChange={(e) => setProfile({ ...profile, activityLevel: e.target.value as any })}
                  className="w-full bg-black/50 border border-[#4A70A9]/50 rounded-xl px-4 py-2 text-[#EFECE3] focus:ring-2 focus:ring-[#8FABD4]/50 focus:border-[#8FABD4]/50 outline-none transition-all"
                >
                  <option value="sedentary">Sedentary (Little to no exercise)</option>
                  <option value="light">Light (Exercise 1-3 days/week)</option>
                  <option value="moderate">Moderate (Exercise 3-5 days/week)</option>
                  <option value="active">Active (Exercise 6-7 days/week)</option>
                  <option value="very_active">Very Active (Physical job + exercise)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-[#8FABD4]">
                  Training Experience
                </label>
                <select
                  value={profile.experienceLevel}
                  onChange={(e) => setProfile({ ...profile, experienceLevel: e.target.value as any })}
                  className="w-full bg-black/50 border border-[#4A70A9]/50 rounded-xl px-4 py-2 text-[#EFECE3] focus:ring-2 focus:ring-[#8FABD4]/50 focus:border-[#8FABD4]/50 outline-none transition-all"
                >
                  <option value="beginner">Beginner (&lt; 1 year training)</option>
                  <option value="intermediate">Intermediate (1-3 years)</option>
                  <option value="advanced">Advanced (3+ years)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-[#8FABD4]">
                  Training Focus
                </label>
                <select
                  value={profile.focusArea}
                  onChange={(e) => setProfile({ ...profile, focusArea: e.target.value as any })}
                  className="w-full bg-black/50 border border-[#4A70A9]/50 rounded-xl px-4 py-2 text-[#EFECE3] focus:ring-2 focus:ring-[#8FABD4]/50 focus:border-[#8FABD4]/50 outline-none transition-all"
                >
                  <option value="general">General Fitness</option>
                  <option value="strength">Strength & Power</option>
                  <option value="hypertrophy">Muscle Building (Hypertrophy)</option>
                  <option value="endurance">Endurance & Conditioning</option>
                </select>
              </div>
            </div>

            {/* Target Weight Change */}
            {profile.goal !== 'maintenance' && (
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#8FABD4]">
                  Target Weight Change (kg per week)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={profile.targetWeightChange || 0.5}
                  onChange={(e) => setProfile({ ...profile, targetWeightChange: Number(e.target.value) })}
                  className="w-full bg-black/50 border border-[#4A70A9]/50 rounded-xl px-4 py-2 text-[#EFECE3] focus:ring-2 focus:ring-[#8FABD4]/50 focus:border-[#8FABD4]/50 outline-none transition-all"
                />
                <p className="text-xs text-[#8FABD4]/70 mt-1">
                  Recommended: 0.5-1kg per week
                </p>
              </div>
            )}

            {/* Dietary Restrictions */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-[#8FABD4]">
                Dietary Restrictions (optional)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={dietaryInput}
                  onChange={(e) => setDietaryInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addItem('dietaryRestrictions', dietaryInput);
                    }
                  }}
                  placeholder="e.g., vegan, gluten-free, keto"
                  className="flex-1 bg-black/50 border border-[#4A70A9]/50 rounded-xl px-4 py-2 text-[#EFECE3] placeholder-[#8FABD4]/50 focus:ring-2 focus:ring-[#8FABD4]/50 focus:border-[#8FABD4]/50 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => addItem('dietaryRestrictions', dietaryInput)}
                  className="bg-gradient-to-r from-[#8FABD4] to-[#4A70A9] hover:from-[#A8C5E0] hover:to-[#8FABD4] text-[#EFECE3] px-4 py-2 rounded-xl transition-all duration-300 shadow-lg shadow-[#8FABD4]/30"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.dietaryRestrictions?.map((item, idx) => (
                  <span
                    key={idx}
                    className="bg-gradient-to-r from-[#8FABD4] to-[#4A70A9] px-3 py-1 rounded-full text-sm flex items-center gap-2 text-[#EFECE3]"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => removeItem('dietaryRestrictions', idx)}
                      className="text-white hover:text-red-300"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Health Issues */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-[#8FABD4]">
                Health Issues (optional)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={healthInput}
                  onChange={(e) => setHealthInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addItem('healthIssues', healthInput);
                    }
                  }}
                  placeholder="e.g., diabetes, high blood pressure"
                  className="flex-1 bg-black/50 border border-[#4A70A9]/50 rounded-xl px-4 py-2 text-[#EFECE3] placeholder-[#8FABD4]/50 focus:ring-2 focus:ring-[#8FABD4]/50 focus:border-[#8FABD4]/50 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => addItem('healthIssues', healthInput)}
                  className="bg-gradient-to-r from-[#8FABD4] to-[#4A70A9] hover:from-[#A8C5E0] hover:to-[#8FABD4] text-[#EFECE3] px-4 py-2 rounded-xl transition-all duration-300 shadow-lg shadow-[#8FABD4]/30"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.healthIssues?.map((item, idx) => (
                  <span
                    key={idx}
                    className="bg-gradient-to-r from-[#8FABD4] to-[#4A70A9] px-3 py-1 rounded-full text-sm flex items-center gap-2 text-[#EFECE3]"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => removeItem('healthIssues', idx)}
                      className="text-white hover:text-red-300"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Target Muscles */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-[#8FABD4]">
                Target Muscle Groups (optional)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={muscleInput}
                  onChange={(e) => setMuscleInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addItem('targetMuscles', muscleInput);
                    }
                  }}
                  placeholder="e.g., chest, legs, arms"
                  className="flex-1 bg-black/50 border border-[#4A70A9]/50 rounded-xl px-4 py-2 text-[#EFECE3] placeholder-[#8FABD4]/50 focus:ring-2 focus:ring-[#8FABD4]/50 focus:border-[#8FABD4]/50 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => addItem('targetMuscles', muscleInput)}
                  className="bg-gradient-to-r from-[#8FABD4] to-[#4A70A9] hover:from-[#A8C5E0] hover:to-[#8FABD4] text-[#EFECE3] px-4 py-2 rounded-xl transition-all duration-300 shadow-lg shadow-[#8FABD4]/30"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.targetMuscles?.map((item, idx) => (
                  <span
                    key={idx}
                    className="bg-gradient-to-r from-[#8FABD4] to-[#4A70A9] px-3 py-1 rounded-full text-sm flex items-center gap-2 text-[#EFECE3]"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => removeItem('targetMuscles', idx)}
                      className="text-white hover:text-red-300"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-black/40 border-t border-[#4A70A9]/30 p-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-black/50 border border-[#4A70A9]/50 hover:border-[#8FABD4]/50 rounded-xl font-semibold text-[#EFECE3] transition-all duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 bg-gradient-to-r from-[#4A70A9] to-[#8FABD4] hover:from-[#8FABD4] hover:to-[#4A70A9] rounded-xl font-semibold text-[#EFECE3] transition-all duration-300"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}


