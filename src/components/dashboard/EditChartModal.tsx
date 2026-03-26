'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import CitySearch from '@/components/CitySearch';

interface ChartData {
  id: string;
  name: string;
  birth_date: string;
  birth_time?: string;
  city: string;
  latitude?: number;
  longitude?: number;
  country_code?: string;
  gender?: string;
}

interface EditChartModalProps {
  chart: ChartData;
  onClose: () => void;
  onSaved: (updated: ChartData) => void;
}

export default function EditChartModal({ chart, onClose, onSaved }: EditChartModalProps) {
  const [form, setForm] = useState({
    name: chart.name || '',
    birth_date: chart.birth_date || '',
    birth_time: chart.birth_time ?? '',
    city: chart.city || '',
    latitude: chart.latitude ?? undefined as number | undefined,
    longitude: chart.longitude ?? undefined as number | undefined,
    country_code: chart.country_code || '',
    gender: chart.gender || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const payload: Record<string, unknown> = {
        name: form.name,
        birth_date: form.birth_date,
        birth_time: form.birth_time || null,
        city: form.city,
        country_code: form.country_code,
        gender: form.gender || null,
      };
      // Only include coordinates if they exist — don't send (0,0) for charts without geodata
      if (form.latitude != null && form.longitude != null) {
        payload.latitude = form.latitude;
        payload.longitude = form.longitude;
      }

      const res = await fetch(`/api/charts/${chart.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Помилка збереження');
      }

      const { chart: updated } = await res.json();
      onSaved({ ...chart, ...updated });
    } catch (e: any) {
      setError(e.message || 'Помилка збереження');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'w-full px-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.12] text-white text-sm placeholder-white/30 focus:outline-none focus:border-zorya-violet/50 transition-colors';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-2xl p-6 space-y-4"
        style={{
          background: 'linear-gradient(135deg, rgba(20,15,40,0.98) 0%, rgba(15,10,30,0.98) 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Редагувати дані</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 transition-colors">
            <X size={18} className="text-white/50" />
          </button>
        </div>

        {/* Fields */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-white/50 mb-1">Ім&apos;я</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Ваше ім'я"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/50 mb-1">Дата народження</label>
              <input
                type="date"
                value={form.birth_date}
                onChange={(e) => setForm(f => ({ ...f, birth_date: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Час народження</label>
              <input
                type="time"
                value={form.birth_time}
                onChange={(e) => setForm(f => ({ ...f, birth_time: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/50 mb-1">Місто народження</label>
            <CitySearch
              value={form.city}
              onSelect={(c) => setForm(f => ({
                ...f,
                city: c.name,
                latitude: c.lat,
                longitude: c.lon,
                country_code: c.countryCode,
              }))}
            />
          </div>

          <div>
            <label className="block text-xs text-white/50 mb-1">Стать</label>
            <select
              value={form.gender}
              onChange={(e) => setForm(f => ({ ...f, gender: e.target.value }))}
              className={`${inputClass} appearance-none`}
            >
              <option value="">Не вказано</option>
              <option value="female">Жіноча</option>
              <option value="male">Чоловіча</option>
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-xs text-red-400">{error}</p>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white/80 transition-colors"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
          >
            Скасувати
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #6C3CE1 0%, #9966E6 100%)',
              boxShadow: '0 2px 10px rgba(108,60,225,0.35)',
            }}
          >
            {saving ? 'Зберігаю...' : 'Зберегти'}
          </button>
        </div>
      </div>
    </div>
  );
}
