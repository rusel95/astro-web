import { createClient } from '@/lib/supabase/client';
import { type FeatureType, CACHE_TTL, type FeatureResult } from '@/types/features';

// Recursively sort object keys at every nesting level for deterministic serialization
function deepSortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(deepSortKeys);
  if (value !== null && typeof value === 'object') {
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(value as Record<string, unknown>).sort()) {
      sorted[key] = deepSortKeys((value as Record<string, unknown>)[key]);
    }
    return sorted;
  }
  return value;
}

// Browser-compatible hash (simple djb2 → hex)
function hashParams(params: Record<string, unknown>): string {
  if (!params || Object.keys(params).length === 0) return '';
  const str = JSON.stringify(deepSortKeys(params));
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) >>> 0;
  }
  return hash.toString(16);
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
  const canonicalParams = JSON.stringify(deepSortKeys(params));

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
    .maybeSingle();

  if (!data) return null;

  // Secondary check: verify full params match to guard against hash collisions
  const storedParams = JSON.stringify(deepSortKeys(data.feature_params as Record<string, unknown>));
  if (storedParams !== canonicalParams) return null;

  return data as FeatureResult;
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

  // Don't cache results where all meaningful values are null (SDK failures)
  const META_KEYS = new Set(['subject', 'subject_data', 'chart_data', 'progressed_data', 'directed_data', 'target_data', 'options', 'id', 'created_at', 'partialErrors']);
  const hasData = Object.entries(resultData).some(([k, v]) => !META_KEYS.has(k) && v != null);
  if (!hasData) return;

  const supabase = createClient();
  const paramsHash = hashParams(params);
  const expiresAt =
    ttl === Infinity
      ? new Date('2099-12-31T23:59:59Z').toISOString()
      : new Date(Date.now() + ttl).toISOString();

  // Upsert: delete old entry with same params then insert.
  // Match on both hash AND full params to avoid evicting unrelated entries on hash collision.
  const canonicalParams = deepSortKeys(params);
  await supabase
    .from('feature_results')
    .delete()
    .eq('user_id', userId)
    .eq('feature_type', featureType)
    .eq('chart_id', chartId)
    .eq('feature_params_hash', paramsHash)
    .eq('feature_params', canonicalParams as any);

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
