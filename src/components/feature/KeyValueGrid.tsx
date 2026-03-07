'use client';

import { getLabel } from './AnalysisSection';

/**
 * Renders key-value pairs in a clean grid layout.
 * Used for: BaZi pillars, numerology numbers, planet dignities, etc.
 */

interface KeyValueGridProps {
  data: Record<string, unknown>;
  columns?: 1 | 2 | 3;
  className?: string;
  /** If true, shows all keys. If false, filters out objects/arrays */
  showComplex?: boolean;
}

export default function KeyValueGrid({ data, columns = 2, className = '', showComplex = false }: KeyValueGridProps) {
  if (!data || typeof data !== 'object') return null;

  const entries = Object.entries(data).filter(([key, value]) => {
    if (value == null || value === '') return false;
    if (['subject', 'subject_data', 'chart_data', 'options', 'id'].includes(key)) return false;
    if (!showComplex && typeof value === 'object') return false;
    return true;
  });

  if (entries.length === 0) return null;

  const gridCols = columns === 1 ? 'grid-cols-1' : columns === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2';

  return (
    <div className={`grid ${gridCols} gap-2 ${className}`}>
      {entries.map(([key, value]) => (
        <div
          key={key}
          className="flex items-center justify-between gap-2 rounded-lg bg-white/[0.04] border border-white/[0.06] px-3 py-2"
        >
          <span className="text-xs text-white/50 truncate">{getLabel(key)}</span>
          <span className="text-sm text-white font-medium text-right truncate max-w-[60%]">
            {formatValue(value)}
          </span>
        </div>
      ))}
    </div>
  );
}

function formatValue(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') {
    // Format degrees
    if (value > 0 && value < 360 && !Number.isInteger(value)) {
      return `${value.toFixed(1)}°`;
    }
    return String(value);
  }
  if (typeof value === 'boolean') return value ? 'Так' : 'Ні';
  if (Array.isArray(value)) return value.map(v => typeof v === 'string' ? v : JSON.stringify(v)).join(', ');
  return String(value);
}
