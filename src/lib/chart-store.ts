// Simple in-memory store for charts (replace with Supabase later)
import { StoredChart } from '@/types/astrology';

const charts = new Map<string, StoredChart>();

export function saveChart(chart: StoredChart): void {
  charts.set(chart.id, chart);
}

export function getChart(id: string): StoredChart | undefined {
  return charts.get(id);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}
