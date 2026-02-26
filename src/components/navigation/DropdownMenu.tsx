'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { track } from '@/lib/analytics';
import { ANALYTICS_EVENTS } from '@/lib/analytics/events';
import ProductIcon from '@/components/icons/ProductIcon';

export interface DropdownItem {
  href: string;
  label: string;
  description?: string;
  icon?: string;
}

export interface DropdownGroup {
  title: string;
  items: DropdownItem[];
}

interface DropdownMenuProps {
  label: string;
  groups: DropdownGroup[];
  icon?: React.ReactNode;
}

export default function DropdownMenu({ label, groups, icon }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
    track(ANALYTICS_EVENTS.NAV_DROPDOWN_OPENED, { dropdown: label });
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 200);
  };

  const handleToggle = () => {
    setOpen(prev => !prev);
    if (!open) track(ANALYTICS_EVENTS.NAV_DROPDOWN_OPENED, { dropdown: label });
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={handleToggle}
        className="flex items-center gap-1.5 px-3.5 py-2 text-white/70 hover:text-white text-sm font-medium rounded-full transition-all hover:bg-white/[0.06]"
      >
        {icon}
        <span>{label}</span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-1 py-3 rounded-2xl min-w-[280px] z-50"
            style={{
              background: 'rgba(15,10,30,0.97)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}
          >
            {groups.map((group, gi) => (
              <div key={group.title}>
                {gi > 0 && <div className="my-2 mx-4 border-t border-white/[0.06]" />}
                <p className="px-4 py-1.5 text-[10px] uppercase tracking-widest text-white/30 font-medium">
                  {group.title}
                </p>
                {group.items.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      track(ANALYTICS_EVENTS.NAV_ITEM_CLICKED, {
                        item: item.label,
                        dropdown: label,
                      });
                      setOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-white/[0.05] transition-all group"
                  >
                    {item.icon && (
                      <span className="w-6 text-center flex-shrink-0">
                        <ProductIcon name={item.icon} size={18} className="text-zorya-violet/70" />
                      </span>
                    )}
                    <div>
                      <p className="text-sm text-white/80 group-hover:text-white font-medium transition-colors">
                        {item.label}
                      </p>
                      {item.description && (
                        <p className="text-xs text-white/35 mt-0.5">{item.description}</p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
