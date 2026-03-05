'use client';

import React from 'react';
import { QuizStepProps } from '@/lib/quiz/types';
import { trackQuizTimeUnknown } from '@/lib/quiz/tracking';

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

function TimeSelect({ label, value, options, onChange, ariaLabel }: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  ariaLabel: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] uppercase tracking-widest font-semibold text-gray-400">{label}</span>
      {/* Wrapper shows custom chevron arrow so it's obvious it's a dropdown */}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={ariaLabel}
          style={{
            appearance: 'none',
            WebkitAppearance: 'none',
            background: 'rgba(108, 60, 225, 0.06)',
            border: '1.5px solid rgba(108, 60, 225, 0.18)',
            color: '#1a1a2e',
            borderRadius: '0.75rem',
            padding: '1rem 2.5rem 1rem 1rem',
            fontSize: '1.75rem',
            fontWeight: 700,
            width: '5.5rem',
            textAlign: 'center',
            cursor: 'pointer',
          }}
        >
          {options.map(v => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
        {/* Chevron indicator */}
        <svg
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
          width="16" height="16" viewBox="0 0 16 16" fill="none"
        >
          <path d="M4 6l4 4 4-4" stroke="rgba(108,60,225,0.5)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}

export default function QuizStep4BirthTime({ state, dispatch, onNext, onBack }: QuizStepProps) {
  const parts = state.birthTime ? state.birthTime.split(':') : ['12', '00'];
  const hourVal = parts[0] ?? '12';
  const minuteVal = parts[1] ?? '00';

  const isValid = state.birthTimeUnknown || state.birthTime.length > 0;

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
        {/* Time selects — hidden when time is unknown */}
        {!state.birthTimeUnknown && (
          <div className="flex items-center justify-center gap-2">
            <TimeSelect
              label="Год"
              value={hourVal}
              options={HOURS}
              onChange={(h) => dispatch({ type: 'SET_BIRTH_TIME', time: `${h}:${minuteVal}` })}
              ariaLabel="Година народження"
            />
            <span className="text-3xl font-light text-gray-300 mt-4">:</span>
            <TimeSelect
              label="Хв"
              value={minuteVal}
              options={MINUTES}
              onChange={(m) => dispatch({ type: 'SET_BIRTH_TIME', time: `${hourVal}:${m}` })}
              ariaLabel="Хвилина народження"
            />
          </div>
        )}

        {/* Custom checkbox */}
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
