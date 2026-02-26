'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';

const TRUST_POINTS = [
  {
    icon: '🛰',
    title: 'Дані NASA',
    description: 'Точні ефемериди на основі даних NASA для розрахунку положення планет',
  },
  {
    icon: '⚙️',
    title: 'Професійне ПЗ',
    description: 'Астрологічні алгоритми, перевірені тисячами професійних астрологів',
  },
  {
    icon: '🔮',
    title: 'Експертна команда',
    description: 'Інтерпретації створені кваліфікованими астрологами з 10+ років досвіду',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="section-badge mb-4 inline-flex">
            <span className="text-zorya-gold">✦</span> Наука + Астрологія
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Як ми знаємо відповіді?
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Поєднання точних астрономічних даних з глибокою астрологічною традицією
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {TRUST_POINTS.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card p-6 text-center"
            >
              <div className="text-4xl mb-4">{point.icon}</div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {point.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {point.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/quiz"
            onClick={() => track(ANALYTICS_EVENTS.CTA_CLICKED, { location: 'how_it_works' })}
            className="btn-primary"
          >
            Спробувати безкоштовно
          </Link>
        </div>
      </div>
    </section>
  );
}
