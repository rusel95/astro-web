'use client';

import { sanitizeSvg } from '@/lib/svg-sanitizer';

interface SvgChartViewerProps {
  svgContent: string | null | undefined;
  title?: string;
  className?: string;
}

export default function SvgChartViewer({
  svgContent,
  title,
  className = '',
}: SvgChartViewerProps) {
  if (!svgContent) {
    return (
      <div className={`rounded-2xl bg-white/[0.05] border border-white/10 p-8 ${className}`}>
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-48 h-48 rounded-full bg-white/[0.08]" />
          <div className="w-32 h-4 rounded bg-white/[0.08]" />
        </div>
      </div>
    );
  }

  // Sanitize SVG using DOMPurify (removes scripts, event handlers per FR-052)
  const sanitized = sanitizeSvg(svgContent);

  return (
    <div className={`rounded-2xl bg-cosmic-900/80 border border-white/10 overflow-hidden ${className}`}>
      {title && (
        <div className="px-4 py-2 border-b border-white/10">
          <h3 className="text-sm font-medium text-white/70">{title}</h3>
        </div>
      )}
      {/* Safe: content sanitized by DOMPurify with SVG profile */}
      <div
        className="w-full [&>svg]:w-full [&>svg]:h-auto [&>svg]:max-w-full"
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
    </div>
  );
}
