'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { initPostHog, posthog } from '@/lib/posthog';

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    initPostHog();
  }, []);

  useEffect(() => {
    if (pathname) {
      const url = window.origin + pathname +
        (searchParams?.toString() ? `?${searchParams}` : '');
      posthog.capture('$pageview', { $current_url: url });
    }
  }, [pathname, searchParams]);

  return null;
}

export default function PostHogProvider() {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  );
}
