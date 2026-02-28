'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';

const USP_BLOCKS = [
  { icon: '🎯', title: 'Індивідуальний', description: 'Створений саме для вас, на основі точних астрономічних даних' },
  { icon: '🧬', title: 'Персоналізований', description: 'Враховує вашу унікальну натальну карту та поточні транзити' },
  { icon: '📖', title: '30+ сторінок', description: 'Детальний аналіз кожної сфери вашого життя' },
  { icon: '📱', title: 'Зручно', description: 'Доступний на будь-якому пристрої, в будь-який час' },
];

export default function BookOfLifeSection() {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="section-badge mb-4 inline-flex">
              <span className="text-zorya-gold">✦</span> Книга Життя
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Ваш персональний гороскоп — це більше, ніж передбачення
            </h2>
            <div className="space-y-4">
              {USP_BLOCKS.map((usp, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <span className="text-2xl mt-0.5">{usp.icon}</span>
                  <div>
                    <h3 className="font-semibold text-text-primary">{usp.title}</h3>
                    <p className="text-sm text-text-secondary">{usp.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <Link
              href="/quiz"
              onClick={() => track(ANALYTICS_EVENTS.CTA_CLICKED, { location: 'book_of_life' })}
              className="btn-primary mt-8 inline-flex"
            >
              Створити мій гороскоп
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="glass-card p-8 text-center">
              <div className="text-6xl mb-4">📘</div>
              <h3 className="text-xl font-display font-bold text-text-primary mb-2">
                Гороскоп Особистості
              </h3>
              <p className="text-text-secondary text-sm mb-4">
                30+ сторінок глибокого аналізу
              </p>
              <div className="space-y-2 text-left text-sm">
                {['Особистість та характер', 'Кар\'єра та фінанси', 'Кохання та стосунки', 'Здоров\'я та енергія'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-text-secondary">
                    <span className="text-zorya-gold text-xs">✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
