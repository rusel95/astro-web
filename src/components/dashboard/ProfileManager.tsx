'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, User, X, Calendar, MapPin, Clock, Loader2 } from 'lucide-react';

interface Chart {
  id: string;
  name: string;
  birth_date: string;
  city: string;
  country_code: string;
  gender: string;
  created_at: string;
}

interface Props {
  charts: Chart[];
  userId: string;
  onChartAdded?: (chart: Chart) => void;
}

const MAX_PROFILES = 6; // 1 primary + 5 additional

export default function ProfileManager({ charts, userId, onChartAdded }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    birth_date: '',
    birth_time: '',
    city: '',
    gender: 'female' as 'male' | 'female',
  });

  const canAdd = charts.length < MAX_PROFILES;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.birth_date || !form.city) {
      setError("Заповніть ім'я, дату та місто народження");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // First geocode the city to get real coordinates
      const geoRes = await fetch(`/api/geocode?q=${encodeURIComponent(form.city)}`);
      const cities = await geoRes.json();
      const city = cities[0];
      if (!city) {
        setError('Місто не знайдено. Перевірте назву.');
        setSaving(false);
        return;
      }

      // Use /api/chart to generate full chart data (natal chart calculation)
      const chartRes = await fetch('/api/chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          birthDate: form.birth_date,
          birthTime: form.birth_time || '12:00',
          city: city.name,
          countryCode: city.countryCode || 'UA',
          latitude: city.lat,
          longitude: city.lon,
          gender: form.gender,
        }),
      });

      if (!chartRes.ok) throw new Error('Chart calculation failed');
      const chartData = await chartRes.json();

      // Save to Supabase with real chart_data
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      const { data, error: dbError } = await supabase
        .from('charts')
        .insert({
          user_id: userId,
          name: form.name,
          birth_date: form.birth_date,
          birth_time: form.birth_time || '12:00',
          city: city.name,
          country_code: city.countryCode || 'UA',
          latitude: city.lat,
          longitude: city.lon,
          gender: form.gender,
          chart_data: chartData,
        })
        .select('id, name, birth_date, city, country_code, gender, created_at')
        .single();

      if (dbError) throw dbError;

      if (data && onChartAdded) {
        onChartAdded(data);
      }

      setForm({ name: '', birth_date: '', birth_time: '', city: '', gender: 'female' });
      setShowForm(false);
    } catch (err) {
      console.error('Failed to add profile:', err);
      setError('Не вдалося зберегти профіль. Спробуйте ще раз.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-white">Профілі</h2>
        {canAdd ? (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white/70 hover:text-white transition-all"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {showForm ? <X size={13} /> : <Plus size={13} />}
            {showForm ? 'Скасувати' : 'Додати профіль'}
          </button>
        ) : (
          <span className="text-xs text-white/30">Максимум {MAX_PROFILES} профілів</span>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="rounded-2xl p-4 mb-3 space-y-3 overflow-hidden"
            style={{ background: 'rgba(108,60,225,0.08)', border: '1px solid rgba(108,60,225,0.2)' }}
          >
            <p className="text-sm font-medium text-white/80 mb-1">Новий профіль</p>

            {/* Name */}
            <div className="relative">
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Ім'я"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm text-white bg-white/5 border border-white/10 placeholder:text-white/30 focus:border-zorya-violet/50 focus:outline-none transition-colors"
              />
            </div>

            {/* Date + Time row */}
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="date"
                  value={form.birth_date}
                  onChange={e => setForm(f => ({ ...f, birth_date: e.target.value }))}
                  className="w-full pl-9 pr-2 py-2.5 rounded-xl text-sm text-white bg-white/5 border border-white/10 focus:border-zorya-violet/50 focus:outline-none transition-colors [color-scheme:dark]"
                />
              </div>
              <div className="relative">
                <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="time"
                  value={form.birth_time}
                  onChange={e => setForm(f => ({ ...f, birth_time: e.target.value }))}
                  placeholder="Час"
                  className="w-full pl-9 pr-2 py-2.5 rounded-xl text-sm text-white bg-white/5 border border-white/10 focus:border-zorya-violet/50 focus:outline-none transition-colors [color-scheme:dark]"
                />
              </div>
            </div>

            {/* City */}
            <div className="relative">
              <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Місто народження"
                value={form.city}
                onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm text-white bg-white/5 border border-white/10 placeholder:text-white/30 focus:border-zorya-violet/50 focus:outline-none transition-colors"
              />
            </div>

            {/* Gender */}
            <div className="flex gap-2">
              {(['female', 'male'] as const).map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, gender: g }))}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                    form.gender === g
                      ? 'bg-zorya-violet/20 text-white border border-zorya-violet/40'
                      : 'bg-white/5 text-white/50 border border-white/10 hover:text-white/70'
                  }`}
                >
                  {g === 'female' ? '♀ Жінка' : '♂ Чоловік'}
                </button>
              ))}
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #6C3CE1 0%, #9966E6 100%)' }}
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  Зберігаємо...
                </span>
              ) : (
                'Зберегти профіль'
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
