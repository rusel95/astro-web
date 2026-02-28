'use client';

import { TOTAL_STEPS } from '@/lib/quiz/types';

interface QuizProgressBarProps {
  currentStep: number;
}

export default function QuizProgressBar({ currentStep }: QuizProgressBarProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => (
        <div
          key={i}
          className={`h-2 rounded-full transition-all duration-300 ${
            i === currentStep
              ? 'w-8 bg-zorya-violet'
              : i < currentStep
                ? 'w-2 bg-zorya-violet/60'
                : 'w-2 bg-gray-300'
          }`}
        />
      ))}
      <span className="ml-3 text-sm text-gray-500 font-medium">
        {currentStep + 1}/{TOTAL_STEPS}
      </span>
    </div>
  );
}
