'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Share2, Check, Download, Gift, Cake, ChevronDown, Sparkles } from 'lucide-react';

import { NatalChart, AIReport, ReportArea } from '@/types/astrology';
import { ZODIAC_SYMBOLS, ZODIAC_NAMES_UK } from '@/lib/constants';
import ZodiacIcon from '@/components/icons/ZodiacIcon';
import NatalChartWheel from '@/components/chart/NatalChartWheel';
import PlanetsTable from '@/components/chart/PlanetsTable';
import HousesTable from '@/components/chart/HousesTable';
import AspectsTable from '@/components/chart/AspectsTable';
import AreaCards from '@/components/report/AreaCards';
import ReportView from '@/components/report/ReportView';
import SvgChartViewer from '@/components/feature/SvgChartViewer';
import BirthTimeWarning from '@/components/feature/BirthTimeWarning';
import SectionCard from '@/components/feature/SectionCard';
import ReportRenderer from '@/components/feature/ReportRenderer';

function isBirthdayToday(birthDate: string): boolean {
  const [, m, d] = birthDate.split('-').map(Number);
  const today = new Date();
  return today.getMonth() + 1 === m && today.getDate() === d;
}

function isBirthdaySoon(birthDate: string): { isSoon: boolean; daysUntil: number } {
  const [, m, d] = birthDate.split('-').map(Number);
  const today = new Date();
  const thisYearBirthday = new Date(today.getFullYear(), m - 1, d);

  if (thisYearBirthday < today) {
    thisYearBirthday.setFullYear(today.getFullYear() + 1);
  }

  const diffTime = thisYearBirthday.getTime() - today.getTime();
  const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return { isSoon: daysUntil <= 14 && daysUntil > 0, daysUntil };
}

function zodiacFromDegree(deg: number) {
  const signs = [
    'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
    'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces',
  ] as const;
  return signs[Math.floor((deg % 360) / 30)];
}

// Map product slugs to AI report areas
const PRODUCT_SLUG_TO_AREA: Record<string, ReportArea> = {
  personality: 'general',
  talent: 'general',
  career: 'career',
  business: 'career',
  love: 'relationships',
  'love-compatibility': 'relationships',
  marriage: 'relationships',
  health: 'health',
  finance: 'finances',
  children: 'children',
  pregnancy: 'general',
  conception: 'general',
  calendar: 'general',
  '3-years': 'general',
  '2026': 'general',
};

