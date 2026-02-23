#!/usr/bin/env tsx
/**
 * Generate Moon Calendar Data
 * Pre-calculates 30 days of moon data and stores in Supabase
 * Run: npx tsx scripts/generate-moon-calendar.ts
 */

import { createClient } from '@supabase/supabase-js';
import {
  getMoonPosition,
  getMoonPhase,
  getZodiacSign,
} from '../src/lib/moon/ephemeris';
import { calculateVoidPeriod } from '../src/lib/moon/void-calculator';

// Supabase config
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface MoonDayData {
  date: string;
  moon_sign: string;
  moon_longitude: number;
  moon_phase: string;
  moon_phase_angle: number;
  illumination_percent: number;
  void_of_course: any | null;
}

/**
 * Calculate moon data for a single day
 */
function calculateMoonDay(date: Date): MoonDayData {
  try {
    // Get Moon position at noon (stable time)
    const noonDate = new Date(date);
    noonDate.setUTCHours(12, 0, 0, 0);
    
    const moonPos = getMoonPosition(noonDate);
    const moonSign = getZodiacSign(moonPos.longitude);
    const phase = getMoonPhase(noonDate);
    
    // Calculate void period for the day (check from midnight)
    const dayStart = new Date(date);
    dayStart.setUTCHours(0, 0, 0, 0);
    const voidPeriod = calculateVoidPeriod(dayStart);
    
    // Format void period for storage
    let voidData = null;
    if (voidPeriod) {
      // Check if void period overlaps with this day
      const dayEnd = new Date(date);
      dayEnd.setUTCHours(23, 59, 59, 999);
      
      if (voidPeriod.start <= dayEnd && voidPeriod.end >= dayStart) {
        voidData = {
          start: voidPeriod.start.toISOString(),
          end: voidPeriod.end.toISOString(),
          lastAspect: {
            planet: voidPeriod.lastAspect.planet,
            type: voidPeriod.lastAspect.type,
            time: voidPeriod.lastAspect.time.toISOString(),
          },
          moonSign: voidPeriod.moonSign,
          nextSign: voidPeriod.nextSign,
          durationMinutes: voidPeriod.durationMinutes,
        };
      }
    }
    
    return {
      date: date.toISOString().split('T')[0],
      moon_sign: moonSign,
      moon_longitude: moonPos.longitude,
      moon_phase: phase.phase,
      moon_phase_angle: phase.angle,
      illumination_percent: phase.illumination,
      void_of_course: voidData,
    };
  } catch (error) {
    console.error(`Error calculating moon data for ${date}:`, error);
    throw error;
  }
}

/**
 * Generate calendar data for date range
 */
async function generateCalendar(startDate: Date, days: number = 30) {
  console.log(`Generating moon calendar for ${days} days from ${startDate.toDateString()}...`);
  
  const records: MoonDayData[] = [];
  
  for (let i = 0; i < days; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i);
    
    try {
      const dayData = calculateMoonDay(currentDate);
      records.push(dayData);
      
      const voidInfo = dayData.void_of_course 
        ? `VoC ${new Date(dayData.void_of_course.start).toLocaleTimeString()} - ${new Date(dayData.void_of_course.end).toLocaleTimeString()}`
        : 'No VoC';
      
      console.log(
        `${dayData.date}: ${dayData.moon_sign} ${dayData.moon_phase} (${dayData.illumination_percent.toFixed(0)}%) - ${voidInfo}`
      );
    } catch (error) {
      console.error(`Failed to process ${currentDate.toDateString()}:`, error);
    }
  }
  
  return records;
}

/**
 * Store calendar data in Supabase
 */
async function storeCalendar(records: MoonDayData[]) {
  console.log(`\nStoring ${records.length} records in Supabase...`);
  
  // Upsert in batches of 10
  const batchSize = 10;
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    
    const { error } = await supabase
      .from('moon_calendar')
      .upsert(batch, {
        onConflict: 'date',
        ignoreDuplicates: false,
      });
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    console.log(`Stored batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(records.length / batchSize)}`);
  }
  
  console.log('✅ Calendar data stored successfully!');
}

/**
 * Main function
 */
async function main() {
  try {
    // Start from today
    const startDate = new Date();
    startDate.setUTCHours(0, 0, 0, 0);
    
    // Generate 30 days
    const days = parseInt(process.argv[2] || '30');
    const records = await generateCalendar(startDate, days);
    
    // Store in Supabase
    await storeCalendar(records);
    
    console.log('\n✨ Moon calendar generation complete!');
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}
