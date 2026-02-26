import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Користувацька угода — Зоря',
  description: 'Умови використання платформи Зоря',
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <div className="glass-card p-8 md:p-12">
        <h1 className="text-3xl font-display font-bold text-text-primary mb-6">
          Користувацька угода
        </h1>
        <div className="text-text-secondary space-y-4 text-sm leading-relaxed">
          <p>
            Ця сторінка знаходиться в розробці. Повний текст користувацької угоди
            буде доступний найближчим часом.
          </p>
          <p>
            Використовуючи платформу Зоря, ви погоджуєтесь з тим, що:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>Астрологічні тлумачення мають розважальний характер і не є професійною порадою</li>
            <li>Ваші персональні дані обробляються відповідно до нашої Політики конфіденційності</li>
            <li>Ви несете відповідальність за достовірність наданих даних</li>
            <li>Ми залишаємо за собою право змінювати умови використання</li>
          </ul>
          <p className="text-text-muted italic">
            Останнє оновлення: лютий 2026
          </p>
        </div>
      </div>
    </main>
  );
}
