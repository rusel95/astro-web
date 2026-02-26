import { track, ANALYTICS_EVENTS } from '@/lib/analytics';

const SESSION_KEY = 'zorya_quiz_session_id';

export function getOrCreateQuizSessionId(): string {
  if (typeof window === 'undefined') return '';

  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = `quiz_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

export function trackQuizStart(): void {
  track(ANALYTICS_EVENTS.QUIZ_STARTED, {
    session_id: getOrCreateQuizSessionId(),
  });
}

export function trackQuizStep(stepNumber: number, stepName: string): void {
  track(ANALYTICS_EVENTS.QUIZ_STEP_COMPLETED, {
    session_id: getOrCreateQuizSessionId(),
    step_number: stepNumber,
    step_name: stepName,
  });
}

export function trackQuizStepBack(stepNumber: number): void {
  track(ANALYTICS_EVENTS.QUIZ_STEP_BACK, {
    session_id: getOrCreateQuizSessionId(),
    step_number: stepNumber,
  });
}

export function trackQuizTimeUnknown(): void {
  track(ANALYTICS_EVENTS.QUIZ_TIME_UNKNOWN_SELECTED, {
    session_id: getOrCreateQuizSessionId(),
  });
}

export function trackQuizAbandonment(lastStep: number): void {
  track(ANALYTICS_EVENTS.QUIZ_ABANDONED, {
    session_id: getOrCreateQuizSessionId(),
    last_step: lastStep,
  });
}

export function trackQuizCompleted(): void {
  track(ANALYTICS_EVENTS.QUIZ_COMPLETED, {
    session_id: getOrCreateQuizSessionId(),
  });
}

export function trackMiniHoroscopeViewed(): void {
  track(ANALYTICS_EVENTS.MINI_HOROSCOPE_VIEWED, {
    session_id: getOrCreateQuizSessionId(),
  });
}
