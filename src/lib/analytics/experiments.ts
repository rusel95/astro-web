import { posthog } from '../posthog'

export enum Experiments {
  ONBOARDING_STEPS = 'onboarding-steps',
  PRICING_PAGE_LAYOUT = 'pricing-page-layout',
  CTA_BUTTON_TEXT = 'cta-button-text',
  CHART_VISUALIZATION = 'chart-visualization'
}

export function getExperimentVariant(
  experiment: Experiments
): string | boolean {
  if (typeof window === 'undefined') return false
  
  return posthog.getFeatureFlag(experiment) || false
}

export function isFeatureEnabled(flag: string): boolean {
  if (typeof window === 'undefined') return false
  
  return posthog.isFeatureEnabled(flag) || false
}
