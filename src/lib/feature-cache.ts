import { createClient } from '@/lib/supabase/client';
import { type FeatureType, CACHE_TTL, type FeatureResult } from '@/types/features';
import { createHash } from 'crypto';

function hashParams(params: Record<string, unknown>): string {
  if (!params || Object.keys(params).length === 0) return '';
  const sorted = JSON.stringify(params, Object.keys(params).sort());
  return createHash('md5').update(sorted).digest('hex');
}

export async function getCachedResult(
  userId: string,
  featureType: FeatureType,
  chartId: string,
  params: Record<string, unknown> = {}
): Promise<FeatureResult | null> {
  const ttl = CACHE_TTL[featureType];
  if (ttl === 0) return null; // No caching for this feature type

  const supabase = createClient();
  const paramsHash = hashParams(params);

  const { data } = await supabase
    .from('feature_results')
    .select('*')
    .eq('user_id', userId)
    .eq('feature_type', featureType)
    .eq('chart_id', chartId)
    .eq('feature_params_hash', paramsHash)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return data as FeatureResult | null;
}

export async function saveCachedResult(
  userId: string,
  featureType: FeatureType,
  chartId: string,
  resultData: Record<string, unknown>,
  params: Record<string, unknown> = {}
): Promise<void> {
  const ttl = CACHE_TTL[featureType];
  if (ttl === 0) return; // No caching for this feature type

  const supabase = createClient();
  const paramsHash = hashParams(params);
  const expiresAt =
    ttl === Infinity
      ? new Date('2099-12-31T23:59:59Z').toISOString()
      : new Date(Date.now() + ttl).toISOString();

  // Upsert: delete old then insert
  await supabase
    .from('feature_results')
    .delete()
    .eq('user_id', userId)
    .eq('feature_type', featureType)
    .eq('chart_id', chartId)
    .eq('feature_params_hash', paramsHash);

  await supabase.from('feature_results').insert({
    user_id: userId,
    chart_id: chartId,
    feature_type: featureType,
    feature_params: params,
    feature_params_hash: paramsHash,
    result_data: resultData,
    expires_at: expiresAt,
  });
}

export async function invalidateForChart(
  userId: string,
  chartId: string
): Promise<void> {
  const supabase = createClient();
  await supabase
    .from('feature_results')
    .delete()
    .eq('user_id', userId)
    .eq('chart_id', chartId);
}

export async function clearExpiredResults(userId: string): Promise<void> {
  const supabase = createClient();
  await supabase
    .from('feature_results')
    .delete()
    .eq('user_id', userId)
    .lt('expires_at', new Date().toISOString());
}
