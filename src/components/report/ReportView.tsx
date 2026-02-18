'use client';

import { motion } from 'framer-motion';
import { AIReport } from '@/types/astrology';

// Parse detailed_analysis into sections split by ## headers
function parseDetailedAnalysis(text: string): { heading: string | null; body: string }[] {
  if (!text) return [];

  const lines = text.split('\n');
  const sections: { heading: string | null; body: string }[] = [];
  let currentHeading: string | null = null;
  let currentBodyLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith('## ')) {
      // Save previous section
      if (currentBodyLines.some(l => l.trim())) {
        sections.push({ heading: currentHeading, body: currentBodyLines.join('\n').trim() });
      }
      currentHeading = line.replace(/^## /, '').trim();
      currentBodyLines = [];
    } else {
      currentBodyLines.push(line);
    }
  }

  // Save last section
  if (currentBodyLines.some(l => l.trim())) {
    sections.push({ heading: currentHeading, body: currentBodyLines.join('\n').trim() });
  }

  // Fallback: if no ## headers found, return entire text as one section
  if (sections.length === 0) {
    sections.push({ heading: null, body: text.trim() });
  }

  return sections;
}

export default function ReportView({ report }: { report: AIReport }) {
  const analysisSections = parseDetailedAnalysis(report.detailed_analysis);
  const hasSections = analysisSections.some(s => s.heading !== null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Summary */}
      <div className="glass-card p-6 border-l-4 border-zorya-purple">
        <div className="flex gap-3 items-start">
          <span className="text-zorya-violet text-xl mt-0.5">✦</span>
          <p className="text-text-primary font-medium leading-relaxed">{report.summary}</p>
        </div>
      </div>

      {/* Key influences */}
      <div className="glass-card p-6">
        <h3 className="flex items-center gap-2 text-lg font-bold text-text-primary mb-4">
          <span className="text-zorya-violet">✦</span> Ключові впливи
        </h3>
        <div className="space-y-3">
          {report.key_influences.map((inf, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex gap-3 p-3 rounded-xl bg-white/5 border border-white/5"
            >
              <span className="text-zorya-violet mt-0.5 shrink-0">✦</span>
              <span className="text-text-secondary text-sm leading-relaxed">{inf}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detailed analysis */}
      <div className="glass-card p-6">
        <h3 className="flex items-center gap-2 text-lg font-bold text-text-primary mb-5">
          📜 Детальний аналіз
        </h3>

        {hasSections ? (
          // Structured sections with ## headers
          <div className="space-y-5">
            {analysisSections.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={section.heading ? 'border-l-2 border-zorya-purple/30 pl-4' : ''}
              >
                {section.heading && (
                  <h4 className="text-sm font-semibold text-zorya-violet mb-2 uppercase tracking-wide">
                    {section.heading}
                  </h4>
                )}
                {section.body && (
                  <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                    {section.body}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          // Fallback: plain text
          <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
            {report.detailed_analysis}
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="glass-card p-6 bg-zorya-purple/5">
        <h3 className="flex items-center gap-2 text-lg font-bold text-text-primary mb-4">
          💡 Рекомендації
        </h3>
        <div className="space-y-3">
          {report.recommendations.map((rec, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="w-6 h-6 rounded-full bg-zorya-purple/20 text-zorya-violet flex items-center justify-center text-xs font-bold shrink-0">
                {i + 1}
              </span>
              <span className="text-text-secondary text-sm leading-relaxed">{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-text-muted italic px-2 py-3">
        ℹ️ Астрологічний звіт створено за допомогою AI на основі натальної карти. 
        Інтерпретації мають ознайомчий характер і не замінюють професійну консультацію.
      </p>
    </motion.div>
  );
}
