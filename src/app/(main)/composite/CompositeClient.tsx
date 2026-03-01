'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CitySearch from '@/components/CitySearch';
import DateInputPicker from '@/components/DateInputPicker';
import TimePicker from '@/components/TimePicker';
import SvgChartViewer from '@/components/feature/SvgChartViewer';
import AnalysisSection from '@/components/feature/AnalysisSection';
import ErrorState from '@/components/feature/ErrorState';
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
}

export default function CompositeClient() {
  const [savedCharts, setSavedCharts] = useState<SavedChart[]>([]);

  // Person 1
  const [name1, setName1] = useState('');
  const [birthDate1, setBirthDate1] = useState('1995-06-15');
  const [birthTime1, setBirthTime1] = useState('12:00');
  const [city1, setCity1] = useState('');
  const [lat1, setLat1] = useState(0);
  const [lon1, setLon1] = useState(0);
  const [cc1, setCc1] = useState('');

  // Person 2
  const [name2, setName2] = useState('');
  const [birthDate2, setBirthDate2] = useState('1993-03-22');
  const [birthTime2, setBirthTime2] = useState('14:30');
  const [city2, setCity2] = useState('');
  const [lat2, setLat2] = useState(0);
  const [lon2, setLon2] = useState(0);
  const [cc2, setCc2] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    fetch('/api/charts/my').then(r => r.ok ? r.json() : null).then(d => {
      if (d?.charts?.length > 0) {
        setSavedCharts(d.charts);
        const c = d.charts[0];
        setName1(c.name); setBirthDate1(c.birth_date); setBirthTime1(c.birth_time || '12:00');
        setCity1(c.city); setCc1(c.country_code); setLat1(c.latitude); setLon1(c.longitude);
      }
    }).catch(() => {});
  }, []);

  const canSubmit = name1.trim() && name2.trim() && lat1 !== 0 && lat2 !== 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch('/api/composite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          person1: { name: name1, birthDate: birthDate1, birthTime: birthTime1, city: city1, countryCode: cc1, latitude: lat1, longitude: lon1 },
          person2: { name: name2, birthDate: birthDate2, birthTime: birthTime2, city: city2, countryCode: cc2, latitude: lat2, longitude: lon2 },
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Помилка');
      setResult(await res.json());
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: BG }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Композитна карта</h1>
          <p className="text-lg text-white/60">Об&apos;єднана карта стосунків — середня точка між двома натальними картами</p>
        </div>

        {!result && (
          <>
            <div className="grid md:grid-cols-2 gap-8">
              <PersonForm label="Ви" name={name1} setName={setName1} birthDate={birthDate1} setBirthDate={setBirthDate1} birthTime={birthTime1} setBirthTime={setBirthTime1} city={city1} setCity={setCity1} lat={lat1} setLat={setLat1} lon={lon1} setLon={setLon1} cc={cc1} setCc={setCc1} color="purple" savedCharts={savedCharts} />
              <PersonForm label="Партнер" name={name2} setName={setName2} birthDate={birthDate2} setBirthDate={setBirthDate2} birthTime={birthTime2} setBirthTime={setBirthTime2} city={city2} setCity={setCity2} lat={lat2} setLat={setLat2} lon={lon2} setLon={setLon2} cc={cc2} setCc={setCc2} color="pink" savedCharts={[]} />
            </div>

            {error && <ErrorState type="api" message={error} onRetry={handleSubmit} />}

            <button
              onClick={handleSubmit}
              disabled={!canSubmit || loading}
              className="w-full mt-8 py-4 rounded-2xl font-bold text-lg text-white transition-all min-h-[44px]"
              style={{ background: canSubmit ? BTN_GRAD : 'rgba(255,255,255,0.08)', opacity: canSubmit ? 1 : 0.45 }}
            >
              {loading ? 'Розраховуємо...' : 'Розрахувати композит'}
            </button>
          </>
        )}

        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white">Композит: {name1} + {name2}</h2>
            </div>

            {result.compositeChartSvg && (
              <SvgChartViewer svgContent={result.compositeChartSvg} title="Композитна карта" />
            )}

            {!!result.compositeReport && (
              <AnalysisSection title="Звіт композитної карти" data={result.compositeReport as Record<string, unknown>} />
            )}

            {!!result.compositeChart && (
              <AnalysisSection title="Дані композитної карти" data={result.compositeChart as Record<string, unknown>} defaultCollapsed />
            )}

            <button onClick={() => setResult(null)} className="w-full py-3 rounded-xl text-white/70 hover:text-white transition-all min-h-[44px]" style={{ background: 'rgba(255,255,255,0.05)' }}>
              ← Нова пара
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function PersonForm({ label, name, setName, birthDate, setBirthDate, birthTime, setBirthTime, city, setCity, lat, setLat, lon, setLon, cc, setCc, color, savedCharts }: {
  label: string; name: string; setName: (v: string) => void;
  birthDate: string; setBirthDate: (v: string) => void;
  birthTime: string; setBirthTime: (v: string) => void;
  city: string; setCity: (v: string) => void;
  lat: number; setLat: (v: number) => void;
  lon: number; setLon: (v: number) => void;
  cc: string; setCc: (v: string) => void;
  color: 'purple' | 'pink'; savedCharts: any[];
}) {
  const c = color === 'purple' ? { bg: 'rgba(108,60,225,0.1)', border: 'rgba(108,60,225,0.3)', ring: 'focus:ring-purple-500' } : { bg: 'rgba(236,72,153,0.1)', border: 'rgba(236,72,153,0.3)', ring: 'focus:ring-pink-500' };
  const INPUT_STYLE: React.CSSProperties = { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' };

  return (
    <div className="p-6 rounded-3xl" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
      <h2 className="text-2xl font-bold text-white mb-4">{label}</h2>
      <div className="flex flex-col gap-5">
        <div>
          <label className="block text-sm text-white/50 mb-2">Ім&apos;я</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ім'я" className={`w-full px-4 py-3 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 ${c.ring}`} style={INPUT_STYLE} />
        </div>
        <div>
          <label className="block text-sm text-white/50 mb-2">Дата народження</label>
          <DateInputPicker value={birthDate} onChange={setBirthDate} />
        </div>
        <div>
          <label className="block text-sm text-white/50 mb-2">Час народження</label>
          <TimePicker value={birthTime} onChange={setBirthTime} />
        </div>
        <div>
          <label className="block text-sm text-white/50 mb-2">Місто народження</label>
          <CitySearch value={city} onSelect={ci => { setCity(ci.name); setCc(ci.countryCode); setLat(ci.lat); setLon(ci.lon); }} />
          {lat !== 0 && <p className="text-xs text-green-400 mt-2">✓ {city}, {cc}</p>}
        </div>
      </div>
    </div>
  );
}
