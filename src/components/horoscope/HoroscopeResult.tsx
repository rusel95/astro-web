'use client';

import { useState } from 'react';
import ZodiacIcon from '@/components/icons/ZodiacIcon';
import { ZODIAC_NAMES_UK } from '@/lib/constants';
import type { ZodiacSign } from '@/types/astrology';

// Ukrainian translations for life area titles
const AREA_LABELS: Record<string, string> = {
  identity: 'Особистість',
  health: "Здоров'я",
  finance: 'Фінанси',
  career: "Кар'єра",
  love: 'Кохання',
  relationships: 'Стосунки',
  creativity: 'Творчість',
  spirituality: 'Духовність',
  home: 'Дім',
  learning: 'Навчання',
  communication: 'Спілкування',
  travel: 'Подорожі',
};

const AREA_ICONS: Record<string, string> = {
  identity: 'sparkles',
  health: 'heart-pulse',
  finance: 'wallet',
  career: 'briefcase',
  love: 'heart',
  relationships: 'users',
  creativity: 'palette',
  spirituality: 'eye',
  home: 'home',
  learning: 'book-open',
  communication: 'message-circle',
  travel: 'compass',
};

// Map lucky element keys
const LUCKY_LABELS: Record<string, string> = {
  colors: 'Кольори',
  numbers: 'Числа',
  stones: 'Камені',
  directions: 'Напрямки',
  day_ruler: 'Планета дня',
  day_ruler_activities: 'Активності дня',
  times: 'Сприятливий час',
  power_hours: 'Години сили',
};

const TIMEFRAME_LABELS: Record<string, string> = {
  daily: 'Сьогодні',
  weekly: 'Цей тиждень',
  monthly: 'Цей місяць',
  yearly: 'Цей рік',
};

interface LifeArea {
  area: string;
  title: string;
  prediction: string;
  rating: number;
  keywords?: string[];
  reasoning?: string;
  context_modifier?: string | null;
}

interface LuckyElements {
  colors?: string[];
  numbers?: number[];
  stones?: string[];
  directions?: string[];
  day_ruler?: string;
  day_ruler_activities?: string[];
  times?: string[];
  power_hours?: Array<{ hour: string; planet: string }>;
}

interface MoonInfo {
  phase: string;
  sign: string;
  illumination: number;
  prediction?: string;
  emoji?: string;
}

interface PlanetaryInfluence {
  planet: string;
  aspect_type: string;
  description: string;
  strength: number;
  aspect_name?: string;
}

interface HoroscopeData {
  horoscope: {
    date: string;
    sign: string;
    timeframe: string;
    overall_theme: string;
    overall_rating: number;
    life_areas: LifeArea[];
    lucky_elements?: LuckyElements;
    moon?: MoonInfo;
    tips?: string[];
    planetary_influences?: PlanetaryInfluence[];
  };
  horoscopeText?: {
    text: string;
    overall_rating: number;
  };
}

