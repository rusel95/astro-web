'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import ZodiacIcon from '@/components/icons/ZodiacIcon';
import { ZODIAC_NAMES_UK } from '@/lib/constants';
import { QuizStepProps } from '@/lib/quiz/types';
import type { ZodiacSign } from '@/types/astrology';

const ZODIAC_FACTS_UK: Record<string, string> = {
  Aries: 'Овни — природжені лідери з невичерпною енергією та сміливістю.',
  Taurus: 'Тельці цінують стабільність, красу та земні задоволення.',
  Gemini: 'Близнюки — майстри комунікації з блискучим розумом.',
  Cancer: 'Раки — найбільш інтуїтивний та турботливий знак зодіаку.',
  Leo: 'Леви — яскраві та харизматичні натури з великим серцем.',
  Virgo: 'Діви мають аналітичний розум та прагнення до досконалості.',
  Libra: 'Терези шукають гармонію, справедливість та красу у всьому.',
  Scorpio: 'Скорпіони — знак трансформації та глибоких емоцій.',
  Sagittarius: 'Стрільці — вічні мандрівники та шукачі істини.',
  Capricorn: 'Козероги — амбітні стратеги з залізною волею.',
  Aquarius: 'Водолії — візіонери та новатори, що випереджають свій час.',
  Pisces: 'Риби — найбільш інтуїтивний та творчий знак зодіаку.',
};

function getZodiacSign(day: number, month: number): string {
  const dates: [number, number, string][] = [
    [1, 20, 'Capricorn'], [2, 19, 'Aquarius'], [3, 20, 'Pisces'],
    [4, 20, 'Aries'], [5, 21, 'Taurus'], [6, 21, 'Gemini'],
    [7, 22, 'Cancer'], [8, 23, 'Leo'], [9, 23, 'Virgo'],
    [10, 23, 'Libra'], [11, 22, 'Scorpio'], [12, 22, 'Sagittarius'],
  ];
  for (let i = dates.length - 1; i >= 0; i--) {
    const [m, d, sign] = dates[i];
    if (month > m || (month === m && day >= d)) return sign;
  }
  return 'Capricorn';
}

export default function QuizStep2Sign({ state, dispatch, onNext, onBack }: QuizStepProps) {
  const sign = state.zodiacSign || getZodiacSign(state.birthDay!, state.birthMonth!);

  useEffect(() => {
    if (!state.zodiacSign && state.birthDay && state.birthMonth) {
      dispatch({ type: 'SET_ZODIAC_SIGN', sign: getZodiacSign(state.birthDay, state.birthMonth) });
    }
  }, [state.birthDay, state.birthMonth, state.zodiacSign, dispatch]);

  const signNameUk = ZODIAC_NAMES_UK[sign as ZodiacSign] || sign;
  const fact = ZODIAC_FACTS_UK[sign] || '';

  return (
    <div className="flex flex-col items-center px-4">
      <h2 className="text-2xl md:text-3xl font-display font-semibold text-gray-900 text-center mb-2">
        Ваш знак зодіаку
      </h2>
      <p className="text-gray-500 text-center mb-8">
        Визначений за вашою датою народження
      </p>

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="flex flex-col items-center"
      >
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-zorya-violet/20 to-zorya-violet/5 flex items-center justify-center mb-4 border border-zorya-violet/20">
          <ZodiacIcon sign={sign} size={56} className="text-zorya-violet" />
        </div>
        <h3 className="text-3xl font-display font-bold text-gray-900 mb-3">
          {signNameUk}
        </h3>
        <p className="text-gray-600 text-center max-w-xs leading-relaxed">
          {fact}
        </p>
      </motion.div>

      <div className="flex gap-3 mt-10">
        <button onClick={onBack} className="quiz-button-secondary">
          Назад
        </button>
        <button onClick={onNext} className="quiz-button">
          Далі
        </button>
      </div>
    </div>
  );
}
