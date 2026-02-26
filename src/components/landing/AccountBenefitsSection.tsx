'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';

const BENEFITS = [
  'Щоденний персональний гороскоп',
  'Зберігання натальних карт (до 5 профілів)',
  'Рекомендації продуктів за вашим знаком',
  'Ексклюзивні астрологічні оновлення',
  'Безкоштовний міні-гороскоп при реєстрації',
];

export default function AccountBenefitsSection() {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-zorya-violet/20 flex items-center justify-center">
                <span className="text-zorya-violet font-bold text-sm">OK</span>
              </div>
              <div>
                <p className="text-text-primary font-medium text-sm">Мій дашборд</p>
                <p className="text-text-muted text-xs">Щоденний огляд</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Кохання', value: 78, color: 'bg-pink-500' },
                { label: 'Кар\'єра', value: 85, color: 'bg-blue-500' },
                { label: 'Здоров\'я', value: 92, color: 'bg-green-500' },
              ].map((bar, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-secondary">{bar.label}</span>
                    <span className="text-text-primary font-medium">{bar.value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.07]">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${bar.value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.3 + i * 0.15 }}
                      className={`h-full rounded-full ${bar.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Benefits list */}
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Безкоштовний акаунт
            </h2>
            <p className="text-text-secondary mb-8">
              Створіть акаунт та отримайте доступ до персональних астрологічних інструментів
            </p>
            <ul className="space-y-3 mb-8">
              {BENEFITS.map((benefit, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-zorya-gold text-sm">✓</span>
                  <span className="text-text-secondary">{benefit}</span>
                </motion.li>
              ))}
            </ul>
            <Link
              href="/auth/login"
              onClick={() => track(ANALYTICS_EVENTS.CTA_CLICKED, { location: 'account_benefits' })}
              className="btn-primary"
            >
              Створити акаунт
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
