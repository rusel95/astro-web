'use client';

/**
 * Renders structured report text (from SDK analysis/report endpoints).
 * Handles: plain text, markdown-like headings (## Heading), paragraphs (\n\n),
 * bullet lists (* item / - item), and interpretation arrays.
 */

interface ReportRendererProps {
  content: unknown;
  className?: string;
}

export default function ReportRenderer({ content, className = '' }: ReportRendererProps) {
  if (!content) return null;

  // String content — render as formatted paragraphs
  if (typeof content === 'string') {
    return <FormattedText text={content} className={className} />;
  }

  // Array of strings or objects with text/interpretation fields
  if (Array.isArray(content)) {
    return (
      <div className={`space-y-3 ${className}`}>
        {content.map((item, i) => (
          <ReportItem key={i} item={item} />
        ))}
      </div>
    );
  }

  // Object with named sections
  if (typeof content === 'object') {
    const obj = content as Record<string, unknown>;
    const entries = Object.entries(obj).filter(([, v]) => v != null && v !== '');
    if (entries.length === 0) return null;

    return (
      <div className={`space-y-4 ${className}`}>
        {entries.map(([key, value]) => (
          <ReportSection key={key} sectionKey={key} value={value} />
        ))}
      </div>
    );
  }

  return null;
}

function FormattedText({ text, className = '' }: { text: string; className?: string }) {
  // Split by double newlines into paragraphs
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim());

  return (
    <div className={`space-y-3 ${className}`}>
      {paragraphs.map((para, i) => {
        const trimmed = para.trim();

        // Heading: ## Title
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={i} className="text-base font-semibold text-white mt-4 first:mt-0">
              {trimmed.slice(3)}
            </h3>
          );
        }

        // Heading: # Title
        if (trimmed.startsWith('# ')) {
          return (
            <h2 key={i} className="text-lg font-bold text-white mt-4 first:mt-0">
              {trimmed.slice(2)}
            </h2>
          );
        }

        // Bullet list
        const lines = trimmed.split('\n');
        const isList = lines.every(l => /^[\-\*•]\s/.test(l.trim()));
        if (isList) {
          return (
            <ul key={i} className="space-y-1.5 ml-1">
              {lines.map((line, j) => (
                <li key={j} className="flex gap-2 text-sm text-white/80">
                  <span className="text-zorya-violet shrink-0 mt-0.5">•</span>
                  <span>{line.replace(/^[\-\*•]\s*/, '')}</span>
                </li>
              ))}
            </ul>
          );
        }

        // Regular paragraph
        return (
          <p key={i} className="text-sm text-white/80 leading-relaxed">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

function ReportItem({ item }: { item: unknown }) {
  if (typeof item === 'string') {
    return <FormattedText text={item} />;
  }

  if (typeof item === 'object' && item !== null) {
    const obj = item as Record<string, unknown>;
    // Common SDK patterns: { planet, interpretation }, { aspect, description }, { title, text }
    const title = (obj.title || obj.planet || obj.aspect || obj.name || obj.area || obj.category) as string | undefined;
    const text = (obj.interpretation || obj.description || obj.text || obj.prediction || obj.meaning || obj.content || obj.summary) as string | undefined;
    const rating = obj.rating as number | undefined;
    const score = obj.score as number | undefined;

    if (!title && !text) {
      // Fallback: render all string values
      const strings = Object.values(obj).filter(v => typeof v === 'string') as string[];
      if (strings.length === 0) return null;
      return <FormattedText text={strings.join('\n\n')} />;
    }

    return (
      <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-3">
        {title && (
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium text-white">{String(title)}</span>
            {(rating != null || score != null) && (
              <span className="text-xs text-zorya-gold font-medium">
                {rating ?? score}/10
              </span>
            )}
          </div>
        )}
        {text && <p className="text-sm text-white/70 leading-relaxed">{String(text)}</p>}
      </div>
    );
  }

  return null;
}

function ReportSection({ sectionKey, value }: { sectionKey: string; value: unknown }) {
  // Skip internal/meta keys
  if (['subject', 'subject_data', 'chart_data', 'progressed_data', 'options', 'id', 'created_at'].includes(sectionKey)) {
    return null;
  }

  // String value — show as paragraph
  if (typeof value === 'string') {
    return <FormattedText text={value} />;
  }

  // Number — skip rendering standalone numbers (usually IDs/scores handled elsewhere)
  if (typeof value === 'number' || typeof value === 'boolean') {
    return null;
  }

  // Array — render as list of items
  if (Array.isArray(value)) {
    if (value.length === 0) return null;
    return (
      <div className="space-y-2">
        {value.map((item, i) => (
          <ReportItem key={i} item={item} />
        ))}
      </div>
    );
  }

  // Nested object — recurse
  if (typeof value === 'object' && value !== null) {
    return <ReportRenderer content={value} />;
  }

  return null;
}
