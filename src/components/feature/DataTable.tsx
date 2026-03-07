'use client';

import { getLabel } from './AnalysisSection';

/**
 * Renders an array of objects as a compact table.
 * Used for: planet positions, aspects, transits, fixed star conjunctions.
 */

interface DataTableProps {
  data: unknown[] | null | undefined;
  title?: string;
  /** Which keys to display as columns. If omitted, auto-detects from first item. */
  columns?: string[];
  /** Max rows before "show more" toggle. Default: 10 */
  maxRows?: number;
  className?: string;
}

export default function DataTable({ data, title, columns, maxRows = 10, className = '' }: DataTableProps) {
  if (!data || !Array.isArray(data) || data.length === 0) return null;

  // Filter to objects only
  const rows = data.filter(item => typeof item === 'object' && item !== null) as Record<string, unknown>[];
  if (rows.length === 0) return null;

  // Auto-detect columns from first item
  const cols = columns || Object.keys(rows[0]).filter(k =>
    !['id', 'subject', 'chart_data', 'options'].includes(k) &&
    typeof rows[0][k] !== 'object'
  ).slice(0, 6); // max 6 columns

  if (cols.length === 0) return null;

  return (
    <div className={`rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden ${className}`}>
      {title && (
        <div className="px-4 py-2.5 border-b border-white/[0.06]">
          <h3 className="text-sm font-medium text-white/70">{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {cols.map(col => (
                <th key={col} className="px-3 py-2 text-left text-xs font-medium text-white/40 whitespace-nowrap">
                  {getLabel(col)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, maxRows).map((row, i) => (
              <tr key={i} className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors">
                {cols.map(col => (
                  <td key={col} className="px-3 py-2 text-white/80 whitespace-nowrap">
                    {formatCell(row[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length > maxRows && (
        <div className="px-4 py-2 border-t border-white/[0.06] text-center">
          <span className="text-xs text-white/40">
            +{rows.length - maxRows} ще
          </span>
        </div>
      )}
    </div>
  );
}

function formatCell(value: unknown): string {
  if (value == null) return '—';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') {
    if (value > 0 && value < 360 && !Number.isInteger(value)) return `${value.toFixed(1)}°`;
    if (!Number.isInteger(value)) return value.toFixed(2);
    return String(value);
  }
  if (typeof value === 'boolean') return value ? 'Так' : 'Ні';
  if (Array.isArray(value)) return value.join(', ');
  return String(value);
}
