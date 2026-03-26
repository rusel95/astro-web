'use client';

/**
 * Renders AI-generated feature reports with polished visual design.
 * Matches the style of ReportView (summary card, sections, recommendations)
 * but for feature-specific AI reports (directions, progressions, etc.).
 */

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AIReport {
  title: string;
  summary: string;
  sections: Array<{
    heading: string;
    text: string;
    rating?: number;
  }>;
  recommendations: string[];
}

interface AIReportCardProps {
  report: AIReport;
  className?: string;
}

function RatingBadge({ rating }: { rating: number }) {
  const color = rating >= 7 ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
    : rating >= 4 ? 'text-zorya-gold bg-zorya-gold/10 border-zorya-gold/20'
    : 'text-orange-400 bg-orange-400/10 border-orange-400/20';

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${color}`}>
      {rating}/10
    </span>
  );
}

function ExpandableSection({ heading, text, rating }: { heading: string; text: string; rating?: number }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="border-l-2 border-zorya-violet/20 pl-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between gap-2 text-left group"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-zorya-violet text-xs">✦</span>
          <h4 className="text-sm font-semibold text-white group-hover:text-zorya-violet transition-colors">
            {heading}
          </h4>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {rating != null && <RatingBadge rating={rating} />}
          <ChevronDown
            size={14}
            className={`text-white/30 transition-transform ${expanded ? 'rotate-180' : ''}`}
          />
        </div>
      </button>
      {expanded && (
        <p className="text-sm text-white/70 leading-relaxed mt-2 whitespace-pre-line">
          {text}
        </p>
      )}
    </div>
  );
}

export default function AIReportCard({ report, className = '' }: AIReportCardProps) {
  if (!report?.summary) return null;

  // Guard against malformed AI responses where sections/recommendations aren't arrays
  const sections = Array.isArray(report.sections) ? report.sections : [];
  const recommendations = Array.isArray(report.recommendations) ? report.recommendations : [];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Summary card */}
      <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] overflow-hidden">
        <div className="h-[3px] bg-gradient-to-r from-zorya-violet via-zorya-blue to-zorya-gold/50" />
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-zorya-gold text-sm">✦</span>
            <span className="text-xs font-medium text-zorya-gold/70 uppercase tracking-widest">
              AI-аналіз
            </span>
          </div>
          <h3 className="text-base font-semibold text-white mb-2">{report.title}</h3>
          <p className="text-sm text-white/80 leading-relaxed">{report.summary}</p>
        </div>
      </div>

      {/* Sections */}
      {sections.length > 0 && (
        <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-5 space-y-4">
          {sections.map((section, i) => (
            <ExpandableSection
              key={i}
              heading={section.heading}
              text={section.text}
              rating={section.rating}
            />
          ))}
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="rounded-2xl bg-zorya-purple/[0.04] border border-zorya-purple/10 p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-zorya-violet text-sm">✦</span>
            <h4 className="text-sm font-semibold text-white">Рекомендації</h4>
          </div>
          <div className="space-y-2">
            {recommendations.map((rec, i) => (
              <div key={i} className="flex gap-3 py-1.5 px-2 rounded-lg bg-white/[0.03]">
                <span className="w-5 h-5 rounded-full bg-zorya-purple/20 text-zorya-violet flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-white/70 leading-relaxed">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
