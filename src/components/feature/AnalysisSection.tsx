'use client';

import { useState } from 'react';

// Ukrainian labels for common API keys
const UK_LABELS: Record<string, string> = {
  general: 'Загальне',
  love: 'Кохання',
  career: 'Кар\'єра',
  health: 'Здоров\'я',
  money: 'Фінанси',
  finances: 'Фінанси',
  spirituality: 'Духовність',
  mood: 'Настрій',
  color: 'Колір',
  lucky_number: 'Щасливе число',
  lucky_numbers: 'Щасливі числа',
  compatibility: 'Сумісність',
  description: 'Опис',
  summary: 'Резюме',
  advice: 'Порада',
  rating: 'Рейтинг',
  score: 'Оцінка',
  strengths: 'Сильні сторони',
  weaknesses: 'Слабкі сторони',
  challenges: 'Виклики',
  opportunities: 'Можливості',
  recommendations: 'Рекомендації',
  interpretation: 'Інтерпретація',
  aspects: 'Аспекти',
  planets: 'Планети',
  houses: 'Будинки',
  sign: 'Знак',
  element: 'Стихія',
  modality: 'Модальність',
  ruler: 'Управитель',
  dignity: 'Гідність',
  detriment: 'Вигнання',
  exaltation: 'Екзальтація',
  fall: 'Падіння',
  retrograde: 'Ретроградність',
  orb: 'Орб',
  applying: 'Застосовний',
  separating: 'Розділяючий',
  key_influences: 'Ключові впливи',
  detailed_analysis: 'Детальний аналіз',
  daily: 'Щоденний',
  weekly: 'Тижневий',
  monthly: 'Місячний',
  yearly: 'Річний',
  personal: 'Особистий',
  timing: 'Час',
  red_flags: 'Тривожні знаки',
  love_languages: 'Мови кохання',
  body_mapping: 'Карта тіла',
  biorhythms: 'Біоритми',
  energy_patterns: 'Енергетичні патерни',
  wellness_timing: 'Час для здоров\'я',
  wellness_score: 'Оцінка здоров\'я',
};

function getLabel(key: string): string {
  return UK_LABELS[key] || key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

interface AnalysisSectionProps {
  title: string;
  data: Record<string, unknown> | unknown[] | null;
  loading?: boolean;
  defaultCollapsed?: boolean;
}

function RenderValue({ value, depth = 0 }: { value: unknown; depth?: number }) {
  if (value === null || value === undefined) return null;

  if (typeof value === 'string') {
    return <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{value}</p>;
  }

  if (typeof value === 'number') {
    return <span className="text-zorya-gold font-medium">{value}</span>;
  }

  if (typeof value === 'boolean') {
    return <span className="text-zorya-violet">{value ? 'Так' : 'Ні'}</span>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return null;
    if (typeof value[0] === 'string' || typeof value[0] === 'number') {
      return (
        <ul className="list-disc list-inside space-y-1">
          {value.map((item, i) => (
            <li key={i} className="text-white/80 text-sm">{String(item)}</li>
          ))}
        </ul>
      );
    }
    return (
      <div className="space-y-3">
        {value.map((item, i) => (
          <div key={i} className="pl-3 border-l border-white/10">
            <RenderValue value={item} depth={depth + 1} />
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).filter(
      ([, v]) => v !== null && v !== undefined
    );
    if (entries.length === 0) return null;
    return (
      <div className="space-y-3">
        {entries.map(([key, val]) => (
          <CollapsibleEntry key={key} label={getLabel(key)} value={val} depth={depth + 1} />
        ))}
      </div>
    );
  }

  return <span className="text-white/60 text-sm">{String(value)}</span>;
}

function CollapsibleEntry({
  label,
  value,
  depth,
}: {
  label: string;
  value: unknown;
  depth: number;
}) {
  const isComplex = typeof value === 'object' && value !== null;
  const hasMany = isComplex && (Array.isArray(value) ? value.length > 5 : Object.keys(value as object).length > 5);
  const [collapsed, setCollapsed] = useState(hasMany && depth > 0);

  if (!isComplex) {
    return (
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="text-white/50 text-xs font-medium uppercase tracking-wide">{label}:</span>
        <RenderValue value={value} depth={depth} />
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors min-h-[44px] w-full text-left"
      >
        <span className="text-xs text-white/40">{collapsed ? '▶' : '▼'}</span>
        {label}
      </button>
      {!collapsed && (
        <div className="pl-4 mt-1">
          <RenderValue value={value} depth={depth} />
        </div>
      )}
    </div>
  );
}

export default function AnalysisSection({
  title,
  data,
  loading = false,
  defaultCollapsed = false,
}: AnalysisSectionProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  if (loading) {
    return (
      <div className="rounded-2xl bg-white/[0.05] border border-white/10 p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-5 w-40 bg-white/[0.08] rounded" />
          <div className="h-4 w-full bg-white/[0.08] rounded" />
          <div className="h-4 w-3/4 bg-white/[0.08] rounded" />
          <div className="h-4 w-5/6 bg-white/[0.08] rounded" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="rounded-2xl bg-white/[0.05] border border-white/10 overflow-hidden">
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/[0.03] transition-colors min-h-[44px]"
      >
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <span className="text-white/40 text-sm">{collapsed ? '▶' : '▼'}</span>
      </button>
      {!collapsed && (
        <div className="px-4 pb-4 space-y-3">
          <RenderValue value={data} />
        </div>
      )}
    </div>
  );
}
