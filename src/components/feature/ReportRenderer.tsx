'use client';

/**
 * Renders structured report text (from SDK analysis/report endpoints).
 * Handles: plain text, markdown-like headings (## Heading), paragraphs (\n\n),
 * bullet lists (* item / - item), interpretation arrays, and scored items.
 */

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { getLabel } from './AnalysisSection';

interface ReportRendererProps {
  content: unknown;
  className?: string;
}

export default function ReportRenderer({ content, className = '' }: ReportRendererProps) {
  if (!content) return null;

  // String content — render as formatted paragraphs
  if (typeof content === 'string') {
    return <FormattedText text={content} className={className} />;
  }

  // Array of strings or objects with text/interpretation fields
  if (Array.isArray(content)) {
    return (
      <div className={`space-y-3 ${className}`}>
        {content.map((item, i) => (
          <ReportItem key={i} item={item} />
        ))}
      </div>
    );
  }

  // Object with named sections
  if (typeof content === 'object') {
    const obj = content as Record<string, unknown>;
    const entries = Object.entries(obj).filter(([, v]) => v != null && v !== '');
    if (entries.length === 0) return null;

    return (
      <div className={`space-y-4 ${className}`}>
        {entries.map(([key, value]) => (
          <ReportSection key={key} sectionKey={key} value={value} />
        ))}
      </div>
    );
  }

  return null;
}

// ─── Ukrainian translation maps ──────────────────────────────────────

const UK_PROG_PLANETS: Record<string, string> = {
  Sun: 'Прогресоване Сонце', Moon: 'Прогресований Місяць',
  Mercury: 'Прогресований Меркурій', Venus: 'Прогресована Венера',
  Mars: 'Прогресований Марс', Jupiter: 'Прогресований Юпітер',
  Saturn: 'Прогресований Сатурн', Uranus: 'Прогресований Уран',
  Neptune: 'Прогресований Нептун', Pluto: 'Прогресований Плутон',
};

const UK_DIR_PLANETS: Record<string, string> = {
  Sun: 'Направлене Сонце', Moon: 'Направлений Місяць',
  Mercury: 'Направлений Меркурій', Venus: 'Направлена Венера',
  Mars: 'Направлений Марс', Jupiter: 'Направлений Юпітер',
  Saturn: 'Направлений Сатурн', Uranus: 'Направлений Уран',
  Neptune: 'Направлений Нептун', Pluto: 'Направлений Плутон',
  True_Node: 'Направлений Північний вузол', True_South_Node: 'Направлений Південний вузол',
  Mean_Lilith: 'Направлена Ліліт',
};

const UK_SIGNS: Record<string, string> = {
  Aries: 'Овні', Taurus: 'Тельці', Gemini: 'Близнюках',
  Cancer: 'Раку', Leo: 'Леві', Virgo: 'Діві',
  Libra: 'Терезах', Scorpio: 'Скорпіоні', Sagittarius: 'Стрільці',
  Capricorn: 'Козерозі', Aquarius: 'Водолії', Pisces: 'Рибах',
  Ari: 'Овні', Tau: 'Тельці', Gem: 'Близнюках',
  Can: 'Раку', Vir: 'Діві', Lib: 'Терезах',
  Sco: 'Скорпіоні', Sag: 'Стрільці', Cap: 'Козерозі',
  Aqu: 'Водолії', Pis: 'Рибах',
};

const ALL_PLANET_KEYS = Array.from(new Set([...Object.keys(UK_PROG_PLANETS), ...Object.keys(UK_DIR_PLANETS)]));
const ALL_SIGN_KEYS = Object.keys(UK_SIGNS).sort((a, b) => b.length - a.length);

const PROG_HOUSE_PATTERN = new RegExp(`Progressed (${Object.keys(UK_PROG_PLANETS).join('|')}) in House (\\d+)`, 'g');
const PROG_SIGN_PATTERN = new RegExp(`Progressed (${Object.keys(UK_PROG_PLANETS).join('|')}) in (${ALL_SIGN_KEYS.join('|')})(?=[^a-z]|$)`, 'g');
const DIR_HOUSE_PATTERN = new RegExp(`(?:Directed|Solar Arc) (${ALL_PLANET_KEYS.join('|')}) in (?:the )?(\\d+)(?:st|nd|rd|th)? [Hh]ouse`, 'g');
const DIR_SIGN_PATTERN = new RegExp(`(?:Directed|Solar Arc) (${ALL_PLANET_KEYS.join('|')}) in (${ALL_SIGN_KEYS.join('|')})(?=[^a-z]|$)`, 'g');

