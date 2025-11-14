'use client';

import { useState, useRef } from 'react';
import { PersonaConfig } from '@/lib/personas';
import { CustomTrainer, saveCustomTrainer, generateCustomTrainerId } from '@/lib/customTrainers';

interface CreateCustomTrainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (trainer: CustomTrainer) => void;
  editingTrainer?: CustomTrainer | null;
}

export default function CreateCustomTrainerModal({ isOpen, onClose, onSave, editingTrainer }: CreateCustomTrainerModalProps) {
  const [formData, setFormData] = useState<Partial<CustomTrainer>>({
    name: editingTrainer?.name || '',
    description: editingTrainer?.description || '',
    avatar: editingTrainer?.avatar || '💪',
    systemPrompt: editingTrainer?.systemPrompt || '',
    catchphrases: editingTrainer?.catchphrases || [],
    image: editingTrainer?.image || '',
  });
  const [catchphraseInput, setCatchphraseInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string>(editingTrainer?.image || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData(prev => ({ ...prev, image: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addCatchphrase = () => {
    if (catchphraseInput.trim()) {
      setFormData(prev => ({
        ...prev,
        catchphrases: [...(prev.catchphrases || []), catchphraseInput.trim()],
      }));
      setCatchphraseInput('');
    }
  };

  const removeCatchphrase = (index: number) => {
    setFormData(prev => ({
      ...prev,
      catchphrases: prev.catchphrases?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.systemPrompt) {
      alert('Molimo unesite ime, opis i system prompt!');
      return;
    }

    const trainer: CustomTrainer = {
      id: editingTrainer?.id || generateCustomTrainerId(),
      name: formData.name,
      description: formData.description,
      avatar: formData.avatar || '💪',
      systemPrompt: formData.systemPrompt,
      catchphrases: formData.catchphrases || [],
      image: formData.image || '',
      createdAt: editingTrainer?.createdAt || Date.now(),
    };

    saveCustomTrainer(trainer);
    onSave(trainer);
    onClose();
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      avatar: '💪',
      systemPrompt: '',
      catchphrases: [],
      image: '',
    });
    setImagePreview('');
    setCatchphraseInput('');
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
                {editingTrainer ? 'Uredi Prilagođenog Trenera' : 'Kreiraj Prilagođenog Trenera'}
              </h2>
              <p className="text-[#EFECE3]/90 text-sm">Unesite informacije o treneru</p>
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
                  Ime Trenera *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black/50 border border-[#4A70A9]/50 rounded-xl px-4 py-2 text-[#EFECE3] focus:ring-2 focus:ring-[#8FABD4]/50 focus:border-[#8FABD4]/50 outline-none transition-all"
                  required
                  placeholder="npr. John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-[#8FABD4]">
                  Avatar Emoji
                </label>
                <input
                  type="text"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  className="w-full bg-black/50 border border-[#4A70A9]/50 rounded-xl px-4 py-2 text-[#EFECE3] focus:ring-2 focus:ring-[#8FABD4]/50 focus:border-[#8FABD4]/50 outline-none transition-all"
                  placeholder="💪"
                  maxLength={2}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-[#8FABD4]">
                Opis *
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-black/50 border border-[#4A70A9]/50 rounded-xl px-4 py-2 text-[#EFECE3] focus:ring-2 focus:ring-[#8FABD4]/50 focus:border-[#8FABD4]/50 outline-none transition-all"
                required
                placeholder="npr. Personal trainer sa fokusom na snagu"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-[#8FABD4]">
                Slika Trenera
              </label>
              <div className="flex gap-4 items-start">
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-black/50 border border-[#4A70A9]/50 hover:border-[#8FABD4]/50 rounded-xl px-4 py-2 text-[#EFECE3] transition-all"
                  >
                    {imagePreview ? 'Promijeni Sliku' : 'Odaberi Sliku'}
                  </button>
                </div>
                {imagePreview && (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-[#4A70A9]/50">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* System Prompt */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-[#8FABD4]">
                System Prompt / Persona Konfiguracija *
              </label>
              <textarea
                value={formData.systemPrompt}
                onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                className="w-full bg-black/50 border border-[#4A70A9]/50 rounded-xl px-4 py-3 text-[#EFECE3] focus:ring-2 focus:ring-[#8FABD4]/50 focus:border-[#8FABD4]/50 outline-none transition-all min-h-[200px] resize-y"
                required
                placeholder="Opišite kako trener razgovara, njegov stil, pristup treningu i prehrani..."
              />
              <p className="text-xs text-[#8FABD4]/70 mt-1">
                Ovo određuje kako će AI trener komunicirati i ponašati se
              </p>
            </div>

            {/* Catchphrases */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-[#8FABD4]">
                Catchphrases (Nepoznate Fraze)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={catchphraseInput}
                  onChange={(e) => setCatchphraseInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCatchphrase();
                    }
                  }}
                  placeholder="npr. 'Let's go!'"
                  className="flex-1 bg-black/50 border border-[#4A70A9]/50 rounded-xl px-4 py-2 text-[#EFECE3] placeholder-[#8FABD4]/50 focus:ring-2 focus:ring-[#8FABD4]/50 focus:border-[#8FABD4]/50 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={addCatchphrase}
                  className="bg-gradient-to-r from-[#8FABD4] to-[#4A70A9] hover:from-[#A8C5E0] hover:to-[#8FABD4] text-[#EFECE3] px-4 py-2 rounded-xl transition-all duration-300 shadow-lg shadow-[#8FABD4]/30"
                >
                  Dodaj
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.catchphrases?.map((phrase, idx) => (
                  <span
                    key={idx}
                    className="bg-gradient-to-r from-[#8FABD4] to-[#4A70A9] px-3 py-1 rounded-full text-sm flex items-center gap-2 text-[#EFECE3]"
                  >
                    {phrase}
                    <button
                      type="button"
                      onClick={() => removeCatchphrase(idx)}
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
            Odustani
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 bg-gradient-to-r from-[#4A70A9] to-[#8FABD4] hover:from-[#8FABD4] hover:to-[#4A70A9] rounded-xl font-semibold text-[#EFECE3] transition-all duration-300"
          >
            {editingTrainer ? 'Spremi Promjene' : 'Kreiraj Trenera'}
          </button>
        </div>
      </div>
    </div>
  );
}

