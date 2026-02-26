'use client';

import { useReducer, useEffect, useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { quizReducer, initialQuizState, loadQuizState } from '@/lib/quiz/reducer';
import { validateStep } from '@/lib/quiz/validation';
import {
  trackQuizStart,
  trackQuizStep,
  trackQuizStepBack,
  trackQuizAbandonment,
  trackQuizCompleted,
  trackMiniHoroscopeViewed,
} from '@/lib/quiz/tracking';
import QuizProgressBar from '@/components/quiz/QuizProgressBar';
import QuizStep1Birthday from '@/components/quiz/QuizStep1Birthday';
import QuizStep2Sign from '@/components/quiz/QuizStep2Sign';
import QuizStep3Birthplace from '@/components/quiz/QuizStep3Birthplace';
import QuizStep4BirthTime from '@/components/quiz/QuizStep4BirthTime';
import QuizStep5NameGender from '@/components/quiz/QuizStep5NameGender';
import QuizStep6Email from '@/components/quiz/QuizStep6Email';
import MiniHoroscope from '@/components/quiz/MiniHoroscope';
import PaywallSection from '@/components/product/PaywallSection';

interface MiniHoroscopeData {
  natal_chart: {
    ascendant: number;
    planets: Array<{
      name: string;
      longitude: number;
      sign: string;
      house: number;
      isRetrograde: boolean;
      speed: number;
    }>;
    houses: Array<{
      number: number;
      cusp: number;
      sign: string;
    }>;
    aspects: Array<{
      planet1: string;
      planet2: string;
      type: string;
      orb: number;
      isApplying: boolean;
    }>;
  };
  key_aspects: Array<{
    planet1: string;
    planet2: string;
    aspect_type: string;
    degrees: string;
    interpretation_uk: string;
  }>;
  zodiac_sign_uk: string;
  ascendant_sign_uk: string;
}

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: { x: '0%', opacity: 1 },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

const STEP_NAMES = [
  'birth_date',
  'zodiac_sign',
  'birthplace',
  'birth_time',
  'name_gender',
  'email',
];

export default function QuizClient() {
  const [state, dispatch] = useReducer(quizReducer, initialQuizState);
  const [direction, setDirection] = useState(0);
  const [horoscopeData, setHoroscopeData] = useState<MiniHoroscopeData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);
  const startedRef = useRef(false);

  // Restore state from sessionStorage
  useEffect(() => {
    const saved = loadQuizState();
    if (saved && !saved.completed) {
      dispatch({ type: 'RESTORE', state: saved });
    }
    setRestored(true);
  }, []);

  // Track quiz start once
  useEffect(() => {
    if (restored && !startedRef.current && state.currentStep === 0 && !state.completed) {
      trackQuizStart();
      startedRef.current = true;
    }
  }, [restored, state.currentStep, state.completed]);

  // Track abandonment on page leave
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!state.completed && state.currentStep > 0) {
        trackQuizAbandonment(state.currentStep);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state.currentStep, state.completed]);

  const handleNext = useCallback(() => {
    if (!validateStep(state.currentStep, state)) return;
    trackQuizStep(state.currentStep, STEP_NAMES[state.currentStep]);
    setDirection(1);
    dispatch({ type: 'NEXT' });
  }, [state]);

  const handleBack = useCallback(() => {
    trackQuizStepBack(state.currentStep);
    setDirection(-1);
    dispatch({ type: 'BACK' });
  }, [state.currentStep]);

  const handleSubmit = useCallback(async () => {
    if (!validateStep(state.currentStep, state)) return;

    trackQuizStep(state.currentStep, STEP_NAMES[state.currentStep]);
    trackQuizCompleted();
    setIsLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      // Step 1: Save quiz session
      const sessionRes = await fetch('/api/quiz/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          session_id: state.sessionId,
          birth_date: `${state.birthYear}-${String(state.birthMonth).padStart(2, '0')}-${String(state.birthDay).padStart(2, '0')}`,
          birth_time: state.birthTime || '12:00',
          birth_time_unknown: state.birthTimeUnknown,
          birth_city: state.city,
          birth_lat: state.latitude,
          birth_lng: state.longitude,
          country_code: state.countryCode,
          name: state.name,
          gender: state.gender,
          email: state.email,
          zodiac_sign: state.zodiacSign,
        }),
      });

      if (!sessionRes.ok) {
        const errData = await sessionRes.json();
        throw new Error(errData.error || 'Failed to save session');
      }

      const sessionData = await sessionRes.json();
      dispatch({ type: 'SET_SESSION_ID', sessionId: sessionData.session_id });

      // Step 2: Generate mini-horoscope
      const completeRes = await fetch('/api/quiz/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          session_id: sessionData.session_id,
        }),
      });

      if (!completeRes.ok) {
        const errData = await completeRes.json();
        throw new Error(errData.error || 'Failed to generate horoscope');
      }

      const completeData = await completeRes.json();
      setHoroscopeData(completeData.mini_horoscope);
      dispatch({ type: 'SET_COMPLETED' });
      trackMiniHoroscopeViewed();
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setError('Час очікування вийшов. Натисніть "Спробувати ще раз".');
      } else {
        setError(err instanceof Error ? err.message : 'Щось пішло не так. Спробуйте ще раз.');
      }
    } finally {
      clearTimeout(timeout);
      setIsLoading(false);
    }
  }, [state]);

  // Don't render until state is restored
  if (!restored) return null;

  // Show results if completed
  if (state.completed && horoscopeData) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <MiniHoroscope
          data={horoscopeData}
          userName={state.name}
        />
        <PaywallSection quizCompleted={true} />
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="w-20 h-20 rounded-full border-3 border-zorya-violet/20 border-t-zorya-violet animate-spin mb-6" />
        <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
          Складаємо вашу карту...
        </h3>
        <p className="text-gray-500 text-center">
          {state.name}, аналізуємо положення планет у момент вашого народження
        </p>
      </div>
    );
  }

  const stepComponents = [
    QuizStep1Birthday,
    QuizStep2Sign,
    QuizStep3Birthplace,
    QuizStep4BirthTime,
    QuizStep5NameGender,
    QuizStep6Email,
  ];

  const StepComponent = stepComponents[state.currentStep];
  const isLastStep = state.currentStep === 5;

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <QuizProgressBar currentStep={state.currentStep} />

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-center"
        >
          <p className="text-red-700 text-sm mb-3">{error}</p>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-zorya-violet text-white text-sm font-medium rounded-xl hover:bg-zorya-violet/90 transition-colors"
          >
            Спробувати ще раз
          </button>
        </motion.div>
      )}

      <div className="mt-8 relative overflow-hidden min-h-[400px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={state.currentStep}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'tween', duration: 0.3 }}
            className="absolute inset-0"
          >
            <StepComponent
              state={state}
              dispatch={dispatch}
              onNext={isLastStep ? handleSubmit : handleNext}
              onBack={handleBack}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