function cleanText(raw: string): string {
  return raw
    .replace(/^НАЗВА:\s*/gm, '')
    .replace(/^ТЕКСТ:\s*/gm, '')
    .replace(PROG_HOUSE_PATTERN, (_, planet, n) => `${UK_PROG_PLANETS[planet]} в ${n}-му Домі`)
    .replace(PROG_SIGN_PATTERN, (_, planet, sign) => `${UK_PROG_PLANETS[planet]} у ${UK_SIGNS[sign]}`)
    .replace(DIR_HOUSE_PATTERN, (_, planet, n) => `${UK_DIR_PLANETS[planet] ?? planet} в ${n}-му Домі`)
    .replace(DIR_SIGN_PATTERN, (_, planet, sign) => `${UK_DIR_PLANETS[planet] ?? planet} у ${UK_SIGNS[sign]}`);
}

// ─── Score bar ────────────────────────────────────────────────────────

function ScoreBar({ score, max = 10 }: { score: number; max?: number }) {
  const pct = Math.min(100, Math.max(0, (score / max) * 100));
  const barColor = pct >= 70 ? 'bg-emerald-400' : pct >= 40 ? 'bg-zorya-gold' : 'bg-orange-400';
  const textColor = pct >= 70 ? 'text-emerald-400' : pct >= 40 ? 'text-zorya-gold' : 'text-orange-400';

  return (
    <div className="flex items-center gap-2.5 shrink-0">
      <div className="w-[80px] h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-xs font-semibold tabular-nums ${textColor}`}>
        {score}/{max}
      </span>
    </div>
  );
}

// ─── Expandable long text ────────────────────────────────────────────

function ExpandableText({ text, maxLength = 400 }: { text: string; maxLength?: number }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > maxLength;

  if (!isLong) {
    return <FormattedText text={text} />;
  }

  return (
    <div>
      <div className={!expanded ? 'max-h-[140px] overflow-hidden relative' : ''}>
        <FormattedText text={expanded ? text : text.slice(0, maxLength) + '…'} />
        {!expanded && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-cosmic-900/80 to-transparent pointer-events-none" />
        )}
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-2 flex items-center gap-1 text-xs text-zorya-violet hover:text-zorya-gold transition-colors font-medium"
      >
        <ChevronDown size={14} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
        {expanded ? 'Згорнути' : 'Читати далі'}
      </button>
    </div>
  );
}

// ─── Formatted text (markdown-like) ──────────────────────────────────

