'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Heart, Briefcase, Activity, Star, Sparkles } from 'lucide-react';
import { ZODIAC_NAMES_UK } from '@/lib/constants';
import type { ZodiacSign } from '@/types/astrology';
import ZodiacIcon from '@/components/icons/ZodiacIcon';

interface DailyHoroscopeData {
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
  life_areas?: Array<{
    area: string;
    title: string;
    prediction: string;
    rating: number;
  }>;
}

interface Props {
  userSign: string | null;
  userName: string;
}

const AREA_CONFIG = [
  { key: 'love_uk' as const, icon: Heart, label: 'Кохання', color: 'rgba(236,72,153,0.15)', border: 'rgba(236,72,153,0.25)', iconColor: 'text-pink-400' },
  { key: 'career_uk' as const, icon: Briefcase, label: "Кар'єра", color: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.25)', iconColor: 'text-blue-400' },
  { key: 'health_uk' as const, icon: Activity, label: "Здоров'я", color: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.25)', iconColor: 'text-green-400' },
];

function RatingStars({ rating }: { rating: number }) {
  const stars = Math.round(rating / 2); // Convert 1-10 to 1-5
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={12}
          className={i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-white/15'}
        />
      ))}
    </div>
  );
}

export default function DailySummary({ userSign, userName }: Props) {
  const [data, setData] = useState<DailyHoroscopeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userSign) {
      setLoading(false);
      return;
    }

    fetch(`/api/daily-horoscope?sign=${encodeURIComponent(userSign)}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d) setData(d);
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, [userSign]);

  if (!userSign) {
    return (
      <div
        className="rounded-2xl p-5"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <p className="text-white/50 text-sm">
          Створіть натальну карту, щоб бачити щоденний прогноз
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-24 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const signUk = ZODIAC_NAMES_UK[userSign as ZodiacSign] || data.sign_uk;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        {/* Focus of the Day */}
        <div
          className="rounded-2xl p-4"
          style={{ background: 'rgba(108,60,225,0.1)', border: '1px solid rgba(108,60,225,0.2)' }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(108,60,225,0.2)' }}
            >
              <ZodiacIcon sign={userSign as ZodiacSign} size={20} className="text-zorya-violet" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xs text-white/50">{signUk} · Прогноз на сьогодні</p>
                <RatingStars rating={data.overall_rating} />
              </div>
              <p className="text-sm text-white/80 leading-relaxed">{data.horoscope.general_uk}</p>
              {data.mood_uk && (
                <div className="flex items-center gap-1.5 mt-2">
                  <Sparkles size={12} className="text-zorya-gold" />
                  <span className="text-xs text-zorya-gold font-medium">Фокус: {data.mood_uk}</span>
                  {data.lucky_number && (
                    <span className="text-xs text-white/30 ml-2">Число дня: {data.lucky_number}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Life Areas Grid */}
        <div className="grid grid-cols-3 gap-2">
          {AREA_CONFIG.map(({ key, icon: Icon, label, color, border, iconColor }) => (
            <div
              key={key}
              className="rounded-xl p-3"
              style={{ background: color, border: `1px solid ${border}` }}
            >
              <Icon size={16} className={`${iconColor} mb-2`} />
              <p className="text-xs font-semibold text-white mb-1">{label}</p>
              <p className="text-[11px] text-white/60 leading-relaxed line-clamp-3">
                {data.horoscope[key]}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
