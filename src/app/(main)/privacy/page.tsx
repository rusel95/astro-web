import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Політика конфіденційності — Зоря',
  description: 'Політика конфіденційності платформи Зоря',
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <div className="glass-card p-8 md:p-12">
        <h1 className="text-3xl font-display font-bold text-text-primary mb-6">
          Політика конфіденційності
        </h1>
        <div className="text-text-secondary space-y-4 text-sm leading-relaxed">
          <p>
            Ця сторінка знаходиться в розробці. Повний текст політики конфіденційності
            буде доступний найближчим часом.
          </p>
          <h2 className="text-lg font-display font-semibold text-text-primary pt-2">
            Які дані ми збираємо
          </h2>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>Дата, час та місце народження — для астрологічних розрахунків</li>
            <li>Ім&apos;я та email — для персоналізації та комунікації</li>
            <li>Анонімні дані аналітики — для покращення сервісу</li>
          </ul>
          <h2 className="text-lg font-display font-semibold text-text-primary pt-2">
            Як ми використовуємо дані
          </h2>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>Розрахунок натальних карт та астрологічних прогнозів</li>
            <li>Надсилання персоналізованих рекомендацій (за згодою)</li>
            <li>Покращення якості послуг</li>
          </ul>
          <h2 className="text-lg font-display font-semibold text-text-primary pt-2">
            Ваші права
          </h2>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>Ви можете запросити видалення ваших даних у будь-який час</li>
            <li>Ви можете відмовитися від розсилки у будь-який момент</li>
            <li>Ваші дані не передаються третім сторонам без вашої згоди</li>
          </ul>
          <p className="text-text-muted italic">
            Останнє оновлення: лютий 2026
          </p>
        </div>
      </div>
    </main>
  );
}
