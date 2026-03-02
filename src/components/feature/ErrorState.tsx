'use client';

type ErrorType = 'network' | 'timeout' | 'validation' | 'api';

interface ErrorStateProps {
  type?: ErrorType;
  message?: string;
  onRetry?: () => void;
}

const ERROR_CONFIG: Record<ErrorType, { headline: string; description: string; suggestion: string }> = {
  network: {
    headline: 'Помилка з\'єднання',
    description: 'Не вдалося з\'єднатися з сервером.',
    suggestion: 'Перевірте з\'єднання з інтернетом та спробуйте ще раз.',
  },
  timeout: {
    headline: 'Запит зайняв занадто довго',
    description: 'Сервер не відповів вчасно.',
    suggestion: 'Спробуйте ще раз через кілька хвилин.',
  },
  validation: {
    headline: 'Помилка введених даних',
    description: 'Будь ласка, перевірте правильність введених даних.',
    suggestion: 'Виправте помилки у формі та спробуйте ще раз.',
  },
  api: {
    headline: 'Сервіс тимчасово недоступний',
    description: 'Виникла помилка при обробці запиту.',
    suggestion: 'Спробуйте ще раз пізніше або зверніться до підтримки.',
  },
};

export default function ErrorState({
  type = 'api',
  message,
  onRetry,
}: ErrorStateProps) {
  const config = ERROR_CONFIG[type];

  return (
    <div className="rounded-2xl bg-red-500/[0.08] border border-red-500/20 p-6 text-center">
      <h3 className="text-lg font-semibold text-red-400 mb-2">{config.headline}</h3>
      <p className="text-white/70 text-sm mb-1">
        {message || config.description}
      </p>
      <p className="text-white/50 text-xs mb-4">{config.suggestion}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 rounded-xl bg-white/[0.1] border border-white/20 text-white text-sm hover:bg-white/[0.15] transition-colors min-h-[44px]"
        >
          Спробувати ще раз
        </button>
      )}
    </div>
  );
}
