'use client';

import { QuizStepProps } from '@/lib/quiz/types';

export default function QuizStep5NameGender({ state, dispatch, onNext, onBack }: QuizStepProps) {
  const isValid = state.name.trim().length > 0 && state.gender !== null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid) onNext();
  };

  return (
    <div className="flex flex-col items-center px-4" onKeyDown={handleKeyDown}>
      <h2 className="text-2xl md:text-3xl font-display font-semibold text-gray-900 text-center mb-2">
        Як вас звати?
      </h2>
      <p className="text-gray-500 text-center mb-8">
        Ваше ім&apos;я додасть персональності вашому гороскопу
      </p>

      <div className="w-full max-w-sm space-y-6">
        <input
          type="text"
          autoFocus
          value={state.name}
          onChange={(e) => dispatch({ type: 'SET_NAME', name: e.target.value })}
          placeholder="Ваше ім'я"
          className="quiz-input w-full"
        />

        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Ваша стать</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => dispatch({ type: 'SET_GENDER', gender: 'female' })}
              className={`quiz-option ${state.gender === 'female' ? 'quiz-option-active' : ''}`}
            >
              <span className="text-2xl mb-1">☽</span>
              <span className="font-medium">Жіноча</span>
              <span className="text-xs text-gray-400">Інь — місячна енергія</span>
            </button>
            <button
              type="button"
              onClick={() => dispatch({ type: 'SET_GENDER', gender: 'male' })}
              className={`quiz-option ${state.gender === 'male' ? 'quiz-option-active' : ''}`}
            >
              <span className="text-2xl mb-1">☉</span>
              <span className="font-medium">Чоловіча</span>
              <span className="text-xs text-gray-400">Ян — сонячна енергія</span>
            </button>
          </div>
        </div>
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
