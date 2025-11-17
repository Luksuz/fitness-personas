'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import { slideVariants, slideTransition } from '@/lib/animations';

interface StepContainerProps {
  children: ReactNode;
  heading: string;
  subheading?: string;
  direction: number;
  stepKey: string | number;
}

export default function StepContainer({
  children,
  heading,
  subheading,
  direction,
  stepKey,
}: StepContainerProps) {
  return (
    <AnimatePresence initial={false} custom={direction} mode="wait">
      <motion.div
        key={stepKey}
        custom={direction}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={slideTransition}
        className="w-full"
      >
        {/* Heading */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-[#8FABD4] to-[#4A70A9] bg-clip-text text-transparent">
            {heading}
          </h2>
          {subheading && (
            <p className="text-[#8FABD4]/80 text-sm sm:text-base md:text-lg">
              {subheading}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="space-y-4 sm:space-y-6">
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
