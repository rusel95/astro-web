'use client';

interface PartialErrorBannerProps {
  message?: string;
  onRetry?: () => void;
}

export default function PartialErrorBanner({
  message = 'Деякі дані не вдалося завантажити.',
  onRetry,
}: PartialErrorBannerProps) {
  return (
    <div className="rounded-xl bg-amber-500/[0.1] border border-amber-500/20 px-4 py-3 flex items-center justify-between gap-3">
      <p className="text-amber-300 text-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-amber-400 text-xs font-medium hover:text-amber-300 whitespace-nowrap min-h-[44px] px-2"
        >
          Спробувати
        </button>
      )}
    </div>
  );
}
