'use client';

import { motion } from 'framer-motion';

interface ProductValuePropsProps {
  valueProps: string[];
  icon: string;
}

export default function ProductValueProps({ valueProps, icon }: ProductValuePropsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {valueProps.map((prop, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + i * 0.1 }}
          className="glass-card p-5 flex items-start gap-3"
        >
          <span className="text-xl shrink-0">{icon}</span>
          <p className="text-text-secondary text-sm leading-relaxed">{prop}</p>
        </motion.div>
      ))}
    </div>
  );
}
