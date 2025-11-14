'use client';

import Image from 'next/image';
import { TrainerPersona } from '@/lib/types';
import { TRAINER_PERSONAS } from '@/lib/personas';

interface TrainerSelectionProps {
  onSelect: (trainer: TrainerPersona) => void;
}

export default function TrainerSelection({ onSelect }: TrainerSelectionProps) {
  const trainers: TrainerPersona[] = ['mike', 'goggins', 'arnold', 'kayla', 'chris', 'jeff', 'jen', 'cassey'];

  return (
    <div className="max-w-6xl mx-auto w-[70%]">
      <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-[#8FABD4] to-[#4A70A9] bg-clip-text text-transparent">
        Choose Your Trainer
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trainers.map((trainerId) => {
          const trainer = TRAINER_PERSONAS[trainerId];
          
          return (
            <div
              key={trainerId}
              onClick={() => onSelect(trainerId)}
              className="bg-black/80 backdrop-blur-sm rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 border-2 border-[#4A70A9]/50 hover:border-[#8FABD4] hover:shadow-xl hover:shadow-[#8FABD4]/20 group"
            >
              {/* Trainer Image */}
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={trainer.image}
                  alt={trainer.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-[#EFECE3] mb-1">
                    {trainer.name}
                  </h3>
                  <p className="text-[#8FABD4] text-sm">
                    {trainer.description}
                  </p>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="space-y-2 mb-6">
                  <p className="text-sm text-[#8FABD4]/70 font-semibold">
                    Catchphrases:
                  </p>
                  {trainer.catchphrases.slice(0, 2).map((phrase, idx) => (
                    <p key={idx} className="text-sm text-[#EFECE3]/80 italic">
                      &quot;{phrase}&quot;
                    </p>
                  ))}
                </div>
                
                <button className="w-full bg-gradient-to-r from-[#8FABD4] via-[#6B9BC7] to-[#8FABD4] hover:from-[#A8C5E0] hover:via-[#8FABD4] hover:to-[#A8C5E0] text-[#EFECE3] font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform group-hover:scale-105 shadow-lg shadow-[#8FABD4]/30 hover:shadow-xl hover:shadow-[#8FABD4]/50">
                  Select {trainer.name.split(' ')[0]}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

