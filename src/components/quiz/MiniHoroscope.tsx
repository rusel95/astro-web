'use client';

import { motion } from 'framer-motion';
import { PLANET_NAMES_UK, ASPECT_NAMES_UK, ZODIAC_NAMES_UK } from '@/lib/constants';
import ZodiacIcon from '@/components/icons/ZodiacIcon';
import type { PlanetName, ZodiacSign } from '@/types/astrology';

interface KeyAspect {
  planet1: string;
  planet2: string;
  aspect_type: string;
  degrees: string;
  interpretation_uk: string;
}

interface MiniHoroscopeProps {
  data: {
    natal_chart: {
      ascendant: number;
      planets: Array<{
        name: string;
        longitude: number;
        sign: string;
        house: number;
        isRetrograde: boolean;
        speed: number;
      }>;
      houses: Array<{
        number: number;
        cusp: number;
        sign: string;
      }>;
      aspects: Array<{
        planet1: string;
        planet2: string;
        type: string;
        orb: number;
        isApplying: boolean;
      }>;
    };
    key_aspects: KeyAspect[];
    zodiac_sign_uk: string;
    ascendant_sign_uk: string;
  };
  userName: string;
}

export default function MiniHoroscope({ data, userName }: MiniHoroscopeProps) {
  const sunPlanet = data.natal_chart.planets.find((p) => p.name === 'Sun');
  const moonPlanet = data.natal_chart.planets.find((p) => p.name === 'Moon');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-2">
          {userName}, ваш міні-гороскоп готовий!
        </h2>
        <p className="text-gray-500">
          Ось ключові аспекти вашої натальної карти
        </p>
      </div>

      {/* Sign Summary */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-center justify-center gap-8">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-zorya-violet/10 flex items-center justify-center mb-2">
              <ZodiacIcon sign={sunPlanet?.sign || 'Aries'} size={32} className="text-zorya-violet" />
            </div>
            <span className="text-xs text-gray-400 uppercase tracking-wide">Сонце</span>
            <span className="font-semibold text-gray-900">{data.zodiac_sign_uk}</span>
          </div>

          {moonPlanet && (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-zorya-violet/10 flex items-center justify-center mb-2">
                <ZodiacIcon sign={moonPlanet.sign} size={32} className="text-zorya-violet" />
              </div>
              <span className="text-xs text-gray-400 uppercase tracking-wide">Місяць</span>
              <span className="font-semibold text-gray-900">
                {ZODIAC_NAMES_UK[moonPlanet.sign as ZodiacSign] || moonPlanet.sign}
              </span>
            </div>
          )}

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-zorya-violet/10 flex items-center justify-center mb-2">
              <span className="text-2xl text-zorya-violet">ASC</span>
            </div>
            <span className="text-xs text-gray-400 uppercase tracking-wide">Асцендент</span>
            <span className="font-semibold text-gray-900">{data.ascendant_sign_uk}</span>
          </div>
        </div>
      </div>

      {/* Key Aspects */}
      <div className="space-y-4">
        <h3 className="text-lg font-display font-semibold text-gray-900">
          Ключові аспекти
        </h3>
        {data.key_aspects.map((aspect, i) => {
          const p1Uk = PLANET_NAMES_UK[aspect.planet1 as PlanetName] || aspect.planet1;
          const p2Uk = PLANET_NAMES_UK[aspect.planet2 as PlanetName] || aspect.planet2;
          const typeUk = ASPECT_NAMES_UK[aspect.aspect_type] || aspect.aspect_type;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.15 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-semibold text-zorya-violet">
                  {p1Uk} {typeUk} {p2Uk}
                </span>
                <span className="text-xs text-gray-400">
                  {aspect.degrees}
                </span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {aspect.interpretation_uk}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Teaser */}
      <div className="mt-8 p-6 bg-gradient-to-br from-zorya-violet/10 to-zorya-violet/5 rounded-2xl border border-zorya-violet/15 text-center">
        <p className="text-gray-700 text-sm">
          Це лише частина вашої натальної карти. Повний аналіз включає
          всі планети, будинки та аспекти з детальними інтерпретаціями.
        </p>
      </div>
    </motion.div>
  );
}
