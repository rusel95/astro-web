'use client';

import React, { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { Planet, House, Aspect, PlanetName } from '@/types/astrology';
import {
  PLANET_SYMBOLS,
  PLANET_NAMES_UK,
  ZODIAC_NAMES_UK,
  ASPECT_NAMES_UK,
  ASPECT_SYMBOLS,
  getPlanetDignityStatus,
  DIGNITY_NAMES_UK,
} from '@/lib/constants';
import ZodiacIcon, { ZODIAC_SVG_PATHS } from '@/components/icons/ZodiacIcon';

interface NatalChartWheelProps {
  planets: Planet[];
  houses: House[];
  aspects: Aspect[];
  ascendant: number;
  midheaven: number;
}

// ─── Tooltip data types ──────────────────────────────────────────────────────
interface PlanetTooltip {
  kind: 'planet';
  planet: Planet;
  x: number;
  y: number;
}
interface AspectTooltip {
  kind: 'aspect';
  aspect: Aspect;
  x: number;
  y: number;
}
type TooltipData = PlanetTooltip | AspectTooltip | null;

// ─── Colour palette ──────────────────────────────────────────────────────────
const ZODIAC_KEYS: string[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

const ZODIAC_COLORS: string[] = [
  '#e85d4a','#4a9e5c','#e8d44a','#4a8be8',
  '#e8834a','#5cb87a','#d4c94a','#4a6be8',
  '#e85d4a','#4a9e5c','#e8d44a','#4a8be8',
];

const ELEMENT_COLORS: Record<string, string> = {
  Aries: '#e85d4a', Leo: '#e85d4a', Sagittarius: '#e85d4a',
  Taurus: '#4a9e5c', Virgo: '#5cb87a', Capricorn: '#4a9e5c',
  Gemini: '#e8d44a', Libra: '#d4c94a', Aquarius: '#e8d44a',
  Cancer: '#4a8be8', Scorpio: '#4a6be8', Pisces: '#4a8be8',
};

const PLANET_COLORS: Record<string, string> = {
  Sun: '#FFD700', Moon: '#C4B5FD', Mercury: '#A3E6CB',
  Venus: '#F9A8D4', Mars: '#FB923C', Jupiter: '#FDE68A',
  Saturn: '#94A3B8', Uranus: '#67E8F9', Neptune: '#818CF8',
  Pluto: '#C084FC', TrueNode: '#86EFAC', SouthNode: '#FCA5A5',
  Lilith: '#F472B6',
};

// ─── Geometry helpers ────────────────────────────────────────────────────────
const CX = 300, CY = 300;
const R_OUTER = 278;
const R_ZODIAC_INNER = 238;
const R_HOUSE_RING = 198;
const R_PLANET_RING = 168;
const R_PLANET_INNER = 140;
const R_ASPECT = 120;

function degToRad(deg: number) { return (deg * Math.PI) / 180; }

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = degToRad(angleDeg);
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
}

function astroToSvgAngle(longitude: number, ascendant: number): number {
  return 180 + ascendant - longitude;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function NatalChartWheel({
  planets, houses, aspects, ascendant, midheaven,
}: NatalChartWheelProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<TooltipData>(null);
  const [animating, setAnimating] = useState(true);

  const toAngle = useCallback(
    (lng: number) => astroToSvgAngle(lng, ascendant),
    [ascendant],
  );

  // Entrance animation: fade-in + slight scale from center
  useEffect(() => {
    const t = setTimeout(() => setAnimating(false), 600);
    return () => clearTimeout(t);
  }, []);

  // ── Planet collision resolution ──────────────────────────────────────────
  const placedPlanets = useMemo(() => {
    const sorted = [...planets].sort((a, b) => a.longitude - b.longitude);
    const MIN_SEP = 9;
    type PlacedPlanet = Planet & { displayAngle: number; radius: number };
    const placed: PlacedPlanet[] = sorted.map(p => ({
      ...p,
      displayAngle: toAngle(p.longitude),
      radius: R_PLANET_RING,
    }));

    for (let pass = 0; pass < 6; pass++) {
      for (let i = 0; i < placed.length; i++) {
        for (let j = i + 1; j < placed.length; j++) {
          let diff = placed[j].displayAngle - placed[i].displayAngle;
          while (diff > 180) diff -= 360;
          while (diff < -180) diff += 360;
          if (Math.abs(diff) < MIN_SEP) {
            const shift = (MIN_SEP - Math.abs(diff)) / 2;
            const sign = diff >= 0 ? 1 : -1;
            placed[i].displayAngle -= sign * shift;
            placed[j].displayAngle += sign * shift;
          }
        }
      }
    }
    return placed;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planets, ascendant]);

  // ── Aspect endpoint map ───────────────────────────────────────────────────
  const planetAngleMap = useMemo(() => {
    const map: Record<string, { angle: number; x: number; y: number }> = {};
    placedPlanets.forEach(p => {
      const pos = polarToXY(CX, CY, R_ASPECT, toAngle(p.longitude));
      map[p.name] = { angle: toAngle(p.longitude), ...pos };
    });
    return map;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placedPlanets]);

  // ── Tooltip helpers ───────────────────────────────────────────────────────
  const showPlanetTooltip = useCallback((planet: Planet, e: React.MouseEvent | React.TouchEvent) => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const rect = svgEl.getBoundingClientRect();
    let clientX: number, clientY: number;
    if ('touches' in e) {
      clientX = e.touches[0]?.clientX ?? 0;
      clientY = e.touches[0]?.clientY ?? 0;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    setTooltip({ kind: 'planet', planet, x, y });
  }, []);

  const showAspectTooltip = useCallback((aspect: Aspect, e: React.MouseEvent) => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const rect = svgEl.getBoundingClientRect();
    setTooltip({
      kind: 'aspect',
      aspect,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const hideTooltip = useCallback(() => setTooltip(null), []);

  // Close tooltip on outside click/touch
  useEffect(() => {
    const handler = () => setTooltip(null);
    document.addEventListener('pointerdown', handler, { passive: true });
    return () => document.removeEventListener('pointerdown', handler);
  }, []);

  // ── Aspect rendering ──────────────────────────────────────────────────────
  const aspectLines = useMemo(() => {
    return aspects.map((asp, i) => {
      const p1 = planetAngleMap[asp.planet1];
      const p2 = planetAngleMap[asp.planet2];
      if (!p1 || !p2) return null;

      let stroke = 'rgba(255,255,255,0.12)';
      let strokeWidth = 0.8;
      let dashArray = '';
      let glowStroke = 'none';

      switch (asp.type) {
        case 'Conjunction':
          stroke = 'rgba(255,215,0,0.55)'; strokeWidth = 1.6; glowStroke = 'rgba(255,215,0,0.15)'; break;
        case 'Opposition':
          stroke = 'rgba(220,60,60,0.65)'; dashArray = '4 3'; strokeWidth = 1.2; glowStroke = 'rgba(220,60,60,0.1)'; break;
        case 'Trine':
          stroke = 'rgba(80,140,255,0.55)'; strokeWidth = 1.1; glowStroke = 'rgba(80,140,255,0.1)'; break;
        case 'Square':
          stroke = 'rgba(220,60,60,0.5)'; strokeWidth = 1; break;
        case 'Sextile':
          stroke = 'rgba(80,200,120,0.5)'; strokeWidth = 0.9; break;
      }

      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;

      return (
        <g key={i} style={{ cursor: 'pointer' }}
          onMouseEnter={(e) => showAspectTooltip(asp, e)}
          onMouseLeave={hideTooltip}
        >
          {/* Glow layer for major aspects */}
          {glowStroke !== 'none' && (
            <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
              stroke={glowStroke} strokeWidth={strokeWidth * 6} />
          )}
          {/* Main line */}
          <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
            stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={dashArray} />
          {/* Invisible hit area */}
          <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
            stroke="transparent" strokeWidth={10}
            data-mid-x={midX} data-mid-y={midY}
          />
        </g>
      );
    });
  }, [aspects, planetAngleMap, showAspectTooltip, hideTooltip]);

  return (
    <div className="relative w-full flex justify-center py-4 select-none">
      {/* SVG Wheel */}
      <svg
        ref={svgRef}
        viewBox="0 0 600 600"
        className="w-full max-w-[600px] min-w-[280px] aspect-square"
        style={{
          fontFamily: "'Segoe UI', system-ui, sans-serif",
          opacity: animating ? 0 : 1,
          transform: animating ? 'scale(0.97)' : 'scale(1)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}
        onPointerLeave={hideTooltip}
      >
        {/* ── Outer background ── */}
        <circle cx={CX} cy={CY} r={R_OUTER + 2} fill="rgba(10,6,25,0.3)" />

        {/* ── Zodiac ring ── */}
        <circle cx={CX} cy={CY} r={R_OUTER} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        <circle cx={CX} cy={CY} r={R_ZODIAC_INNER} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.5" />

        {ZODIAC_KEYS.map((key, i) => {
          const startLng = i * 30, midLng = startLng + 15, endLng = startLng + 30;
          const startA = toAngle(startLng), midA = toAngle(midLng), endA = toAngle(endLng);

          const arcOuter = (r: number, a: number) => polarToXY(CX, CY, r, a);
          const pArcStart = arcOuter(R_OUTER - 1, startA);
          const pArcEnd   = arcOuter(R_OUTER - 1, endA);
          const pInnerEnd = arcOuter(R_ZODIAC_INNER + 1, endA);
          const pInnerStart = arcOuter(R_ZODIAC_INNER + 1, startA);

          const pathD = [
            `M ${pArcStart.x} ${pArcStart.y}`,
            `A ${R_OUTER - 1} ${R_OUTER - 1} 0 0 0 ${pArcEnd.x} ${pArcEnd.y}`,
            `L ${pInnerEnd.x} ${pInnerEnd.y}`,
            `A ${R_ZODIAC_INNER + 1} ${R_ZODIAC_INNER + 1} 0 0 1 ${pInnerStart.x} ${pInnerStart.y}`,
            'Z',
          ].join(' ');

          const divLine = { inner: arcOuter(R_ZODIAC_INNER, startA), outer: arcOuter(R_OUTER, startA) };
          const glyphPos = polarToXY(CX, CY, (R_OUTER + R_ZODIAC_INNER) / 2, midA);
          const iconSize = 16;
          const scale = iconSize / 24;

          return (
            <g key={i}>
              <path d={pathD} fill={ZODIAC_COLORS[i]} fillOpacity="0.10" />
              <line x1={divLine.inner.x} y1={divLine.inner.y}
                x2={divLine.outer.x} y2={divLine.outer.y}
                stroke="rgba(255,255,255,0.22)" strokeWidth="0.5" />
              <g transform={`translate(${glyphPos.x - iconSize / 2}, ${glyphPos.y - iconSize / 2}) scale(${scale})`}>
                <path d={ZODIAC_SVG_PATHS[key]} fill="none" stroke={ZODIAC_COLORS[i]}
                  strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </g>
          );
        })}

        {/* ── House ring ── */}
        <circle cx={CX} cy={CY} r={R_HOUSE_RING} fill="none"
          stroke="rgba(255,255,255,0.13)" strokeWidth="0.5" />
        <circle cx={CX} cy={CY} r={R_PLANET_INNER} fill="none"
          stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />

        {houses.map((house) => {
          const angle = toAngle(house.cusp);
          const p1 = polarToXY(CX, CY, R_PLANET_INNER, angle);
          const p2 = polarToXY(CX, CY, R_ZODIAC_INNER, angle);
          const nextH = houses.find(h => h.number === (house.number % 12) + 1);
          const nextCusp = nextH ? nextH.cusp : house.cusp + 30;
          let mid = (house.cusp + nextCusp) / 2;
          if (nextCusp < house.cusp) mid = ((house.cusp + nextCusp + 360) / 2) % 360;
          const numPos = polarToXY(CX, CY, (R_HOUSE_RING + R_ZODIAC_INNER) / 2, toAngle(mid));
          const isAngular = [1, 4, 7, 10].includes(house.number);
          return (
            <g key={house.number}>
              <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                stroke={isAngular ? 'rgba(255,215,0,0.35)' : 'rgba(255,255,255,0.12)'}
                strokeWidth={isAngular ? 1 : 0.5} />
              <text x={numPos.x} y={numPos.y}
                textAnchor="middle" dominantBaseline="central"
                fill="rgba(255,255,255,0.35)" fontSize="9.5"
              >{house.number}</text>
            </g>
          );
        })}

        {/* ── Aspect lines ── */}
        {aspectLines}

        {/* ── Inner circle fill ── */}
        <circle cx={CX} cy={CY} r={R_ASPECT - 2} fill="rgba(8,4,20,0.55)" />

        {/* ── Planets ── */}
        {placedPlanets.map((planet) => {
          const pos = polarToXY(CX, CY, planet.radius, planet.displayAngle);
          const actualAngle = toAngle(planet.longitude);
          const tickInner = polarToXY(CX, CY, R_HOUSE_RING + 2, actualAngle);
          const tickOuter = polarToXY(CX, CY, R_ZODIAC_INNER - 2, actualAngle);
          const color = PLANET_COLORS[planet.name] ?? '#c4b5fd';
          const isPersonal = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars'].includes(planet.name);
          const symbol = PLANET_SYMBOLS[planet.name as PlanetName] || '?';
          const dignity = getPlanetDignityStatus(planet.name as PlanetName, planet.sign);

          return (
            <g key={planet.name}
              style={{ cursor: 'pointer' }}
              onMouseEnter={(e) => { e.stopPropagation(); showPlanetTooltip(planet, e); }}
              onMouseLeave={hideTooltip}
              onTouchStart={(e) => { e.stopPropagation(); showPlanetTooltip(planet, e); }}
              onClick={(e) => { e.stopPropagation(); showPlanetTooltip(planet, e); }}
            >
              {/* Tick on house ring */}
              <line x1={tickInner.x} y1={tickInner.y} x2={tickOuter.x} y2={tickOuter.y}
                stroke={color} strokeWidth="0.8" strokeOpacity="0.5" />

              {/* Subtle connector to displaced glyph */}
              <line x1={polarToXY(CX, CY, R_HOUSE_RING + 8, actualAngle).x}
                y1={polarToXY(CX, CY, R_HOUSE_RING + 8, actualAngle).y}
                x2={pos.x} y2={pos.y}
                stroke={color} strokeWidth="0.4" strokeOpacity="0.3" />

              {/* Glow for personal planets */}
              {isPersonal && (
                <circle cx={pos.x} cy={pos.y} r="14"
                  fill={color} fillOpacity="0.06" />
              )}

              {/* Dignity indicator ring */}
              {(dignity === 'rulership' || dignity === 'exaltation') && (
                <circle cx={pos.x} cy={pos.y} r={isPersonal ? 14 : 12}
                  fill="none" stroke={dignity === 'rulership' ? '#FFD700' : '#86EFAC'}
                  strokeWidth="0.8" strokeOpacity="0.7" />
              )}

              {/* Planet glyph */}
              <text x={pos.x} y={pos.y}
                textAnchor="middle" dominantBaseline="central"
                fill={color}
                fontSize={isPersonal ? '14' : '12'}
                fontWeight="bold"
              >{symbol}</text>

              {/* Retrograde marker */}
              {planet.isRetrograde && (
                <text x={pos.x + 11} y={pos.y - 7}
                  textAnchor="middle" dominantBaseline="central"
                  fill="#f97316" fontSize="7" fontWeight="bold"
                >℞</text>
              )}

              {/* Hit area */}
              <circle cx={pos.x} cy={pos.y} r="16" fill="transparent" />
            </g>
          );
        })}

        {/* ── ASC marker ── */}
        {(() => {
          const ascA = toAngle(ascendant);
          const tip = polarToXY(CX, CY, R_OUTER + 6, ascA);
          const b1  = polarToXY(CX, CY, R_OUTER + 18, ascA + 3.5);
          const b2  = polarToXY(CX, CY, R_OUTER + 18, ascA - 3.5);
          const lbl = polarToXY(CX, CY, R_OUTER + 22, ascA);
          return (
            <g>
              <polygon points={`${tip.x},${tip.y} ${b1.x},${b1.y} ${b2.x},${b2.y}`}
                fill="#FFD700" fillOpacity="0.9" />
              <text x={lbl.x - 16} y={lbl.y}
                textAnchor="middle" dominantBaseline="central"
                fill="#FFD700" fontSize="10" fontWeight="bold"
              >ASC</text>
            </g>
          );
        })()}

        {/* ── MC marker ── */}
        {(() => {
          const mcA = toAngle(midheaven);
          const pos = polarToXY(CX, CY, R_OUTER + 14, mcA);
          return (
            <text x={pos.x} y={pos.y}
              textAnchor="middle" dominantBaseline="central"
              fill="#c4b5fd" fontSize="10" fontWeight="bold"
            >MC</text>
          );
        })()}

        {/* ── Center decoration ── */}
        <circle cx={CX} cy={CY} r={12} fill="rgba(139,92,246,0.15)"
          stroke="rgba(139,92,246,0.35)" strokeWidth="0.8" />
        <circle cx={CX} cy={CY} r={3} fill="rgba(139,92,246,0.6)" />
      </svg>

      {/* ── Tooltip overlay (HTML, outside SVG for proper z-index) ── */}
      {tooltip && (
        <TooltipPanel tooltip={tooltip} svgRef={svgRef} />
      )}
    </div>
  );
}

// ─── Tooltip Panel ────────────────────────────────────────────────────────────
function TooltipPanel({
  tooltip,
  svgRef,
}: {
  tooltip: NonNullable<TooltipData>;
  svgRef: React.RefObject<SVGSVGElement>;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ left: 0, top: 0, alignRight: false, alignBottom: false });

  useEffect(() => {
    const panel = panelRef.current;
    const svg = svgRef.current;
    if (!panel || !svg) return;
    const svgRect = svg.getBoundingClientRect();
    const W = panel.offsetWidth;
    const H = panel.offsetHeight;

    // tooltip.x/y are relative to svg bounding box
    const rawLeft = tooltip.x + 12;
    const rawTop  = tooltip.y - H / 2;

    const alignRight  = rawLeft + W > svgRect.width - 8;
    const alignBottom = rawTop < 8;

    setPos({
      left:        alignRight  ? tooltip.x - W - 12 : rawLeft,
      top:         alignBottom ? 8 : rawTop,
      alignRight,
      alignBottom,
    });
  }, [tooltip, svgRef]);

  if (tooltip.kind === 'planet') {
    const p = tooltip.planet;
    const symbol = PLANET_SYMBOLS[p.name as PlanetName] ?? '?';
    const name   = PLANET_NAMES_UK[p.name as PlanetName] ?? p.name;
    const sign   = ZODIAC_NAMES_UK[p.sign];
    const color  = PLANET_COLORS[p.name] ?? '#c4b5fd';
    const dignity = getPlanetDignityStatus(p.name as PlanetName, p.sign);
    const degInSign = (p.longitude % 30).toFixed(1);

    return (
      <div
        ref={panelRef}
        className="absolute z-50 pointer-events-none"
        style={{ left: pos.left, top: pos.top }}
      >
        <div
          className="rounded-xl border border-white/15 shadow-2xl backdrop-blur-xl px-3 py-2.5 min-w-[160px] max-w-[200px]"
          style={{ background: 'rgba(14,8,35,0.92)' }}
        >
          {/* Planet header */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xl leading-none" style={{ color }}>{symbol}</span>
            <div>
              <div className="text-sm font-bold text-white leading-tight">{name}</div>
              {p.isRetrograde && (
                <div className="text-[10px] text-orange-400 font-semibold">ретроградний ℞</div>
              )}
            </div>
          </div>

          {/* Sign & degree */}
          <div className="flex items-center gap-1.5 text-xs text-text-muted mb-1">
            <ZodiacIcon sign={p.sign} size={12} color={ELEMENT_COLORS[p.sign]} />
            <span className="text-white/80">{sign}</span>
            <span className="text-white/40">{degInSign}°</span>
          </div>

          {/* House */}
          <div className="text-[11px] text-white/50">
            Дім <span className="text-white/70 font-semibold">{p.house}</span>
          </div>

          {/* Dignity */}
          {dignity && (
            <div className="mt-1.5 text-[10px] font-semibold"
              style={{
                color: dignity === 'rulership' ? '#FFD700'
                     : dignity === 'exaltation' ? '#86EFAC'
                     : dignity === 'detriment'  ? '#FB923C'
                     : '#F87171',
              }}
            >
              {DIGNITY_NAMES_UK[dignity]}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Aspect tooltip
  const asp = tooltip.aspect;
  const sym = ASPECT_SYMBOLS[asp.type] ?? '';
  const nameUK = ASPECT_NAMES_UK[asp.type] ?? asp.type;
  const p1UK = PLANET_NAMES_UK[asp.planet1 as PlanetName] ?? asp.planet1;
  const p2UK = PLANET_NAMES_UK[asp.planet2 as PlanetName] ?? asp.planet2;

  const aspColor: Record<string, string> = {
    Conjunction: '#FFD700', Opposition: '#F87171', Trine: '#60A5FA',
    Square: '#FB923C', Sextile: '#6EE7B7',
  };
  const color = aspColor[asp.type] ?? '#c4b5fd';

  return (
    <div
      ref={panelRef}
      className="absolute z-50 pointer-events-none"
      style={{ left: pos.left, top: pos.top }}
    >
      <div
        className="rounded-xl border border-white/15 shadow-2xl backdrop-blur-xl px-3 py-2 min-w-[150px]"
        style={{ background: 'rgba(14,8,35,0.92)' }}
      >
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-base font-bold" style={{ color }}>{sym}</span>
          <span className="text-sm font-bold text-white">{nameUK}</span>
        </div>
        <div className="text-[11px] text-white/60">
          {p1UK} — {p2UK}
        </div>
        <div className="text-[10px] text-white/40 mt-0.5">
          Орб {asp.orb.toFixed(1)}°{asp.isApplying ? ' (застосов.)' : ''}
        </div>
      </div>
    </div>
  );
}
