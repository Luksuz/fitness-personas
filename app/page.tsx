'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';
import TrainerSelection from '@/components/TrainerSelection';
import { TrainerPersona, UserProfile } from '@/lib/types';
import { loadUserProfile } from '@/lib/storage';
import { t } from '@/lib/translations';

export default function Home() {
  const router = useRouter();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get language from profile, default to 'en'
  const lang = userProfile?.language || 'en';

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

  // Taglines in different languages
  const getTagline = () => {
    const taglines: Record<string, string> = {
      en: 'Your personal trainer powered by AI',
      hr: 'Vaš osobni trener pokretan AI-jem',
      de: 'Ihr persönlicher KI-Trainer',
      es: 'Tu entrenador personal impulsado por IA',
      fr: 'Votre coach personnel propulsé par l\'IA',
      it: 'Il tuo allenatore personale basato su IA',
      pt: 'Seu personal trainer com IA',
      nl: 'Jouw persoonlijke AI-trainer',
      pl: 'Twój osobisty trener AI',
      ru: 'Ваш персональный ИИ-тренер',
    };
    return taglines[lang] || taglines.en;
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-black via-[#1a1f2e] to-[#000000] text-[#EFECE3] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⚙️</div>
          <p className="text-[#8FABD4]">{t(lang, 'loading')}</p>
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
            {getTagline()}
          </p>
          
          {/* Edit Profile Button (only show when not in onboarding) */}
          {!showOnboarding && userProfile && (
            <button
              onClick={handleResetProfile}
              className="mt-4 text-sm text-[#8FABD4] hover:text-[#EFECE3] transition-colors underline decoration-dashed underline-offset-4"
            >
              {t(lang, 'editProfile')}
            </button>
          )}
        </header>

        {/* Onboarding Wizard */}
        {showOnboarding && (
          <OnboardingWizard onComplete={handleOnboardingComplete} />
        )}

        {/* Trainer Selection (after onboarding) */}
        {!showOnboarding && userProfile && (
          <div className="mb-12">
            <TrainerSelection 
              onSelect={handleTrainerSelect}
              profile={userProfile}
            />
          </div>
        )}
      </div>
    </main>
  );
}
