'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';
import RecommendedTrainers from '@/components/RecommendedTrainers';
import TrainerSelection from '@/components/TrainerSelection';
import { TrainerPersona, UserProfile } from '@/lib/types';
import { loadUserProfile } from '@/lib/storage';

export default function Home() {
  const router = useRouter();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has completed onboarding
    const savedProfile = loadUserProfile();
    if (savedProfile && savedProfile.name && savedProfile.language) {
      setUserProfile(savedProfile);
      setShowOnboarding(false);
    } else {
      setShowOnboarding(true);
    }
    setIsLoading(false);
  }, []);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setShowOnboarding(false);
  };

  const handleTrainerSelect = (trainer: TrainerPersona) => {
    // Navigate to trainer-specific route
    router.push(`/${trainer}`);
  };

  const handleResetProfile = () => {
    localStorage.removeItem('userProfile');
    setUserProfile(null);
    setShowOnboarding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
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
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-12 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#8FABD4] via-[#4A70A9] to-[#8FABD4]">
            AI Fitness Coach
          </h1>
          <p className="text-[#8FABD4] text-base sm:text-lg">
            {showOnboarding 
              ? (userProfile?.language === 'hr' ? 'Vaš osobni trener pokretaný AI' : 'Your personal trainer powered by AI')
              : (userProfile?.language === 'hr' ? 'Vaš osobni trener pokretaný AI' : 'Your personal trainer powered by AI')}
          </p>
          
          {/* Edit Profile Button (only show when not in onboarding) */}
          {!showOnboarding && userProfile && (
            <button
              onClick={handleResetProfile}
              className="mt-4 text-sm text-[#8FABD4] hover:text-[#EFECE3] transition-colors underline decoration-dashed underline-offset-4"
            >
              {userProfile.language === 'hr' ? '✏️ Uredi profil' : '✏️ Edit profile'}
            </button>
          )}
        </header>

        {/* Onboarding Wizard */}
        {showOnboarding && (
          <OnboardingWizard onComplete={handleOnboardingComplete} />
        )}

        {/* Recommended Trainers (after onboarding) */}
        {!showOnboarding && userProfile && (
          <>
            <div className="mb-12">
              <RecommendedTrainers
                profile={userProfile}
                onSelect={handleTrainerSelect}
              />
            </div>

            {/* All Trainers Section */}
            <div id="all-trainers" className="pt-8 border-t border-[#4A70A9]/30">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-[#EFECE3]">
                {userProfile.language === 'hr' ? 'Svi Treneri' : 'All Trainers'}
              </h2>
              <TrainerSelection onSelect={handleTrainerSelect} />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
