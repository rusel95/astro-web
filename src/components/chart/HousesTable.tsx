'use client';

import { NatalChart } from '@/types/astrology';
import { ZODIAC_NAMES_UK } from '@/lib/constants';
import ZodiacIcon from '@/components/icons/ZodiacIcon';

export default function HousesTable({ chart }: { chart: NatalChart }) {
  return (
    <div className="overflow-x-auto -mx-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-text-muted border-b border-white/10">
            <th className="text-left py-2.5 px-4 font-medium">Дім</th>
            <th className="text-left py-2.5 px-4 font-medium">Знак</th>
            <th className="text-right py-2.5 px-4 font-medium">Куспід</th>
          </tr>
        </thead>
        <tbody>
          {chart.houses.map((h) => (
            <tr key={h.number} className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="py-2.5 px-4 font-medium text-text-primary">
                <span className="text-zorya-violet mr-1">{h.number}</span>
                {h.number === 1 && <span className="text-[10px] text-text-muted ml-1">ASC</span>}
                {h.number === 10 && <span className="text-[10px] text-text-muted ml-1">MC</span>}
              </td>
              <td className="py-2.5 px-4">
                <span className="mr-1 inline-flex align-middle"><ZodiacIcon sign={h.sign} size={14} className="text-zorya-violet" /></span>
                <span className="text-text-secondary">{ZODIAC_NAMES_UK[h.sign]}</span>
              </td>
              <td className="py-2.5 px-4 text-right font-mono text-text-secondary text-xs">
                {h.cusp.toFixed(2)}°
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
