'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserProfile } from '@/lib/types';
import { loadUserProfile, saveUserProfile } from '@/lib/storage';
import ProgressBar from './ProgressBar';
import StepContainer from './StepContainer';
import WelcomeStep from './steps/WelcomeStep';
import NameLanguageStep from './steps/NameLanguageStep';
import BasicInfoStep from './steps/BasicInfoStep';
import GoalStep from './steps/GoalStep';
import ActivityStep from './steps/ActivityStep';
import FocusStep from './steps/FocusStep';
import PreferencesStep from './steps/PreferencesStep';
import SuccessStep from './steps/SuccessStep';
import { buttonVariants } from '@/lib/animations';

interface OnboardingWizardProps {
  onComplete: (profile: UserProfile) => void;
}

const defaultProfile: Partial<UserProfile> = {
  name: '',
  language: 'en',
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
  unitPreferences: {
    height: 'cm',
    weight: 'kg',
  },
};

const TOTAL_STEPS = 8;

export default function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [profile, setProfile] = useState<Partial<UserProfile>>(defaultProfile);

  // Load from localStorage on mount
  useEffect(() => {
    const savedProfile = loadUserProfile();
    if (savedProfile) {
      setProfile(savedProfile);
    }
  }, []);

  // Auto-save to localStorage on profile changes
  useEffect(() => {
    if (currentStep > 0) {
      const profileToSave = { ...profile };
      if (profileToSave.height && profileToSave.weight && profileToSave.age) {
        localStorage.setItem('userProfile', JSON.stringify(profileToSave));
      }
    }
  }, [profile, currentStep]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    // Validation for each step
    if (currentStep === 1 && (!profile.name || !profile.language)) {
      alert('Please enter your name and select a language');
      return;
    }
    if (currentStep === 2 && (!profile.height || !profile.weight || !profile.age)) {
      alert('Please fill in all basic information');
      return;
    }
    if (currentStep === 3 && !profile.goal) {
      alert('Please select your primary goal');
      return;
    }
    if (currentStep === 4 && (!profile.activityLevel || !profile.experienceLevel)) {
      alert('Please select your activity level and experience');
      return;
    }
    if (currentStep === 5 && !profile.focusArea) {
      alert('Please select your training focus');
      return;
    }

    setDirection(1);
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentStep === 0) return;
    setDirection(-1);
    setCurrentStep((prev) => prev - 1);
  };

  const handleSkipPreferences = () => {
    setDirection(1);
    setCurrentStep(7); // Skip to success step
  };

  const handleComplete = () => {
    if (profile.name && profile.language && profile.height && profile.weight && profile.age && profile.experienceLevel && profile.activityLevel) {
      const fullProfile = profile as UserProfile;
      saveUserProfile(fullProfile);
      onComplete(fullProfile);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return true; // Welcome
      case 1: return !!(profile.name && profile.language);
      case 2: return !!(profile.height && profile.weight && profile.age && profile.gender);
      case 3: return !!profile.goal;
      case 4: return !!(profile.activityLevel && profile.experienceLevel);
      case 5: return !!profile.focusArea;
      case 6: return true; // Preferences are optional
      case 7: return true; // Success
      default: return false;
    }
  };

  return (
    <div className="w-full px-4 sm:w-[90%] md:w-[85%] lg:w-[75%] xl:w-[70%] mx-auto bg-black/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-[#4A70A9]/50 shadow-2xl">
      {/* Progress Bar - Only show after welcome */}
      {currentStep > 0 && currentStep < 7 && (
        <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS - 1} />
      )}

      {/* Step Content */}
      <div className="min-h-[400px] sm:min-h-[500px]">
        {currentStep === 0 && (
          <WelcomeStep onNext={handleNext} />
        )}

        {currentStep === 1 && (
          <StepContainer
            heading="Let's Get to Know You!"
            subheading="Tell us your name and language preference"
            direction={direction}
            stepKey="name-language"
          >
            <NameLanguageStep profile={profile} onChange={updateProfile} />
          </StepContainer>
        )}

        {currentStep === 2 && (
          <StepContainer
            heading="Your Stats"
            subheading="Help us understand your body metrics"
            direction={direction}
            stepKey="basic-info"
          >
            <BasicInfoStep profile={profile} onChange={updateProfile} />
          </StepContainer>
        )}

        {currentStep === 3 && (
          <StepContainer
            heading="What's Your Main Goal?"
            subheading="We'll tailor everything to help you achieve it"
            direction={direction}
            stepKey="goal"
          >
            <GoalStep profile={profile} onChange={updateProfile} />
          </StepContainer>
        )}

        {currentStep === 4 && (
          <StepContainer
            heading="Your Activity & Experience"
            subheading="This helps us create the perfect plan"
            direction={direction}
            stepKey="activity"
          >
            <ActivityStep profile={profile} onChange={updateProfile} />
          </StepContainer>
        )}

        {currentStep === 5 && (
          <StepContainer
            heading="What's Your Training Focus?"
            subheading="Choose what matters most to you"
            direction={direction}
            stepKey="focus"
          >
            <FocusStep profile={profile} onChange={updateProfile} />
          </StepContainer>
        )}

        {currentStep === 6 && (
          <StepContainer
            heading="Personal Preferences"
            subheading="Optional, but helps us personalize better"
            direction={direction}
            stepKey="preferences"
          >
            <PreferencesStep
              profile={profile}
              onChange={updateProfile}
              onSkip={handleSkipPreferences}
            />
          </StepContainer>
        )}

        {currentStep === 7 && (
          <SuccessStep
            profile={profile as UserProfile}
            onComplete={handleComplete}
          />
        )}
      </div>

      {/* Navigation Buttons - Hide on welcome and success steps */}
      {currentStep > 0 && currentStep < 7 && (
        <div className="flex gap-3 mt-6 sm:mt-8">
          <motion.button
            variants={buttonVariants}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
            onClick={handleBack}
            className="flex-1 py-3 bg-black/50 border border-[#4A70A9]/50 hover:border-[#8FABD4]/50 rounded-xl font-semibold text-[#EFECE3] transition-all duration-300 min-h-[50px] touch-manipulation"
          >
            ← Back
          </motion.button>
          <motion.button
            variants={buttonVariants}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
            onClick={handleNext}
            disabled={!canProceed()}
            className={`
              flex-1 py-3 rounded-xl font-semibold text-[#EFECE3] transition-all duration-300 min-h-[50px] touch-manipulation
              ${
                canProceed()
                  ? 'bg-gradient-to-r from-[#8FABD4] to-[#4A70A9] hover:from-[#A8C5E0] hover:to-[#8FABD4] shadow-lg shadow-[#8FABD4]/30'
                  : 'bg-gray-600/50 cursor-not-allowed opacity-50'
              }
            `}
          >
            Next →
          </motion.button>
        </div>
      )}
    </div>
  );
}
