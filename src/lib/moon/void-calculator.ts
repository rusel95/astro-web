/**
 * Void of Course Moon Calculator
 * Implements Susan Miller Moonlight algorithm
 */

import {
  getMoonPosition,
  findUpcomingAspects,
  findNextMoonIngress,
  getZodiacSign,
  type Aspect,
} from './ephemeris';

export interface VoidPeriod {
  start: Date;
  end: Date;
  lastAspect: {
    planet: string;
    type: string;
    time: Date;
  };
  moonSign: string;
  nextSign: string;
  durationMinutes: number;
}

/**
 * Calculate Void of Course period for a given date
 * 
 * Algorithm:
 * 1. Find next Moon sign ingress
 * 2. Find all major aspects between now and ingress
 * 3. Last aspect before ingress = start of VoC
 * 4. Ingress time = end of VoC
 */
export function calculateVoidPeriod(date: Date): VoidPeriod | null {
  try {
    // Get Moon position and sign
    const moonPos = getMoonPosition(date);
    const moonSign = getZodiacSign(moonPos.longitude);
    
    // Find next sign ingress
    const ingress = findNextMoonIngress(date);
    
    // Find all aspects between now and ingress
    const aspects = findUpcomingAspects(date, ingress.time);
    
    if (aspects.length === 0) {
      // Moon is already void (no aspects until ingress)
      return {
        start: date,
        end: ingress.time,
        lastAspect: {
          planet: 'None',
          type: 'void_start',
          time: date,
        },
        moonSign: ingress.fromSign,
        nextSign: ingress.toSign,
        durationMinutes: Math.round((ingress.time.getTime() - date.getTime()) / 60000),
      };
    }
    
    // Get last aspect before ingress
    const lastAspect = aspects[aspects.length - 1];
    
    // VoC period = time between last aspect and ingress
    const durationMinutes = Math.round(
      (ingress.time.getTime() - lastAspect.exactTime.getTime()) / 60000
    );
    
    // Only return if duration > 5 minutes (ignore very short periods)
    if (durationMinutes < 5) {
      return null;
    }
    
    return {
      start: lastAspect.exactTime,
      end: ingress.time,
      lastAspect: {
        planet: lastAspect.planet,
        type: lastAspect.type,
        time: lastAspect.exactTime,
      },
      moonSign: ingress.fromSign,
      nextSign: ingress.toSign,
      durationMinutes,
    };
  } catch (error) {
    console.error('Error calculating void period:', error);
    return null;
  }
}

/**
 * Check if Moon is currently void of course
 */
export function isCurrentlyVoid(date: Date = new Date()): boolean {
  const voidPeriod = calculateVoidPeriod(date);
  
  if (!voidPeriod) return false;
  
  return date >= voidPeriod.start && date <= voidPeriod.end;
}

/**
 * Find all void periods within a date range
 */
export function findVoidPeriods(startDate: Date, endDate: Date): VoidPeriod[] {
  const voidPeriods: VoidPeriod[] = [];
  let currentDate = new Date(startDate);
  
  // Step through date range, checking every Moon ingress
  while (currentDate < endDate) {
    const voidPeriod = calculateVoidPeriod(currentDate);
    
    if (voidPeriod && voidPeriod.end <= endDate) {
      voidPeriods.push(voidPeriod);
    }
    
    // Move to next Moon sign change
    const ingress = findNextMoonIngress(currentDate);
    currentDate = new Date(ingress.time.getTime() + 60000); // +1 minute after ingress
  }
  
  return voidPeriods;
}

/**
 * Get next void period from given date
 */
export function getNextVoidPeriod(date: Date = new Date()): VoidPeriod | null {
  const voidPeriod = calculateVoidPeriod(date);
  
  if (!voidPeriod) {
    // No void in current sign, check next sign
    const ingress = findNextMoonIngress(date);
    const nextDate = new Date(ingress.time.getTime() + 60000);
    return calculateVoidPeriod(nextDate);
  }
  
  // If current time is before void starts, return it
  if (date < voidPeriod.start) {
    return voidPeriod;
  }
  
  // If we're currently in void, find next one
  if (date >= voidPeriod.start && date <= voidPeriod.end) {
    const nextDate = new Date(voidPeriod.end.getTime() + 60000);
    return calculateVoidPeriod(nextDate);
  }
  
  return voidPeriod;
}

/**
 * Format void period for display
 */
export function formatVoidPeriod(voidPeriod: VoidPeriod): {
  summary: string;
  details: string;
  warning: string;
} {
  const startTime = voidPeriod.start.toLocaleTimeString('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Kiev',
  });
  
  const endTime = voidPeriod.end.toLocaleTimeString('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Kiev',
  });
  
  const hours = Math.floor(voidPeriod.durationMinutes / 60);
  const minutes = voidPeriod.durationMinutes % 60;
  const duration = hours > 0 
    ? `${hours}г ${minutes}хв`
    : `${minutes}хв`;
  
  return {
    summary: `Void of Course: ${startTime} - ${endTime}`,
    details: `Місяць у ${voidPeriod.moonSign} → ${voidPeriod.nextSign} (${duration})`,
    warning: `Уникайте важливих рішень та підписання договорів до ${endTime}`,
  };
}