function RatingStars({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${
            i < rating
              ? rating >= 4
                ? 'bg-emerald-400'
                : rating >= 3
                  ? 'bg-zorya-gold'
                  : 'bg-orange-400'
              : 'bg-white/10'
          }`}
        />
      ))}
    </div>
  );
}

function OverallRating({ rating, theme }: { rating: number; theme: string }) {
  const ratingColor =
    rating >= 4
      ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10'
      : rating >= 3
        ? 'text-zorya-gold border-zorya-gold/30 bg-zorya-gold/10'
        : 'text-orange-400 border-orange-400/30 bg-orange-400/10';

  return (
    <div className="rounded-2xl bg-white/[0.05] border border-white/10 p-5">
      <div className="flex items-start gap-4">
        <div
          className={`flex-shrink-0 w-14 h-14 rounded-xl border flex items-center justify-center ${ratingColor}`}
        >
          <span className="text-2xl font-bold">{rating}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-1">
            Загальний прогноз
          </p>
          <p className="text-white/80 text-sm leading-relaxed">{theme}</p>
        </div>
      </div>
    </div>
  );
}

function LifeAreaCard({ area }: { area: LifeArea }) {
  const [expanded, setExpanded] = useState(false);
  const label = AREA_LABELS[area.area] || area.title;

  const ratingBg =
    area.rating >= 4
      ? 'bg-emerald-400/10 border-emerald-400/20'
      : area.rating >= 3
        ? 'bg-white/[0.04] border-white/10'
        : 'bg-orange-400/5 border-orange-400/15';

  return (
    <button
      type="button"
      aria-expanded={expanded}
      onClick={() => setExpanded(!expanded)}
      className={`w-full text-left p-4 rounded-xl border transition-all ${ratingBg}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-base font-medium text-white">{label}</span>
          <RatingStars rating={area.rating} />
        </div>
        <span className="text-white/30 text-xs flex-shrink-0">
          {expanded ? '▲' : '▼'}
        </span>
      </div>
      {expanded && (
        <div className="mt-3 space-y-2">
          <p className="text-white/70 text-sm leading-relaxed">
            {area.prediction}
          </p>
          {area.context_modifier && (
            <p className="text-zorya-violet/80 text-xs italic">
              {area.context_modifier}
            </p>
          )}
        </div>
      )}
      {!expanded && (
        <p className="text-white/50 text-xs mt-1.5 line-clamp-1">
          {area.prediction}
        </p>
      )}
    </button>
  );
}

