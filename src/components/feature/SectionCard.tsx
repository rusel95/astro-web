'use client';

import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Collapsible section card with glass styling.
 * Consistent wrapper for all feature page result sections.
 */

interface SectionCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  defaultCollapsed?: boolean;
  className?: string;
}

export default function SectionCard({ title, icon, children, defaultCollapsed = false, className = '' }: SectionCardProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  return (
    <div className={`rounded-2xl bg-white/[0.04] border border-white/[0.08] overflow-hidden ${className}`}>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          {icon && <span className="text-zorya-violet shrink-0">{icon}</span>}
          <h3 className="text-sm font-semibold text-white truncate">{title}</h3>
        </div>
        <ChevronDown
          size={16}
          className={`text-white/40 shrink-0 transition-transform duration-200 ${collapsed ? '' : 'rotate-180'}`}
        />
      </button>
      {!collapsed && (
        <div className="px-4 pb-4 pt-1">
          {children}
        </div>
      )}
    </div>
  );
}
