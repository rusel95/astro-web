'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';

const QUESTIONS = [
  { text: 'Що мене чекає цього року?', tag: '#прогноз2026' },
  { text: 'Коли зустріну кохання?', tag: '#кохання' },
  { text: 'Яка робота мені підходить?', tag: '#кар\'єра' },
  { text: 'Чому мені не щастить?', tag: '#доля' },
  { text: 'Чи сумісні ми з партнером?', tag: '#сумісність' },
  { text: 'Коли краще починати справи?', tag: '#місяць' },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1 },
};

export default function PainPointsSection() {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Знайомі питання?
          </h2>
          <p className="text-text-secondary text-lg">
            Зоря дає відповіді, які базуються на вашій унікальній натальній карті
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {QUESTIONS.map((q, i) => (
            <motion.div
              key={i}
              variants={item}
              className="glass-card p-5 flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-zorya-violet/15 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-zorya-violet text-sm">?</span>
              </div>
              <div>
                <p className="text-text-primary font-medium mb-1">{q.text}</p>
                <span className="text-xs text-zorya-violet/70">{q.tag}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-10">
          <Link
            href="/quiz"
            onClick={() => track(ANALYTICS_EVENTS.CTA_CLICKED, { location: 'pain_points' })}
            className="btn-primary"
          >
            Отримати відповіді
          </Link>
        </div>
      </div>
    </section>
  );
}
