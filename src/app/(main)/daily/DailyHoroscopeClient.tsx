'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import DateInputPicker from '@/components/DateInputPicker';
import ZodiacIcon from '@/components/icons/ZodiacIcon';
import GlassCard from '@/components/ui/GlassCard';
import { ZODIAC_NAMES_UK } from '@/lib/constants';
import { ZodiacSign } from '@/types/astrology';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';

function getZodiacSignFromDate(dateStr: string): ZodiacSign | null {
  if (!dateStr) return null;
  const parts = dateStr.split('-').map(Number);
  const month = parts[1];
  const day = parts[2];
  if (!month || !day) return null;
  const dates: [number, number, ZodiacSign][] = [
    [1, 20, 'Capricorn'], [2, 19, 'Aquarius'], [3, 20, 'Pisces'],
    [4, 20, 'Aries'], [5, 21, 'Taurus'], [6, 21, 'Gemini'],
    [7, 22, 'Cancer'], [8, 23, 'Leo'], [9, 23, 'Virgo'],
    [10, 23, 'Libra'], [11, 22, 'Scorpio'], [12, 22, 'Sagittarius'],
  ];
  for (let i = dates.length - 1; i >= 0; i--) {
    const [m, d, sign] = dates[i];
    if (month > m || (month === m && day >= d)) return sign;
  }
  return 'Capricorn';
}

interface HoroscopeData {
  sign: string;
  sign_uk: string;
  date: string;
  horoscope: {
    general_uk: string;
    love_uk: string;
    career_uk: string;
    health_uk: string;
  };
  overall_rating: number;
  lucky_number: number;
  mood_uk: string;
}

const CATEGORY_CONFIG = [
  { key: 'love_uk' as const, label: 'Кохання', emoji: '💕', color: 'from-pink-500/20 to-rose-500/20 border-pink-500/20' },
  { key: 'career_uk' as const, label: 'Кар\'єра', emoji: '💼', color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/20' },
  { key: 'health_uk' as const, label: 'Здоров\'я', emoji: '🌿', color: 'from-green-500/20 to-emerald-500/20 border-green-500/20' },
];

export default function DailyHoroscopeClient() {
  const [birthDate, setBirthDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<HoroscopeData | null>(null);
  const [userSign, setUserSign] = useState<ZodiacSign | null>(null);

  const canSubmit = !!birthDate;

  async function handleSubmit() {
    if (!canSubmit) return;
    const sign = getZodiacSignFromDate(birthDate);
    if (!sign) {
      setError('Не вдалося визначити знак зодіаку');
      return;
    }

    setUserSign(sign);
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/daily-horoscope?sign=${sign}`);
      if (!res.ok) throw new Error('Помилка завантаження');
      const json = await res.json();
      setData(json);

      track(ANALYTICS_EVENTS.DAILY_HOROSCOPE_VIEWED, {
        sign,
        source: 'daily_page',
      });
    } catch {
      setError('Не вдалося завантажити гороскоп. Спробуйте пізніше.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold">
          ✨ Безкоштовно
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-text-primary">
          Гороскоп на сьогодні
        </h1>
        <p className="text-text-secondary max-w-md mx-auto">
          Дізнайтеся, що зірки приготували для вас сьогодні. 
          Персональний прогноз на основі вашого знаку зодіаку.
        </p>
      </motion.div>

      {/* Form */}
      {!data && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Дата народження
              </label>
              <DateInputPicker value={birthDate} onChange={setBirthDate} />
              {birthDate && getZodiacSignFromDate(birthDate) && (
                <div className="flex items-center gap-2 mt-2 text-sm text-text-secondary">
                  <ZodiacIcon sign={getZodiacSignFromDate(birthDate)!} size={16} className="text-zorya-violet" />
                  <span>{ZODIAC_NAMES_UK[getZodiacSignFromDate(birthDate)!]}</span>
                </div>
              )}
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={!canSubmit || loading}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-zorya-violet to-zorya-blue hover:shadow-lg hover:shadow-zorya-purple/30"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Завантаження...
                </span>
              ) : (
                'Дізнатися прогноз'
              )}
            </button>
          </GlassCard>
        </motion.div>
      )}

      {/* Results */}
      <AnimatePresence mode="wait">
        {data && userSign && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-5"
          >
            {/* General forecast */}
            <GlassCard variant="accent" className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-zorya-purple/20 flex items-center justify-center">
                  <ZodiacIcon sign={userSign} size={24} className="text-zorya-violet" />
                </div>
                <div>
                  <h2 className="text-lg font-display font-bold text-text-primary">
                    {data.sign_uk}
                  </h2>
                  <p className="text-xs text-text-muted">
                    {new Date().toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${i < Math.round(data.overall_rating / 2) ? 'text-zorya-gold' : 'text-white/20'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">{data.overall_rating}/10</p>
                </div>
              </div>

              <p className="text-text-secondary text-sm leading-relaxed">
                {data.horoscope.general_uk}
              </p>

              <div className="flex items-center gap-4 text-xs text-text-muted pt-2 border-t border-white/10">
                <span>🎯 Настрій: <span className="text-text-secondary">{data.mood_uk}</span></span>
                <span>🍀 Число: <span className="text-text-secondary">{data.lucky_number}</span></span>
              </div>
            </GlassCard>

            {/* Categories */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {CATEGORY_CONFIG.map((cat) => (
                <GlassCard key={cat.key} className={`p-4 space-y-2 bg-gradient-to-br ${cat.color}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{cat.emoji}</span>
                    <h3 className="text-sm font-semibold text-text-primary">{cat.label}</h3>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {data.horoscope[cat.key]}
                  </p>
                </GlassCard>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => { setData(null); setUserSign(null); setError(''); }}
                className="flex-1 py-3 rounded-xl text-sm text-text-secondary hover:text-text-primary transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                ← Нова дата
              </button>
              <Link href="/horoscope/monthly" className="flex-1">
                <GlassCard variant="premium" hover className="p-3 text-center cursor-pointer group">
                  <p className="text-sm font-semibold text-text-primary group-hover:text-zorya-violet transition-colors">
                    Місячний гороскоп →
                  </p>
                  <p className="text-xs text-text-muted">Детальний прогноз на місяць</p>
                </GlassCard>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEO content (always visible) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <GlassCard variant="subtle" className="p-6 space-y-3">
          <h2 className="text-lg font-display font-semibold text-text-primary">
            Про щоденний гороскоп
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Щоденний гороскоп базується на транзитах планет відносно вашого сонячного знаку. 
            Ми аналізуємо поточне розташування Сонця, Місяця, Меркурія, Венери та Марса 
            та їхній вплив на кожен знак зодіаку.
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">
            Прогноз охоплює три основні сфери: кохання та стосунки, кар&apos;єра та фінанси, 
            здоров&apos;я та енергія. Для більш точного прогнозу рекомендуємо також звернути увагу 
            на ваш Місяць та Асцендент.
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
