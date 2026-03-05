'use client';

interface CompatibilityScoreGaugeProps {
  score: number;
  description?: string;
  isDestinySign?: boolean;
  person1Name?: string;
  person2Name?: string;
}

export default function CompatibilityScoreGauge({
  score,
  description,
  isDestinySign,
  person1Name,
  person2Name,
}: CompatibilityScoreGaugeProps) {
  // Normalize score to 0-100 range
  const normalizedScore = Math.min(100, Math.max(0, Math.round(score)));

  // Color based on score
  const getScoreColor = (s: number) => {
    if (s >= 80) return { text: 'text-emerald-400', ring: 'stroke-emerald-400', bg: 'bg-emerald-400' };
    if (s >= 60) return { text: 'text-zorya-gold', ring: 'stroke-zorya-gold', bg: 'bg-zorya-gold' };
    if (s >= 40) return { text: 'text-orange-400', ring: 'stroke-orange-400', bg: 'bg-orange-400' };
    return { text: 'text-red-400', ring: 'stroke-red-400', bg: 'bg-red-400' };
  };

  const getScoreLabel = (s: number) => {
    if (s >= 80) return 'Відмінна';
    if (s >= 60) return 'Хороша';
    if (s >= 40) return 'Помірна';
    return 'Складна';
  };

  const colors = getScoreColor(normalizedScore);

  // SVG circle gauge
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div className="rounded-2xl bg-white/[0.05] border border-white/10 p-6">
      <div className="flex flex-col items-center gap-4">
        {/* Names */}
        {person1Name && person2Name && (
          <p className="text-white/50 text-sm">
            {person1Name} & {person2Name}
          </p>
        )}

        {/* Circular gauge */}
        <div className="relative w-36 h-36">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="8"
            />
            {/* Score arc */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              className={colors.ring}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 1s ease-out' }}
            />
          </svg>
          {/* Score number in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${colors.text}`}>
              {normalizedScore}
            </span>
            <span className="text-white/40 text-xs">/ 100</span>
          </div>
        </div>

        {/* Score label */}
        <div className="text-center space-y-1">
          <p className={`text-sm font-semibold ${colors.text}`}>
            {getScoreLabel(normalizedScore)} сумісність
          </p>
          {description && (
            <p className="text-white/60 text-xs leading-relaxed max-w-sm">
              {description}
            </p>
          )}
        </div>

        {/* Destiny sign badge */}
        {isDestinySign && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zorya-violet/15 border border-zorya-violet/25">
            <span className="text-zorya-violet text-xs font-medium">
              Знаки долі
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
