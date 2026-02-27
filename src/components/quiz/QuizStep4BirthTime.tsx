'use client';

import React, { useRef, useState, useEffect } from 'react';
import { QuizStepProps } from '@/lib/quiz/types';
import { trackQuizTimeUnknown } from '@/lib/quiz/tracking';

export default function QuizStep4BirthTime({ state, dispatch, onNext, onBack }: QuizStepProps) {
  const parts = state.birthTime ? state.birthTime.split(':').map(Number) : [12, 0];
  const [hourStr, setHourStr] = useState(String(parts[0] ?? 12).padStart(2, '0'));
  const [minuteStr, setMinuteStr] = useState(String(parts[1] ?? 0).padStart(2, '0'));

  const hourRef = useRef<HTMLInputElement>(null);
  const minuteRef = useRef<HTMLInputElement>(null);

  const isValid = state.birthTimeUnknown || state.birthTime.length > 0;

  const emit = (h: number, m: number) => {
    const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    dispatch({ type: 'SET_BIRTH_TIME', time });
  };

  // Sync from state when it changes externally
  useEffect(() => {
    if (state.birthTime) {
      const [h, m] = state.birthTime.split(':').map(Number);
      setHourStr(String(h).padStart(2, '0'));
      setMinuteStr(String(m).padStart(2, '0'));
    }
  }, [state.birthTime]);

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 2);
    setHourStr(raw);
    const n = parseInt(raw, 10);
    if (raw.length === 0) return;
    if (!isNaN(n) && n >= 0 && n <= 23) {
      emit(n, parseInt(minuteStr, 10) || 0);
      if (raw.length === 2) {
        setTimeout(() => minuteRef.current?.focus(), 0);
      }
    } else if (n > 23) {
      setHourStr('23');
      emit(23, parseInt(minuteStr, 10) || 0);
      minuteRef.current?.focus();
    }
  };

  const handleHourBlur = () => {
    const n = parseInt(hourStr, 10);
    if (isNaN(n) || n < 0) {
      setHourStr('00');
      emit(0, parseInt(minuteStr, 10) || 0);
    } else {
      const clamped = Math.min(23, Math.max(0, n));
      setHourStr(String(clamped).padStart(2, '0'));
      emit(clamped, parseInt(minuteStr, 10) || 0);
    }
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 2);
    setMinuteStr(raw);
    const n = parseInt(raw, 10);
    if (raw.length === 0) return;
    if (!isNaN(n) && n >= 0 && n <= 59) {
      emit(parseInt(hourStr, 10) || 0, n);
    } else if (n > 59) {
      setMinuteStr('59');
      emit(parseInt(hourStr, 10) || 0, 59);
    }
  };

  const handleMinuteBlur = () => {
    const n = parseInt(minuteStr, 10);
    if (isNaN(n) || n < 0) {
      setMinuteStr('00');
      emit(parseInt(hourStr, 10) || 0, 0);
    } else {
      const clamped = Math.min(59, Math.max(0, n));
      setMinuteStr(String(clamped).padStart(2, '0'));
      emit(parseInt(hourStr, 10) || 0, clamped);
    }
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
        <div className={`flex items-center justify-center gap-2 ${state.birthTimeUnknown ? 'opacity-40 pointer-events-none' : ''}`}>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] uppercase tracking-widest font-semibold text-gray-400">Год</span>
            <input
              ref={hourRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={hourStr}
              onChange={handleHourChange}
              onFocus={() => hourRef.current?.select()}
              onBlur={handleHourBlur}
              placeholder="ГГ"
              maxLength={2}
              disabled={state.birthTimeUnknown}
              className="quiz-input w-20 text-center text-3xl font-bold py-4"
              aria-label="Година народження"
            />
          </div>

          <span className="text-3xl font-light text-gray-300 mt-4">:</span>

          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] uppercase tracking-widest font-semibold text-gray-400">Хв</span>
            <input
              ref={minuteRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={minuteStr}
              onChange={handleMinuteChange}
              onFocus={() => minuteRef.current?.select()}
              onBlur={handleMinuteBlur}
              placeholder="ХХ"
              maxLength={2}
              disabled={state.birthTimeUnknown}
              className="quiz-input w-20 text-center text-3xl font-bold py-4"
              aria-label="Хвилина народження"
            />
          </div>
        </div>

        <label className="flex items-center gap-3 mt-6 cursor-pointer group">
          <input
            type="checkbox"
            checked={state.birthTimeUnknown}
            onChange={(e) => {
              dispatch({ type: 'SET_BIRTH_TIME_UNKNOWN', unknown: e.target.checked });
              if (e.target.checked) trackQuizTimeUnknown();
            }}
            className="w-5 h-5 rounded border-gray-300 text-zorya-violet focus:ring-zorya-violet/30"
          />
          <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
            Я не знаю точний час народження
          </span>
        </label>

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
