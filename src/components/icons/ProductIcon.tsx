'use client';

import {
  Sparkles,
  Gem,
  Heart,
  CircleDot,
  HeartHandshake,
  CalendarHeart,
  Baby,
  Smile,
  Activity,
  Calendar,
  CalendarDays,
  Telescope,
  Coins,
  Briefcase,
  TrendingUp,
  CalendarRange,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  gem: Gem,
  heart: Heart,
  ring: CircleDot,
  'heart-handshake': HeartHandshake,
  'calendar-heart': CalendarHeart,
  baby: Baby,
  smile: Smile,
  activity: Activity,
  calendar: Calendar,
  'calendar-days': CalendarDays,
  telescope: Telescope,
  coins: Coins,
  briefcase: Briefcase,
  'trending-up': TrendingUp,
  'calendar-range': CalendarRange,
};

interface ProductIconProps {
  name: string;
  size?: number;
  className?: string;
}

export default function ProductIcon({ name, size = 20, className = '' }: ProductIconProps) {
  const IconComponent = ICON_MAP[name];
  if (!IconComponent) return <span className={className}>✦</span>;
  return <IconComponent size={size} className={className} />;
}
