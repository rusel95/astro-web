'use client';

import { NatalChart } from '@/types/astrology';
import { PLANET_SYMBOLS, PLANET_NAMES_UK, ZODIAC_SYMBOLS, ZODIAC_NAMES_UK } from '@/lib/constants';

export default function PlanetsTable({ chart }: { chart: NatalChart }) {
  return (
    <div className="overflow-x-auto -mx-4">
      <table className="w-full text-sm min-w-[400px]">
        <thead>
          <tr className="text-text-muted border-b border-white/10">
            <th className="text-left py-2.5 px-4 font-medium">Планета</th>
            <th className="text-left py-2.5 px-4 font-medium">Знак</th>
            <th className="text-right py-2.5 px-4 font-medium">Градус</th>
            <th className="text-center py-2.5 px-4 font-medium">Дім</th>
            <th className="text-center py-2.5 px-4 font-medium">℞</th>
          </tr>
        </thead>
        <tbody>
          {chart.planets.map((p) => (
            <tr key={p.name} className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="py-2.5 px-4">
                <span className="text-zorya-violet mr-1.5 text-base">{PLANET_SYMBOLS[p.name]}</span>
                <span className="text-text-primary">{PLANET_NAMES_UK[p.name]}</span>
              </td>
              <td className="py-2.5 px-4">
                <span className="mr-1">{ZODIAC_SYMBOLS[p.sign]}</span>
                <span className="text-text-secondary">{ZODIAC_NAMES_UK[p.sign]}</span>
              </td>
              <td className="py-2.5 px-4 text-right font-mono text-text-secondary text-xs">
                {(p.longitude % 30).toFixed(2)}°
              </td>
              <td className="py-2.5 px-4 text-center text-text-secondary">{p.house}</td>
              <td className="py-2.5 px-4 text-center">
                {p.isRetrograde && <span className="text-orange-400 font-bold">℞</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
