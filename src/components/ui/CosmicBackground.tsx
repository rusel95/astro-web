'use client';

import { motion } from 'framer-motion';

interface CosmicBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'intense' | 'calm';
}

export default function CosmicBackground({ 
  children, 
  className = '',
  variant = 'default'
}: CosmicBackgroundProps) {
  const orbs = variant === 'intense' 
    ? [
        { delay: 0, x: '10%', y: '15%', size: 'w-96 h-96', color: 'bg-zorya-purple/15' },
        { delay: 1, x: '75%', y: '60%', size: 'w-80 h-80', color: 'bg-zorya-violet/12' },
        { delay: 2, x: '20%', y: '70%', size: 'w-72 h-72', color: 'bg-zorya-blue/10' },
      ]
    : [
        { delay: 0, x: '10%', y: '10%', size: 'w-64 h-64', color: 'bg-zorya-purple/10' },
        { delay: 1, x: '80%', y: '70%', size: 'w-80 h-80', color: 'bg-zorya-violet/8' },
        { delay: 2, x: '30%', y: '50%', size: 'w-48 h-48', color: 'bg-zorya-blue/10' },
      ];

  return (
    <div className={`relative min-h-screen overflow-hidden bg-cosmic-900 ${className}`}>
      {/* Fixed stars */}
      <div className="stars-bg absolute inset-0 opacity-50" />

      {/* Animated floating orbs */}
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className={`absolute ${orb.size} rounded-full ${orb.color} blur-[80px]`}
          animate={{ 
            x: [0, 40, 0], 
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 12 + i * 2, 
            repeat: Infinity, 
            ease: 'easeInOut',
            delay: orb.delay
          }}
          style={{ 
            top: orb.y, 
            left: orb.x
          }}
        />
      ))}

      {/* Subtle animated grid overlay (optional) */}
      <motion.div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(102, 77, 204, 0.5) 25%, rgba(102, 77, 204, 0.5) 26%, transparent 27%, transparent 74%, rgba(102, 77, 204, 0.5) 75%, rgba(102, 77, 204, 0.5) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(102, 77, 204, 0.5) 25%, rgba(102, 77, 204, 0.5) 26%, transparent 27%, transparent 74%, rgba(102, 77, 204, 0.5) 75%, rgba(102, 77, 204, 0.5) 76%, transparent 77%, transparent)',
          backgroundSize: '50px 50px',
        }}
        animate={{ 
          backgroundPosition: ['0px 0px', '50px 50px'],
          opacity: [0.01, 0.02, 0.01]
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: 'linear' 
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
