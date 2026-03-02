'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import BirthDataForm from './BirthDataForm';
import ChartSelector from './ChartSelector';
import AnalysisSection from './AnalysisSection';
import ErrorState from './ErrorState';
import PartialErrorBanner from './PartialErrorBanner';
import BirthTimeWarning from './BirthTimeWarning';
import { apiPost } from '@/lib/api-client';
import { useAuthChart } from '@/hooks/useAuthChart';
import type { ChartInput } from '@/types/astrology';
import type { BirthDataFormVariant } from '@/types/features';
import { posthog } from '@/lib/posthog';

interface FeaturePageLayoutProps {
  title: string;
  description: string;
  apiEndpoint: string;
  formVariant?: BirthDataFormVariant;
  dualInput?: boolean;
  children?: (data: Record<string, unknown>) => ReactNode;
}

export default function FeaturePageLayout({
  title,
  description,
  apiEndpoint,
  formVariant = 'basic',
  dualInput = false,
  children,
}: FeaturePageLayoutProps) {
  const { user, chart, isComplete, isLoading: authLoading } = useAuthChart();
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [partialError, setPartialError] = useState<string | null>(null);
  const [birthTimeUnknown, setBirthTimeUnknown] = useState(false);
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  // Track last submitted body so retry sends the original request, not the API response
  const lastBodyRef = useRef<Record<string, unknown> | null>(null);

  useEffect(() => {
    posthog?.capture('feature_page_view', { feature: title, endpoint: apiEndpoint });
  }, [title, apiEndpoint]);

  const handleSubmit = useCallback(
    async (body: Record<string, unknown>) => {
      lastBodyRef.current = body;
      setLoading(true);
      setError(null);
      setPartialError(null);

      const { data, error: apiError } = await apiPost(apiEndpoint, body);

      if (apiError) {
        setError(apiError);
        posthog?.capture('feature_error', { feature: title, error: apiError });
      } else if (data) {
        setResult(data);
        posthog?.capture('feature_result_loaded', { feature: title });
      }
      setLoading(false);
    },
    [apiEndpoint, title]
  );

  // Auto-submit for auth users with complete chart on single-input pages
  useEffect(() => {
    if (!dualInput && !authLoading && user && isComplete && chart && !autoSubmitted && !result) {
      setAutoSubmitted(true);
      // Use snake_case fields from ChartRecord (not ChartInput camelCase)
      setBirthTimeUnknown(chart.birth_time === '12:00');
      handleSubmit({ subject: chartRecordToSubject(chart) });
    }
  }, [dualInput, authLoading, user, isComplete, chart, autoSubmitted, result, handleSubmit]);

  const handleFormSubmit = (data: ChartInput & { targetDate?: string; targetCity?: string; targetLatitude?: number; targetLongitude?: number }) => {
    setBirthTimeUnknown(data.birthTime === '12:00');
    const subject = chartInputToSubject(data);
    const body: Record<string, unknown> = { subject };
    if (data.targetDate) body.target_date = data.targetDate;
    if (data.targetCity) {
      body.location = {
        city: data.targetCity,
        latitude: data.targetLatitude,
        longitude: data.targetLongitude,
      };
    }
    handleSubmit(body);
  };

  const handleChartSelect = (selectedChart: { id: string; name: string; birth_date: string; city: string }) => {
    // Chart selected from dropdown — will be used with form submission
    void selectedChart;
  };

  const handleRetry = () => {
    if (lastBodyRef.current) handleSubmit(lastBodyRef.current);
  };

  const showForm = !dualInput ? (!user || !isComplete) : true;

  // Map ChartRecord (snake_case DB fields) to ChartInput (camelCase form fields)
  const initialData: Partial<ChartInput> | undefined =
    user && chart
      ? {
          name: chart.name,
          birthDate: chart.birth_date,
          birthTime: chart.birth_time,
          city: chart.city,
          countryCode: chart.country_code,
          latitude: chart.latitude,
          longitude: chart.longitude,
          gender: chart.gender as 'male' | 'female' | undefined,
        }
      : undefined;

  // Safely render children — catch any render errors to avoid full-page crash
  const renderChildren = (data: Record<string, unknown>): ReactNode => {
    try {
      if (children) return children(data);
      const entries = Object.entries(data).filter(([, value]) => {
        if (!value) return false;
        if (typeof value === 'object' && Object.keys(value as object).length === 0) return false;
        return true;
      });
      if (entries.length === 0) {
        return <p className="text-white/40 text-sm text-center py-8">Дані відсутні</p>;
      }
      return entries.map(([key, value]) => (
        <AnalysisSection
          key={key}
          title={key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
          data={value as Record<string, unknown>}
        />
      ));
    } catch {
      return (
        <p className="text-red-400 text-sm text-center py-8">
          Помилка відображення результатів
        </p>
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white">
          {title}
        </h1>
        <p className="text-white/60 mt-1">{description}</p>
      </div>

      {/* Birth Time Warning */}
      {birthTimeUnknown && <BirthTimeWarning />}

      {/* Partial Error */}
      {partialError && (
        <PartialErrorBanner
          message={partialError}
          onRetry={handleRetry}
        />
      )}

      {/* Form or auto-load */}
      {authLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-white/[0.08] rounded-xl" />
          <div className="h-12 bg-white/[0.08] rounded-xl" />
        </div>
      ) : showForm ? (
        <div className="space-y-4">
          {user && chart && !dualInput && (
            <ChartSelector onSelect={handleChartSelect} />
          )}
          <BirthDataForm
            variant={formVariant}
            initialData={initialData}
            onSubmit={handleFormSubmit}
            loading={loading}
          />
        </div>
      ) : loading ? (
        <div className="space-y-4">
          <div className="animate-pulse h-40 bg-white/[0.05] rounded-2xl" />
        </div>
      ) : null}

      {/* Error */}
      {error && !loading && (
        <ErrorState
          type={error.includes('з\'єднання') ? 'network' : error.includes('довго') ? 'timeout' : 'api'}
          message={error}
          onRetry={handleRetry}
        />
      )}

      {/* Results */}
      {result && !error && (
        <div className="space-y-4">
          {renderChildren(result)}
        </div>
      )}
    </div>
  );
}

function chartInputToSubject(input: ChartInput) {
  const [year, month, day] = input.birthDate.split('-').map(Number);
  const [hour, minute] = (input.birthTime || '12:00').split(':').map(Number);
  return {
    name: input.name,
    birth_data: {
      year,
      month,
      day,
      hour,
      minute,
      second: 0,
      city: input.city,
      country_code: input.countryCode,
      latitude: input.latitude,
      longitude: input.longitude,
    },
  };
}

// Map ChartRecord (snake_case DB fields) directly to SDK subject format
function chartRecordToSubject(chart: { name: string; birth_date: string; birth_time: string; city: string; country_code: string; latitude: number; longitude: number }) {
  const [year, month, day] = chart.birth_date.split('-').map(Number);
  const [hour, minute] = (chart.birth_time || '12:00').split(':').map(Number);
  return {
    name: chart.name,
    birth_data: {
      year,
      month,
      day,
      hour,
      minute,
      second: 0,
      city: chart.city,
      country_code: chart.country_code,
      latitude: chart.latitude,
      longitude: chart.longitude,
    },
  };
}
