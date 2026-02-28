'use client';

import { QuizStepProps } from '@/lib/quiz/types';

const MONTHS_UK = [
  'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
  'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень',
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1935 }, (_, i) => currentYear - i);
const days = Array.from({ length: 31 }, (_, i) => i + 1);

export default function QuizStep1Birthday({ state, dispatch, onNext }: QuizStepProps) {
  const isValid =
    state.birthDay !== null &&
    state.birthMonth !== null &&
    state.birthYear !== null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid) onNext();
  };

  return (
    <div className="flex flex-col items-center px-4" onKeyDown={handleKeyDown}>
      <h2 className="text-2xl md:text-3xl font-display font-semibold text-gray-900 text-center mb-2">
        Коли ви народились?
      </h2>
      <p className="text-gray-500 text-center mb-8">
        Дата народження — основа вашої натальної карти
      </p>

      <div className="flex gap-3 w-full max-w-sm">
        {/* Day */}
        <select
          value={state.birthDay ?? ''}
          onChange={(e) => {
            const day = Number(e.target.value);
            dispatch({
              type: 'SET_BIRTH_DATE',
              day,
              month: state.birthMonth,
              year: state.birthYear,
            });
          }}
          className="quiz-select flex-1"
        >
          <option value="">День</option>
          {days.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        {/* Month */}
        <select
          value={state.birthMonth ?? ''}
          onChange={(e) => {
            const month = Number(e.target.value);
            dispatch({
              type: 'SET_BIRTH_DATE',
              day: state.birthDay,
              month,
              year: state.birthYear,
            });
          }}
          className="quiz-select flex-[1.5]"
        >
          <option value="">Місяць</option>
          {MONTHS_UK.map((name, i) => (
            <option key={i} value={i + 1}>{name}</option>
          ))}
        </select>

        {/* Year */}
        <select
          value={state.birthYear ?? ''}
          onChange={(e) => {
            const year = Number(e.target.value);
            dispatch({
              type: 'SET_BIRTH_DATE',
              day: state.birthDay,
              month: state.birthMonth,
              year,
            });
          }}
          className="quiz-select flex-1"
        >
          <option value="">Рік</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <button
        onClick={onNext}
        disabled={!isValid}
        className="quiz-button mt-10"
      >
        Далі
      </button>
    </div>
  );
}