export default function ChartPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const [chart, setChart] = useState<NatalChart | null>(null);
  const [inputData, setInputData] = useState<{ name?: string; gender?: string }>({});
  const [report, setReport] = useState<AIReport | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [selectedArea, setSelectedArea] = useState<ReportArea | null>(null);
  const [generatedAreas, setGeneratedAreas] = useState<Set<ReportArea>>(new Set());
  const [reports, setReports] = useState<Record<string, AIReport>>({});
  const [enhanced, setEnhanced] = useState<Record<string, unknown> | null>(null);
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadChart() {
      const stored = sessionStorage.getItem(`chart-${id}`) || localStorage.getItem(`chart-${id}`);
      const storedInput = sessionStorage.getItem(`chart-input-${id}`) || localStorage.getItem(`chart-input-${id}`);
      if (stored) {
        if (cancelled) return;
        setChart(JSON.parse(stored));
        if (storedInput) setInputData(JSON.parse(storedInput));
        const storedEnhanced = sessionStorage.getItem(`chart-enhanced-${id}`) || localStorage.getItem(`chart-enhanced-${id}`);
        if (storedEnhanced) setEnhanced(JSON.parse(storedEnhanced));
        return;
      }

      try {
        const res = await fetch(`/api/charts/${id}`);
        if (!res.ok) {
          if (!cancelled) setNotFound(true);
          return;
        }
        const data = await res.json();
        if (data.chart?.chart_data) {
          if (cancelled) return;
          setChart(data.chart.chart_data);
          setInputData({ name: data.chart.name, gender: data.chart.gender });
          sessionStorage.setItem(`chart-${id}`, JSON.stringify(data.chart.chart_data));
          sessionStorage.setItem(`chart-input-${id}`, JSON.stringify({ name: data.chart.name, gender: data.chart.gender }));
        } else {
          if (!cancelled) setNotFound(true);
        }
      } catch {
        if (!cancelled) setNotFound(true);
      }
    }

    loadChart();
    return () => { cancelled = true; };
  }, [id]);

  // Auto-trigger report area when arriving from a product page (e.g. /horoscope/career)
  const fromProduct = searchParams.get('from');
  useEffect(() => {
    if (!chart || !fromProduct) return;
    const area = PRODUCT_SLUG_TO_AREA[fromProduct];
    if (area && !generatedAreas.has(area)) {
      generateReport(area);
    }
    // Only run once when chart first loads
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chart, fromProduct]);

  const sunPlanet = chart?.planets.find(p => p.name === 'Sun');
  const moonPlanet = chart?.planets.find(p => p.name === 'Moon');

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const el = document.createElement('input');
      el.value = window.location.href;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }, []);

  const handleShareToTwitter = useCallback(() => {
    if (!chart || !sunPlanet) return;
    const sunSign = zodiacFromDegree(sunPlanet.longitude);
    const chartUrl = window.location.href;
    const tweetText = `✨ Щойно розрахував свою натальну карту!\n\n${ZODIAC_SYMBOLS[sunPlanet.sign]} Сонце в ${sunSign}\n🌙 Місяць в ${moonPlanet ? zodiacFromDegree(moonPlanet.longitude) : '—'}\n⬆️ Асцендент в ${zodiacFromDegree(chart.ascendant)}\n\nДізнайся про себе більше → ${chartUrl}\n\n#астрологія #натальнакарта #${sunSign.toLowerCase()}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`, '_blank', 'width=550,height=420');
  }, [chart, sunPlanet, moonPlanet]);

  const handleDownloadStory = useCallback(async () => {
    if (!chart || !sunPlanet) return;
    const sunSign = zodiacFromDegree(sunPlanet.longitude);
    const url = `/api/share-image?sign=${encodeURIComponent(sunSign)}&name=${encodeURIComponent(inputData.name || '')}`;
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      if (navigator.share && navigator.canShare) {
        const file = new File([blob], `astro-${sunSign.toLowerCase()}.png`, { type: 'image/png' });
        const shareData = { title: `✨ ${inputData.name || 'Моя'} астрологічна карта`, text: `Мій знак Сонця: ${sunSign} ${ZODIAC_SYMBOLS[sunPlanet.sign]} | Розрахуй свою карту на Зоря`, files: [file] };
        if (navigator.canShare(shareData)) { await navigator.share(shareData); return; }
      }
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `astro-story-${sunSign.toLowerCase()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Failed to share/download story:', error);
    }
  }, [chart, sunPlanet, inputData.name]);

  const generateReport = useCallback(async (area: ReportArea) => {
    if (!chart) return;
    if (reports[area]) {
      setSelectedArea(area);
      setReport(reports[area]);
      return;
    }
    setSelectedArea(area);
    setLoadingReport(true);
    setReport(null);
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chart, area }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setReport(data);
      setReports(prev => ({ ...prev, [area]: data }));
      setGeneratedAreas(prev => { const next = new Set(prev); next.add(area); return next; });
    } catch {
      setReport(null);
    }
    setLoadingReport(false);
  }, [chart, reports]);

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <div className="text-5xl">🔭</div>
        <h2 className="text-xl font-bold text-text-primary">Карту не знайдено</h2>
        <p className="text-text-muted text-sm text-center max-w-xs">
          Ця карта не існує або належить іншому користувачу. Увійдіть до акаунту або створіть нову карту.
        </p>
        <div className="flex gap-3 mt-2">
          <a href="/auth/login" className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-80" style={{ border: '1px solid rgba(108,60,225,0.5)', color: '#9966E6' }}>Увійти</a>
          <a href="/chart/new" className="px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #6C3CE1 0%, #9966E6 100%)' }}>Нова карта</a>
        </div>
      </div>
    );
  }

  if (!chart) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} strokeWidth={1.5} className="text-zorya-violet animate-spin" />
      </div>
    );
  }

  const ascSign = zodiacFromDegree(chart.ascendant);
  const mcSign = zodiacFromDegree(chart.midheaven);

  return (
    <div className="max-w-2xl mx-auto px-4 pb-12">

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center pt-6 pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
          {(inputData.name && !/[/?&=]/.test(inputData.name)) ? inputData.name : 'Натальна карта'}
        </h1>
        <p className="text-text-muted text-sm mt-1">
          {chart.locationName} · {chart.birthDate} · {chart.birthTime}
        </p>

        <div className="flex justify-center gap-2 mt-4 flex-wrap">
          <motion.button
            onClick={handleCopyLink}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              copied
                ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                : 'bg-white/8 text-text-muted hover:text-zorya-violet hover:bg-zorya-purple/15 border border-white/10 hover:border-zorya-purple/40'
            }`}
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span key="check" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} className="flex items-center gap-2">
                  <Check size={14} strokeWidth={2.5} /> Скопійовано!
                </motion.span>
              ) : (
                <motion.span key="share" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} className="flex items-center gap-2">
                  <Share2 size={14} strokeWidth={1.75} /> Поділитися
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <motion.button
            onClick={handleDownloadStory}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-zorya-violet to-zorya-purple text-white border border-zorya-purple/40 hover:shadow-lg hover:shadow-zorya-purple/30 transition-all"
          >
            <Download size={14} strokeWidth={1.75} /> Stories
          </motion.button>

          <motion.button
            onClick={handleShareToTwitter}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-black/60 text-white border border-white/20 hover:bg-black/80 hover:border-white/40 transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            X
          </motion.button>
        </div>
      </motion.div>

      {/* ── Birthday Banners ── */}
      {chart.birthDate && isBirthdayToday(chart.birthDate) && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
          <div className="glass-card p-4 border-2 border-zorya-gold/40 bg-gradient-to-r from-zorya-gold/10 to-zorya-purple/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-zorya-gold/20 flex items-center justify-center flex-shrink-0">
                <Cake size={20} className="text-zorya-gold" />
              </div>
              <div>
                <p className="text-zorya-gold font-semibold text-sm">З Днем Народження!</p>
                <p className="text-text-secondary text-xs">Перегляньте AI-звіт для персонального прогнозу</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {chart.birthDate && !isBirthdayToday(chart.birthDate) && isBirthdaySoon(chart.birthDate).isSoon && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
          <div className="glass-card p-4 border border-zorya-purple/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zorya-purple/20 flex items-center justify-center flex-shrink-0">
                <Gift size={18} className="text-zorya-violet" />
              </div>
              <div>
                <p className="text-text-primary font-medium text-sm">День народження за {isBirthdaySoon(chart.birthDate).daysUntil} дн.</p>
                <p className="text-text-muted text-xs">Перегляньте AI-звіт для персонального прогнозу</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Birth Time Warning (FR-050) ── */}
      {chart.birthTime === '12:00' && (
        <div className="mb-5">
          <BirthTimeWarning />
        </div>
      )}

      {/* ── API SVG Chart (T035) ── */}
      {chart.svgContent && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <SvgChartViewer svgContent={chart.svgContent} title="Натальна карта (API)" />
        </motion.div>
      )}

      {/* ── Quick Identity ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
      >
        <QuickStat
          label="Сонце"
          icon={sunPlanet ? <ZodiacIcon sign={sunPlanet.sign} size={16} className="text-zorya-violet" /> : null}
          value={sunPlanet ? ZODIAC_NAMES_UK[sunPlanet.sign] : '—'}
          sub={`Дім ${sunPlanet?.house || '—'}`}
        />
        <QuickStat
          label="Місяць"
          icon={moonPlanet ? <ZodiacIcon sign={moonPlanet.sign} size={16} className="text-zorya-violet" /> : null}
          value={moonPlanet ? ZODIAC_NAMES_UK[moonPlanet.sign] : '—'}
          sub={`Дім ${moonPlanet?.house || '—'}`}
        />
        <QuickStat
          label="Асцендент"
          icon={<ZodiacIcon sign={ascSign} size={16} className="text-zorya-violet" />}
          value={ZODIAC_NAMES_UK[ascSign]}
          sub={`${(chart.ascendant % 30).toFixed(1)}°`}
        />
        <QuickStat
          label="MC"
          icon={<ZodiacIcon sign={mcSign} size={16} className="text-zorya-violet" />}
          value={ZODIAC_NAMES_UK[mcSign]}
          sub={`${(chart.midheaven % 30).toFixed(1)}°`}
        />
      </motion.div>

      {/* ── AI Life Areas — PRIMARY SECTION ── */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <span className="text-zorya-violet">✦</span> AI Інтерпретація
          </h2>
          {generatedAreas.size > 0 && (
            <span className="text-xs text-text-muted bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
              {generatedAreas.size}/6 сфер
            </span>
          )}
        </div>

        <AreaCards
          selectedArea={selectedArea}
          onSelect={generateReport}
          generatedAreas={generatedAreas}
        />

        {/* Report loading */}
        <AnimatePresence>
          {loadingReport && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="glass-card p-8 flex flex-col items-center gap-4 mt-4"
            >
              <Loader2 size={28} strokeWidth={1.5} className="text-zorya-violet animate-spin" />
              <div className="text-center">
                <p className="text-text-primary font-semibold">Генеруємо звіт...</p>
                <p className="text-text-muted text-xs mt-1">AI аналізує вашу натальну карту</p>
              </div>
              <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-zorya-purple to-zorya-violet rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 8, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Inline report result */}
        <AnimatePresence>
          {report && !loadingReport && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4"
            >
              <ReportView report={report} />
              <button
                onClick={() => { setSelectedArea(null); setReport(null); }}
                className="w-full mt-3 py-3 text-sm text-text-muted hover:text-zorya-violet transition-colors"
              >
                ← Обрати іншу сферу
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Technical Details Accordion ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <button
          onClick={() => setShowDetails(prev => !prev)}
          className="w-full flex items-center justify-between p-4 rounded-2xl glass-card hover:border-white/20 transition-all"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <span className="text-sm font-semibold text-text-primary">Технічні деталі карти</span>
          <ChevronDown
            size={18}
            strokeWidth={1.75}
            className={`text-text-muted transition-transform duration-300 ${showDetails ? 'rotate-180' : ''}`}
          />
        </button>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pt-4">
                {/* Local chart visualization (fallback when API SVG unavailable) */}
                {!chart.svgContent && (
                  <div className="glass-card p-6">
                    <p className="text-xs text-amber-400/70 mb-2">Локальна візуалізація (API SVG недоступне)</p>
                    <NatalChartWheel
                      planets={chart.planets}
                      houses={chart.houses}
                      aspects={chart.aspects}
                      ascendant={chart.ascendant}
                      midheaven={chart.midheaven}
                    />
                  </div>
                )}

                <div className="glass-card p-4">
                  <h3 className="text-sm font-semibold text-text-muted mb-3">Планети</h3>
                  <PlanetsTable chart={chart} />
                </div>

                <div className="glass-card p-4">
                  <h3 className="text-sm font-semibold text-text-muted mb-3">Доми</h3>
                  <HousesTable chart={chart} />
                </div>

                <div className="glass-card p-4">
                  <h3 className="text-sm font-semibold text-text-muted mb-3">{chart.aspects.length} аспектів</h3>
                  <AspectsTable chart={chart} />
                </div>

                {/* Enhanced data sections (T034) */}
                {!!enhanced?.natalReport && (
                  <SectionCard title="Натальний звіт (API)">
                    <ReportRenderer content={enhanced.natalReport} />
                  </SectionCard>
                )}

                {!!enhanced?.enhancedPositions && (
                  <SectionCard title="Гідності планет">
                    <ReportRenderer content={enhanced.enhancedPositions} />
                  </SectionCard>
                )}

                {!!enhanced?.enhancedAspects && (
                  <SectionCard title="Розширені аспекти">
                    <ReportRenderer content={enhanced.enhancedAspects} />
                  </SectionCard>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* AI Personality CTA — triggers inline report, no navigation */}
      {!generatedAreas.has('general') && !selectedArea && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={() => generateReport('general')}
            className="w-full block"
          >
            <div className="glass-card p-5 border border-zorya-purple/30 bg-zorya-purple/5 hover:border-zorya-purple/50 hover:shadow-lg hover:shadow-zorya-purple/20 transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-zorya-purple/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={18} className="text-zorya-violet" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-text-primary group-hover:text-zorya-violet transition-colors">
                    Отримати Гороскоп Особистості
                  </p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    AI-аналіз вашої натальної карти — безкоштовно
                  </p>
                </div>
                <span className="text-text-muted group-hover:text-zorya-violet transition-colors text-lg">→</span>
              </div>
            </div>
          </button>
        </motion.div>
      )}

    </div>
  );
}

function QuickStat({ label, value, sub, icon }: { label: string; value: string; sub: string; icon?: React.ReactNode }) {
  return (
    <div className="glass-card p-3 sm:p-4">
      <div className="text-[9px] sm:text-[10px] text-text-muted uppercase tracking-wider mb-1">{label}</div>
      <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-text-primary leading-tight">
        {icon}
        <span>{value}</span>
      </div>
      <div className="text-[10px] sm:text-xs text-text-muted mt-0.5">{sub}</div>
    </div>
  );
}
