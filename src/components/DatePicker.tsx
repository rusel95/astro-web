'use client';

import React, { useRef, useEffect, useState } from 'react';

const MONTHS_UA = [
  'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
  'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень',
];

interface DatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
}

function daysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

// ── Scroll Drum Column ─────────────────────────────────────────────────────────
interface DrumProps {
  items: (string | number)[];
  selected: number; // selected item index
  onSelect: (idx: number) => void;
  label: string;
  width?: string;
}

function DrumColumn({ items, selected, onSelect, label, width = 'flex-1' }: DrumProps) {
  const ITEM_H = 52;
  const VISIBLE = 5;
  const containerRef = useRef<HTMLDivElement>(null);
  const programmaticScroll = useRef(false);
  const scrollDebounce = useRef<ReturnType<typeof setTimeout>>();

  // Center selected item — skip during active user scroll
  useEffect(() => {
    if (containerRef.current) {
      programmaticScroll.current = true;
      containerRef.current.scrollTop = selected * ITEM_H;
      // Keep flag raised for 2 frames to cover scroll event propagation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { programmaticScroll.current = false; });
      });
    }
  }, [selected]);

  // Intercept wheel events to scroll exactly 1 item at a time (desktop)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 1 : -1;
      const newIdx = Math.max(0, Math.min(items.length - 1, selected + delta));
      programmaticScroll.current = true;
      el.scrollTop = newIdx * ITEM_H;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { programmaticScroll.current = false; });
      });
      onSelect(newIdx);
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [selected, items.length, onSelect]);

  // Debounced scroll handler — waits for scroll snap to settle before syncing
  const handleScroll = () => {
    if (!containerRef.current || programmaticScroll.current) return;
    clearTimeout(scrollDebounce.current);
    scrollDebounce.current = setTimeout(() => {
      if (!containerRef.current) return;
      const newIdx = Math.round(containerRef.current.scrollTop / ITEM_H);
      const clamped = Math.max(0, Math.min(items.length - 1, newIdx));
      if (clamped !== selected) onSelect(clamped);
    }, 80);
  };

  return (
    <div className={`${width} flex flex-col items-center gap-1`}>
      <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'rgba(255,255,255,0.35)' }}>
        {label}
      </span>
      <div className="relative w-full" style={{ height: ITEM_H * VISIBLE }}>
        {/* Selection highlight */}
        <div
          className="absolute left-0 right-0 z-10 pointer-events-none rounded-xl"
          style={{
            top: ITEM_H * Math.floor(VISIBLE / 2),
            height: ITEM_H,
            background: 'rgba(108,60,225,0.25)',
            borderTop: '1px solid rgba(153,102,230,0.4)',
            borderBottom: '1px solid rgba(153,102,230,0.4)',
          }}
        />
        {/* Fade top */}
        <div
          className="absolute inset-x-0 top-0 z-20 pointer-events-none"
          style={{ height: ITEM_H * 2, background: 'linear-gradient(to bottom, rgba(15,10,30,0.75), transparent)' }}
        />
        {/* Fade bottom */}
        <div
          className="absolute inset-x-0 bottom-0 z-20 pointer-events-none"
          style={{ height: ITEM_H * 2, background: 'linear-gradient(to top, rgba(15,10,30,0.75), transparent)' }}
        />
        {/* Scroll container */}
        <div
          ref={containerRef}
          data-testid="drum-col"
          className="absolute inset-0 overflow-y-scroll hide-scrollbar"
          style={{
            scrollSnapType: 'y mandatory',
            scrollPaddingTop: ITEM_H * Math.floor(VISIBLE / 2),
          }}
          onScroll={handleScroll}
        >
          {/* Top padding */}
          <div style={{ height: ITEM_H * Math.floor(VISIBLE / 2) }} />
          {items.map((item, idx) => (
            <div
              key={idx}
              onClick={() => onSelect(idx)}
              className="flex items-center justify-center cursor-pointer transition-all select-none"
              style={{
                height: ITEM_H,
                scrollSnapAlign: 'start',
                color: idx === selected ? '#ffffff' : 'rgba(255,255,255,0.45)',
                fontSize: idx === selected ? '22px' : '17px',
                fontWeight: idx === selected ? 700 : 400,
                transition: 'all 0.15s ease',
              }}
            >
              {typeof item === 'number' ? String(item).padStart(2, '0') : item}
            </div>
          ))}
          {/* Bottom padding */}
          <div style={{ height: ITEM_H * Math.floor(VISIBLE / 2) }} />
        </div>
      </div>
    </div>
  );
}

// ── Main DatePicker ────────────────────────────────────────────────────────────
export default function DatePicker({ value, onChange }: DatePickerProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1930 }, (_, i) => 1931 + i).reverse(); // newest first

  const parsed = value ? value.split('-').map(Number) : [currentYear - 25, 6, 15];
  const [year, setYear] = useState(parsed[0] || currentYear - 25);
  const [month, setMonth] = useState(parsed[1] || 6); // 1-based
  const [day, setDay] = useState(parsed[2] || 15);

  // Recalculate days when month/year changes
  const maxDay = daysInMonth(month, year);
  const days = Array.from({ length: maxDay }, (_, i) => i + 1);

  // Clamp day if month changes to shorter month
  const safeDay = Math.min(day, maxDay);
  useEffect(() => {
    if (safeDay !== day) setDay(safeDay);
  }, [safeDay, day]);

  // Sync to parent on any change
  useEffect(() => {
    const mm = String(month).padStart(2, '0');
    const dd = String(safeDay).padStart(2, '0');
    onChange(`${year}-${mm}-${dd}`);
  }, [year, month, safeDay]); // eslint-disable-line

  const dayIdx = safeDay - 1;
  const monthIdx = month - 1;
  const yearIdx = years.indexOf(year);

  return (
    <div className="w-full">
      {/* Drum pickers */}
      <div
        className="flex gap-2 rounded-2xl px-3 py-2"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        {/* Day */}
        <DrumColumn
          items={days}
          selected={dayIdx}
          onSelect={idx => setDay(idx + 1)}
          label="День"
          width="w-16"
        />

        <div className="w-px" style={{ background: 'rgba(255,255,255,0.08)' }} />

        {/* Month */}
        <DrumColumn
          items={MONTHS_UA}
          selected={monthIdx}
          onSelect={idx => setMonth(idx + 1)}
          label="Місяць"
          width="flex-1"
        />

        <div className="w-px" style={{ background: 'rgba(255,255,255,0.08)' }} />

        {/* Year */}
        <DrumColumn
          items={years}
          selected={yearIdx >= 0 ? yearIdx : 0}
          onSelect={idx => setYear(years[idx])}
          label="Рік"
          width="w-20"
        />
      </div>

      {/* Add global scrollbar hiding styles */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
