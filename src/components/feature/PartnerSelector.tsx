'use client';

import { useState, useEffect } from 'react';
import { apiGet, apiPost } from '@/lib/api-client';
import BirthDataForm from './BirthDataForm';
import type { ChartInput } from '@/types/astrology';
import type { PartnerChart } from '@/types/features';

interface PartnerSelectorProps {
  onSelect: (partner: PartnerChart | ChartInput) => void;
  label?: string;
}

export default function PartnerSelector({
  onSelect,
  label = 'Оберіть партнера',
}: PartnerSelectorProps) {
  const [partners, setPartners] = useState<PartnerChart[]>([]);
  const [selected, setSelected] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await apiGet<PartnerChart[]>('/api/partner-charts');
      if (data) {
        setPartners(data);
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
    if (id === 'new') {
      setShowForm(true);
      return;
    }
    setSelected(id);
    const partner = partners.find((p) => p.id === id);
    if (partner) onSelect(partner);
  };

  const handleNewPartner = async (data: ChartInput) => {
    setSaving(true);
    const { data: saved } = await apiPost<PartnerChart>('/api/partner-charts', {
      name: data.name,
      birth_date: data.birthDate,
      birth_time: data.birthTime,
      city: data.city,
      country_code: data.countryCode,
      latitude: data.latitude,
      longitude: data.longitude,
      gender: data.gender || null,
    });

    if (saved) {
      setPartners((prev) => [saved, ...prev]);
      setSelected(saved.id);
      onSelect(saved);
      setShowForm(false);
    } else {
      // Fallback: use form data directly without saving
      onSelect(data);
      setShowForm(false);
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="animate-pulse h-12 rounded-xl bg-white/[0.08]" />;
  }

  if (showForm) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-white/70">Додати партнера</h3>
          <button
            onClick={() => setShowForm(false)}
            className="text-xs text-white/40 hover:text-white/70 min-h-[44px] px-2"
          >
            Скасувати
          </button>
        </div>
        <BirthDataForm
          variant="full"
          onSubmit={handleNewPartner}
          loading={saving}
          compact
          submitLabel="Зберегти партнера"
        />
      </div>
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
        {partners.map((p) => (
          <option key={p.id} value={p.id} className="bg-cosmic-900 text-white">
            {p.name} — {p.birth_date}
          </option>
        ))}
        <option value="new" className="bg-cosmic-900 text-zorya-violet">
          + Додати партнера
        </option>
      </select>
    </div>
  );
}