function LuckyBadges({ lucky }: { lucky: LuckyElements }) {
  const items: { label: string; values: string[] }[] = [];

  if (lucky.numbers?.length) {
    items.push({
      label: LUCKY_LABELS.numbers,
      values: lucky.numbers.map(String),
    });
  }
  if (lucky.colors?.length) {
    items.push({ label: LUCKY_LABELS.colors, values: lucky.colors });
  }
  if (lucky.stones?.length) {
    items.push({ label: LUCKY_LABELS.stones, values: lucky.stones });
  }
  if (lucky.directions?.length) {
    items.push({ label: LUCKY_LABELS.directions, values: lucky.directions });
  }
  if (lucky.day_ruler) {
    items.push({ label: LUCKY_LABELS.day_ruler, values: [lucky.day_ruler] });
  }
  if (lucky.day_ruler_activities?.length) {
    items.push({ label: LUCKY_LABELS.day_ruler_activities, values: lucky.day_ruler_activities });
  }
  if (lucky.times?.length) {
    items.push({ label: LUCKY_LABELS.times, values: lucky.times });
  }
  if (lucky.power_hours?.length) {
    items.push({
      label: LUCKY_LABELS.power_hours,
      values: lucky.power_hours.map((h) => `${h.hour} (${h.planet})`),
    });
  }

  if (items.length === 0) return null;

  return (
    <div className="rounded-xl bg-white/[0.04] border border-white/10 p-4">
      <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-3">
        Щасливі елементи
      </p>
      <div className="space-y-2.5">
        {items.map((item) => (
          <div key={item.label} className="flex flex-wrap items-center gap-2">
            <span className="text-white/50 text-xs w-16">{item.label}:</span>
            <div className="flex flex-wrap gap-1.5">
              {item.values.map((v, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 rounded-full bg-zorya-violet/15 border border-zorya-violet/25 text-zorya-violet text-xs"
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MoonBadge({ moon }: { moon: MoonInfo }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10">
      <span className="text-2xl">{moon.emoji || '🌙'}</span>
      <div>
        <p className="text-white text-sm font-medium">
          {moon.phase} · {moon.sign}
        </p>
        {moon.prediction && (
          <p className="text-white/50 text-xs mt-0.5">{moon.prediction}</p>
        )}
      </div>
    </div>
  );
}

function TipsList({ tips }: { tips: string[] }) {
  return (
    <div className="rounded-xl bg-white/[0.04] border border-white/10 p-4">
      <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-3">
        Поради на день
      </p>
      <ul className="space-y-2">
        {tips.map((tip, i) => (
          <li key={i} className="flex gap-2 text-white/70 text-sm">
            <span className="text-zorya-gold flex-shrink-0 mt-0.5">•</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface HoroscopeResultProps {
  data: Record<string, unknown>;
  sign: string;
}

export default function HoroscopeResult({ data, sign }: HoroscopeResultProps) {
  // Try to parse as structured horoscope data
  const horoscope = data.horoscope as HoroscopeData['horoscope'] | undefined;
  const horoscopeText = data.horoscopeText as
    | HoroscopeData['horoscopeText']
    | undefined;

  // If no structured data, fall back to null (caller handles fallback)
  if (!horoscope?.life_areas) return null;

  const timeframeLabel =
    TIMEFRAME_LABELS[horoscope.timeframe] || horoscope.timeframe;
  const zodiacSign = sign as ZodiacSign;
  const signName = ZODIAC_NAMES_UK[zodiacSign] || sign;

  // Sort life areas: highest rating first
  const sortedAreas = [...horoscope.life_areas].sort(
    (a, b) => b.rating - a.rating
  );

  return (
    <div className="space-y-4">
      {/* Sign header */}
      <div className="flex items-center gap-3 pb-2">
        <ZodiacIcon sign={zodiacSign} size={28} className="text-zorya-violet" />
        <div>
          <h2 className="text-lg font-display font-bold text-white">
            {signName}
          </h2>
          <p className="text-white/40 text-xs">
            {timeframeLabel} · {horoscope.date}
          </p>
        </div>
      </div>

      {/* Overall theme + rating */}
      <OverallRating
        rating={horoscope.overall_rating}
        theme={horoscope.overall_theme}
      />

      {/* Horoscope text (if available) */}
      {horoscopeText?.text && (
        <div className="rounded-xl bg-white/[0.04] border border-white/10 p-4">
          <p className="text-white/75 text-sm leading-relaxed whitespace-pre-wrap">
            {horoscopeText.text}
          </p>
        </div>
      )}

      {/* Life areas grid */}
      <div className="space-y-2">
        <p className="text-white/40 text-xs font-medium uppercase tracking-wider px-1">
          Сфери життя
        </p>
        <div className="grid gap-2">
          {sortedAreas.map((area) => (
            <LifeAreaCard key={area.area} area={area} />
          ))}
        </div>
      </div>

      {/* Moon info */}
      {horoscope.moon && <MoonBadge moon={horoscope.moon} />}

      {/* Lucky elements */}
      {horoscope.lucky_elements && (
        <LuckyBadges lucky={horoscope.lucky_elements} />
      )}

      {/* Tips */}
      {horoscope.tips && horoscope.tips.length > 0 && (
        <TipsList tips={horoscope.tips} />
      )}

      {/* Planetary influences (collapsible) */}
      {horoscope.planetary_influences &&
        horoscope.planetary_influences.length > 0 && (
          <PlanetaryInfluences
            influences={horoscope.planetary_influences}
          />
        )}
    </div>
  );
}

function PlanetaryInfluences({
  influences,
}: {
  influences: PlanetaryInfluence[];
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl bg-white/[0.04] border border-white/10 overflow-hidden">
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-white/40 text-xs font-medium uppercase tracking-wider">
          Планетарні впливи ({influences.length})
        </span>
        <span className="text-white/30 text-xs">{expanded ? '▲' : '▼'}</span>
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          {influences.map((inf, i) => (
            <div
              key={i}
              className="flex gap-3 p-3 rounded-lg bg-white/[0.03]"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zorya-violet/10 border border-zorya-violet/20 flex items-center justify-center">
                <span className="text-zorya-violet text-xs font-bold">
                  {inf.planet.charAt(0)}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-medium">
                  {inf.aspect_name || `${inf.planet} ${inf.aspect_type}`}
                </p>
                <p className="text-white/60 text-xs mt-1 leading-relaxed">
                  {inf.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
