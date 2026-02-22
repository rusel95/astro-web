'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import CitySearch from '@/components/CitySearch';
import DateInputPicker from '@/components/DateInputPicker';
import TimePicker from '@/components/TimePicker';
import { isSupabaseConfigured, createClient } from '@/lib/supabase/client';
import { posthog } from '@/lib/posthog';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';

const TOTAL_STEPS = 5;

const BG = 'linear-gradient(to bottom, #0f0a1e, #1a0e35)';
const BTN_GRAD = 'linear-gradient(135deg, #6C3CE1 0%, #9966E6 100%)';
const INPUT_STYLE: React.CSSProperties = {
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.15)',
};

interface ZodiacSign {
  name: string;
  symbol: string;
  color: string;
  from: [number, number];
  to: [number, number];
}

const ZODIAC_SIGNS: ZodiacSign[] = [
  { name: 'Овен',     symbol: '♈', color: '#ef4444', from: [3, 21],  to: [4, 19]  },
  { name: 'Телець',   symbol: '♉', color: '#22c55e', from: [4, 20],  to: [5, 20]  },
  { name: 'Близнюки', symbol: '♊', color: '#eab308', from: [5, 21],  to: [6, 20]  },
  { name: 'Рак',      symbol: '♋', color: '#94a3b8', from: [6, 21],  to: [7, 22]  },
  { name: 'Лев',      symbol: '♌', color: '#d4af37', from: [7, 23],  to: [8, 22]  },
  { name: 'Діва',     symbol: '♍', color: '#14b8a6', from: [8, 23],  to: [9, 22]  },
  { name: 'Терези',   symbol: '♎', color: '#ec4899', from: [9, 23],  to: [10, 22] },
  { name: 'Скорпіон', symbol: '♏', color: '#dc2626', from: [10, 23], to: [11, 21] },
  { name: 'Стрілець', symbol: '♐', color: '#f97316', from: [11, 22], to: [12, 21] },
  { name: 'Козеріг',  symbol: '♑', color: '#92400e', from: [12, 22], to: [1, 19]  },
  { name: 'Водолій',  symbol: '♒', color: '#3b82f6', from: [1, 20],  to: [2, 18]  },
  { name: 'Риби',     symbol: '♓', color: '#a855f7', from: [2, 19],  to: [3, 20]  },
];

const ZODIAC_WHEEL = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

function getZodiacSign(dateStr: string): ZodiacSign | null {
  if (!dateStr) return null;
  const parts = dateStr.split('-').map(Number);
  const m = parts[1];
  const d = parts[2];
  if (!m || !d) return null;
  for (const sign of ZODIAC_SIGNS) {
    const [fm, fd] = sign.from;
    const [tm, td] = sign.to;
    if (fm <= tm) {
      if ((m === fm && d >= fd) || (m === tm && d <= td) || (m > fm && m < tm)) return sign;
    } else {
      if ((m === fm && d >= fd) || (m === tm && d <= td) || m > fm || m < tm) return sign;
    }
  }
  return null;
}

const STEP_TITLES = [
  'Яка ваша дата народження?',
  'Де ви народились?',
  'О котрій годині ви народились?',
  'Як вас звати?',
  'Ваша електронна пошта',
];

const STEP_SUBTITLES = [
  'Дата народження визначає положення Сонця у вашій карті',
  'Місце народження потрібне для розрахунку Асцендента та будинків',
  'Час народження визначає ваш Асцендент — маску, яку ви показуєте світу',
  "Вкажіть вашу стать та ім'я для персоналізованого звіту",
  "Необов'язково — для збереження карти та сповіщень",
];

