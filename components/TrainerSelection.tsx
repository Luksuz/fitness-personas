'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { TrainerPersona } from '@/lib/types';
import { TRAINER_PERSONAS, getAllPersonas, getPersonaConfig } from '@/lib/personas';
import { loadCustomTrainers, deleteCustomTrainer, CustomTrainer } from '@/lib/customTrainers';
import CreateCustomTrainerModal from './CreateCustomTrainerModal';

interface TrainerSelectionProps {
  onSelect: (trainer: TrainerPersona) => void;
}

export default function TrainerSelection({ onSelect }: TrainerSelectionProps) {
  const builtInTrainers: TrainerPersona[] = ['mike', 'goggins', 'arnold', 'kayla', 'chris', 'jeff', 'jen', 'cassey'];
  const [customTrainers, setCustomTrainers] = useState<CustomTrainer[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<CustomTrainer | null>(null);

  useEffect(() => {
    setCustomTrainers(loadCustomTrainers());
  }, []);

  const handleSaveCustomTrainer = (trainer: CustomTrainer) => {
    setCustomTrainers(loadCustomTrainers());
  };

  const handleDeleteCustomTrainer = (e: React.MouseEvent, trainerId: string) => {
    e.stopPropagation();
    if (confirm('Jeste li sigurni da želite obrisati ovog trenera?')) {
      deleteCustomTrainer(trainerId);
      setCustomTrainers(loadCustomTrainers());
    }
  };

  const handleEditCustomTrainer = (e: React.MouseEvent, trainer: CustomTrainer) => {
    e.stopPropagation();
    setEditingTrainer(trainer);
    setIsCreateModalOpen(true);
  };

  const allPersonas = getAllPersonas();

  return (
    <div className="max-w-6xl mx-auto w-[70%]">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-[#8FABD4] to-[#4A70A9] bg-clip-text text-transparent">
          Odaberi Trenera
        </h2>
        <button
          onClick={() => {
            setEditingTrainer(null);
            setIsCreateModalOpen(true);
          }}
          className="px-5 py-2.5 bg-gradient-to-r from-[#8FABD4] to-[#4A70A9] hover:from-[#A8C5E0] hover:to-[#8FABD4] text-[#EFECE3] font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-[#8FABD4]/30 hover:shadow-xl hover:shadow-[#8FABD4]/50"
        >
          + Kreiraj Prilagođenog Trenera
        </button>
      </div>
      
      {/* Built-in Trainers */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold mb-6 text-[#8FABD4]">Ugrađeni Treneri</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {builtInTrainers.map((trainerId) => {
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
                  Odaberi {trainer.name.split(' ')[0]}
                </button>
              </div>
            </div>
          );
        })}
        </div>
      </div>

      {/* Custom Trainers */}
      {customTrainers.length > 0 && (
        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-6 text-[#8FABD4]">Prilagođeni Treneri</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {customTrainers.map((trainer) => {
              return (
                <div
                  key={trainer.id}
                  onClick={() => onSelect(trainer.id)}
                  className="bg-black/80 backdrop-blur-sm rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 border-2 border-[#4A70A9]/50 hover:border-[#8FABD4] hover:shadow-xl hover:shadow-[#8FABD4]/20 group relative"
                >
                  {/* Edit/Delete Buttons */}
                  <div className="absolute top-2 right-2 z-10 flex gap-2">
                    <button
                      onClick={(e) => handleEditCustomTrainer(e, trainer)}
                      className="bg-[#4A70A9]/80 hover:bg-[#8FABD4]/80 text-white p-2 rounded-lg transition-all"
                      title="Uredi"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => handleDeleteCustomTrainer(e, trainer.id)}
                      className="bg-red-600/80 hover:bg-red-700/80 text-white p-2 rounded-lg transition-all"
                      title="Obriši"
                    >
                      🗑️
                    </button>
                  </div>

                  {/* Trainer Image */}
                  <div className="relative h-64 w-full overflow-hidden">
                    {trainer.image ? (
                      <img
                        src={trainer.image}
                        alt={trainer.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#4A70A9] to-[#8FABD4] flex items-center justify-center text-6xl">
                        {trainer.avatar}
                      </div>
                    )}
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
                      {trainer.catchphrases.length === 0 && (
                        <p className="text-sm text-[#8FABD4]/50 italic">
                          Nema catchphrases
                        </p>
                      )}
                    </div>
                    
                    <button className="w-full bg-gradient-to-r from-[#8FABD4] via-[#6B9BC7] to-[#8FABD4] hover:from-[#A8C5E0] hover:via-[#8FABD4] hover:to-[#A8C5E0] text-[#EFECE3] font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform group-hover:scale-105 shadow-lg shadow-[#8FABD4]/30 hover:shadow-xl hover:shadow-[#8FABD4]/50">
                      Odaberi {trainer.name.split(' ')[0]}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create Custom Trainer Modal */}
      <CreateCustomTrainerModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingTrainer(null);
        }}
        onSave={handleSaveCustomTrainer}
        editingTrainer={editingTrainer}
      />
    </div>
  );
}

