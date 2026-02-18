'use client';

import { motion } from 'framer-motion';
import { LucideIcon, User, Briefcase, Heart, Activity, TrendingUp, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';
import { ReportArea } from '@/types/astrology';
import { REPORT_AREAS } from '@/lib/constants';

const AREA_ICONS: Record<ReportArea, LucideIcon> = {
  general:       User,
  career:        Briefcase,
  relationships: Heart,
  health:        Activity,
  finances:      TrendingUp,
  spirituality:  Sparkles,
};

interface Props {
  selectedArea: ReportArea | null;
  onSelect: (area: ReportArea) => void;
  generatedAreas?: Set<ReportArea>;
}

export default function AreaCards({ selectedArea, onSelect, generatedAreas = new Set() }: Props) {
  return (
    <div className="space-y-3">
      {REPORT_AREAS.map((area, i) => {
        const isGenerated = generatedAreas.has(area.id);
        const isSelected = selectedArea === area.id;
        const Icon = AREA_ICONS[area.id];

        return (
          <motion.button
            key={area.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => onSelect(area.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all group backdrop-blur-sm
              ${isSelected
                ? 'bg-zorya-purple/15 border-zorya-purple/30 shadow-glow-sm'
                : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/8'
              }
            `}
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              isSelected ? 'bg-zorya-purple/20' : 'bg-white/5 group-hover:bg-white/10'
            }`}>
              <Icon
                size={20}
                strokeWidth={1.75}
                className={isSelected ? 'text-zorya-violet' : 'text-text-secondary group-hover:text-zorya-violet transition-colors'}
              />
            </div>
            <div className="flex-1 text-left">
              <div className={`font-semibold text-sm transition-colors ${
                isSelected ? 'text-zorya-violet' : 'text-text-primary group-hover:text-zorya-violet'
              }`}>
                {area.name}
              </div>
              <div className="text-xs text-text-muted mt-0.5">{area.description}</div>
            </div>
            <div className="shrink-0">
              {isGenerated ? (
                <CheckCircle2 size={18} strokeWidth={1.75} className="text-green-400" />
              ) : (
                <ChevronRight size={18} strokeWidth={1.75} className="text-text-muted group-hover:text-zorya-violet transition-colors" />
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
