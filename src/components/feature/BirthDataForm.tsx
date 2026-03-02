'use client';

import { useState, useCallback } from 'react';
import CitySearch from '@/components/CitySearch';
import DatePicker from '@/components/DatePicker';
import TimePicker from '@/components/TimePicker';
import { sanitizeInput } from '@/lib/input-sanitizer';
import type { ChartInput } from '@/types/astrology';
import type { BirthDataFormVariant } from '@/types/features';

interface CityResult {
  name: string;
  country: string;
  countryCode: string;
  lat: number;
  lon: number;
  display: string;
}

interface BirthDataFormProps {
  variant?: BirthDataFormVariant;
  initialData?: Partial<ChartInput & { targetDate?: string; targetCity?: string }>;
  onSubmit: (data: ChartInput & { targetDate?: string; targetCity?: string; targetLatitude?: number; targetLongitude?: number }) => void;
  loading?: boolean;
  compact?: boolean;
  submitLabel?: string;
}

const LABEL_CLASS = 'block text-sm font-medium text-white/70 mb-1';
const INPUT_CLASS =
  'w-full px-4 py-3 rounded-xl bg-white/[0.08] border border-white/[0.15] text-white placeholder-white/30 focus:outline-none focus:border-zorya-violet/50 transition-colors min-h-[44px]';

