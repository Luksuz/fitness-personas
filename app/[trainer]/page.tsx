'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import UserProfileForm from '@/components/UserProfileForm';
import ChatInterface from '@/components/ChatInterface';
import { TrainerPersona, UserProfile } from '@/lib/types';
import { loadUserProfile } from '@/lib/storage';
import { getPersonaConfig } from '@/lib/personas';

export default function TrainerPage() {
  const params = useParams();
  const router = useRouter();
  const trainerId = params.trainer as TrainerPersona;
  
  const [step, setStep] = useState<'profile' | 'chat'>('profile');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Validate trainer exists
  const trainerConfig = getPersonaConfig(trainerId);
  
  useEffect(() => {
    // If trainer doesn't exist, redirect to home
    if (!trainerConfig) {
      router.push('/');
      return;
    }

    // Load profile from localStorage on mount
    const savedProfile = loadUserProfile();
    if (savedProfile) {
      setUserProfile(savedProfile);
      setStep('chat');
    }
  }, [trainerId, trainerConfig, router]);

  const handleProfileSubmit = (profile: UserProfile) => {
    setUserProfile(profile);
    setStep('chat');
  };

  const handleProfileUpdate = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  const handleReset = () => {
    // Go back to trainer selection
    router.push('/');
  };

  // Show loading while validating
  if (!trainerConfig) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-black via-[#1a1f2e] to-[#000000] text-[#EFECE3] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⚙️</div>
          <p className="text-[#8FABD4]">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-[#1a1f2e] to-[#000000] text-[#EFECE3]">
      {step === 'chat' && userProfile ? (
        <ChatInterface
          trainer={trainerId}
          userProfile={userProfile}
          onReset={handleReset}
          onProfileUpdate={handleProfileUpdate}
        />
      ) : (
        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
          <header className="text-center mb-8 sm:mb-12 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#8FABD4] via-[#4A70A9] to-[#8FABD4]">
              AI Fitness Coach
            </h1>
            <p className="text-[#8FABD4] text-base sm:text-lg">
              Your personal trainer powered by AI
            </p>
          </header>

          <UserProfileForm 
            onSubmit={handleProfileSubmit}
            onBack={handleReset}
          />
        </div>
      )}
    </main>
  );
}

