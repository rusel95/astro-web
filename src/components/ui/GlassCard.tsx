import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'premium' | 'accent' | 'subtle';
  hover?: boolean;
}

export default function GlassCard({
  children,
  className = '',
  variant = 'default',
  hover = true,
}: GlassCardProps) {
  const variants = {
    default: 'glass-card',
    premium: 'glass-card shadow-lg shadow-zorya-purple/20',
    accent: 'glass-card border-zorya-purple/30 bg-zorya-purple/5',
    subtle: 'glass-card border-white/10 backdrop-blur-sm',
  };

  const hoverClass = hover ? 'transition-all duration-300 hover:border-white/40 hover:shadow-lg' : '';

  return (
    <div className={`${variants[variant]} ${hoverClass} ${className}`}>
      {children}
    </div>
  );
}