export default function NewChartPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  // Form state
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [birthDate, setBirthDate] = useState('1995-06-15'); // default so drum shows something
  const [birthTime, setBirthTime] = useState('12:00');
  const [unknownTime, setUnknownTime] = useState(false);
  const [city, setCity] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const zodiacSign = getZodiacSign(birthDate);

  const canAdvance = useCallback((): boolean => {
    switch (step) {
      case 0: return true; // drum picker always has a valid date
      case 1: return city.length > 0 && lat !== 0;
      case 2: return true;
      case 3: return name.trim().length > 0 && gender !== '';
      case 4: return true;
      default: return false;
    }
  }, [step, birthDate, city, lat, name, gender]);

  const handleSubmitRef = React.useRef<() => void>();

  const goNext = useCallback(() => {
    if (!canAdvance()) return;
    if (step < TOTAL_STEPS - 1) {
      track(ANALYTICS_EVENTS.ONBOARDING_STEP_COMPLETED, { step, from: step, to: step + 1 });
      setDirection(1);
      setStep(s => s + 1);
    } else if (handleSubmitRef.current) {
      handleSubmitRef.current();
    }
  }, [step, canAdvance]);

  const goBack = () => {
    if (step > 0) {
      setDirection(-1);
      setStep(s => s - 1);
    }
  };

  useEffect(() => {
    track(ANALYTICS_EVENTS.ONBOARDING_STARTED);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !loading) goNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, loading]);

  const handleSubmit = useCallback(async () => {
    if (!name || !birthDate || !city) {
      setError('Заповніть всі поля');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          birthDate,
          birthTime: unknownTime ? '12:00' : birthTime,
          city,
          countryCode,
          latitude: lat,
          longitude: lon,
          gender,
        }),
      });
      const data: { id?: string; chart?: unknown; error?: string } = await res.json();
      if (data.error) throw new Error(data.error);
      if (!data.id) throw new Error('Помилка відповіді сервера');
      const chartJson = JSON.stringify(data.chart);
      const inputJson = JSON.stringify({ name, gender });
      sessionStorage.setItem(`chart-${data.id}`, chartJson);
      sessionStorage.setItem(`chart-input-${data.id}`, inputJson);
      // Also persist to localStorage so shared links work on the same device
      localStorage.setItem(`chart-${data.id}`, chartJson);
      localStorage.setItem(`chart-input-${data.id}`, inputJson);

      // Save to Supabase if user is logged in
      if (isSupabaseConfigured()) {
        try {
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.from('charts').upsert({
              id: data.id,
              user_id: user.id,
              name,
              birth_date: birthDate,
              birth_time: unknownTime ? '12:00' : birthTime,
              city,
              country_code: countryCode,
              latitude: lat,
              longitude: lon,
              gender,
              chart_data: data.chart,
            });
          }
        } catch {
          // Non-critical: chart is in sessionStorage anyway
          console.warn('Could not save chart to Supabase');
        }
      }

      track(ANALYTICS_EVENTS.CHART_CREATED, {
        chart_id: data.id,
        zodiac: birthDate ? birthDate.substring(0, 7) : null,
        has_birth_time: !unknownTime,
        gender,
      });
      router.push(`/chart/${data.id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Помилка розрахунку';
      setError(message);
      setLoading(false);
    }
  }, [name, birthDate, birthTime, unknownTime, city, countryCode, lat, lon, gender, router]);

  useEffect(() => {
    handleSubmitRef.current = handleSubmit;
  }, [handleSubmit]);

  // ─── Loading screen ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center"
        style={{ background: BG }}
      >
        <div className="flex flex-col items-center gap-8">
          {/* Spinning zodiac wheel */}
          <div className="relative w-36 h-36">
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
              {ZODIAC_WHEEL.map((s, i) => {
                const angle = (i / 12) * 360;
                const rad = (angle * Math.PI) / 180;
                return (
                  <span
                    key={i}
                    className="absolute text-lg font-bold select-none"
                    style={{
                      color: 'rgba(153, 102, 230, 0.7)',
                      left: `${50 + 44 * Math.cos(rad)}%`,
                      top: `${50 + 44 * Math.sin(rad)}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {s}
                  </span>
                );
              })}
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span
                className="text-4xl select-none"
                style={{ color: '#d4af37' }}
                animate={{ scale: [1, 1.25, 1], rotate: [0, 180, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                ✦
              </motion.span>
            </div>
          </div>

          <div className="text-center">
            <motion.p
              className="text-2xl font-bold text-white"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Складаємо вашу карту...
            </motion.p>
            <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {name} • {birthDate}
            </p>
          </div>

          <div
            className="w-52 h-1 rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.1)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: BTN_GRAD }}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 6, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </div>
    );
  }

  // ─── Step animations ──────────────────────────────────────────────────────
  const stepVariants = {
    enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: '0%', opacity: 1 },
    exit: (d: number) => ({ x: d < 0 ? '100%' : '-100%', opacity: 0 }),
  };

  const advance = canAdvance();
  const isLast = step === TOTAL_STEPS - 1;

  // ─── Desktop left panel ──────────────────────────────────────────────────
  const DesktopPanel = () => (
    <div
      className="hidden lg:flex lg:w-[45%] xl:w-1/2 flex-col items-center justify-center relative overflow-hidden flex-shrink-0"
      style={{ background: 'linear-gradient(160deg, #120a28 0%, #1e0d40 50%, #0f0a1e 100%)' }}
    >
      {/* Decorative orbs */}
      <div className="absolute top-[-120px] right-[-80px] w-80 h-80 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #6C3CE1, transparent)' }} />
      <div className="absolute bottom-[-80px] left-[-60px] w-64 h-64 rounded-full opacity-15 blur-3xl" style={{ background: 'radial-gradient(circle, #9966E6, transparent)' }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-12 gap-10">
        {/* Zodiac wheel */}
        <div className="relative w-52 h-52">
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          >
            {ZODIAC_WHEEL.map((s, i) => {
              const angle = (i / 12) * 360;
              const rad = (angle * Math.PI) / 180;
              return (
                <span
                  key={i}
                  className="absolute text-2xl font-bold select-none"
                  style={{
                    color: 'rgba(153, 102, 230, 0.55)',
                    left: `${50 + 44 * Math.cos(rad)}%`,
                    top: `${50 + 44 * Math.sin(rad)}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {s}
                </span>
              );
            })}
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center flex-col gap-1">
            <motion.span
              className="text-5xl select-none"
              style={{ color: '#d4af37' }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              ✦
            </motion.span>
            <span className="text-lg font-bold text-white/80">Зоря</span>
          </div>
        </div>

        {/* Step progress visual */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-2">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <motion.div
                key={i}
                className="rounded-full"
                animate={{
                  width: i === step ? 24 : 8,
                  background: i <= step ? '#6C3CE1' : 'rgba(255,255,255,0.15)',
                }}
                style={{ height: 8 }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
          <p className="text-sm text-white/40 tabular-nums">Крок {step + 1} з {TOTAL_STEPS}</p>
        </div>

        {/* Current step description */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-3"
          >
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              {STEP_SUBTITLES[step]}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Feature pills */}
        <div className="flex flex-col gap-2 w-full max-w-xs">
          {['🔭 Астрономічна точність', '🤖 AI-інтерпретація', '🔒 Приватність гарантована'].map(f => (
            <div key={f} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white/50" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {f}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ─── Main render ──────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[60] flex flex-row" style={{ background: BG }}>
      {/* Desktop left panel */}
      <DesktopPanel />

      {/* Right / full-width form panel */}
      <div className="flex-1 flex flex-col min-w-0">

      {/* ── Progress bar ── */}
      <div className="h-1 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <motion.div
          className="h-full"
          style={{ background: BTN_GRAD }}
          animate={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        />
      </div>

      {/* ── Top nav ── */}
      <div className="flex items-center px-4 pt-3 pb-1 flex-shrink-0">
        <AnimatePresence>
          {step > 0 && (
            <motion.button
              key="back-btn"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              onClick={goBack}
              className="w-10 h-10 flex items-center justify-center rounded-full text-xl transition-all"
              style={{ color: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.07)' }}
              aria-label="Назад"
            >
              ←
            </motion.button>
          )}
        </AnimatePresence>
        <div className="flex-1" />
        <span className="text-xs tabular-nums lg:hidden" style={{ color: 'rgba(255,255,255,0.28)' }}>
          {step + 1} / {TOTAL_STEPS}
        </span>
      </div>

      {/* ── Animated step content ── */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className="absolute inset-0 flex flex-col px-5 pb-6"
          >
            {/* Title block */}
            <div className="pt-6 pb-4 lg:pt-10 text-center lg:text-left">
              <h1 className="text-[1.75rem] md:text-[2rem] lg:text-[2.25rem] font-bold text-white leading-tight">
                {STEP_TITLES[step]}
              </h1>
              <p className="text-sm mt-2 leading-relaxed lg:hidden" style={{ color: 'rgba(255,255,255,0.38)' }}>
                {STEP_SUBTITLES[step]}
              </p>
            </div>

            {/* Step-specific content — vertically centred */}
            <div className="flex-1 flex flex-col items-center lg:items-start justify-center">
              <div className="w-full max-w-sm lg:max-w-md">

                {/* ── Step 0: Date ── */}
                {step === 0 && (
                  <div className="flex flex-col items-center gap-5">
                    <DateInputPicker
                      value={birthDate}
                      onChange={setBirthDate}
                    />

                    {/* Compact zodiac reveal */}
                    <AnimatePresence>
                      {zodiacSign && (
                        <motion.div
                          key={zodiacSign.symbol}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                          className="flex items-center gap-4 px-5 py-3 rounded-2xl"
                          data-testid="zodiac-pill"
                          style={{
                            background: `${zodiacSign.color}18`,
                            border: `1px solid ${zodiacSign.color}40`,
                          }}
                        >
                          <motion.span
                            className="leading-none select-none flex-shrink-0"
                            style={{
                              fontSize: '42px',
                              color: zodiacSign.color,
                              filter: `drop-shadow(0 0 12px ${zodiacSign.color})`,
                            }}
                            animate={{ scale: [1, 1.06, 1] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                          >
                            {zodiacSign.symbol}
                          </motion.span>
                          <div className="flex flex-col gap-0.5">
                            <p
                              className="text-[10px] uppercase tracking-[0.2em]"
                              style={{ color: 'rgba(255,255,255,0.4)' }}
                            >
                              Сонце в знаку
                            </p>
                            <p
                              className="text-lg font-bold"
                              style={{ color: zodiacSign.color }}
                            >
                              {zodiacSign.name}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* ── Step 1: City ── */}
                {step === 1 && (
                  <div className="flex flex-col gap-4">
                    <CitySearch
                      value={city}
                      onSelect={c => {
                        setCity(c.name);
                        setCountryCode(c.countryCode);
                        setLat(c.lat);
                        setLon(c.lon);
                      }}
                    />
                    {lat !== 0 ? (
                      <motion.p
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm font-medium text-center"
                        style={{ color: '#4ade80' }}
                      >
                        ✓ {city}, {countryCode}
                      </motion.p>
                    ) : (
                      <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.28)' }}>
                        Введіть назву міста і оберіть зі списку
                      </p>
                    )}
                  </div>
                )}

                {/* ── Step 2: Time ── */}
                {step === 2 && (
                  <div className="flex flex-col items-center gap-6">
                    <AnimatePresence mode="wait">
                      {unknownTime ? (
                        <motion.div
                          key="unknown"
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.96 }}
                          className="w-full text-center py-6 rounded-2xl"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                          <p className="text-4xl font-bold text-white/40">12:00</p>
                          <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
                            Деякі розрахунки будуть менш точними
                          </p>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="time-picker"
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.96 }}
                          className="w-full"
                        >
                          <TimePicker
                            value={birthTime}
                            onChange={setBirthTime}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button
                      onClick={() => {
                        const next = !unknownTime;
                        setUnknownTime(next);
                        if (next) setBirthTime('12:00');
                      }}
                      className="flex items-center gap-3 group"
                    >
                      <div
                        className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all"
                        style={{
                          background: unknownTime ? '#6C3CE1' : 'transparent',
                          border: unknownTime ? '1px solid #9966E6' : '1px solid rgba(255,255,255,0.3)',
                        }}
                      >
                        {unknownTime && (
                          <span className="text-white text-xs font-bold">✓</span>
                        )}
                      </div>
                      <span className="text-sm select-none" style={{ color: 'rgba(255,255,255,0.55)' }}>
                        Не знаю час народження
                      </span>
                    </button>
                  </div>
                )}

                {/* ── Step 3: Gender + Name ── */}
                {step === 3 && (
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-3">
                      {(['male', 'female'] as const).map(g => (
                        <button
                          key={g}
                          onClick={() => setGender(g)}
                          className="py-4 rounded-2xl font-semibold text-base transition-all"
                          style={{
                            background: gender === g ? BTN_GRAD : 'rgba(255,255,255,0.06)',
                            border: gender === g ? 'none' : '1px solid rgba(255,255,255,0.12)',
                            color: gender === g ? '#fff' : 'rgba(255,255,255,0.5)',
                            boxShadow: gender === g ? '0 4px 20px rgba(108,60,225,0.45)' : 'none',
                          }}
                        >
                          {g === 'male' ? '♂ Чоловік' : '♀ Жінка'}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Ваше ім'я"
                      autoFocus
                      className="w-full px-6 py-4 rounded-2xl text-white text-center text-lg placeholder-white/30 focus:outline-none transition-all"
                      style={INPUT_STYLE}
                    />
                    {error && (
                      <p className="text-red-400 text-sm text-center">{error}</p>
                    )}
                  </div>
                )}

                {/* ── Step 4: Email (optional) ── */}
                {step === 4 && (
                  <div className="flex flex-col gap-4">
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      autoFocus
                      className="w-full px-6 py-4 rounded-2xl text-white text-center text-lg placeholder-white/30 focus:outline-none transition-all"
                      style={INPUT_STYLE}
                    />
                    {error && (
                      <p className="text-red-400 text-sm text-center">{error}</p>
                    )}
                  </div>
                )}

              </div>
            </div>

            {/* ── Bottom action buttons ── */}
            <div className="flex flex-col gap-3 pt-4">
              {/* Skip button (email step only) */}
              {isLast && (
                <button
                  onClick={goNext}
                  className="text-sm text-center py-1 transition-colors hover:text-white/60"
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                >
                  Пропустити
                </button>
              )}

              {/* Main Next / Submit button */}
              <motion.button
                onClick={goNext}
                disabled={!advance}
                className="w-full h-14 rounded-2xl font-bold text-lg text-white transition-all"
                style={{
                  background: advance ? BTN_GRAD : 'rgba(255,255,255,0.08)',
                  opacity: advance ? 1 : 0.45,
                  cursor: advance ? 'pointer' : 'not-allowed',
                  boxShadow: advance ? '0 4px 24px rgba(108,60,225,0.45)' : 'none',
                }}
                whileHover={advance ? { scale: 1.02 } : {}}
                whileTap={advance ? { scale: 0.97 } : {}}
              >
                {isLast ? 'Розрахувати карту ✦' : 'Далі →'}
              </motion.button>
            </div>

          </motion.div>
        </AnimatePresence>
      </div>
      </div> {/* closes: right panel (flex-1 flex flex-col min-w-0) */}
    </div>
  );
}
