export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="quiz-theme min-h-screen">
      {/* Minimal header — logo only */}
      <header className="px-4 py-4 flex items-center justify-center">
        <a href="/" className="flex items-center gap-2.5 group">
          <img src="/logo-64.png" alt="Зоря" className="w-8 h-8 rounded-xl" />
          <span className="font-display text-xl font-semibold text-zorya-violet group-hover:text-[#6C3CE1] transition-colors">
            Зоря
          </span>
        </a>
      </header>

      <main>{children}</main>
    </div>
  );
}
