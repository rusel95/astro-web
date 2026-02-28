'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

interface ChartRecord {
  id: string;
  name: string;
  birth_date: string;
  birth_time: string;
  city: string;
  country_code: string;
  latitude: number;
  longitude: number;
  gender: string | null;
  created_at: string;
}

interface UseAuthChartReturn {
  user: User | null;
  chart: ChartRecord | null;
  charts: ChartRecord[];
  isComplete: boolean;
  isLoading: boolean;
  pinChart: (chartId: string) => void;
}

function isChartComplete(chart: ChartRecord | null): boolean {
  if (!chart) return false;
  return !!(
    chart.name &&
    chart.birth_date &&
    chart.birth_time &&
    chart.birth_time !== '12:00' &&
    chart.city &&
    chart.latitude &&
    chart.longitude &&
    chart.gender
  );
}

export function useAuthChart(): UseAuthChartReturn {
  const [user, setUser] = useState<User | null>(null);
  const [charts, setCharts] = useState<ChartRecord[]>([]);
  const [primaryChartId, setPrimaryChartId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) {
        setIsLoading(false);
        return;
      }

      setUser(authUser);

      const { data: chartData } = await supabase
        .from('charts')
        .select('id, name, birth_date, birth_time, city, country_code, latitude, longitude, gender, created_at')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false });

      if (chartData) {
        setCharts(chartData as ChartRecord[]);
      }

      setIsLoading(false);
    }

    load();
  }, []);

  const chart = primaryChartId
    ? charts.find((c) => c.id === primaryChartId) || charts[0] || null
    : charts[0] || null;

  const pinChart = useCallback((chartId: string) => {
    setPrimaryChartId(chartId);
  }, []);

  return {
    user,
    chart,
    charts,
    isComplete: isChartComplete(chart),
    isLoading,
    pinChart,
  };
}
