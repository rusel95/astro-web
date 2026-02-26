'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import DateInputPicker from '@/components/DateInputPicker';
import TimePicker from '@/components/TimePicker';
import CitySearch from '@/components/CitySearch';
import ZodiacIcon from '@/components/icons/ZodiacIcon';
import GlassCard from '@/components/ui/GlassCard';
import { ZODIAC_NAMES_UK } from '@/lib/constants';
import { ZodiacSign } from '@/types/astrology';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';

// Ascendant descriptions in Ukrainian
const ASCENDANT_DESCRIPTIONS: Record<ZodiacSign, string> = {
  Aries: 'Ви справляєте враження енергійної, рішучої та сміливої людини. Світ бачить вас як лідера, який діє першим і думає потім. Ваша зовнішність часто виразна та спортивна.',
  Taurus: 'Ви виглядаєте спокійно, надійно та стабільно. Люди відчувають від вас ауру комфорту та практичності. Ваш стиль — елегантність, чуттєвість і земна краса.',
  Gemini: 'Ви справляєте враження товариської, допитливої та гнучкої людини. Світ бачить вас як чудового співрозмовника. Ваша зовнішність — молодіжна, жвава та виразна.',
  Cancer: 'Ви виглядаєте ніжно, турботливо та емоційно. Люди відчувають від вас тепло та затишок. Ваша зовнішність — м\'яка, з виразними очима та округлими рисами.',
  Leo: 'Ви справляєте царственне враження — яскраве, гордовите та магнетичне. Світ бачить вас як зірку. Ваша зовнішність — вражаюча, з пишним волоссям та впевненою поставою.',
  Virgo: 'Ви виглядаєте охайно, інтелектуально та стримано. Люди бачать вас як розумну та надійну людину. Ваша зовнішність — елегантна, акуратна, з увагою до деталей.',
  Libra: 'Ви справляєте гармонійне, чарівне та дипломатичне враження. Світ бачить вас як естета. Ваша зовнішність — симетрична, приваблива, з вишуканим стилем.',
  Scorpio: 'Ви виглядаєте загадково, інтенсивно та магнетично. Люди відчувають від вас силу та глибину. Ваша зовнішність — пронизливий погляд, виразні риси обличчя.',
  Sagittarius: 'Ви справляєте враження оптимістичної, вільної та відкритої людини. Світ бачить вас як мандрівника та філософа. Ваша зовнішність — висока, спортивна, з веселою усмішкою.',
  Capricorn: 'Ви виглядаєте серйозно, амбітно та надійно. Люди бачать вас як людину з авторитетом. Ваша зовнішність — стримана, класична, з чіткими рисами обличчя.',
  Aquarius: 'Ви справляєте враження незвичайної, незалежної та прогресивної людини. Світ бачить вас як оригінала. Ваша зовнішність — особлива, нестандартна, з яскравими деталями.',
  Pisces: 'Ви виглядаєте мрійливо, ніжно та інтуїтивно. Люди відчувають від вас містичну ауру. Ваша зовнішність — ефірна, з великими виразними очима та м\'якими рисами.',
};

// Big Three explanation
const BIG_THREE_INFO: { name: string; emoji: string; desc: string }[] = [
  { name: 'Сонце (Sun)', emoji: '☉', desc: 'Ваша суть, его, основна ідентичність. Визначає вашу волю та життєву мету.' },
  { name: 'Місяць (Moon)', emoji: '☽', desc: 'Ваші емоції, підсвідомість, внутрішній світ. Як ви відчуваєте та реагуєте.' },
  { name: 'Асцендент (Rising)', emoji: '↑', desc: 'Ваша зовнішня оболонка, перше враження, як вас бачить світ.' },
];

interface CityResult {
  name: string;
  countryCode: string;
  lat: number;
  lon: number;
}

function getZodiacSignFromLongitude(longitude: number): ZodiacSign {
  const signs: ZodiacSign[] = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
  ];
  return signs[Math.floor((longitude % 360) / 30)];
}

