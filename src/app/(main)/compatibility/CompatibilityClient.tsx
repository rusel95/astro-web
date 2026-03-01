'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import CitySearch from '@/components/CitySearch';
import DateInputPicker from '@/components/DateInputPicker';
import TimePicker from '@/components/TimePicker';
import SvgChartViewer from '@/components/feature/SvgChartViewer';
import AnalysisSection from '@/components/feature/AnalysisSection';
import { isSupabaseConfigured } from '@/lib/supabase/client';

const BG = 'linear-gradient(to bottom, #0f0a1e, #1a0e35)';
const BTN_GRAD = 'linear-gradient(135deg, #6C3CE1 0%, #9966E6 100%)';
const INPUT_STYLE: React.CSSProperties = {
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.15)',
};

interface SavedChart {
  id: string;
  name: string;
  birth_date: string;
  birth_time: string;
  city: string;
  country_code: string;
  latitude: number;
  longitude: number;
  gender: string;
}

export default function CompatibilityClient() {
  const [savedCharts, setSavedCharts] = useState<SavedChart[]>([]);
  const [selectedChart1, setSelectedChart1] = useState<string | null>(null);
  const [useExisting1, setUseExisting1] = useState(false);

  // Person 1 (You)
  const [name1, setName1] = useState('');
  const [birthDate1, setBirthDate1] = useState('1995-06-15');
  const [birthTime1, setBirthTime1] = useState('12:00');
  const [city1, setCity1] = useState('');
  const [lat1, setLat1] = useState(0);
  const [lon1, setLon1] = useState(0);
  const [countryCode1, setCountryCode1] = useState('');

  // Person 2 (Partner)
  const [name2, setName2] = useState('');
  const [birthDate2, setBirthDate2] = useState('1993-03-22');
  const [birthTime2, setBirthTime2] = useState('14:30');
  const [city2, setCity2] = useState('');
  const [lat2, setLat2] = useState(0);
  const [lon2, setLon2] = useState(0);
  const [countryCode2, setCountryCode2] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    async function fetchMyCharts() {
      try {
        const res = await fetch('/api/charts/my');
        if (!res.ok) return;
        const data = await res.json();
        if (data.charts && data.charts.length > 0) {
          setSavedCharts(data.charts);
          const first = data.charts[0];
          setSelectedChart1(first.id);
          applyChart(first);
          setUseExisting1(true);
        }
      } catch { /* Not logged in */ }
    }
    fetchMyCharts();
  }, []);

  function applyChart(chart: SavedChart) {
    setName1(chart.name || '');
    setBirthDate1(chart.birth_date || '1995-06-15');
    setBirthTime1(chart.birth_time || '12:00');
    setCity1(chart.city || '');
    setCountryCode1(chart.country_code || '');
    setLat1(chart.latitude || 0);
    setLon1(chart.longitude || 0);
  }

  function handleChartSelect(chartId: string) {
    const chart = savedCharts.find(c => c.id === chartId);
    if (chart) { setSelectedChart1(chartId); applyChart(chart); }
  }

  function handleSwitchToManual() {
    setUseExisting1(false); setSelectedChart1(null);
    setName1(''); setBirthDate1('1995-06-15'); setBirthTime1('12:00');
    setCity1(''); setLat1(0); setLon1(0); setCountryCode1('');
  }

  function handleSwitchToExisting() {
    setUseExisting1(true);
    if (savedCharts.length > 0) { const f = savedCharts[0]; setSelectedChart1(f.id); applyChart(f); }
  }

  const canSubmit = name1.trim().length > 0 && name2.trim().length > 0 && city1.length > 0 && city2.length > 0 && lat1 !== 0 && lat2 !== 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch('/api/compatibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          person1: { name: name1, birthDate: birthDate1, birthTime: birthTime1, city: city1, countryCode: countryCode1, latitude: lat1, longitude: lon1 },
          person2: { name: name2, birthDate: birthDate2, birthTime: birthTime2, city: city2, countryCode: countryCode2, latitude: lat2, longitude: lon2 },
        }),
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Помилка розрахунку'); }
      setResult(await res.json());
    } catch (err: any) {
      setError(err.message || 'Помилка розрахунку');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: BG }}>
        <div className="flex flex-col items-center gap-6">
          <motion.div
            className="w-16 h-16 rounded-full border-4 border-t-purple-500 border-purple-200"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-white text-xl">Аналізуємо сумісність...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: BG }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-white mb-4">
            Сумісність партнерів
          </motion.h1>
          <p className="text-lg text-white/60">Синастрія — порівняння двох натальних карт для оцінки сумісності</p>
        </div>

        {/* Two-column form */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Person 1 */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-3xl" style={{ background: 'rgba(108, 60, 225, 0.1)', border: '1px solid rgba(108, 60, 225, 0.3)' }}>
            <h2 className="text-2xl font-bold text-white mb-4">Ви</h2>
            {savedCharts.length > 0 && (
              <div className="flex gap-2 mb-5">
                <button onClick={handleSwitchToExisting} className="flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all min-h-[44px]" style={{ background: useExisting1 ? 'rgba(108,60,225,0.3)' : 'rgba(255,255,255,0.05)', border: useExisting1 ? '1px solid rgba(108,60,225,0.6)' : '1px solid rgba(255,255,255,0.1)', color: useExisting1 ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                  Моя карта
                </button>
                <button onClick={handleSwitchToManual} className="flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all min-h-[44px]" style={{ background: !useExisting1 ? 'rgba(108,60,225,0.3)' : 'rgba(255,255,255,0.05)', border: !useExisting1 ? '1px solid rgba(108,60,225,0.6)' : '1px solid rgba(255,255,255,0.1)', color: !useExisting1 ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                  Інша людина
                </button>
              </div>
            )}
            <AnimatePresence mode="wait">
              {useExisting1 && savedCharts.length > 0 ? (
                <motion.div key="existing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3">
                  {savedCharts.map((chart) => (
                    <button key={chart.id} onClick={() => handleChartSelect(chart.id)} className="w-full text-left p-4 rounded-xl transition-all min-h-[44px]" style={{ background: selectedChart1 === chart.id ? 'rgba(108,60,225,0.25)' : 'rgba(255,255,255,0.05)', border: selectedChart1 === chart.id ? '1px solid rgba(108,60,225,0.5)' : '1px solid rgba(255,255,255,0.1)' }}>
                      <p className="font-semibold text-white">{chart.name}</p>
                      <p className="text-xs text-white/40 mt-1">{chart.birth_date} · {chart.city}</p>
                    </button>
                  ))}
                </motion.div>
              ) : (
                <motion.div key="manual" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-5">
                  <div>
                    <label className="block text-sm text-white/50 mb-2">Ім&apos;я</label>
                    <input type="text" value={name1} onChange={(e) => setName1(e.target.value)} placeholder="Ваше ім'я" className="w-full px-4 py-3 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500" style={INPUT_STYLE} />
                  </div>
                  <div>
                    <label className="block text-sm text-white/50 mb-2">Дата народження</label>
                    <DateInputPicker value={birthDate1} onChange={setBirthDate1} />
                  </div>
                  <div>
                    <label className="block text-sm text-white/50 mb-2">Час народження</label>
                    <TimePicker value={birthTime1} onChange={setBirthTime1} />
                  </div>
                  <div>
                    <label className="block text-sm text-white/50 mb-2">Місто народження</label>
                    <CitySearch value={city1} onSelect={(c) => { setCity1(c.name); setCountryCode1(c.countryCode); setLat1(c.lat); setLon1(c.lon); }} />
                    {lat1 !== 0 && <p className="text-xs text-green-400 mt-2">✓ {city1}, {countryCode1}</p>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Person 2 */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="p-6 rounded-3xl" style={{ background: 'rgba(236, 72, 153, 0.1)', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
            <h2 className="text-2xl font-bold text-white mb-6">Партнер</h2>
            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-sm text-white/50 mb-2">Ім&apos;я</label>
                <input type="text" value={name2} onChange={(e) => setName2(e.target.value)} placeholder="Ім'я партнера" className="w-full px-4 py-3 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-pink-500" style={INPUT_STYLE} />
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-2">Дата народження</label>
                <DateInputPicker value={birthDate2} onChange={setBirthDate2} />
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-2">Час народження</label>
                <TimePicker value={birthTime2} onChange={setBirthTime2} />
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-2">Місто народження</label>
                <CitySearch value={city2} onSelect={(c) => { setCity2(c.name); setCountryCode2(c.countryCode); setLat2(c.lat); setLon2(c.lon); }} />
                {lat2 !== 0 && <p className="text-xs text-green-400 mt-2">✓ {city2}, {countryCode2}</p>}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Error */}
        {error && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 rounded-xl bg-red-500/20 border border-red-500/50">
            <p className="text-red-300 text-center">{error}</p>
          </motion.div>
        )}

        {/* Submit */}
        <motion.button
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          onClick={handleSubmit} disabled={!canSubmit}
          className="w-full mt-8 py-4 rounded-2xl font-bold text-lg text-white transition-all min-h-[44px]"
          style={{ background: canSubmit ? BTN_GRAD : 'rgba(255,255,255,0.08)', opacity: canSubmit ? 1 : 0.45, cursor: canSubmit ? 'pointer' : 'not-allowed', boxShadow: canSubmit ? '0 4px 24px rgba(108,60,225,0.45)' : 'none' }}
          whileHover={canSubmit ? { scale: 1.02 } : {}}
          whileTap={canSubmit ? { scale: 0.97 } : {}}
        >
          Розрахувати сумісність
        </motion.button>

        {/* Results */}
        {result && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mt-12 space-y-6">
            {/* Compatibility Score */}
            {!!result.compatibilityScore && (
              <AnalysisSection title="Оцінка сумісності" data={result.compatibilityScore} />
            )}

            {/* Synastry SVG */}
            {result.synastryChartSvg && (
              <SvgChartViewer svgContent={result.synastryChartSvg} title="Синастрійна карта (бі-колесо)" />
            )}

            {/* Synastry Report */}
            {!!result.synastryReport && (
              <AnalysisSection title="Синастрійний звіт" data={result.synastryReport as Record<string, unknown>} />
            )}

            {/* Synastry Chart Data */}
            {!!result.synastryChart && (
              <AnalysisSection title="Аспекти синастрії" data={result.synastryChart as Record<string, unknown>} defaultCollapsed />
            )}

            {/* New calculation */}
            <button onClick={() => setResult(null)} className="w-full mt-6 py-3 rounded-xl text-white/70 hover:text-white transition-all min-h-[44px]" style={{ background: 'rgba(255,255,255,0.05)' }}>
              ← Нова пара
            </button>

            {/* Cross-sell links */}
            <div className="grid sm:grid-cols-2 gap-3">
              <Link href="/composite" className="block">
                <div className="p-4 rounded-xl border transition-all hover:border-purple-400/40" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.25)' }}>
                  <p className="text-sm font-semibold text-white">Композитна карта</p>
                  <p className="text-xs text-white/50 mt-0.5">Об&apos;єднана карта стосунків</p>
                </div>
              </Link>
              <Link href="/relationship" className="block">
                <div className="p-4 rounded-xl border transition-all hover:border-pink-400/40" style={{ background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.25)' }}>
                  <p className="text-sm font-semibold text-white">Інсайти стосунків</p>
                  <p className="text-xs text-white/50 mt-0.5">Мови кохання, тривожні знаки, час</p>
                </div>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Info block */}
        {!result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-12 p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 className="text-white font-bold mb-3">Що таке синастрія?</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Синастрія — це метод порівняння двох натальних карт для оцінки сумісності.
              Ми аналізуємо аспекти між вашими планетами: Венера-Марс (кохання),
              Місяць-Місяць (емоції), Сонце-Місяць (розуміння), Меркурій-Меркурій (комунікація).
              Результат покаже сильні сторони ваших стосунків та потенційні виклики.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
