'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface City {
  name: string;
  country: string;
  countryCode: string;
  lat: number;
  lon: number;
  display: string;
}

interface Props {
  onSelect: (city: City) => void;
  value?: string;
}

const INPUT_STYLE: React.CSSProperties = {
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.15)',
};

export default function CitySearch({ onSelect, value }: Props) {
  const [query, setQuery] = useState(value ?? '');
  const [results, setResults] = useState<City[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
  };

  // Attach / detach click-outside listener
  const onFocus = () => {
    document.addEventListener('mousedown', handleClickOutside);
  };
  const onBlur = () => {
    // small delay so click on list item registers first
    setTimeout(() => document.removeEventListener('mousedown', handleClickOutside), 200);
  };

  const search = (q: string) => {
    setQuery(q);
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
  };

  return (
    <div ref={ref} className="relative w-full">
      {/* Input */}
      <div className="relative">
        <input
          type="text"
          autoFocus
          value={query}
          onChange={e => search(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder="Введіть назву міста..."
          className="w-full px-6 py-4 rounded-2xl text-white text-center text-lg placeholder-white/30 focus:outline-none transition-all"
          style={INPUT_STYLE}
        />

        {/* Loading spinner */}
        <AnimatePresence>
          {loading && (
            <motion.span
              key="spinner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, rotate: 360 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 text-lg select-none"
            >
              ✦
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 4 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="absolute z-50 w-full mt-0 rounded-2xl overflow-y-auto max-h-64"
            style={{
              background: 'rgba(15, 10, 30, 0.97)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
            {results.map((city, i) => (
              <li
                key={i}
                className="px-5 py-3 cursor-pointer transition-colors border-b last:border-0 group"
                style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                onMouseDown={e => e.preventDefault()}
                onClick={() => {
                  onSelect(city);
                  setQuery(city.display);
                  setOpen(false);
                }}
                onTouchEnd={e => {
                  e.preventDefault();
                  onSelect(city);
                  setQuery(city.display);
                  setOpen(false);
                }}
              >
                <div
                  className="text-sm font-medium transition-colors"
                  style={{ color: 'rgba(232,232,240,0.9)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#9966E6'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(232,232,240,0.9)'; }}
                >
                  {city.name}
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.38)' }}>
                  {city.country}
                </div>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
