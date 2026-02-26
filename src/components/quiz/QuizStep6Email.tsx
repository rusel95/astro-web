'use client';

import { QuizStepProps } from '@/lib/quiz/types';

export default function QuizStep6Email({ state, dispatch, onNext, onBack }: QuizStepProps) {
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email);
  const isValid = emailValid && state.consentAccepted;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid) onNext();
  };

  return (
    <div className="flex flex-col items-center px-4" onKeyDown={handleKeyDown}>
      <h2 className="text-2xl md:text-3xl font-display font-semibold text-gray-900 text-center mb-2">
        Куди надіслати ваш гороскоп?
      </h2>
      <p className="text-gray-500 text-center mb-8">
        Ми надішлемо персональний міні-гороскоп на вашу пошту
      </p>

      <div className="w-full max-w-sm space-y-6">
        <input
          type="email"
          autoFocus
          value={state.email}
          onChange={(e) => dispatch({ type: 'SET_EMAIL', email: e.target.value })}
          placeholder="your@email.com"
          className="quiz-input w-full"
        />

        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={state.consentAccepted}
            onChange={(e) => dispatch({ type: 'SET_CONSENT', accepted: e.target.checked })}
            className="w-5 h-5 mt-0.5 rounded border-gray-300 text-zorya-violet focus:ring-zorya-violet/30 shrink-0"
          />
          <span className="text-sm text-gray-600 leading-relaxed">
            Я погоджуюсь з{' '}
            <a href="/terms" target="_blank" className="text-zorya-violet hover:underline">
              Користувацькою угодою
            </a>{' '}
            та{' '}
            <a href="/privacy" target="_blank" className="text-zorya-violet hover:underline">
              Політикою конфіденційності
            </a>
          </span>
        </label>
      </div>

      <div className="flex gap-3 mt-10">
        <button onClick={onBack} className="quiz-button-secondary">
          Назад
        </button>
        <button onClick={onNext} disabled={!isValid} className="quiz-button">
          Відкрити гороскоп
        </button>
      </div>
    </div>
  );
}
