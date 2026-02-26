export const ANALYTICS_EVENTS = {
  // Landing & Acquisition
  LANDING_VIEWED: 'landing_viewed',
  CTA_CLICKED: 'cta_clicked',

  // Onboarding (legacy)
  ONBOARDING_STARTED: 'onboarding_started',
  ONBOARDING_STEP_VIEWED: 'onboarding_step_viewed',
  ONBOARDING_STEP_COMPLETED: 'onboarding_step_completed',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  ONBOARDING_ABANDONED: 'onboarding_abandoned',

  // Quiz Funnel
  QUIZ_STARTED: 'quiz_started',
  QUIZ_STEP_COMPLETED: 'quiz_step_completed',
  QUIZ_STEP_BACK: 'quiz_step_back',
  QUIZ_ABANDONED: 'quiz_abandoned',
  QUIZ_COMPLETED: 'quiz_completed',
  QUIZ_TIME_UNKNOWN_SELECTED: 'quiz_time_unknown_selected',
  MINI_HOROSCOPE_VIEWED: 'mini_horoscope_viewed',

  // Chart
  CHART_CREATED: 'chart_created',
  CHART_VIEWED: 'chart_viewed',
  SPHERE_VIEWED: 'sphere_viewed',
  AI_CHAT_OPENED: 'ai_chat_opened',
  AI_MESSAGE_SENT: 'ai_message_sent',

  // Compatibility (Viral Loop)
  INVITE_CREATED: 'invite_created',
  INVITE_SHARED: 'invite_shared',
  INVITE_ACCEPTED: 'invite_accepted',
  SYNASTRY_VIEWED: 'synastry_viewed',
  SYNASTRY_SHARED: 'synastry_shared',

  // Products
  PRODUCT_PAGE_VIEWED: 'product_page_viewed',
  PRODUCT_CARD_CLICKED: 'product_card_clicked',
  PRODUCT_FORM_STARTED: 'product_form_started',
  PRODUCT_FORM_COMPLETED: 'product_form_completed',

  // Paywall
  PAYWALL_VIEWED: 'paywall_viewed',
  PAYWALL_CTA_CLICKED: 'paywall_cta_clicked',
  PLAN_SELECTED: 'plan_selected',

  // Monetization (legacy)
  PRICING_PAGE_VIEWED: 'pricing_page_viewed',
  UPGRADE_CLICKED: 'upgrade_clicked',
  CHECKOUT_STARTED: 'checkout_started',
  PAYMENT_SUCCESS: 'payment_success',
  PAYMENT_FAILED: 'payment_failed',
  SUBSCRIPTION_CANCELLED: 'subscription_cancelled',

  // Navigation
  NAV_DROPDOWN_OPENED: 'nav_dropdown_opened',
  NAV_ITEM_CLICKED: 'nav_item_clicked',

  // Auth
  LOGIN_ATTEMPTED: 'login_attempted',
  LOGIN_COMPLETED: 'login_completed',
  REGISTRATION_COMPLETED: 'registration_completed',
  PROFILE_CREATED: 'profile_created',

  // Retention
  DAILY_HOROSCOPE_VIEWED: 'daily_horoscope_viewed',
  EMAIL_OPENED: 'email_opened',
  EMAIL_CLICKED: 'email_clicked',
  NOTIFICATION_CLICKED: 'notification_clicked',

  // Engagement
  BLOG_ARTICLE_VIEWED: 'blog_article_viewed',
  BLOG_CTA_CLICKED: 'blog_cta_clicked',
  SEARCH_PERFORMED: 'search_performed',
  SHARE_BUTTON_CLICKED: 'share_button_clicked',
  REVIEW_SUBMITTED: 'review_submitted',
  REVIEW_PAGE_VIEWED: 'review_page_viewed',
  YEARLY_HOROSCOPE_VIEWED: 'yearly_horoscope_viewed',
  ASCENDANT_CALCULATED: 'ascendant_calculated',
  FREE_BIRTH_CHART_GENERATED: 'free_birth_chart_generated',

  // Email Subscription
  EMAIL_SUBSCRIPTION_SUBMITTED: 'email_subscription_submitted',
} as const

export type AnalyticsEvent = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS]
