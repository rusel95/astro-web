'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimePickerProps {
  value: string; // HH:mm
  onChange: (value: string) => void;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

interface FieldProps {
  label: string;
  children: React.ReactNode;
  focused: boolean;
}

function Field({ label, children, focused }: FieldProps) {
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
          borderColor: focused
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

export default function TimePicker({ value, onChange }: TimePickerProps) {
  const parts = value ? value.split(':').map(Number) : [12, 0];
  const [hour, setHour] = useState<number>(parts[0] ?? 12);
  const [minute, setMinute] = useState<number>(parts[1] ?? 0);

  const [hourStr, setHourStr] = useState(String(parts[0] ?? 12).padStart(2, '0'));
  const [minuteStr, setMinuteStr] = useState(String(parts[1] ?? 0).padStart(2, '0'));

  const [focusedField, setFocusedField] = useState<'hour' | 'minute' | null>(null);

  const hourRef = useRef<HTMLInputElement>(null);
  const minuteRef = useRef<HTMLInputElement>(null);

  const emit = (h: number, m: number) => {
    onChange(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
  };

  // ── Hour handlers ──
  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 2);
    setHourStr(raw);
    const n = parseInt(raw, 10);
    if (raw.length === 0) return;
    if (!isNaN(n) && n >= 0 && n <= 23) {
      setHour(n);
      emit(n, minute);
      if (raw.length === 2) {
        setTimeout(() => minuteRef.current?.focus(), 0);
      }
    } else if (n > 23) {
      setHour(23);
      setHourStr('23');
      emit(23, minute);
      minuteRef.current?.focus();
    }
  };

  const handleHourBlur = () => {
    setFocusedField(null);
    const n = parseInt(hourStr, 10);
    if (isNaN(n) || n < 0) {
      setHour(0);
      setHourStr('00');
      emit(0, minute);
    } else {
      const clamped = clamp(n, 0, 23);
      setHour(clamped);
      setHourStr(String(clamped).padStart(2, '0'));
      emit(clamped, minute);
    }
  };

  const handleHourKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = (hour + 1) % 24;
      setHour(next);
      setHourStr(String(next).padStart(2, '0'));
      emit(next, minute);
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = hour > 0 ? hour - 1 : 23;
      setHour(next);
      setHourStr(String(next).padStart(2, '0'));
      emit(next, minute);
    }
  };

  // ── Minute handlers ──
  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 2);
    setMinuteStr(raw);
    const n = parseInt(raw, 10);
    if (raw.length === 0) return;
    if (!isNaN(n) && n >= 0 && n <= 59) {
      setMinute(n);
      emit(hour, n);
    } else if (n > 59) {
      setMinute(59);
      setMinuteStr('59');
      emit(hour, 59);
    }
  };

  const handleMinuteBlur = () => {
    setFocusedField(null);
    const n = parseInt(minuteStr, 10);
    if (isNaN(n) || n < 0) {
      setMinute(0);
      setMinuteStr('00');
      emit(hour, 0);
    } else {
      const clamped = clamp(n, 0, 59);
      setMinute(clamped);
      setMinuteStr(String(clamped).padStart(2, '0'));
      emit(hour, clamped);
    }
  };

  const handleMinuteKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = (minute + 1) % 60;
      setMinute(next);
      setMinuteStr(String(next).padStart(2, '0'));
      emit(hour, next);
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = minute > 0 ? minute - 1 : 59;
      setMinute(next);
      setMinuteStr(String(next).padStart(2, '0'));
      emit(hour, next);
    }
  };

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

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex gap-3 items-end">
        {/* Hours */}
        <Field label="Год" focused={focusedField === 'hour'}>
          <input
            ref={hourRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={hourStr}
            onChange={handleHourChange}
            onFocus={() => { setFocusedField('hour'); hourRef.current?.select(); }}
            onBlur={handleHourBlur}
            onKeyDown={handleHourKeyDown}
            placeholder="ГГ"
            maxLength={2}
            style={inputBase}
            aria-label="Година народження"
          />
        </Field>

        {/* Separator */}
        <div className="pb-4 text-2xl font-light" style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0 }}>
          :
        </div>

        {/* Minutes */}
        <Field label="Хв" focused={focusedField === 'minute'}>
          <input
            ref={minuteRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={minuteStr}
            onChange={handleMinuteChange}
            onFocus={() => { setFocusedField('minute'); minuteRef.current?.focus(); minuteRef.current?.select(); }}
            onBlur={handleMinuteBlur}
            onKeyDown={handleMinuteKeyDown}
            placeholder="ХХ"
            maxLength={2}
            style={inputBase}
            aria-label="Хвилина народження"
          />
        </Field>
      </div>

      {/* Arrow keys hint */}
      <AnimatePresence>
        {focusedField && (
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
    </div>
  );
}
