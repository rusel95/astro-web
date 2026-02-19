'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Gift, Sparkles, Star, ArrowLeft, Share2, TrendingUp, Heart, Briefcase, Brain, Wallet } from 'lucide-react';
import type { NatalChart, ChartInput } from '@/types/astrology';
import type { BirthdayForecastResponse } from '@/app/api/birthday-forecast/route';

interface StoredChart {
  id: string;
  input: ChartInput;
  chart: NatalChart;
}

const THEME_ICONS: Record<string, React.ReactNode> = {
  '💼': <Briefcase size={20} />,
  '❤️': <Heart size={20} />,
  '💰': <Wallet size={20} />,
  '🧠': <Brain size={20} />,
  '✨': <Sparkles size={20} />,
  '📈': <TrendingUp size={20} />,
};

function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function isBirthdayToday(birthDate: string): boolean {
  const birth = new Date(birthDate);
  const today = new Date();
  return birth.getMonth() === today.getMonth() && birth.getDate() === today.getDate();
}

function formatBirthday(birthDate: string): string {
  const date = new Date(birthDate);
  return date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' });
}

export default function BirthdayForecastPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [storedChart, setStoredChart] = useState<StoredChart | null>(null);
  const [forecast, setForecast] = useState<BirthdayForecastResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load chart from localStorage
    const stored = localStorage.getItem(`chart_${id}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      setStoredChart(parsed);
    } else {
      setError('Карту не знайдено');
    }
    setLoading(false);
  }, [id]);

  const generateForecast = async () => {
    if (!storedChart) return;
    
    setGenerating(true);
    setError(null);
    
    try {
      const age = calculateAge(storedChart.input.birthDate);
      const res = await fetch('/api/birthday-forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chart: storedChart.chart,
          userName: storedChart.input.name,
          age,
        }),
      });

      if (!res.ok) {
        throw new Error('Помилка генерації прогнозу');
      }

      const data = await res.json();
      setForecast(data);
      
      // Save forecast to localStorage
      localStorage.setItem(`birthday_forecast_${id}`, JSON.stringify({
        forecast: data,
        generatedAt: new Date().toISOString(),
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка');
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    // Try to load cached forecast
    const cached = localStorage.getItem(`birthday_forecast_${id}`);
    if (cached) {
      const { forecast: cachedForecast } = JSON.parse(cached);
      setForecast(cachedForecast);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cosmic-900 flex items-center justify-center">
        <div className="animate-pulse text-zorya-violet">Завантаження...</div>
      </div>
    );
  }

  if (error && !storedChart) {
    return (
      <div className="min-h-screen bg-cosmic-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <a href="/dashboard" className="text-zorya-violet hover:underline">
            ← Повернутися до карт
          </a>
        </div>
      </div>
    );
  }

  if (!storedChart) return null;

  const isToday = isBirthdayToday(storedChart.input.birthDate);
  const age = calculateAge(storedChart.input.birthDate);
  const nextAge = age + 1;
  const birthdayFormatted = formatBirthday(storedChart.input.birthDate);

  return (
    <div className="min-h-screen bg-cosmic-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a2e] via-[#0e0b25] to-[#0c0820]" />
        <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-zorya-gold/10 blur-[100px]" />
        <div className="absolute bottom-[-50px] left-[-50px] w-[300px] h-[300px] rounded-full bg-zorya-purple/10 blur-[80px]" />
        
        <div className="relative max-w-4xl mx-auto px-4 py-8">
          <a 
            href={`/chart/${id}`}
            className="inline-flex items-center gap-2 text-text-muted hover:text-text-secondary transition-colors mb-6"
          >
            <ArrowLeft size={18} />
            Назад до карти
          </a>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            {isToday && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zorya-gold/20 text-zorya-gold mb-4"
              >
                <Gift size={18} />
                <span className="font-medium">З Днем Народження!</span>
                <Gift size={18} />
              </motion.div>
            )}
            
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-text-primary mb-3">
              <span className="text-zorya-gold">🎂</span> Прогноз на рік
            </h1>
            <p className="text-text-secondary text-lg">
              {storedChart.input.name} · {birthdayFormatted} · {nextAge} років
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        {!forecast ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 text-center"
          >
            <div className="text-6xl mb-6">🎁</div>
            <h2 className="font-display text-2xl font-semibold text-text-primary mb-3">
              Персональний прогноз на наступний рік
            </h2>
            <p className="text-text-secondary mb-6 max-w-md mx-auto">
              На основі вашої натальної карти AI-астролог створить детальний прогноз 
              на наступний рік життя з темами, порадами та щомісячними підказками.
            </p>
            
            {error && (
              <p className="text-red-400 mb-4">{error}</p>
            )}
            
            <motion.button
              onClick={generateForecast}
              disabled={generating}
              className="btn-primary px-8 py-3 inline-flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {generating ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                  Генеруємо прогноз...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Отримати прогноз на рік
                </>
              )}
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Greeting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 border-l-4 border-zorya-gold"
            >
              <p className="text-lg text-text-primary italic">{forecast.greeting}</p>
            </motion.div>

            {/* Year Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-zorya-purple/20 flex items-center justify-center">
                  <Star size={20} className="text-zorya-violet" />
                </div>
                <h2 className="font-display text-xl font-semibold text-text-primary">
                  Огляд року
                </h2>
              </div>
              <p className="text-text-secondary leading-relaxed">{forecast.year_overview}</p>
            </motion.div>

            {/* Themes Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="font-display text-xl font-semibold text-text-primary mb-4">
                Ключові теми року
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {forecast.themes.map((theme, i) => (
                  <motion.div
                    key={theme.title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    className="glass-card p-5"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-zorya-purple/15 flex items-center justify-center text-zorya-violet">
                        {THEME_ICONS[theme.icon] || <span className="text-xl">{theme.icon}</span>}
                      </div>
                      <h3 className="font-semibold text-text-primary">{theme.title}</h3>
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed">{theme.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Monthly Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-zorya-purple/20 flex items-center justify-center">
                  <Calendar size={20} className="text-zorya-violet" />
                </div>
                <h2 className="font-display text-xl font-semibold text-text-primary">
                  Місяць за місяцем
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {forecast.monthly_highlights.map((month, i) => (
                  <div 
                    key={month.month}
                    className="p-3 rounded-xl bg-white/3 border border-white/5"
                  >
                    <p className="text-zorya-violet font-medium text-sm mb-1">{month.month}</p>
                    <p className="text-text-secondary text-xs">{month.highlight}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Lucky Periods */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-zorya-gold/20 flex items-center justify-center">
                  <TrendingUp size={20} className="text-zorya-gold" />
                </div>
                <h2 className="font-display text-xl font-semibold text-text-primary">
                  Сприятливі періоди
                </h2>
              </div>
              <ul className="space-y-2">
                {forecast.lucky_periods.map((period, i) => (
                  <li key={i} className="flex items-start gap-2 text-text-secondary">
                    <span className="text-zorya-gold mt-0.5">✦</span>
                    {period}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Advice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-zorya-purple/20 flex items-center justify-center">
                  <Sparkles size={20} className="text-zorya-violet" />
                </div>
                <h2 className="font-display text-xl font-semibold text-text-primary">
                  Поради на рік
                </h2>
              </div>
              <ul className="space-y-3">
                {forecast.advice.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-text-secondary">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zorya-purple/20 text-zorya-violet text-xs flex items-center justify-center font-medium">
                      {i + 1}
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Share CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center pt-4"
            >
              <button
                onClick={() => {
                  const text = `🎂 Мій прогноз на ${nextAge} років від Зоря AI-астрології!\n\n${forecast.greeting}\n\nОтримай свій: ${window.location.origin}/chart/new`;
                  if (navigator.share) { navigator.share({ text }); } else { navigator.clipboard.writeText(text); }
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-text-secondary hover:text-text-primary hover:bg-white/10 transition-all"
              >
                <Share2 size={18} />
                Поділитися прогнозом
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
