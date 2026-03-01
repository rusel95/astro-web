'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Cake, Moon, Heart, Plus, ChevronRight, Star, Compass, Sun } from 'lucide-react';
import DailySummary from '@/components/dashboard/DailySummary';
import ProfileManager from '@/components/dashboard/ProfileManager';
import RecommendedProducts from '@/components/dashboard/RecommendedProducts';
import { track } from '@/lib/analytics';
import { ANALYTICS_EVENTS } from '@/lib/analytics/events';

const BG = 'linear-gradient(to bottom, #0f0a1e, #1a0e35)';
const BTN_GRAD = 'linear-gradient(135deg, #6C3CE1 0%, #9966E6 100%)';

function isBirthdayToday(birthDate: string): boolean {
  const [, m, d] = birthDate.split('-').map(Number);
  const today = new Date();
  return today.getMonth() + 1 === m && today.getDate() === d;
}

function isBirthdaySoon(birthDate: string): { isSoon: boolean; daysUntil: number } {
  const [, m, d] = birthDate.split('-').map(Number);
  const today = new Date();
  const thisYearBirthday = new Date(today.getFullYear(), m - 1, d);

  if (thisYearBirthday < today) {
    thisYearBirthday.setFullYear(today.getFullYear() + 1);
  }

  const diffTime = thisYearBirthday.getTime() - today.getTime();
  const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return { isSoon: daysUntil <= 14 && daysUntil > 0, daysUntil };
}

const MOON_PHASE_EMOJI: Record<string, string> = {
  new_moon: '🌑',
  waxing_crescent: '🌒',
  first_quarter: '🌓',
  waxing_gibbous: '🌔',
  full_moon: '🌕',
  waning_gibbous: '🌖',
  last_quarter: '🌗',
  waning_crescent: '🌘',
};

const MOON_PHASE_UA: Record<string, string> = {
  new_moon: 'Новий Місяць',
  waxing_crescent: 'Зростаючий серп',
  first_quarter: 'Перша чверть',
  waxing_gibbous: 'Зростаючий опуклий',
  full_moon: 'Повний Місяць',
  waning_gibbous: 'Спадний опуклий',
  last_quarter: 'Остання чверть',
  waning_crescent: 'Спадний серп',
};

const ZODIAC_UA: Record<string, string> = {
  Aries: 'Овен', Taurus: 'Телець', Gemini: 'Близнюки', Cancer: 'Рак',
  Leo: 'Лев', Virgo: 'Діва', Libra: 'Терези', Scorpio: 'Скорпіон',
  Sagittarius: 'Стрілець', Capricorn: 'Козоріг', Aquarius: 'Водолій', Pisces: 'Риби',
};

interface MoonData {
  phase: string;
  sign: string;
  illumination: number;
  is_void: boolean;
}

// Derive zodiac sign from birth date string "YYYY-MM-DD"
function getZodiacSignFromDate(dateStr: string): string | null {
  if (!dateStr) return null;
  const parts = dateStr.split('-').map(Number);
  const month = parts[1];
  const day = parts[2];
  if (!month || !day) return null;
  const dates: [number, number, string][] = [
    [1, 20, 'Aquarius'], [2, 19, 'Pisces'], [3, 21, 'Aries'],
    [4, 20, 'Taurus'], [5, 21, 'Gemini'], [6, 21, 'Cancer'],
    [7, 23, 'Leo'], [8, 23, 'Virgo'], [9, 23, 'Libra'],
    [10, 23, 'Scorpio'], [11, 22, 'Sagittarius'], [12, 22, 'Capricorn'],
  ];
  for (let i = dates.length - 1; i >= 0; i--) {
    const [m, d, sign] = dates[i];
    if (month > m || (month === m && day >= d)) return sign;
  }
  return 'Capricorn';
}

interface Chart {
  id: string;
  name: string;
  birth_date: string;
  city: string;
  country_code: string;
  gender: string;
  created_at: string;
}

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

interface Props {
  user: User;
  charts: Chart[];
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return iso;
  }
}

function getTodayUA() {
  return new Date().toLocaleDateString('uk-UA', { weekday: 'long', day: 'numeric', month: 'long' });
}

