'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizStepProps } from '@/lib/quiz/types';

interface City {
  name: string;
  country: string;
  countryCode: string;
  lat: number;
  lon: number;
  display: string;
}

export default function QuizStep3Birthplace({ state, dispatch, onNext, onBack }: QuizStepProps) {
  const [query, setQuery] = useState(state.city || '');
  const [results, setResults] = useState<City[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const ref = useRef<HTMLDivElement>(null);

  const isValid = state.city.trim().length > 0 && state.latitude !== null;

  const search = useCallback((q: string) => {
    setQuery(q);
    // Reset selection when user types — null out coords so validation fails
    if (state.latitude !== null) {
      dispatch({ type: 'SET_BIRTHPLACE', city: q, countryCode: '', lat: null, lng: null });
    }
    if (timer.current) clearTimeout(timer.current);
    if (q.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`);
        const data: City[] = await res.json();
        setResults(data);
        setOpen(data.length > 0);
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 300);
  }, [state.latitude, dispatch]);

  const selectCity = useCallback((city: City) => {
    setQuery(city.display);
    setOpen(false);
    dispatch({
      type: 'SET_BIRTHPLACE',
      city: city.name,
      countryCode: city.countryCode,
      lat: city.lat,
      lng: city.lon,
    });
  }, [dispatch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid) onNext();
  };

  return (
    <div className="flex flex-col items-center px-4" onKeyDown={handleKeyDown}>
      <h2 className="text-2xl md:text-3xl font-display font-semibold text-gray-900 text-center mb-2">
        Де ви народились?
      </h2>
      <p className="text-gray-500 text-center mb-8">
        Місце народження впливає на положення будинків у карті
      </p>

      <div ref={ref} className="relative w-full max-w-sm">
        <div className="relative">
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => search(e.target.value)}
            placeholder="Введіть назву міста..."
            className="quiz-input w-full"
          />
          <AnimatePresence>
            {loading && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, rotate: 360 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zorya-violet text-lg select-none"
              >
                ✦
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {open && results.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 4 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="absolute z-50 w-full mt-0 rounded-xl overflow-y-auto max-h-64 bg-white border border-gray-200 shadow-lg"
            >
              {results.map((city, i) => (
                <li
                  key={i}
                  className="px-5 py-3 cursor-pointer transition-colors border-b last:border-0 border-gray-100 hover:bg-zorya-violet/5"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectCity(city)}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    selectCity(city);
                  }}
                >
                  <div className="text-sm font-medium text-gray-900">
                    {city.name}
                  </div>
                  <div className="text-xs mt-0.5 text-gray-400">
                    {city.country}
                  </div>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {state.latitude !== null && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-zorya-violet mt-3"
        >
          {state.city}, {state.countryCode}
        </motion.p>
      )}

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