export default function BirthDataForm({
  variant = 'basic',
  initialData,
  onSubmit,
  loading = false,
  compact = false,
  submitLabel = 'Розрахувати',
}: BirthDataFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [birthDate, setBirthDate] = useState(initialData?.birthDate || '');
  const [birthTime, setBirthTime] = useState(initialData?.birthTime || '');
  const [timeUnknown, setTimeUnknown] = useState(initialData?.birthTime === '12:00');
  const [city, setCity] = useState(initialData?.city || '');
  const [countryCode, setCountryCode] = useState(initialData?.countryCode || '');
  const [latitude, setLatitude] = useState(initialData?.latitude || 0);
  const [longitude, setLongitude] = useState(initialData?.longitude || 0);
  const [gender, setGender] = useState<'male' | 'female' | undefined>(initialData?.gender);
  const [targetDate, setTargetDate] = useState(initialData?.targetDate || '');
  const [targetCity, setTargetCity] = useState(initialData?.targetCity || '');
  const [targetLatitude, setTargetLatitude] = useState(0);
  const [targetLongitude, setTargetLongitude] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const showGender = variant === 'full';
  const showTargetDate = variant === 'date-range';
  const showTargetCity = variant === 'location';

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Вкажіть ім'я";
    if (!birthDate) newErrors.birthDate = 'Вкажіть дату народження';
    else {
      const year = parseInt(birthDate.split('-')[0]);
      if (year < 1800) {
        newErrors.birthDate = 'Дати до 1800 року не підтримуються';
      }
    }
    if (!city) newErrors.city = 'Вкажіть місто народження';
    if (showTargetDate && !targetDate) newErrors.targetDate = 'Вкажіть цільову дату';
    if (showTargetCity && !targetCity) newErrors.targetCity = 'Вкажіть цільове місто';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, birthDate, city, showTargetDate, targetDate, showTargetCity, targetCity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const year = parseInt(birthDate.split('-')[0]);
    const warnPre1900 = year >= 1800 && year < 1900;

    const data: ChartInput & { targetDate?: string; targetCity?: string; targetLatitude?: number; targetLongitude?: number } = {
      name: sanitizeInput(name),
      birthDate,
      birthTime: timeUnknown ? '12:00' : birthTime || '12:00',
      city: sanitizeInput(city),
      countryCode,
      latitude,
      longitude,
      gender: showGender ? gender : undefined,
      ...(showTargetDate && { targetDate }),
      ...(showTargetCity && { targetCity: sanitizeInput(targetCity), targetLatitude, targetLongitude }),
    };

    if (warnPre1900) {
      // Still submit but user sees the warning inline
    }

    onSubmit(data);
  };

  const handleCitySelect = (c: CityResult) => {
    setCity(c.name);
    setCountryCode(c.countryCode);
    setLatitude(c.lat);
    setLongitude(c.lon);
    setErrors((prev) => ({ ...prev, city: '' }));
  };

  const handleTargetCitySelect = (c: CityResult) => {
    setTargetCity(c.name);
    setTargetLatitude(c.lat);
    setTargetLongitude(c.lon);
    setErrors((prev) => ({ ...prev, targetCity: '' }));
  };

  const gap = compact ? 'gap-3' : 'gap-4';

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col ${gap}`}>
      {/* Name */}
      <div>
        <label className={LABEL_CLASS}>{"Ім'я"}</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ваше ім'я"
          className={INPUT_CLASS}
        />
        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
      </div>

      {/* Birth Date */}
      <div>
        <label className={LABEL_CLASS}>Дата народження</label>
        <DatePicker value={birthDate} onChange={setBirthDate} />
        {errors.birthDate && <p className="text-red-400 text-xs mt-1">{errors.birthDate}</p>}
        {birthDate && parseInt(birthDate.split('-')[0]) >= 1800 && parseInt(birthDate.split('-')[0]) < 1900 && (
          <p className="text-amber-400 text-xs mt-1">Для дат до 1900 року точність може бути знижена</p>
        )}
      </div>

      {/* Birth Time */}
      <div>
        <label className={LABEL_CLASS}>Час народження</label>
        {!timeUnknown && <TimePicker value={birthTime} onChange={setBirthTime} />}
        <label className="flex items-center gap-2 mt-2 cursor-pointer min-h-[44px]">
          <input
            type="checkbox"
            checked={timeUnknown}
            onChange={(e) => {
              setTimeUnknown(e.target.checked);
              if (e.target.checked) setBirthTime('12:00');
            }}
            className="w-5 h-5 rounded border-white/20 bg-white/10 text-zorya-violet focus:ring-zorya-violet"
          />
          <span className="text-sm text-white/60">Невідомо</span>
        </label>
      </div>

      {/* City */}
      <div>
        <label className={LABEL_CLASS}>Місто народження</label>
        <CitySearch onSelect={handleCitySelect} value={city} />
        {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
      </div>

      {/* Gender (full variant only) */}
      {showGender && (
        <div>
          <label className={LABEL_CLASS}>Стать</label>
          <div className="flex gap-3">
            {([
              { value: 'male' as const, label: 'Чоловіча' },
              { value: 'female' as const, label: 'Жіноча' },
            ]).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setGender(opt.value)}
                className={`flex-1 py-3 rounded-xl border text-sm transition-all min-h-[44px] ${
                  gender === opt.value
                    ? 'border-zorya-violet bg-zorya-violet/20 text-white'
                    : 'border-white/15 bg-white/[0.06] text-white/60 hover:border-white/30'
                }`}
              >
                {opt.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setGender(undefined)}
              className={`flex-1 py-3 rounded-xl border text-sm transition-all min-h-[44px] ${
                gender === undefined
                  ? 'border-zorya-violet bg-zorya-violet/20 text-white'
                  : 'border-white/15 bg-white/[0.06] text-white/60 hover:border-white/30'
              }`}
            >
              Не вказувати
            </button>
          </div>
        </div>
      )}

      {/* Target Date (date-range variant) */}
      {showTargetDate && (
        <div>
          <label className={LABEL_CLASS}>Цільова дата</label>
          <DatePicker value={targetDate} onChange={setTargetDate} />
          {errors.targetDate && <p className="text-red-400 text-xs mt-1">{errors.targetDate}</p>}
        </div>
      )}

      {/* Target City (location variant) */}
      {showTargetCity && (
        <div>
          <label className={LABEL_CLASS}>Цільове місто</label>
          <CitySearch onSelect={handleTargetCitySelect} value={targetCity} />
          {errors.targetCity && <p className="text-red-400 text-xs mt-1">{errors.targetCity}</p>}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-zorya-violet to-zorya-blue text-white font-medium transition-all hover:opacity-90 disabled:opacity-50 min-h-[44px]"
      >
        {loading ? 'Завантаження...' : submitLabel}
      </button>
    </form>
  );
}
