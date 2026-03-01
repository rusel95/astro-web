'use client';

import { useState, useEffect } from 'react';
import { apiGet } from '@/lib/api-client';

interface SavedChart {
  id: string;
  name: string;
  birth_date: string;
  city: string;
}

interface ChartSelectorProps {
  onSelect: (chart: SavedChart) => void;
  label?: string;
}

export default function ChartSelector({
  onSelect,
  label = 'Оберіть карту',
}: ChartSelectorProps) {
  const [charts, setCharts] = useState<SavedChart[]>([]);
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await apiGet<SavedChart[]>('/api/charts/my');
      if (data) {
        setCharts(data);
        if (data.length > 0) {
          setSelected(data[0].id);
          onSelect(data[0]);
        }
      }
      setLoading(false);
    }
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (id: string) => {
    setSelected(id);
    const chart = charts.find((c) => c.id === id);
    if (chart) onSelect(chart);
  };

  if (loading) {
    return (
      <div className="animate-pulse h-12 rounded-xl bg-white/[0.08]" />
    );
  }

  if (charts.length === 0) {
    return (
      <p className="text-white/50 text-sm">
        Немає збережених карт.{' '}
        <a href="/chart/new" className="text-zorya-violet underline">
          Створити карту
        </a>
      </p>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-white/70 mb-1">
        {label}
      </label>
      <select
        value={selected}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-white/[0.08] border border-white/[0.15] text-white focus:outline-none focus:border-zorya-violet/50 transition-colors min-h-[44px] appearance-none"
      >
        {charts.map((c) => (
          <option key={c.id} value={c.id} className="bg-cosmic-900 text-white">
            {c.name} — {c.birth_date}
          </option>
        ))}
      </select>
    </div>
  );
}
