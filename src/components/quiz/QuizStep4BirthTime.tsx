'use client';

import { QuizStepProps } from '@/lib/quiz/types';
import { trackQuizTimeUnknown } from '@/lib/quiz/tracking';

export default function QuizStep4BirthTime({ state, dispatch, onNext, onBack }: QuizStepProps) {
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
        <input
          type="time"
          value={state.birthTime}
          onChange={(e) => dispatch({ type: 'SET_BIRTH_TIME', time: e.target.value })}
          disabled={state.birthTimeUnknown}
          className={`quiz-input w-full text-center text-2xl ${
            state.birthTimeUnknown ? 'opacity-40' : ''
          }`}
        />

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
