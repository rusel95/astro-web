'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';

interface Stat {
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
}

const DEFAULT_STATS: Stat[] = [
  { label: 'Гороскопів створено', value: 100000, suffix: '+', prefix: '' },
  { label: 'Років астрологічних даних', value: 30, suffix: '+', prefix: '' },
  { label: 'Позитивних відгуків', value: 97, suffix: '%', prefix: '' },
  { label: 'Активних користувачів', value: 15000, suffix: '+', prefix: '' },
];

function AnimatedCounter({ value, suffix, prefix }: { value: number; suffix: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
    const steps = 40;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, value]);

  const formatted = count >= 1000
    ? `${Math.floor(count / 1000).toLocaleString('uk-UA')},${String(count % 1000).padStart(3, '0').slice(0, -2)}`
    : count.toLocaleString('uk-UA');

  return (
    <span ref={ref} className="text-3xl md:text-4xl font-bold text-text-primary">
      {prefix}{count >= 1000 ? count.toLocaleString('uk-UA') : formatted}{suffix}
    </span>
  );
}

export default function StatsSection() {
  const [stats, setStats] = useState(DEFAULT_STATS);

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((data) => {
        if (data.total_charts && data.total_charts > 0) {
          setStats((prev) =>
            prev.map((s) =>
              s.label === 'Гороскопів створено' ? { ...s, value: data.total_charts } : s
            )
          );
        }
      })
      .catch(() => {
        // Use defaults
      });
  }, []);

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-12">
          Зоря у цифрах
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <AnimatedCounter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              <p className="text-text-secondary text-sm mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <Link
          href="/quiz"
          onClick={() => track(ANALYTICS_EVENTS.CTA_CLICKED, { location: 'stats' })}
          className="btn-primary"
        >
          Приєднатися
        </Link>
      </div>
    </section>
  );
}
