'use client';

import React from 'react';
import { QuizStepProps } from '@/lib/quiz/types';
import { trackQuizTimeUnknown } from '@/lib/quiz/tracking';

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

export default function QuizStep4BirthTime({ state, dispatch, onNext, onBack }: QuizStepProps) {
  const parts = state.birthTime ? state.birthTime.split(':') : ['12', '00'];
  const hourVal = parts[0] ?? '12';
  const minuteVal = parts[1] ?? '00';

  const isValid = state.birthTimeUnknown || state.birthTime.length > 0;

  const setHour = (h: string) => {
    dispatch({ type: 'SET_BIRTH_TIME', time: `${h}:${minuteVal}` });
  };

  const setMinute = (m: string) => {
    dispatch({ type: 'SET_BIRTH_TIME', time: `${hourVal}:${m}` });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid) onNext();
  };

  return (
    <div className="flex flex-col items-center px-4" onKeyDown={handleKeyDown}>
      <h2 className="text-2xl md:text-3xl font-display font-semibold text-gray-900 text-center mb-2">
        О котрій годині ви народились?
      </h2>
      <p className="text-gray-500 text-center mb-8">
        Точний час дозволяє визначити ваш асцендент
      </p>

      <div className="w-full max-w-sm">
        {/* Time selects — hidden when time is unknown (#101: no active fields when unknown) */}
        {!state.birthTimeUnknown && (
          <div className="flex items-center justify-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] uppercase tracking-widest font-semibold text-gray-400">Год</span>
              <select
                value={hourVal}
                onChange={(e) => setHour(e.target.value)}
                className="quiz-select w-24 text-center text-2xl font-bold py-4"
                aria-label="Година народження"
              >
                {HOURS.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>

            <span className="text-3xl font-light text-gray-300 mt-4">:</span>

            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] uppercase tracking-widest font-semibold text-gray-400">Хв</span>
              <select
                value={minuteVal}
                onChange={(e) => setMinute(e.target.value)}
                className="quiz-select w-24 text-center text-2xl font-bold py-4"
                aria-label="Хвилина народження"
              >
                {MINUTES.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Custom checkbox — fixes black square rendering bug (#100) */}
        <button
          type="button"
          onClick={() => {
            const next = !state.birthTimeUnknown;
            dispatch({ type: 'SET_BIRTH_TIME_UNKNOWN', unknown: next });
            if (next) trackQuizTimeUnknown();
          }}
          className="flex items-center gap-3 mt-6 group cursor-pointer"
        >
          <div
            className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all"
            style={{
              background: state.birthTimeUnknown ? '#6C3CE1' : 'transparent',
              border: state.birthTimeUnknown ? '1.5px solid #9966E6' : '1.5px solid rgba(26,26,46,0.25)',
            }}
          >
            {state.birthTimeUnknown && (
              <span className="text-white text-xs font-bold leading-none">✓</span>
            )}
          </div>
          <span className="text-gray-700 group-hover:text-gray-900 transition-colors select-none">
            Я не знаю точний час народження
          </span>
        </button>

        {state.birthTimeUnknown && (
          <p className="mt-4 text-sm text-gray-500 bg-zorya-violet/5 rounded-xl p-4 leading-relaxed">
            Нічого страшного! Ми використаємо полудень (12:00) для розрахунків.
            Більшість аспектів між планетами залишаться точними.
          </p>
        )}
      </div>

      <div className="flex gap-3 mt-10">
        <button onClick={onBack} className="quiz-button-secondary">
          Назад
        </button>
        <button onClick={onNext} disabled={!isValid} className="quiz-button">
          Далі
        </button>
      </div>
    </div>
  );
}
