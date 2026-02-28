import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(to bottom, #0f0a1e, #1a0e35)' }}
    >
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">🌌</div>
        <h1 className="text-4xl font-display font-bold text-white mb-3">
          Сторінку не знайдено
        </h1>
        <p className="text-white/60 mb-8">
          Ця сторінка загубилась серед зірок. Спробуйте повернутись на головну.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, #6C3CE1 0%, #9966E6 100%)',
              boxShadow: '0 4px 24px rgba(108, 60, 225, 0.35)',
            }}
          >
            ✦ На головну
          </Link>
          <Link
            href="/quiz"
            className="px-6 py-3 rounded-xl font-semibold text-white/70 hover:text-white transition-all"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            Пройти тест
          </Link>
        </div>
      </div>
    </div>
  );
}
