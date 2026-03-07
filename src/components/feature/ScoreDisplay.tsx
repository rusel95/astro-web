'use client';

/**
 * Visual score/rating display with progress ring or bar.
 * Used for: compatibility scores, wellness scores, overall ratings.
 */

interface ScoreDisplayProps {
  score: number;
  maxScore?: number;
  label: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ScoreDisplay({
  score,
  maxScore = 10,
  label,
  description,
  size = 'md',
  className = '',
}: ScoreDisplayProps) {
  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));

  // Color based on score
  const getColor = () => {
    if (percentage >= 70) return { ring: 'text-emerald-400', bg: 'bg-emerald-400/20' };
    if (percentage >= 40) return { ring: 'text-zorya-gold', bg: 'bg-zorya-gold/20' };
    return { ring: 'text-orange-400', bg: 'bg-orange-400/20' };
  };

  const colors = getColor();
  const ringSize = size === 'sm' ? 48 : size === 'lg' ? 80 : 64;
  const strokeWidth = size === 'sm' ? 3 : size === 'lg' ? 5 : 4;
  const radius = (ringSize - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`flex items-center gap-3 rounded-xl bg-white/[0.04] border border-white/[0.06] p-3 ${className}`}>
      <div className="relative shrink-0" style={{ width: ringSize, height: ringSize }}>
        <svg width={ringSize} height={ringSize} className="-rotate-90">
          {/* Background ring */}
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-white/[0.08]"
          />
          {/* Score ring */}
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`${colors.ring} transition-all duration-500`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold text-white ${size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-lg' : 'text-sm'}`}>
            {typeof score === 'number' && !Number.isInteger(score) ? score.toFixed(1) : score}
          </span>
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white truncate">{label}</p>
        {description && (
          <p className="text-xs text-white/50 mt-0.5 line-clamp-2">{description}</p>
        )}
      </div>
    </div>
  );
}

/** Multiple scores in a row */
export function ScoreRow({ scores, className = '' }: { scores: Array<{ score: number; maxScore?: number; label: string; description?: string }>; className?: string }) {
  if (!scores || scores.length === 0) return null;

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 ${className}`}>
      {scores.map((s, i) => (
        <ScoreDisplay key={i} {...s} size="sm" />
      ))}
    </div>
  );
}
