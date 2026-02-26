'use client';

import { motion } from 'framer-motion';

interface ProductPageProps {
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  bullets: { title: string; desc: string }[];
  steps: string[];
  ctaText?: string;
  ctaHref?: string;
}

export default function ProductPage({ icon, title, subtitle, description, bullets, steps, ctaText = '✦ Розрахувати зараз', ctaHref = '/chart/new' }: ProductPageProps) {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-16 md:py-24 px-4 overflow-hidden">
        <motion.div className="absolute w-[500px] h-[500px] rounded-full bg-zorya-purple/10 blur-[120px]" style={{ top: '-10%', right: '-15%' }} />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-6xl mb-6">{icon}</motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-zorya-gold via-zorya-violet to-zorya-blue bg-clip-text text-transparent">{title}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg md:text-xl text-white/60 mb-4">{subtitle}</motion.p>
          <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-white/40 max-w-2xl mx-auto mb-8">{description}</motion.p>
          <motion.a
            href={ctaHref}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="btn-zorya px-10 text-lg"
          >
            {ctaText}
          </motion.a>
        </div>
      </section>

      {/* What you'll learn */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-center mb-10"
          >
            Що ви <span className="text-zorya-gold">дізнаєтесь</span>
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-4">
            {bullets.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-5 flex gap-4"
              >
                <span className="text-zorya-gold text-lg mt-0.5 shrink-0">✦</span>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-1">{b.title}</h3>
                  <p className="text-white/50 text-sm">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-center mb-10"
          >
            Як це <span className="text-zorya-gold">працює</span>
          </motion.h2>
          <div className="space-y-4">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-5 flex items-center gap-5"
              >
                <div className="w-10 h-10 rounded-full bg-zorya-purple/30 border border-zorya-purple/40 flex items-center justify-center text-zorya-gold font-bold shrink-0">
                  {i + 1}
                </div>
                <p className="text-white/80 text-sm">{s}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Готові <span className="text-zorya-gold">дізнатися?</span>
            </h2>
            <p className="text-white/50 mb-8">Розрахунок займає менше 2 хвилин</p>
            <a href={ctaHref} className="btn-zorya px-12 text-lg">{ctaText}</a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
