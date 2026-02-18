'use client';

import React, { useRef, useEffect } from 'react';

interface TimePickerProps {
  value: string; // HH:mm
  onChange: (value: string) => void;
}

// ── Scroll Drum Column (inline, no external deps) ─────────────────────────────
interface DrumColumnProps {
  items: string[];
  selected: number;
  onSelect: (idx: number) => void;
  label: string;
  width?: string;
}

function DrumColumn({ items, selected, onSelect, label, width = 'flex-1' }: DrumColumnProps) {
  const ITEM_H = 52;
  const VISIBLE = 5;
  const containerRef = useRef<HTMLDivElement>(null);

  // Center selected item on mount and selection change
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTop = selected * ITEM_H;
  }, [selected]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const newIdx = Math.round(el.scrollTop / ITEM_H);
    const clamped = Math.max(0, Math.min(items.length - 1, newIdx));
    if (clamped !== selected) onSelect(clamped);
  };

  return (
    <div className={`${width} flex flex-col items-center gap-1`}>
      <span
        className="text-[10px] uppercase tracking-widest font-semibold"
        style={{ color: 'rgba(255,255,255,0.35)' }}
      >
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
          style={{ height: ITEM_H * 2, background: 'linear-gradient(to bottom, rgba(15,10,30,0.95), transparent)' }}
        />
        {/* Fade bottom */}
        <div
          className="absolute inset-x-0 bottom-0 z-20 pointer-events-none"
          style={{ height: ITEM_H * 2, background: 'linear-gradient(to top, rgba(15,10,30,0.95), transparent)' }}
        />
        {/* Scroll container */}
        <div
          ref={containerRef}
          className="absolute inset-0 overflow-y-scroll hide-scrollbar-tp"
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
              className="flex items-center justify-center cursor-pointer select-none"
              style={{
                height: ITEM_H,
                scrollSnapAlign: 'start',
                color: idx === selected ? '#ffffff' : 'rgba(255,255,255,0.3)',
                fontSize: idx === selected ? '22px' : '17px',
                fontWeight: idx === selected ? 700 : 400,
                transition: 'all 0.15s ease',
              }}
            >
              {item}
            </div>
          ))}
          {/* Bottom padding */}
          <div style={{ height: ITEM_H * Math.floor(VISIBLE / 2) }} />
        </div>
      </div>
    </div>
  );
}

// ── Main TimePicker ────────────────────────────────────────────────────────────
const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

export default function TimePicker({ value, onChange }: TimePickerProps) {
  const parts = value ? value.split(':').map(Number) : [12, 0];
  const hour = parts[0] ?? 12;
  const minute = parts[1] ?? 0;

  const handleHourSelect = (idx: number) => {
    const mm = String(minute).padStart(2, '0');
    onChange(`${String(idx).padStart(2, '0')}:${mm}`);
  };

  const handleMinuteSelect = (idx: number) => {
    const hh = String(hour).padStart(2, '0');
    onChange(`${hh}:${String(idx).padStart(2, '0')}`);
  };

  return (
    <div className="w-full">
      <div
        className="flex gap-2 rounded-2xl px-3 py-2"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        {/* Hours */}
        <DrumColumn
          items={HOURS}
          selected={Math.max(0, Math.min(23, hour))}
          onSelect={handleHourSelect}
          label="Год"
          width="flex-1"
        />

        {/* Colon separator */}
        <div
          className="flex items-center justify-center text-3xl font-bold pb-2"
          style={{ color: 'rgba(153,102,230,0.6)', flexShrink: 0 }}
        >
          :
        </div>

        {/* Minutes */}
        <DrumColumn
          items={MINUTES}
          selected={Math.max(0, Math.min(59, minute))}
          onSelect={handleMinuteSelect}
          label="Хв"
          width="flex-1"
        />
      </div>

      <style>{`
        .hide-scrollbar-tp::-webkit-scrollbar { display: none; }
        .hide-scrollbar-tp { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
