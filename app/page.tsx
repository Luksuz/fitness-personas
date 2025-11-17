'use client';

import { useRouter } from 'next/navigation';
import TrainerSelection from '@/components/TrainerSelection';
import { TrainerPersona } from '@/lib/types';

export default function Home() {
  const router = useRouter();

  const handleTrainerSelect = (trainer: TrainerPersona) => {
    // Navigate to trainer-specific route
    router.push(`/${trainer}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-[#1a1f2e] to-[#000000] text-[#EFECE3]">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <header className="text-center mb-8 sm:mb-12 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#8FABD4] via-[#4A70A9] to-[#8FABD4]">
            AI Fitness Coach
          </h1>
          <p className="text-[#8FABD4] text-base sm:text-lg">
            Your personal trainer powered by AI
          </p>
        </header>

        <TrainerSelection onSelect={handleTrainerSelect} />
      </div>
    </main>
  );
}
