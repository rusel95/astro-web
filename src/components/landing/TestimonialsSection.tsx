'use client';

import { motion } from 'framer-motion';

const TESTIMONIALS = [
  {
    name: 'Олена К.',
    text: 'Гороскоп виявився дуже точним! Описав мій характер так, ніби мене знає особисто. Рекомендую всім, хто хоче краще зрозуміти себе.',
    rating: 5,
  },
  {
    name: 'Андрій М.',
    text: 'Замовив прогноз на рік — вже кілька передбачень здійснились. Дуже якісний та детальний аналіз, вражає глибина.',
    rating: 5,
  },
  {
    name: 'Марія С.',
    text: 'Сумісність з чоловіком перевірили — все підтвердилось! Тепер розуміємо одне одного краще. Дякую Зоря!',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Що кажуть наші користувачі
          </h2>
          <p className="text-text-secondary text-lg">
            Реальні відгуки від людей, які вже отримали свій гороскоп
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card p-6"
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }, (_, j) => (
                  <span key={j} className="text-zorya-gold text-sm">★</span>
                ))}
              </div>
              <p className="text-text-secondary text-sm leading-relaxed mb-4">
                &ldquo;{t.text}&rdquo;
              </p>
              <p className="text-text-primary font-medium text-sm">{t.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
