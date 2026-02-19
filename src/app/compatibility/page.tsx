'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CitySearch from '@/components/CitySearch';
import DateInputPicker from '@/components/DateInputPicker';
import TimePicker from '@/components/TimePicker';

const BG = 'linear-gradient(to bottom, #0f0a1e, #1a0e35)';
const BTN_GRAD = 'linear-gradient(135deg, #6C3CE1 0%, #9966E6 100%)';
const INPUT_STYLE: React.CSSProperties = {
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.15)',
};

export default function CompatibilityPage() {
  // Person 1 (You)
  const [name1, setName1] = useState('');
  const [birthDate1, setBirthDate1] = useState('1995-06-15');
  const [birthTime1, setBirthTime1] = useState('12:00');
  const [city1, setCity1] = useState('');
  const [lat1, setLat1] = useState(0);
  const [lon1, setLon1] = useState(0); // Used for API call (TODO)
  const [countryCode1, setCountryCode1] = useState('');

  // Person 2 (Partner)
  const [name2, setName2] = useState('');
  const [birthDate2, setBirthDate2] = useState('1993-03-22');
  const [birthTime2, setBirthTime2] = useState('14:30');
  const [city2, setCity2] = useState('');
  const [lat2, setLat2] = useState(0);
  const [lon2, setLon2] = useState(0); // Used for API call (TODO)
  const [countryCode2, setCountryCode2] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = 
    name1.trim().length > 0 && 
    name2.trim().length > 0 && 
    city1.length > 0 && 
    city2.length > 0 &&
    lat1 !== 0 && 
    lat2 !== 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError('');

    try {
      // TODO: API call to /api/compatibility
      // const res = await fetch('/api/compatibility', { 
      //   person1: { name1, birthDate1, birthTime1, lat1, lon1 },
      //   person2: { name2, birthDate2, birthTime2, lat2, lon2 }
      // });
      
      // Placeholder for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Synastry would calculate:', { lat1, lon1, lat2, lon2 });
      
      setError('API endpoint not yet implemented');
    } catch (err: any) {
      setError(err.message || 'Помилка розрахунку');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: BG }}
      >
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
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            💕 Сумісність партнерів
          </motion.h1>
          <p className="text-lg text-white/60">
            Синастрія — порівняння двох натальних карт для оцінки сумісності
          </p>
        </div>

        {/* Two-column form */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Person 1 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-3xl"
            style={{
              background: 'rgba(108, 60, 225, 0.1)',
              border: '1px solid rgba(108, 60, 225, 0.3)',
            }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">🌟 Ви</h2>

            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-sm text-white/50 mb-2">Ім&apos;я</label>
                <input
                  type="text"
                  value={name1}
                  onChange={(e) => setName1(e.target.value)}
                  placeholder="Ваше ім'я"
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={INPUT_STYLE}
                />
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
                <CitySearch
                  value={city1}
                  onSelect={(c) => {
                    setCity1(c.name);
                    setCountryCode1(c.countryCode);
                    setLat1(c.lat);
                    setLon1(c.lon);
                  }}
                />
                {lat1 !== 0 && (
                  <p className="text-xs text-green-400 mt-2">
                    ✓ {city1}, {countryCode1}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Person 2 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-3xl"
            style={{
              background: 'rgba(236, 72, 153, 0.1)',
              border: '1px solid rgba(236, 72, 153, 0.3)',
            }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">💖 Партнер</h2>

            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-sm text-white/50 mb-2">Ім&apos;я</label>
                <input
                  type="text"
                  value={name2}
                  onChange={(e) => setName2(e.target.value)}
                  placeholder="Ім'я партнера"
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  style={INPUT_STYLE}
                />
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
                <CitySearch
                  value={city2}
                  onSelect={(c) => {
                    setCity2(c.name);
                    setCountryCode2(c.countryCode);
                    setLat2(c.lat);
                    setLon2(c.lon);
                  }}
                />
                {lat2 !== 0 && (
                  <p className="text-xs text-green-400 mt-2">
                    ✓ {city2}, {countryCode2}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-xl bg-red-500/20 border border-red-500/50"
          >
            <p className="text-red-300 text-center">{error}</p>
          </motion.div>
        )}

        {/* Submit button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full mt-8 py-4 rounded-2xl font-bold text-lg text-white transition-all"
          style={{
            background: canSubmit ? BTN_GRAD : 'rgba(255,255,255,0.08)',
            opacity: canSubmit ? 1 : 0.45,
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            boxShadow: canSubmit ? '0 4px 24px rgba(108,60,225,0.45)' : 'none',
          }}
          whileHover={canSubmit ? { scale: 1.02 } : {}}
          whileTap={canSubmit ? { scale: 0.97 } : {}}
        >
          💫 Розрахувати сумісність
        </motion.button>

        {/* Info block */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-6 rounded-2xl"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <h3 className="text-white font-bold mb-3">Що таке синастрія?</h3>
          <p className="text-white/60 text-sm leading-relaxed">
            Синастрія — це метод порівняння двох натальних карт для оцінки сумісності. 
            Ми аналізуємо аспекти між вашими планетами: Венера-Марс (кохання), 
            Місяць-Місяць (емоції), Сонце-Місяць (розуміння), Меркурій-Меркурій (комунікація). 
            Результат покаже сильні сторони ваших стосунків та потенційні виклики.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