function FormattedText({ text, className = '' }: { text: string; className?: string }) {
  const cleaned = cleanText(text);
  const paragraphs = cleaned.split(/\n\n+/).filter(p => p.trim());

  return (
    <div className={`space-y-3 ${className}`}>
      {paragraphs.map((para, i) => {
        const trimmed = para.trim();

        // Heading: ## Title
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={i} className="flex items-center gap-2 text-base font-semibold text-white mt-4 first:mt-0">
              <span className="text-zorya-violet text-sm">✦</span>
              {trimmed.slice(3)}
            </h3>
          );
        }

        // Heading: # Title
        if (trimmed.startsWith('# ')) {
          return (
            <h2 key={i} className="flex items-center gap-2 text-lg font-bold text-white mt-5 first:mt-0">
              <span className="text-zorya-gold text-base">✦</span>
              {trimmed.slice(2)}
            </h2>
          );
        }

        // Bullet list
        const lines = trimmed.split('\n');
        const isList = lines.every(l => /^[-*•]\s/.test(l.trim()));
        if (isList) {
          return (
            <div key={i} className="space-y-1.5">
              {lines.map((line, j) => (
                <div key={j} className="flex gap-2.5 py-1.5 px-2.5 rounded-lg bg-white/[0.03] border border-white/[0.04]">
                  <span className="text-zorya-violet shrink-0 mt-0.5 text-xs">✦</span>
                  <span className="text-sm text-white/80 leading-relaxed">
                    {line.replace(/^[-*•]\s*/, '')}
                  </span>
                </div>
              ))}
            </div>
          );
        }

        // Regular paragraph
        return (
          <p key={i} className="text-sm text-white/80 leading-relaxed">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

// ─── Single report item (from array) ─────────────────────────────────

function ReportItem({ item }: { item: unknown }) {
  if (typeof item === 'string') {
    return (
      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
        <FormattedText text={item} />
      </div>
    );
  }

  if (typeof item === 'object' && item !== null) {
    const obj = item as Record<string, unknown>;
    const rawTitle = (obj.title || obj.planet || obj.aspect || obj.name || obj.area || obj.category) as string | undefined;
    const rawText = (obj.interpretation || obj.description || obj.text || obj.prediction || obj.meaning || obj.content || obj.summary) as string | undefined;
    const title = rawTitle ? cleanText(String(rawTitle)) : undefined;
    const text = rawText ? cleanText(String(rawText)) : undefined;
    const rating = obj.rating as number | undefined;
    const score = obj.score as number | undefined;
    const scoreVal = rating ?? score;

    if (!title && !text) {
      const strings = Object.values(obj).filter(v => typeof v === 'string') as string[];
      if (strings.length === 0) return null;
      return (
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
          <FormattedText text={strings.join('\n\n')} />
        </div>
      );
    }

    return (
      <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] overflow-hidden">
        {/* Accent top line */}
        <div className="h-[2px] bg-gradient-to-r from-zorya-violet/40 via-zorya-blue/20 to-transparent" />

        <div className="p-4">
          {title && (
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-zorya-violet text-xs shrink-0">✦</span>
                <span className="text-sm font-semibold text-white">{String(title)}</span>
              </div>
              {scoreVal != null && <ScoreBar score={scoreVal} />}
            </div>
          )}
          {text && (
            <div className={title ? 'ml-[22px]' : ''}>
              <ExpandableText text={String(text)} />
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}

// ─── Named section (from object keys) ────────────────────────────────

function ReportSection({ sectionKey, value }: { sectionKey: string; value: unknown }) {
  if (['subject', 'subject_data', 'chart_data', 'progressed_data', 'directed_data', 'options', 'id', 'created_at'].includes(sectionKey)) {
    return null;
  }

  const label = getLabel(sectionKey);

  // String value — show with left accent border
  if (typeof value === 'string') {
    const cleaned = cleanText(value);
    if (!cleaned.trim()) return null;
    return (
      <div className="border-l-2 border-zorya-violet/30 pl-4">
        <p className="text-xs font-medium text-zorya-violet/70 uppercase tracking-wide mb-1.5">{label}</p>
        <ExpandableText text={cleaned} />
      </div>
    );
  }

  // Number — render as score bar if applicable
  if (typeof value === 'number') {
    const lowerKey = sectionKey.toLowerCase();
    const isScore = lowerKey.includes('score') || lowerKey.includes('rating') ||
      lowerKey.includes('strength') || lowerKey.includes('оцінка');
    if (isScore) {
      const max = value <= 10 ? 10 : 100;
      return (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
          <span className="text-sm text-white/70 font-medium">{label}</span>
          <ScoreBar score={value} max={max} />
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 px-1">
        <span className="text-xs text-white/50 uppercase tracking-wide">{label}:</span>
        <span className="text-sm text-zorya-gold font-medium">{value}</span>
      </div>
    );
  }

  // Boolean
  if (typeof value === 'boolean') {
    return (
      <div className="flex items-center gap-2 px-1">
        <span className="text-xs text-white/50 uppercase tracking-wide">{label}:</span>
        <span className={`text-sm font-medium ${value ? 'text-emerald-400' : 'text-white/50'}`}>
          {value ? 'Так' : 'Ні'}
        </span>
      </div>
    );
  }

  // Array — render as tags (short strings) or item cards
  if (Array.isArray(value)) {
    if (value.length === 0) return null;

    // Short string arrays → render as tags
    if (value.every(v => typeof v === 'string') && value.every(v => String(v).length < 50) && value.length <= 10) {
      return (
        <div>
          <p className="text-xs font-medium text-zorya-violet/70 uppercase tracking-wide mb-2">{label}</p>
          <div className="flex flex-wrap gap-1.5">
            {value.map((item, i) => (
              <span key={i} className="px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/70 text-xs">
                {String(item)}
              </span>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <p className="text-xs font-medium text-zorya-violet/70 uppercase tracking-wide">{label}</p>
        {value.map((item, i) => (
          <ReportItem key={i} item={item} />
        ))}
      </div>
    );
  }

  // Nested object — recurse with section header
  if (typeof value === 'object' && value !== null) {
    return (
      <div>
        <p className="text-xs font-medium text-zorya-violet/70 uppercase tracking-wide mb-2">{label}</p>
        <ReportRenderer content={value} />
      </div>
    );
  }

  return null;
}
