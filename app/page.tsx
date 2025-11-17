'use client';

import { useState, useEffect } from 'react';
import TrainerSelection from '@/components/TrainerSelection';
import UserProfileForm from '@/components/UserProfileForm';
import ChatInterface from '@/components/ChatInterface';
import { TrainerPersona, UserProfile } from '@/lib/types';
import { loadUserProfile } from '@/lib/storage';

export default function Home() {
  const [step, setStep] = useState<'trainer' | 'profile' | 'chat'>('trainer');
  const [selectedTrainer, setSelectedTrainer] = useState<TrainerPersona | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Load profile from localStorage on mount
  useEffect(() => {
    const savedProfile = loadUserProfile();
    if (savedProfile) {
      setUserProfile(savedProfile);
    }
  }, []);

  const handleTrainerSelect = (trainer: TrainerPersona) => {
    setSelectedTrainer(trainer);
    // Check if profile already exists in localStorage
    const savedProfile = loadUserProfile();
    if (savedProfile) {
      // Profile exists, update state and skip to chat
      setUserProfile(savedProfile);
      setStep('chat');
    } else {
      // No profile, show profile form
      setStep('profile');
    }
  };

  const handleProfileSubmit = (profile: UserProfile) => {
    setUserProfile(profile);
    setStep('chat');
  };

  const handleProfileUpdate = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  const handleReset = () => {
    setStep('trainer');
    setSelectedTrainer(null);
    // Don't clear userProfile on reset, keep it for next time
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-[#1a1f2e] to-[#000000] text-[#EFECE3]">
      {step === 'chat' && selectedTrainer && userProfile ? (
        <ChatInterface
          trainer={selectedTrainer}
          userProfile={userProfile}
          onReset={handleReset}
          onProfileUpdate={handleProfileUpdate}
        />
      ) : (
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#8FABD4] via-[#4A70A9] to-[#8FABD4]">
              AI Fitness Coach
            </h1>
            <p className="text-[#8FABD4] text-lg">
              Your personal trainer powered by AI
            </p>
          </header>

          {step === 'trainer' && (
            <TrainerSelection onSelect={handleTrainerSelect} />
          )}

          {step === 'profile' && selectedTrainer && (
            <UserProfileForm 
              onSubmit={handleProfileSubmit}
              onBack={() => setStep('trainer')}
            />
          )}
        </div>
      )}
    </main>
  );
}
