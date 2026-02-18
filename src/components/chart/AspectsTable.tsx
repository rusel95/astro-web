'use client';

import { NatalChart } from '@/types/astrology';
import { PLANET_SYMBOLS, PLANET_NAMES_UK, ASPECT_SYMBOLS, ASPECT_NAMES_UK } from '@/lib/constants';

const ASPECT_COLORS: Record<string, string> = {
  Conjunction: 'text-blue-400', Opposition: 'text-red-400', Trine: 'text-green-400',
  Square: 'text-orange-400', Sextile: 'text-purple-400', Quincunx: 'text-amber-600',
  Semisextile: 'text-cyan-400', Semisquare: 'text-pink-400', Sesquisquare: 'text-indigo-400',
  Quintile: 'text-teal-400', Biquintile: 'text-teal-400',
};

export default function AspectsTable({ chart }: { chart: NatalChart }) {
  return (
    <div className="space-y-1">
      {chart.aspects.map((a, i) => (
        <div key={i} className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-white/[0.03] transition-colors text-sm">
          <span className="text-zorya-gold">{PLANET_SYMBOLS[a.planet1]}</span>
          <span className="text-white text-xs min-w-[60px]">{PLANET_NAMES_UK[a.planet1]}</span>
          <span className={`text-lg ${ASPECT_COLORS[a.type] || 'text-gray-400'}`}>{ASPECT_SYMBOLS[a.type]}</span>
          <span className="text-white text-xs min-w-[60px]">{PLANET_NAMES_UK[a.planet2]}</span>
          <span className="text-gray-500 text-xs ml-auto">{ASPECT_NAMES_UK[a.type]}</span>
          <span className="font-mono text-gray-400 text-xs">{a.orb.toFixed(2)}°</span>
        </div>
      ))}
    </div>
  );
}
