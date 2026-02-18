'use client';

import { motion } from 'framer-motion';

interface Props {
  total: number;
  current: number;
}

export default function ProgressDots({ total, current }: Props) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          className={`rounded-full ${i <= current ? 'bg-zorya-purple' : 'bg-white/20'}`}
          animate={{
            width: i === current ? 24 : 8,
            height: 8,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        />
      ))}
    </div>
  );
}
