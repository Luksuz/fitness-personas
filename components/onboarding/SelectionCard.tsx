'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cardVariants } from '@/lib/animations';

interface SelectionCardProps {
  icon: string | ReactNode;
  title: string;
  subtitle?: string;
  selected?: boolean;
  onClick: () => void;
  className?: string;
  compact?: boolean;
}

export default function SelectionCard({
  icon,
  title,
  subtitle,
  selected = false,
  onClick,
  className = '',
  compact = false,
}: SelectionCardProps) {
  if (compact) {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        className={`
          relative w-full p-2 sm:p-3 rounded-lg
          bg-gradient-to-br from-black/50 to-black/30
          border-2 transition-all duration-300
          text-center touch-manipulation
          ${
            selected
            ? 'border-[#8FABD4] shadow-lg shadow-[#8FABD4]/50 bg-[#8FABD4]/10' 
              : 'border-[#4A70A9]/50 hover:border-[#8FABD4]/50'
          }
          ${className}
        `}
        variants={cardVariants}
        initial="idle"
        whileHover="hover"
        whileTap="tap"
        animate={selected ? 'selected' : 'idle'}
      >
        <div className="flex flex-col items-center gap-1">
          <div className="text-2xl sm:text-3xl">
            {typeof icon === 'string' ? icon : icon}
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-[#EFECE3] truncate w-full">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[10px] sm:text-xs text-[#8FABD4]/80 truncate w-full">{subtitle}</p>
          )}
        </div>
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-[#8FABD4] to-[#4A70A9] rounded-full flex items-center justify-center"
          >
            <svg
              className="w-2.5 h-2.5 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7"></path>
            </svg>
          </motion.div>
        )}
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`
        relative w-full min-h-[80px] p-4 sm:p-6 rounded-xl
        bg-gradient-to-br from-black/50 to-black/30
        border-2 transition-all duration-300
        text-left touch-manipulation
        ${
          selected
          ? 'border-[#8FABD4] shadow-lg shadow-[#8FABD4]/50' 
            : 'border-[#4A70A9]/50 hover:border-[#8FABD4]/50'
        }
        ${className}
      `}
      variants={cardVariants}
      initial="idle"
      whileHover="hover"
      whileTap="tap"
      animate={selected ? 'selected' : 'idle'}
    >
      {/* Selected indicator */}
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-br from-[#8FABD4] to-[#4A70A9] rounded-full flex items-center justify-center"
        >
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7"></path>
          </svg>
        </motion.div>
      )}

      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className="text-4xl sm:text-5xl flex-shrink-0">
          {typeof icon === 'string' ? icon : icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-[#EFECE3] mb-1">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-[#8FABD4]/80">{subtitle}</p>
          )}
        </div>
      </div>
    </motion.button>
  );
}
