'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Globe2, Building2, GitBranch, ScrollText, Loader2, Share2, Check, Download, Gift, Cake } from 'lucide-react';
import { NatalChart, AIReport, ReportArea } from '@/types/astrology';
import { ZODIAC_SYMBOLS, ZODIAC_NAMES_UK } from '@/lib/constants';
import NatalChartWheel from '@/components/chart/NatalChartWheel';
import PlanetsTable from '@/components/chart/PlanetsTable';
import HousesTable from '@/components/chart/HousesTable';
import AspectsTable from '@/components/chart/AspectsTable';
import AreaCards from '@/components/report/AreaCards';
import ReportView from '@/components/report/ReportView';

type Tab = 'overview' | 'planets' | 'houses' | 'aspects' | 'report';

function isBirthdayToday(birthDate: string): boolean {
  const birth = new Date(birthDate);
  const today = new Date();
  return birth.getMonth() === today.getMonth() && birth.getDate() === today.getDate();
}

function isBirthdaySoon(birthDate: string): { isSoon: boolean; daysUntil: number } {
  const birth = new Date(birthDate);
  const today = new Date();
  const thisYearBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  
  if (thisYearBirthday < today) {
    thisYearBirthday.setFullYear(today.getFullYear() + 1);
  }
  
  const diffTime = thisYearBirthday.getTime() - today.getTime();
  const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return { isSoon: daysUntil <= 14 && daysUntil > 0, daysUntil };
}