export default function AscendantClient() {
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [city, setCity] = useState<CityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    ascendant: ZodiacSign;
    degree: number;
    sunSign: ZodiacSign;
    moonSign: ZodiacSign;
  } | null>(null);

  const canSubmit = birthDate && birthTime && city;

  async function handleCalculate() {
    if (!canSubmit || !city) return;
    setLoading(true);
    setError('');

    try {
      const [year, month, day] = birthDate.split('-').map(Number);
      const [hour, minute] = birthTime.split(':').map(Number);

      const res = await fetch('/api/chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthDate,
          birthTime,
          city: city.name,
          countryCode: city.countryCode,
          lat: city.lat,
          lon: city.lon,
          name: 'Ascendant',
          gender: 'female',
        }),
      });

      if (!res.ok) throw new Error('Помилка розрахунку');

      const data = await res.json();
      const chart = data.chart;

      const ascSign = getZodiacSignFromLongitude(chart.ascendant);
      const sunPlanet = chart.planets?.find((p: any) => p.name === 'Sun');
      const moonPlanet = chart.planets?.find((p: any) => p.name === 'Moon');

      setResult({
        ascendant: ascSign,
        degree: chart.ascendant % 30,
        sunSign: sunPlanet?.sign || 'Aries',
        moonSign: moonPlanet?.sign || 'Aries',
      });

      track(ANALYTICS_EVENTS.ASCENDANT_CALCULATED, {
        ascendant: ascSign,
        sun_sign: sunPlanet?.sign,
        moon_sign: moonPlanet?.sign,
      });
    } catch {
      setError('Не вдалося розрахувати асцендент. Перевірте дані та спробуйте ще раз.');
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zorya-purple/20 text-zorya-violet text-xs font-medium">
          ↑ Безкоштовний калькулятор
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-text-primary">
          Розрахувати Асцендент
        </h1>
        <p className="text-text-secondary max-w-md mx-auto">
          Асцендент — знак зодіаку, який сходив на горизонті в момент вашого народження. 
          Він визначає вашу зовнішність та перше враження, яке ви справляєте.
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Дата народження <span className="text-red-400">*</span>
            </label>
            <DateInputPicker value={birthDate} onChange={setBirthDate} />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Час народження <span className="text-red-400">*</span>
            </label>
            <TimePicker value={birthTime} onChange={setBirthTime} />
            <p className="text-xs text-text-muted mt-1">
              Точний час народження обов&apos;язковий для розрахунку асцендента
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Місто народження <span className="text-red-400">*</span>
            </label>
            <CitySearch
              onSelect={(c) => setCity({ name: c.name, countryCode: c.countryCode, lat: c.lat, lon: c.lon })}
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            onClick={handleCalculate}
            disabled={!canSubmit || loading}
            className="w-full py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-zorya-violet to-zorya-blue hover:shadow-lg hover:shadow-zorya-purple/30"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Розраховуємо...
              </span>
            ) : (
              'Розрахувати асцендент'
            )}
          </button>
        </GlassCard>
      </motion.div>

      {/* Result */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Ascendant result card */}
            <GlassCard variant="accent" className="p-6 text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-zorya-purple/20 flex items-center justify-center">
                  <ZodiacIcon sign={result.ascendant} size={40} className="text-zorya-violet" />
                </div>
              </div>
              <div>
                <p className="text-sm text-text-muted uppercase tracking-wider">Ваш Асцендент</p>
                <h2 className="text-2xl font-display font-bold text-text-primary mt-1">
                  {ZODIAC_NAMES_UK[result.ascendant]}
                </h2>
                <p className="text-sm text-text-muted mt-1">{result.degree.toFixed(1)}°</p>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed max-w-lg mx-auto">
                {ASCENDANT_DESCRIPTIONS[result.ascendant]}
              </p>
            </GlassCard>

            {/* Big Three */}
            <GlassCard className="p-6 space-y-4">
              <h3 className="text-lg font-display font-semibold text-text-primary text-center">
                Ваша Велика Трійка
              </h3>
              <p className="text-sm text-text-secondary text-center">
                Три головні точки вашої натальної карти, що формують основу особистості
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center space-y-2 p-3 rounded-xl bg-white/5">
                  <ZodiacIcon sign={result.sunSign} size={28} className="text-yellow-400 mx-auto" />
                  <p className="text-xs text-text-muted">Сонце</p>
                  <p className="text-sm font-semibold text-text-primary">{ZODIAC_NAMES_UK[result.sunSign]}</p>
                </div>
                <div className="text-center space-y-2 p-3 rounded-xl bg-white/5">
                  <ZodiacIcon sign={result.moonSign} size={28} className="text-blue-300 mx-auto" />
                  <p className="text-xs text-text-muted">Місяць</p>
                  <p className="text-sm font-semibold text-text-primary">{ZODIAC_NAMES_UK[result.moonSign]}</p>
                </div>
                <div className="text-center space-y-2 p-3 rounded-xl bg-zorya-purple/10 border border-zorya-purple/20">
                  <ZodiacIcon sign={result.ascendant} size={28} className="text-zorya-violet mx-auto" />
                  <p className="text-xs text-text-muted">Асцендент</p>
                  <p className="text-sm font-semibold text-text-primary">{ZODIAC_NAMES_UK[result.ascendant]}</p>
                </div>
              </div>
            </GlassCard>

            {/* Big Three explanation */}
            <GlassCard variant="subtle" className="p-6 space-y-4">
              <h3 className="text-lg font-display font-semibold text-text-primary">
                Що таке «Велика Трійка»?
              </h3>
              {BIG_THREE_INFO.map((item) => (
                <div key={item.name} className="flex gap-3">
                  <span className="text-lg flex-shrink-0 mt-0.5">{item.emoji}</span>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{item.name}</p>
                    <p className="text-sm text-text-secondary">{item.desc}</p>
                  </div>
                </div>
              ))}
            </GlassCard>

            {/* CTA to personality horoscope */}
            <Link href="/horoscope/personality">
              <GlassCard variant="premium" hover className="p-5 cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-text-primary group-hover:text-zorya-violet transition-colors">
                      Повний Гороскоп Особистості
                    </p>
                    <p className="text-xs text-text-secondary">
                      Детальний аналіз вашої натальної карти з AI-інтерпретацією
                    </p>
                  </div>
                  <span className="text-xl text-text-muted group-hover:text-zorya-violet transition-colors">→</span>
                </div>
              </GlassCard>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEO Info (shown when no result) */}
      {!result && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard variant="subtle" className="p-6 space-y-4">
            <h2 className="text-lg font-display font-semibold text-text-primary">
              Що таке «Велика Трійка»?
            </h2>
            {BIG_THREE_INFO.map((item) => (
              <div key={item.name} className="flex gap-3">
                <span className="text-lg flex-shrink-0 mt-0.5">{item.emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{item.name}</p>
                  <p className="text-sm text-text-secondary">{item.desc}</p>
                </div>
              </div>
            ))}
            <p className="text-xs text-text-muted pt-2 border-t border-white/10">
              Для розрахунку асцендента потрібен точний час народження. Якщо ви не знаєте його — 
              перевірте свідоцтво про народження або запитайте у батьків.
            </p>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
