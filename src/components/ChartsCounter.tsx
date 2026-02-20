'use client';

import { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';

function formatCount(n: number): string {
  if (n >= 1000) {
    return n.toLocaleString('uk-UA');
  }
  return String(n);
}

export default function ChartsCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [displayed, setDisplayed] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(d => setCount(d.total))
      .catch(() => setCount(1000));
  }, []);

  // Animate count up when in view and data loaded
  useEffect(() => {
    if (!inView || count === null) return;
    const start = Math.max(0, count - 150);
    const duration = 1200;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(start + (count - start) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, count]);

  return (
    <div ref={ref} className="text-2xl md:text-3xl font-extrabold text-zorya-violet">
      {count === null ? (
        <span className="opacity-40">...</span>
      ) : (
        <>{formatCount(displayed)}+</>
      )}
    </div>
  );
}
