'use client';

import { useState, useCallback, useEffect } from 'react';
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
  children?: (data: Record<string, unknown>) => React.ReactNode;
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

  useEffect(() => {
    posthog?.capture('feature_page_view', { feature: title, endpoint: apiEndpoint });
  }, [title, apiEndpoint]);

  const handleSubmit = useCallback(
    async (body: Record<string, unknown>) => {
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
      const input = chart as unknown as ChartInput;
      setBirthTimeUnknown(input.birthTime === '12:00');
      handleSubmit({ subject: chartInputToSubject(input) });
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

  const showForm = !dualInput ? (!user || !isComplete) : true;

  const initialData: Partial<ChartInput> | undefined =
    user && chart
      ? (chart as unknown as Partial<ChartInput>)
      : undefined;

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
          onRetry={() => result && handleSubmit(result)}
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
          onRetry={() => {
            if (result) handleSubmit(result);
          }}
        />
      )}

      {/* Results */}
      {result && !error && (
        <div className="space-y-4">
          {children ? (
            children(result)
          ) : (
            Object.entries(result).map(([key, value]) => {
              if (!value || (typeof value === 'object' && Object.keys(value as object).length === 0)) return null;
              return (
                <AnalysisSection
                  key={key}
                  title={key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  data={value as Record<string, unknown>}
                />
              );
            })
          )}
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
