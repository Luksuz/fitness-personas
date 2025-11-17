'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ChatInterface from '@/components/ChatInterface';
import { TrainerPersona, UserProfile } from '@/lib/types';
import { loadUserProfile } from '@/lib/storage';
import { getPersonaConfig } from '@/lib/personas';

export default function TrainerPage() {
  const params = useParams();
  const router = useRouter();
  const trainerId = params.trainer as TrainerPersona;
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    if (savedProfile && savedProfile.name && savedProfile.language) {
      setUserProfile(savedProfile);
      setIsLoading(false);
    } else {
      // No profile found, redirect to home to complete onboarding
      router.push('/');
    }
  }, [trainerId, trainerConfig, router]);

  const handleProfileUpdate = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  const handleReset = () => {
    // Go back to trainer selection
    router.push('/');
  };

  // Show loading while validating
  if (isLoading || !trainerConfig || !userProfile) {
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
      <ChatInterface
        trainer={trainerId}
        userProfile={userProfile}
        onReset={handleReset}
        onProfileUpdate={handleProfileUpdate}
      />
    </main>
  );
}