export default function ChartPage() {
  const { id } = useParams<{ id: string }>();
  const [chart, setChart] = useState<NatalChart | null>(null);
  const [inputData, setInputData] = useState<{ name?: string; gender?: string }>({});
  const [tab, setTab] = useState<Tab>('overview');
  const [report, setReport] = useState<AIReport | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [selectedArea, setSelectedArea] = useState<ReportArea | null>(null);
  const [generatedAreas, setGeneratedAreas] = useState<Set<ReportArea>>(new Set());
  const [reports, setReports] = useState<Record<string, AIReport>>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Try sessionStorage first, then localStorage as fallback
    const stored = sessionStorage.getItem(`chart-${id}`) || localStorage.getItem(`chart-${id}`);
    const storedInput = sessionStorage.getItem(`chart-input-${id}`) || localStorage.getItem(`chart-input-${id}`);
    if (stored) {
      const chartData = JSON.parse(stored);
      setChart(chartData);
      // Persist to localStorage for sharing (survives session)
      localStorage.setItem(`chart-${id}`, stored);
    }
    if (storedInput) {
      setInputData(JSON.parse(storedInput));
      localStorage.setItem(`chart-input-${id}`, storedInput);
    }
  }, [id]);

  // Extract planets early (used in callbacks)
  const sunPlanet = chart?.planets.find(p => p.name === 'Sun');
  const moonPlanet = chart?.planets.find(p => p.name === 'Moon');

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
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
    
    // X-optimized copy: short, engaging, emoji, hashtags
    const tweetText = `✨ Щойно розрахував свою натальну карту!

${ZODIAC_SYMBOLS[sunPlanet.sign]} Сонце в ${sunSign}
🌙 Місяць в ${moonPlanet ? zodiacFromDegree(moonPlanet.longitude) : '—'}
⬆️ Асцендент в ${zodiacFromDegree(chart.ascendant)}

Дізнайся про себе більше → ${chartUrl}

#астрологія #натальнакарта #${sunSign.toLowerCase()}`;
    
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  }, [chart, sunPlanet, moonPlanet]);

  const handleDownloadStory = useCallback(async () => {
    if (!chart || !sunPlanet) return;
    
    const sunSign = zodiacFromDegree(sunPlanet.longitude);
    const url = `/api/share-image?sign=${encodeURIComponent(sunSign)}&name=${encodeURIComponent(inputData.name || '')}`;
    
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      
      // Try Web Share API first (mobile devices, Instagram Stories)
      if (navigator.share && navigator.canShare) {
        const file = new File([blob], `astro-${sunSign.toLowerCase()}.png`, { type: 'image/png' });
        const shareData = {
          title: `✨ ${inputData.name || 'Моя'} астрологічна карта`,
          text: `Мій знак Сонця: ${sunSign} ${ZODIAC_SYMBOLS[sunPlanet.sign]} | Розрахуй свою карту на AstroSvitlana`,
          files: [file],
        };
        
        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          return;
        }
      }
      
      // Fallback: download file
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
      setTab('report');
      return;
    }
    setSelectedArea(area);
    setLoadingReport(true);
    setReport(null);
    setTab('report');
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

  if (!chart) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} strokeWidth={1.5} className="text-zorya-violet animate-spin" />
      </div>
    );
  }

  const ascSign = zodiacFromDegree(chart.ascendant);
  const mcSign = zodiacFromDegree(chart.midheaven);

  const TABS: { id: Tab; label: string; Icon: React.ElementType }[] = [
    { id: 'overview',   label: 'Огляд',   Icon: LayoutGrid },
    { id: 'planets',    label: 'Планети', Icon: Globe2 },
    { id: 'houses',     label: 'Доми',    Icon: Building2 },
    { id: 'aspects',    label: 'Аспекти', Icon: GitBranch },
    { id: 'report',     label: 'Звіт',    Icon: ScrollText },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-6 pb-4 relative"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
          {inputData.name || 'Натальна карта'}
        </h1>
        <p className="text-text-muted text-sm mt-1">
          {chart.locationName} • {chart.birthDate} • {chart.birthTime}
        </p>

        {/* Share buttons */}
        <div className="flex justify-center gap-3 mt-3 flex-wrap">
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
                <motion.span
                  key="check"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Check size={14} strokeWidth={2.5} />
                  Посилання скопійовано!
                </motion.span>
              ) : (
                <motion.span
                  key="share"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Share2 size={14} strokeWidth={1.75} />
                  Скопіювати посилання
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <motion.button
            onClick={handleDownloadStory}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 bg-gradient-to-r from-zorya-violet to-zorya-purple text-white border border-zorya-purple/40 hover:shadow-lg hover:shadow-zorya-purple/30"
          >
            <Download size={14} strokeWidth={1.75} />
            Stories для Instagram
          </motion.button>

          <motion.button
            onClick={handleShareToTwitter}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 bg-black/60 text-white border border-white/20 hover:bg-black/80 hover:border-white/40"
            title="Поділитися в X (Twitter)"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Поділитися в X
          </motion.button>
        </div>
      </motion.div>

      {/* Chart Wheel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="glass-card overflow-hidden">
          {chart.svgContent ? (
            <div
              className="w-full"
              dangerouslySetInnerHTML={{ __html: chart.svgContent }}
              style={{ lineHeight: 0 }}
            />
          ) : (
            <div className="p-6">
              <NatalChartWheel
                planets={chart.planets}
                houses={chart.houses}
                aspects={chart.aspects}
                ascendant={chart.ascendant}
                midheaven={chart.midheaven}
              />
            </div>
          )}
        </div>
      </motion.div>

      {/* Birthday Banner */}
      {chart.birthDate && isBirthdayToday(chart.birthDate) && (
        <motion.a
          href={`/birthday-forecast/${id}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="block mb-6"
        >
          <div className="glass-card p-4 border-2 border-zorya-gold/40 bg-gradient-to-r from-zorya-gold/10 to-zorya-purple/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-zorya-gold/20 flex items-center justify-center">
                  <Cake size={24} className="text-zorya-gold" />
                </div>
                <div>
                  <p className="text-zorya-gold font-semibold">🎂 З Днем Народження!</p>
                  <p className="text-text-secondary text-sm">Отримайте персональний прогноз на рік</p>
                </div>
              </div>
              <div className="text-zorya-gold">→</div>
            </div>
          </div>
        </motion.a>
      )}
      
      {chart.birthDate && !isBirthdayToday(chart.birthDate) && isBirthdaySoon(chart.birthDate).isSoon && (
        <motion.a
          href={`/birthday-forecast/${id}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="block mb-6"
        >
          <div className="glass-card p-4 border border-zorya-purple/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zorya-purple/20 flex items-center justify-center">
                  <Gift size={20} className="text-zorya-violet" />
                </div>
                <div>
                  <p className="text-text-primary font-medium">День народження за {isBirthdaySoon(chart.birthDate).daysUntil} дн.</p>
                  <p className="text-text-muted text-sm">Дізнайтесь прогноз на наступний рік</p>
                </div>
              </div>
              <div className="text-zorya-violet">→</div>
            </div>
          </div>
        </motion.a>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <QuickStat
          label="Сонце"
          value={sunPlanet ? `${ZODIAC_SYMBOLS[sunPlanet.sign]} ${ZODIAC_NAMES_UK[sunPlanet.sign]}` : '—'}
          sub={`Дім ${sunPlanet?.house || '—'}`}
        />
        <QuickStat
          label="Місяць"
          value={moonPlanet ? `${ZODIAC_SYMBOLS[moonPlanet.sign]} ${ZODIAC_NAMES_UK[moonPlanet.sign]}` : '—'}
          sub={`Дім ${moonPlanet?.house || '—'}`}
        />
        <QuickStat
          label="Асцендент"
          value={`${ZODIAC_SYMBOLS[ascSign]} ${ZODIAC_NAMES_UK[ascSign]}`}
          sub={`${(chart.ascendant % 30).toFixed(1)}°`}
        />
        <QuickStat
          label="MC"
          value={`${ZODIAC_SYMBOLS[mcSign]} ${ZODIAC_NAMES_UK[mcSign]}`}
          sub={`${(chart.midheaven % 30).toFixed(1)}°`}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 rounded-2xl p-1 mb-6 overflow-x-auto border border-white/10 no-scrollbar">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 min-w-[56px] py-2.5 px-1 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex flex-col items-center gap-1 touch-manipulation select-none ${
              tab === t.id
                ? 'bg-zorya-purple/20 text-zorya-violet border border-zorya-purple/30'
                : 'text-text-muted hover:text-text-primary hover:bg-white/5 active:bg-white/10'
            }`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <t.Icon size={18} strokeWidth={1.75} />
            <span className="text-[10px] sm:text-[11px]">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {tab === 'overview' && (
            <div className="space-y-4">
              <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-text-muted mb-3">Планети у знаках</h3>
                <div className="grid grid-cols-2 gap-2">
                  {chart.planets.slice(0, 10).map(p => (
                    <div key={p.name} className="flex items-center gap-2 text-sm">
                      <span className="text-zorya-violet">{ZODIAC_SYMBOLS[p.sign]}</span>
                      <span className="text-text-primary">{p.name === 'TrueNode' ? 'Пн.Вуз.' : p.name === 'SouthNode' ? 'Пд.Вуз.' : p.name}</span>
                      <span className="text-text-muted text-xs">{ZODIAC_NAMES_UK[p.sign]}</span>
                      {p.isRetrograde && <span className="text-orange-400 text-xs">℞</span>}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-text-primary mb-2 flex items-center gap-2">
                  <span className="text-zorya-violet">✦</span> AI Інтерпретація
                </h3>
                <p className="text-text-muted text-sm mb-4">
                  Оберіть сферу життя для персоналізованого аналізу
                </p>
                <AreaCards
                  selectedArea={selectedArea}
                  onSelect={generateReport}
                  generatedAreas={generatedAreas}
                />
              </div>
            </div>
          )}

          {tab === 'planets' && (
            <div className="glass-card p-4">
              <PlanetsTable chart={chart} />
            </div>
          )}

          {tab === 'houses' && (
            <div className="glass-card p-4">
              <HousesTable chart={chart} />
            </div>
          )}

          {tab === 'aspects' && (
            <div className="glass-card p-4">
              <h3 className="text-sm text-text-muted mb-3 px-1">
                {chart.aspects.length} аспектів
              </h3>
              <AspectsTable chart={chart} />
            </div>
          )}

          {tab === 'report' && (
            <div className="space-y-4">
              {!selectedArea && (
                <div>
                  <p className="text-text-muted text-sm mb-4">Оберіть сферу для аналізу:</p>
                  <AreaCards
                    selectedArea={selectedArea}
                    onSelect={generateReport}
                    generatedAreas={generatedAreas}
                  />
                </div>
              )}

              {loadingReport && (
                <div className="glass-card p-8 flex flex-col items-center gap-4">
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
                </div>
              )}

              {report && !loadingReport && <ReportView report={report} />}

              {selectedArea && !loadingReport && (
                <button
                  onClick={() => { setSelectedArea(null); setReport(null); }}
                  className="w-full py-3 text-sm text-text-muted hover:text-zorya-violet transition-colors"
                >
                  ← Обрати іншу сферу
                </button>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function QuickStat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="glass-card p-3 sm:p-4">
      <div className="text-[9px] sm:text-[10px] text-text-muted uppercase tracking-wider mb-1">{label}</div>
      <div className="text-xs sm:text-sm font-semibold text-text-primary leading-tight">{value}</div>
      <div className="text-[10px] sm:text-xs text-text-muted mt-0.5">{sub}</div>
    </div>
  );
}

function zodiacFromDegree(deg: number) {
  const signs = [
    'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
    'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces',
  ] as const;
  return signs[Math.floor((deg % 360) / 30)];
}