export default function DashboardClient({ user, charts: initialCharts }: Props) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const [moonData, setMoonData] = useState<MoonData | null>(null);
  const [showAllCharts, setShowAllCharts] = useState(false);
  const [charts, setCharts] = useState(initialCharts);

  const displayName = user.user_metadata?.full_name?.split(' ')[0] ?? user.email?.split('@')[0] ?? 'Мандрівнику';
  const avatarUrl = user.user_metadata?.avatar_url;
  const initials = displayName.charAt(0).toUpperCase();

  // Derive zodiac sign from the first (primary) chart
  const primaryChart = charts[0] || null;
  const userSign = primaryChart ? getZodiacSignFromDate(primaryChart.birth_date) : null;

  useEffect(() => {
    fetch('/api/moon/current')
      .then(r => r.ok ? r.json() : null)
      .then(data => data?.current && setMoonData(data.current))
      .catch(() => null);

    // Track dashboard view
    track(ANALYTICS_EVENTS.DAILY_HOROSCOPE_VIEWED, { source: 'dashboard' });
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('chart-') || key.startsWith('chart-input-'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      router.push('/');
      router.refresh();
    } catch {
      setSigningOut(false);
    }
  };

  const visibleCharts = showAllCharts ? charts : charts.slice(0, 3);

  return (
    <div className="min-h-screen px-4 py-8" style={{ background: BG }}>
      <div className="max-w-2xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="w-11 h-11 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-base text-white flex-shrink-0"
                style={{ background: BTN_GRAD }}
              >
                {initials}
              </div>
            )}
            <div>
              <p className="font-semibold text-white">Привіт, {displayName} 👋</p>
              <p className="text-xs text-white/40 capitalize">{getTodayUA()}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all text-white/50 hover:text-white/80"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {signingOut ? '...' : 'Вийти'}
          </button>
        </div>

        {/* ── Today in the Sky ── */}
        <a
          href="/moon"
          className="flex items-center justify-between p-4 rounded-2xl transition-all hover:opacity-90"
          style={{ background: 'rgba(108,60,225,0.12)', border: '1px solid rgba(108,60,225,0.25)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: 'rgba(108,60,225,0.2)', border: '1px solid rgba(108,60,225,0.3)' }}
            >
              {moonData ? (MOON_PHASE_EMOJI[moonData.phase] ?? '🌙') : '🌙'}
            </div>
            <div>
              <p className="text-xs text-white/50 mb-0.5">Сьогодні на небі</p>
              {moonData ? (
                <>
                  <p className="font-semibold text-white text-sm">
                    {MOON_PHASE_UA[moonData.phase] ?? moonData.phase}
                  </p>
                  <p className="text-xs text-white/45">
                    Місяць у {ZODIAC_UA[moonData.sign] ?? moonData.sign} · {Math.round(moonData.illumination)}%
                    {moonData.is_void && <span className="ml-2 text-yellow-400">⚠ Void</span>}
                  </p>
                </>
              ) : (
                <p className="font-semibold text-white/60 text-sm">Місячний календар</p>
              )}
            </div>
          </div>
          <ChevronRight size={18} className="text-white/30 flex-shrink-0" />
        </a>

        {/* ── My Charts ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-white">Мої карти</h2>
            <a
              href="/chart/new"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white transition-all hover:opacity-90"
              style={{ background: BTN_GRAD, boxShadow: '0 2px 10px rgba(108,60,225,0.35)' }}
            >
              <Plus size={13} strokeWidth={2.5} />
              Нова карта
            </a>
          </div>

          {charts.length === 0 ? (
            <div
              className="rounded-2xl p-10 text-center"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.12)' }}
            >
              <div className="text-4xl mb-3">🌌</div>
              <p className="text-white font-semibold mb-1">Карт ще немає</p>
              <p className="text-xs text-white/40">Розрахуйте вашу першу натальну карту</p>
            </div>
          ) : (
            <div className="space-y-2">
              {visibleCharts.map((chart) => {
                const isToday = isBirthdayToday(chart.birth_date);
                const { isSoon, daysUntil } = isBirthdaySoon(chart.birth_date);

                return (
                  <a
                    key={chart.id}
                    href={`/chart/${chart.id}`}
                    className="flex items-center justify-between p-4 rounded-2xl transition-all hover:bg-white/5 group"
                    style={{
                      background: isToday ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.04)',
                      border: isToday ? '1px solid rgba(212,175,55,0.25)' : '1px solid rgba(255,255,255,0.07)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: isToday ? 'rgba(212,175,55,0.15)' : 'rgba(108,60,225,0.15)',
                          border: isToday ? '1px solid rgba(212,175,55,0.3)' : '1px solid rgba(108,60,225,0.25)',
                        }}
                      >
                        {isToday ? (
                          <Cake size={16} className="text-yellow-400" />
                        ) : (
                          <span className="text-sm">{chart.gender === 'female' ? '♀' : '♂'}</span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-white text-sm group-hover:text-purple-300 transition-colors">
                            {chart.name}
                          </p>
                          {isToday && (
                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400">
                              🎂 ДН!
                            </span>
                          )}
                          {!isToday && isSoon && (
                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300">
                              🎁 {daysUntil} дн.
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-white/35 mt-0.5">
                          {formatDate(chart.birth_date)} · {chart.city}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-white/25 group-hover:text-white/50 transition-colors flex-shrink-0" />
                  </a>
                );
              })}

              {charts.length > 3 && !showAllCharts && (
                <button
                  onClick={() => setShowAllCharts(true)}
                  className="w-full py-3 rounded-2xl text-sm text-white/50 hover:text-white/80 transition-all"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  Показати ще {charts.length - 3}
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── First-Time User Overview ── */}
        {charts.length === 0 && (
          <div>
            <h2 className="font-semibold text-white mb-3">Ласкаво просимо до Зоря</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href="/chart/new"
                className="p-4 rounded-2xl transition-all hover:opacity-90"
                style={{ background: 'rgba(108,60,225,0.12)', border: '1px solid rgba(108,60,225,0.25)' }}
              >
                <Star size={22} strokeWidth={1.5} className="text-zorya-violet mb-2" />
                <p className="font-semibold text-white text-sm">Натальна карта</p>
                <p className="text-xs text-white/40 mt-1">Розрахунок вашої карти народження з AI-інтерпретацією</p>
              </a>
              <a
                href="/moon"
                className="p-4 rounded-2xl transition-all hover:opacity-90"
                style={{ background: 'rgba(108,60,225,0.12)', border: '1px solid rgba(108,60,225,0.25)' }}
              >
                <Moon size={22} strokeWidth={1.5} className="text-zorya-violet mb-2" />
                <p className="font-semibold text-white text-sm">Місячний календар</p>
                <p className="text-xs text-white/40 mt-1">Фази Місяця, знак та періоди Void-of-Course</p>
              </a>
              <a
                href="/compatibility"
                className="p-4 rounded-2xl transition-all hover:opacity-90"
                style={{ background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.2)' }}
              >
                <Heart size={22} strokeWidth={1.5} className="text-pink-400 mb-2" />
                <p className="font-semibold text-white text-sm">Сумісність</p>
                <p className="text-xs text-white/40 mt-1">Аналіз синастрії та порівняння двох натальних карт</p>
              </a>
              <a
                href="/horoscope/daily"
                className="p-4 rounded-2xl transition-all hover:opacity-90"
                style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}
              >
                <Sun size={22} strokeWidth={1.5} className="text-zorya-gold mb-2" />
                <p className="font-semibold text-white text-sm">Щоденний гороскоп</p>
                <p className="text-xs text-white/40 mt-1">Персональний прогноз на кожен день за знаком Зодіаку</p>
              </a>
            </div>
          </div>
        )}

        {/* ── Feature Recommendations ── */}
        <div>
          <h2 className="font-semibold text-white mb-3">Можливості</h2>
          <div className="grid grid-cols-2 gap-3">
            <a
              href="/moon"
              className="flex flex-col gap-3 p-4 rounded-2xl transition-all hover:opacity-90"
              style={{ background: 'rgba(108,60,225,0.1)', border: '1px solid rgba(108,60,225,0.2)' }}
            >
              <Moon size={22} strokeWidth={1.5} className="text-zorya-violet" />
              <div>
                <p className="font-semibold text-white text-sm">Місячний календар</p>
                <p className="text-xs text-white/40 mt-1">Фази та Місяць без курсу</p>
              </div>
            </a>
            <a
              href="/compatibility"
              className="flex flex-col gap-3 p-4 rounded-2xl transition-all hover:opacity-90"
              style={{ background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.2)' }}
            >
              <Heart size={22} strokeWidth={1.5} className="text-pink-400" />
              <div>
                <p className="font-semibold text-white text-sm">Сумісність</p>
                <p className="text-xs text-white/40 mt-1">Синастрія двох карт</p>
              </div>
            </a>
            <a
              href="/horoscope/daily"
              className="flex flex-col gap-3 p-4 rounded-2xl transition-all hover:opacity-90"
              style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}
            >
              <Sun size={22} strokeWidth={1.5} className="text-zorya-gold" />
              <div>
                <p className="font-semibold text-white text-sm">Гороскопи</p>
                <p className="text-xs text-white/40 mt-1">Щоденні прогнози за знаком</p>
              </div>
            </a>
            <a
              href="/glossary"
              className="flex flex-col gap-3 p-4 rounded-2xl transition-all hover:opacity-90"
              style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}
            >
              <Compass size={22} strokeWidth={1.5} className="text-green-400" />
              <div>
                <p className="font-semibold text-white text-sm">Глосарій</p>
                <p className="text-xs text-white/40 mt-1">Астрологічні терміни</p>
              </div>
            </a>
          </div>
        </div>

        {/* ── Daily Summary ── */}
        <div>
          <h2 className="font-semibold text-white mb-3">Прогноз на сьогодні</h2>
          <DailySummary userSign={userSign} userName={displayName} />
        </div>

        {/* ── Recommended Products ── */}
        <RecommendedProducts userSign={userSign} />

        {/* ── Profile Manager ── */}
        <ProfileManager
          charts={charts}
          userId={user.id}
          onChartAdded={(newChart) => setCharts(prev => [newChart, ...prev])}
        />

      </div>
    </div>
  );
}
