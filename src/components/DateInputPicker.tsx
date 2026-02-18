'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MONTHS_UA = [
  'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
  'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень',
];

interface DateInputPickerProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
}

function daysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

// ── Individual Field ─────────────────────────────────────────────────────────
interface FieldProps {
  label: string;
  children: React.ReactNode;
  focused: boolean;
  error?: boolean;
}

function Field({ label, children, focused, error }: FieldProps) {
  return (
    <div className="flex flex-col gap-1 flex-1">
      <span
        className="text-[10px] uppercase tracking-widest font-semibold text-center"
        style={{ color: 'rgba(255,255,255,0.35)' }}
      >
        {label}
      </span>
      <motion.div
        animate={{
          borderColor: error
            ? 'rgba(248,113,113,0.7)'
            : focused
            ? 'rgba(153,102,230,0.7)'
            : 'rgba(255,255,255,0.12)',
          background: focused
            ? 'rgba(108,60,225,0.12)'
            : 'rgba(255,255,255,0.07)',
          boxShadow: focused
            ? '0 0 0 3px rgba(108,60,225,0.15)'
            : 'none',
        }}
        transition={{ duration: 0.15 }}
        className="rounded-xl overflow-hidden"
        style={{ border: '1.5px solid rgba(255,255,255,0.12)' }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function DateInputPicker({ value, onChange }: DateInputPickerProps) {
  const currentYear = new Date().getFullYear();

  const parsed = value ? value.split('-').map(Number) : [currentYear - 25, 6, 15];
  const [year, setYear] = useState<number>(parsed[0] || currentYear - 25);
  const [month, setMonth] = useState<number>(parsed[1] || 6); // 1-based
  const [day, setDay] = useState<number>(parsed[2] || 15);

  // Raw string values for controlled inputs
  const [dayStr, setDayStr] = useState(String(parsed[2] || 15).padStart(2, '0'));
  const [yearStr, setYearStr] = useState(String(parsed[0] || currentYear - 25));

  const [focusedField, setFocusedField] = useState<'day' | 'month' | 'year' | null>(null);
  const [dayError, setDayError] = useState(false);
  const [yearError, setYearError] = useState(false);

  const monthRef = useRef<HTMLSelectElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLInputElement>(null);

  const maxDay = daysInMonth(month, year);

  // Emit valid date to parent whenever state changes
  useEffect(() => {
    const safeDay = clamp(day, 1, daysInMonth(month, year));
    if (safeDay !== day) {
      setDay(safeDay);
      setDayStr(String(safeDay).padStart(2, '0'));
    }
    if (year >= 1930 && year <= currentYear) {
      const mm = String(month).padStart(2, '0');
      const dd = String(safeDay).padStart(2, '0');
      onChange(`${year}-${mm}-${dd}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day, month, year]);

  // ── Day handlers ──────────────────────────────────────────────────────────
  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 2);
    setDayStr(raw);
    const n = parseInt(raw, 10);
    if (raw.length === 0) {
      setDayError(false);
      return;
    }
    if (!isNaN(n) && n >= 1 && n <= maxDay) {
      setDay(n);
      setDayError(false);
      // Auto-advance when 2 digits entered — defer so React state commits first
      if (raw.length === 2) {
        setTimeout(() => monthRef.current?.focus(), 0);
      }
    } else if (n > maxDay) {
      setDay(maxDay);
      setDayStr(String(maxDay).padStart(2, '0'));
      setDayError(false);
      monthRef.current?.focus();
    } else {
      setDayError(true);
    }
  };

  const handleDayBlur = () => {
    setFocusedField(null);
    const n = parseInt(dayStr, 10);
    if (isNaN(n) || n < 1) {
      setDay(1);
      setDayStr('01');
      setDayError(false);
    } else {
      const clamped = clamp(n, 1, maxDay);
      setDay(clamped);
      setDayStr(String(clamped).padStart(2, '0'));
      setDayError(false);
    }
  };

  const handleDayKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = clamp((day % maxDay) + 1, 1, maxDay);
      setDay(next);
      setDayStr(String(next).padStart(2, '0'));
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = day > 1 ? day - 1 : maxDay;
      setDay(next);
      setDayStr(String(next).padStart(2, '0'));
    }
    if (e.key === 'Tab' || e.key === 'Enter') {
      // Let natural focus flow, but ensure value is committed
      const n = parseInt(dayStr, 10);
      if (!isNaN(n) && n >= 1 && n <= maxDay) {
        setDay(n);
        setDayStr(String(n).padStart(2, '0'));
      }
    }
  };

  // ── Month handlers ────────────────────────────────────────────────────────
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const m = parseInt(e.target.value, 10);
    setMonth(m);
  };

  const handleMonthKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && !e.shiftKey) {
      yearRef.current?.focus();
    }
  };

  // ── Year handlers ─────────────────────────────────────────────────────────
  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    setYearStr(raw);
    const n = parseInt(raw, 10);
    if (raw.length === 4) {
      if (!isNaN(n) && n >= 1930 && n <= currentYear) {
        setYear(n);
        setYearError(false);
      } else {
        setYearError(true);
      }
    } else {
      setYearError(false);
    }
  };

  const handleYearBlur = () => {
    setFocusedField(null);
    const n = parseInt(yearStr, 10);
    if (isNaN(n) || n < 1930) {
      setYear(1930);
      setYearStr('1930');
      setYearError(false);
    } else if (n > currentYear) {
      setYear(currentYear);
      setYearStr(String(currentYear));
      setYearError(false);
    } else {
      setYear(n);
      setYearStr(String(n));
      setYearError(false);
    }
  };

  const handleYearKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = clamp(year + 1, 1930, currentYear);
      setYear(next);
      setYearStr(String(next));
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = clamp(year - 1, 1930, currentYear);
      setYear(next);
      setYearStr(String(next));
    }
  };

  // ── Shared input styles ───────────────────────────────────────────────────
  const inputBase: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#ffffff',
    width: '100%',
    textAlign: 'center',
    fontWeight: 700,
    fontSize: '1.5rem',
    padding: '14px 8px',
    caretColor: '#9966E6',
    WebkitAppearance: 'none',
    MozAppearance: 'textfield',
  };

  const selectBase: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#ffffff',
    width: '100%',
    textAlign: 'center',
    fontWeight: 700,
    fontSize: '1.1rem',
    padding: '16px 4px',
    cursor: 'pointer',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    appearance: 'none',
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex gap-3 items-end">
        {/* Day */}
        <Field label="День" focused={focusedField === 'day'} error={dayError}>
          <input
            ref={dayRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={dayStr}
            onChange={handleDayChange}
            onFocus={() => { setFocusedField('day'); dayRef.current?.select(); }}
            onBlur={handleDayBlur}
            onKeyDown={handleDayKeyDown}
            placeholder="ДД"
            maxLength={2}
            style={inputBase}
            aria-label="День народження"
          />
        </Field>

        {/* Separator */}
        <div className="pb-4 text-2xl font-light" style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0 }}>
          /
        </div>

        {/* Month */}
        <Field label="Місяць" focused={focusedField === 'month'}>
          <div className="relative">
            <select
              ref={monthRef}
              value={month}
              onChange={handleMonthChange}
              onFocus={() => setFocusedField('month')}
              onBlur={() => setFocusedField(null)}
              onKeyDown={handleMonthKeyDown}
              style={selectBase}
              aria-label="Місяць народження"
            >
              {MONTHS_UA.map((name, idx) => (
                <option
                  key={idx}
                  value={idx + 1}
                  style={{ background: '#1a0e35', color: '#ffffff' }}
                >
                  {name}
                </option>
              ))}
            </select>
            {/* Custom dropdown arrow */}
            <div
              className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'rgba(153,102,230,0.7)' }}
            >
              ▾
            </div>
          </div>
        </Field>

        {/* Separator */}
        <div className="pb-4 text-2xl font-light" style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0 }}>
          /
        </div>

        {/* Year */}
        <Field label="Рік" focused={focusedField === 'year'} error={yearError}>
          <input
            ref={yearRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={yearStr}
            onChange={handleYearChange}
            onFocus={() => { setFocusedField('year'); yearRef.current?.select(); }}
            onBlur={handleYearBlur}
            onKeyDown={handleYearKeyDown}
            placeholder="РРРР"
            maxLength={4}
            style={{ ...inputBase, fontSize: '1.3rem' }}
            aria-label="Рік народження"
          />
        </Field>
      </div>

      {/* Hint text */}
      <AnimatePresence>
        {(dayError || yearError) && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-xs text-center"
            style={{ color: 'rgba(248,113,113,0.8)' }}
          >
            {dayError ? `День: 1–${maxDay}` : `Рік: 1930–${currentYear}`}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Arrow keys hint — show when year or day focused */}
      <AnimatePresence>
        {(focusedField === 'day' || focusedField === 'year') && !dayError && !yearError && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-[10px] text-center select-none"
            style={{ color: 'rgba(255,255,255,0.2)' }}
          >
            ↑↓ для зміни значення
          </motion.p>
        )}
      </AnimatePresence>

      {/* Add number input arrow hiding */}
      <style>{`
        input[type=text]::-webkit-outer-spin-button,
        input[type=text]::-webkit-inner-spin-button { display: none; }
      `}</style>
    </div>
  );
}
