'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';

export default function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 px-4 overflow-hidden">
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-badge mb-6 inline-flex">
            <span className="text-zorya-gold">✦</span> Персональна астрологія
          </span>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6">
            Ваші персональні{' '}
            <span className="text-shimmer">гороскопи та прогнози</span>
          </h1>

          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            Дізнайтесь, що зірки підготували саме для вас.
            Персоналізовані гороскопи на основі вашої натальної карти.
          </p>

          <Link
            href="/quiz"
            onClick={() => track(ANALYTICS_EVENTS.CTA_CLICKED, { location: 'hero' })}
            className="btn-primary text-lg px-10"
          >
            Дізнатися свій гороскоп
          </Link>

          <p className="mt-4 text-sm text-text-muted">
            Безкоштовний міні-гороскоп за 2 хвилини
          </p>
        </motion.div>
      </div>

      {/* Decorative orbs */}
      <div className="orb orb-purple w-72 h-72 -top-20 -right-20 opacity-40" />
      <div className="orb orb-violet w-96 h-96 -bottom-40 -left-40 opacity-30" />
    </section>
  );
}
